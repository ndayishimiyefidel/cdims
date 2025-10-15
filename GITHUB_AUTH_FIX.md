# GitHub Authentication Fix for VPS

## 🚨 Issue: Password Authentication Not Supported

GitHub no longer supports password authentication for Git operations. You need to use either:
1. **Personal Access Token (PAT)** - Recommended
2. **SSH Keys** - Alternative

## 🔑 Solution 1: Personal Access Token (PAT)

### Step 1: Create Personal Access Token on GitHub
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "VPS Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Use Token for Cloning
```bash
# Clone using token
git clone https://YOUR_TOKEN@github.com/ndayishimiyefidel/cdims.git

# Or clone and enter token when prompted
git clone https://github.com/ndayishimiyefidel/cdims.git
# When prompted for username: ndayishimiyefidel
# When prompted for password: paste your token
```

### Step 3: Store Credentials (Optional)
```bash
# Store credentials to avoid re-entering
git config --global credential.helper store

# Or use credential manager
git config --global credential.helper cache
```

## 🔐 Solution 2: SSH Keys (Alternative)

### Step 1: Generate SSH Key on VPS
```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter for default location
# Press Enter for no passphrase (or set one)

# Display public key
cat ~/.ssh/id_ed25519.pub
```

### Step 2: Add SSH Key to GitHub
1. Copy the public key output
2. Go to GitHub.com → Settings → SSH and GPG keys
3. Click "New SSH key"
4. Paste the public key
5. Give it a title like "VPS Server"
6. Click "Add SSH key"

### Step 3: Clone Using SSH
```bash
# Clone using SSH
git clone git@github.com:ndayishimiyefidel/cdims.git
```

## 🚀 Quick Fix Commands

### Option A: Use Token (Immediate Fix)
```bash
# Replace YOUR_TOKEN with your actual token
git clone https://YOUR_TOKEN@github.com/ndayishimiyefidel/cdims.git
```

### Option B: Configure Git with Token
```bash
# Set up git with your token
git config --global user.name "ndayishimiyefidel"
git config --global user.email "your-email@example.com"

# Clone the repository
git clone https://github.com/ndayishimiyefidel/cdims.git
# When prompted:
# Username: ndayishimiyefidel
# Password: paste your personal access token
```

### Option C: Use SSH (One-time setup)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Display and copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub (manually via web interface)
# Then clone with SSH
git clone git@github.com:ndayishimiyefidel/cdims.git
```

## 🔧 Complete VPS Setup with Authentication

### Method 1: Token Authentication
```bash
# 1. Get your token from GitHub
# 2. Clone with token
git clone https://YOUR_TOKEN@github.com/ndayishimiyefidel/cdims.git

# 3. Continue with setup
cd cdims
cd backend
npm install

# 4. Create .env file
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
# 5. Run migrations and seed
npm run migrate
npm run seed

# 6. Setup frontend
cd ../frontend
npm install
npm run build

# 7. Install PM2 and start
cd ../backend
npm install -g pm2
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 🛠️ Troubleshooting

### If Token Doesn't Work
```bash
# Check if token is valid
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# Test repository access
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/ndayishimiyefidel/cdims
```

### If SSH Doesn't Work
```bash
# Test SSH connection
ssh -T git@github.com

# Check SSH key
ssh-add -l

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519
```

### Alternative: Download ZIP
```bash
# If Git still doesn't work, download ZIP
wget https://github.com/ndayishimiyefidel/cdims/archive/refs/heads/main.zip

# Extract
unzip main.zip
mv cdims-main cdims
cd cdims
```

## 📋 Quick Reference

### Token Method (Recommended)
1. Create PAT on GitHub
2. `git clone https://YOUR_TOKEN@github.com/ndayishimiyefidel/cdims.git`
3. Continue with setup

### SSH Method
1. Generate SSH key: `ssh-keygen -t ed25519 -C "email"`
2. Add public key to GitHub
3. `git clone git@github.com:ndayishimiyefidel/cdims.git`

### ZIP Method (Fallback)
1. `wget https://github.com/ndayishimiyefidel/cdims/archive/refs/heads/main.zip`
2. `unzip main.zip && mv cdims-main cdims`

Choose the method that works best for your VPS setup! 🎯
