# Switch to Main Branch on VPS

## 🚨 Issue: You're on `backend` branch instead of `main`

The `git branch` command shows you're on the `backend` branch, which is why you're missing the `frontend` folder.

## 🔧 Solution: Switch to Main Branch

### **1. Switch to Main Branch**
```bash
# Switch to main branch
git checkout main

# Verify you're on main branch
git branch

# Pull latest changes
git pull origin main
```

### **2. Check Structure After Switch**
```bash
# List all files and folders
ls -la

# You should now see both backend and frontend folders
```

### **3. Complete Setup After Switch**
```bash
# Setup backend
cd backend
npm install

# Create .env file
nano .env
```

**Add to .env:**
```env
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=password@123
DB_NAME=cdims
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
```

```bash
# Run migrations and seed
npm run migrate
npm run seed

# Setup frontend
cd ../frontend
npm install
npm run build

# Start with PM2
cd ../backend
npm install -g pm2
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 🔍 **Alternative: Fresh Clone from Main**

If switching branches doesn't work:

```bash
# Go back to home directory
cd ~

# Remove existing cdims folder
rm -rf cdims

# Clone main branch specifically
git clone -b main https://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@github.com/ndayishimiyefidel/cdims.git

# Check structure
cd cdims
ls -la
```

## 📋 **Expected Structure After Switch**

You should see:
```
cdims/
├── backend/
├── frontend/
├── README.md
├── QUICK_START.md
├── SETUP_COMMANDS.md
├── VPS_DEPLOYMENT.md
├── deploy.sh
└── ...
```

## 🚀 **Quick Commands**

### **Option A: Switch Branch (Recommended)**
```bash
git checkout main
git pull origin main
ls -la
```

### **Option B: Fresh Clone from Main**
```bash
cd ~
rm -rf cdims
git clone -b main https://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@github.com/ndayishimiyefidel/cdims.git
cd cdims
ls -la
```

## ✅ **Verification**

After switching to main branch, you should see:
- `backend/` folder
- `frontend/` folder
- All other project files

The `frontend` folder was missing because you were on the `backend` branch! 🎯
