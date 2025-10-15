# VPS Repository Structure Fix

## 🚨 Issue: Missing Backend and Frontend Folders

If you don't see `backend` and `frontend` folders after cloning, here are the solutions:

## 🔍 Check Current Structure
```bash
# Check what you have in the cdims directory
ls -la

# Check if you're on the correct branch
git branch

# Check git status
git status
```

## 🔧 Solution 1: Check Branch and Pull Latest
```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Check if folders exist now
ls -la
```

## 🔧 Solution 2: Force Pull All Files
```bash
# Reset to latest main branch
git fetch origin
git reset --hard origin/main

# Check structure
ls -la
```

## 🔧 Solution 3: Clone Fresh (Recommended)
```bash
# Go back to home directory
cd ~

# Remove existing cdims folder
rm -rf cdims

# Clone fresh with token
git clone https://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@github.com/ndayishimiyefidel/cdims.git

# Check structure
cd cdims
ls -la
```

## 🔧 Solution 4: Download ZIP (Fallback)
```bash
# If git still doesn't work
cd ~
rm -rf cdims

# Download ZIP
wget https://github.com/ndayishimiyefidel/cdims/archive/refs/heads/main.zip

# Extract
unzip main.zip
mv cdims-main cdims
cd cdims

# Check structure
ls -la
```

## 📋 Expected Structure
After successful clone, you should see:
```
cdims/
├── backend/
│   ├── src/
│   ├── models/
│   ├── migrations/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

## 🚀 Complete Setup After Fix
```bash
# 1. Verify structure
ls -la

# 2. Setup backend
cd backend
npm install

# 3. Create .env file
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
# 4. Run migrations and seed
npm run migrate
npm run seed

# 5. Setup frontend
cd ../frontend
npm install
npm run build

# 6. Install PM2 and start
cd ../backend
npm install -g pm2
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 🛠️ Troubleshooting

### Check Git Status
```bash
# Check if you're on the right branch
git branch -a

# Check remote URLs
git remote -v

# Check last commit
git log --oneline -5
```

### Verify Repository Content
```bash
# Check if files exist remotely
git ls-tree -r HEAD --name-only | grep -E "(backend|frontend)"

# Check specific files
git show HEAD:backend/package.json
git show HEAD:frontend/package.json
```

### Force Update
```bash
# Clean and reset
git clean -fd
git reset --hard HEAD
git pull origin main
```

## 📋 Quick Fix Commands

### Option A: Fresh Clone (Recommended)
```bash
cd ~
rm -rf cdims
git clone https://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@github.com/ndayishimiyefidel/cdims.git
cd cdims
ls -la
```

### Option B: Reset Current Clone
```bash
cd cdims
git fetch origin
git reset --hard origin/main
git clean -fd
ls -la
```

### Option C: Download ZIP
```bash
cd ~
rm -rf cdims
wget https://github.com/ndayishimiyefidel/cdims/archive/refs/heads/main.zip
unzip main.zip
mv cdims-main cdims
cd cdims
ls -la
```

## ✅ Verification
After fixing, you should see:
- `backend/` folder with `package.json`, `src/`, `models/`, etc.
- `frontend/` folder with `package.json`, `src/`, `public/`, etc.
- `README.md` file
- Other project files

If you still don't see the folders, the issue might be with the repository itself. Let me know what you see after running these commands! 🎯
