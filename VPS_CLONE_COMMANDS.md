# VPS Clone Commands for CDIMS

Use this for fast project cloning and first setup on a VPS.
For full deployment and troubleshooting details, see `VPS_DEPLOYMENT.md` and `PROJECT_DOCUMENTATION.md`.

## 1) Clone Repository

```bash
cd /var/www
git clone https://github.com/ndayishimiyefidel/cdims.git
cd cdims
git branch
```

## 2) Setup Backend

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
DB_PASSWORD=CHANGE_ME
JWT_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_SECRET
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://cyangugudims.com
```

Then run:

```bash
npm run migrate
npm run seed
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 3) Setup Frontend

```bash
cd /var/www/cdims/frontend
printf "VITE_API_URL=https://cyangugudims.com/api\n" > .env
npm install
npm run build
```

## 4) Quick Verify

```bash
pm2 status
curl -i http://127.0.0.1:3000/api/health
```

## 5) Secure Notes

- Do not use personal access tokens in `git clone` URLs.
- Do not keep real DB passwords or JWT secrets in tracked docs/scripts.
- Rotate credentials immediately after first deployment.
