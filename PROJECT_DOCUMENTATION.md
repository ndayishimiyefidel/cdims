# CDIMS Project Documentation

This document provides a complete and practical overview of the CDIMS project (backend + frontend), including architecture, setup, deployment, and troubleshooting.

## 1) Project Overview

CDIMS is a web-based management platform for infrastructure, materials, stock, procurement, sites, stores, and reporting.

- Frontend: React + Vite + TypeScript SPA
- Backend: Node.js + Express REST API
- Database: MySQL via Sequelize
- Process manager: PM2
- Reverse proxy/static hosting: Nginx

## 2) Repository Structure

```text
cdims/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│   └── config/config.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   └── types/
│   ├── vite.config.ts
│   └── package.json
├── deploy.sh
└── PROJECT_DOCUMENTATION.md
```

## 3) Backend Documentation

## 3.1 Backend Startup Flow

Entry point: `backend/src/app.js`

Startup sequence:
1. Load environment variables (`dotenv`).
2. Initialize Express and middleware (`helmet`, `cors`, body parsers, `morgan`).
3. Register static serving for `/uploads`.
4. Register docs (`/api-docs`) and health endpoints (`/health`, `/api/health`).
5. Mount API route groups under `/api/...`.
6. Register `notFound` and global `errorHandler`.
7. Test DB connection using Sequelize (`testConnection()`).
8. Start HTTP server on `PORT` (fallback currently `5000` if not set).

## 3.2 Backend API Route Groups

Mounted in `backend/src/app.js`:

- `/api/auth` - authentication (login/profile/change-password/logout/reset/delete-account)
- `/api/users` - user management
- `/api/requests` - material request lifecycle
- `/api/materials` - materials, categories, units
- `/api/stock` - stock, stock history, issue flow
- `/api/procurement` - suppliers, purchase orders, receipts
- `/api/reports` - operational reports
- `/api/site-assignments` - assignment of users to sites
- `/api/sites` - site CRUD
- `/api/stores` - store CRUD
- `/api/admin` - admin operations (audit logs, system configs, DB maintenance, exports)

## 3.3 Authentication and Authorization

- Auth token: JWT in `Authorization: Bearer <token>`
- JWT secret: `JWT_SECRET` (required)
- Auth middleware: `backend/src/middleware/auth.js`
- Role checks: `authorize(...)`, `requireRole(...)`, and admin/padiri access checks
- First-login flow: password update required before normal access

## 3.4 Database and Sequelize

- Runtime DB config: `backend/src/config/database.js` using env vars
- Sequelize CLI config: `backend/config/config.json`
- Migrations: `backend/migrations/`
- Seeders: `backend/seeders/`

Common commands:

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

## 3.5 Backend Environment Variables

Required core variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cdims
DB_USER=cdims_user
DB_PASSWORD=change_me
JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

## 3.6 Backend Risks to Address

- `postinstall` currently runs migrations + seed automatically.
- `config/config.json` has production credentials in plain text; replace/remove sensitive defaults.
- Port mismatch risks (`3000` vs fallback `5000`) can break Nginx upstream.
- Some security/rate-limit middleware exists but is not fully wired in `app.js`.

## 4) Frontend Documentation

## 4.1 Frontend Bootstrap

Entry sequence:
1. `frontend/src/main.tsx` renders app under `AuthContextProvider`.
2. `frontend/src/App.tsx` uses `RouterProvider`.
3. `frontend/src/router/index.tsx` defines route tree.

Main route areas:
- `/auth/admin/login`
- `/auth/admin/unlock`
- `/admin/dashboard/...` protected by auth route guard

## 4.2 Frontend API Layer

File: `frontend/src/api/api.ts`

- Uses Axios instance with base URL from `VITE_API_URL`.
- Automatically appends `/api` when env provides domain-only URL.
- Adds `Authorization` header from `localStorage.auth_token`.

Recommended env:

```env
VITE_API_URL=https://your-domain.com/api
```

## 4.3 Frontend Build and Run

```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
```

- Dev server default port: `3001` (from `vite.config.ts`)
- Production build output: `frontend/dist`

## 4.4 Frontend Risks to Address

- Ensure `.env` is UTF-8 encoded to avoid Vite env parsing issues.
- Keep `VITE_API_URL` aligned with deployed API domain.
- Verify `SocketProvider` usage where socket hooks are used.
- Add a catch-all 404 route if desired for unknown frontend paths.

## 5) End-to-End Local Setup

## 5.1 Prerequisites

- Node.js LTS
- MySQL Server
- npm

## 5.2 Database Setup

```sql
CREATE DATABASE cdims;
CREATE USER 'cdims_user'@'localhost' IDENTIFIED BY 'change_me';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
```

## 5.3 Run Backend

```bash
cd backend
cp env.example .env
# edit .env values
npm install
npm run migrate
npm run seed
npm run dev
```

## 5.4 Run Frontend

```bash
cd frontend
# create .env with VITE_API_URL
npm install
npm run dev
```

## 6) VPS Hosting Guide (Production)

## 6.1 Server Prerequisites

```bash
apt update && apt upgrade -y
apt install -y nginx mysql-server git curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
npm install -g pm2
```

## 6.2 Deploy Code

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/ndayishimiyefidel/cdims.git
cd cdims
```

## 6.3 Configure Backend

```bash
cd /var/www/cdims/backend
npm install
nano .env
```

Use:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cdims
DB_USER=cdims_user
DB_PASSWORD=change_me
JWT_SECRET=change_me_to_long_random_secret
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://cyangugudims.com
```

Run migrations/seed and start:

```bash
npm run migrate
npm run seed
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 6.4 Configure Frontend

```bash
cd /var/www/cdims/frontend
printf "VITE_API_URL=https://cyangugudims.com/api\n" > .env
npm install
npm run build
```

## 6.5 Configure Nginx

Create/update `/etc/nginx/sites-available/cdims`:

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

## 6.6 Enable SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d cyangugudims.com -d www.cyangugudims.com
```

## 7) Troubleshooting Guide

## 7.1 500 Internal Server Error on Frontend Routes

Symptoms:
- Nginx 500 page on routes like `/auth/admin/login`

Checks:
- Confirm `root` points to correct build folder: `/var/www/cdims/frontend/dist`
- Confirm build exists: `ls -la /var/www/cdims/frontend/dist`
- Confirm SPA fallback is present: `try_files $uri $uri/ /index.html;`
- Check Nginx error log:

```bash
tail -n 100 /var/log/nginx/error.log
```

## 7.2 502 Bad Gateway on `/api/health`

Symptoms:
- `https://domain/api/health` returns 502

Root cause:
- Nginx upstream points to wrong backend port.

Fix:
- Ensure `proxy_pass` points to backend actual port (recommended `3000`):
  - `proxy_pass http://127.0.0.1:3000/;`
- Reload Nginx and verify backend process:

```bash
nginx -t && systemctl reload nginx
pm2 status
curl -i http://127.0.0.1:3000/api/health
curl -i https://cyangugudims.com/api/health
```

## 7.3 Useful Operational Commands

```bash
pm2 status
pm2 logs cdims-backend --lines 100
pm2 restart cdims-backend --update-env
systemctl status nginx
tail -f /var/log/nginx/error.log
```

## 8) Security and Maintenance Recommendations

- Rotate all default credentials and secrets immediately.
- Do not keep real passwords/tokens in tracked markdown/config files.
- Consider removing migration/seed from `postinstall`.
- Restrict CORS origins strictly in production.
- Add request rate limits for auth and public endpoints.
- Back up MySQL regularly.

## 9) Quick Verification Checklist

- Backend health works: `http://127.0.0.1:3000/api/health`
- Public API health works: `https://cyangugudims.com/api/health`
- Frontend loads without server errors: `https://cyangugudims.com/auth/admin/login`
- Admin login succeeds with valid account
- PM2 process survives restart/reboot

