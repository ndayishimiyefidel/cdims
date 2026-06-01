# CDIMS VPS Deployment Guide

This file is the quick production deployment guide.
For full architecture and complete runbook, read `PROJECT_DOCUMENTATION.md`.

## 1) Server Setup

```bash
apt update && apt upgrade -y
apt install -y nginx mysql-server git curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
npm install -g pm2
```

## 2) Clone Project

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/ndayishimiyefidel/cdims.git
cd cdims
```

## 3) Configure Backend

```bash
cd /var/www/cdims/backend
npm install
nano .env
```

Use this template (replace placeholders):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cdims
DB_USER=cdims_user
DB_PASSWORD=CHANGE_ME
JWT_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_SECRET
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://cyangugudims.com
```

Run migrations and start app:

```bash
npm run migrate
npm run seed
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 4) Configure Frontend

```bash
cd /var/www/cdims/frontend
printf "VITE_API_URL=https://cyangugudims.com/api\n" > .env
npm install
npm run build
```

## 5) Configure Nginx

Create `/etc/nginx/sites-available/cdims`:

```nginx
server {
    listen 80;
    server_name cyangugudims.com www.cyangugudims.com;

    root /var/www/cdims/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /backend/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable and reload:

```bash
ln -sf /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/cdims
nginx -t
systemctl reload nginx
```

## 6) SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d cyangugudims.com -d www.cyangugudims.com
```

## 7) Verification

```bash
pm2 status
curl -i http://127.0.0.1:3000/api/health
curl -i https://cyangugudims.com/api/health
```

## 8) Common Issues

- `500` on frontend route refresh: wrong `root` path or missing `dist` build.
- `502` on `/api/health`: Nginx upstream port mismatch (must match backend `PORT`).
- Login request fails: invalid `VITE_API_URL` or backend not reachable.

## 9) Security Notes

- Never commit real secrets to repository files.
- Rotate DB password, JWT secret, and admin password after deployment.
- Do not clone with access tokens inside repository URLs.
