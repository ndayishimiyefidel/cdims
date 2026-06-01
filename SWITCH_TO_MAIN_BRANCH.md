# Switch to Main Branch on VPS

Use this when VPS code is on the wrong branch and folders are missing.

## 1) Move to Repository

```bash
cd /var/www/cdims
git status
git branch
```

## 2) Switch to `main`

```bash
git fetch origin
git checkout main
git pull origin main
```

## 3) Verify Structure

```bash
ls -la
```

You should see both `backend/` and `frontend/`.

## 4) If Switch Fails, Fresh Clone

```bash
cd /var/www
rm -rf cdims
git clone -b main https://github.com/ndayishimiyefidel/cdims.git
cd cdims
ls -la
```

## 5) Continue Deployment

Follow `VPS_DEPLOYMENT.md` for complete setup.

## Security Note

Never clone using a personal access token in the repository URL.
