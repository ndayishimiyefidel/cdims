# Production MySQL Setup for VPS

## 🔧 **Updated Configuration for MySQL Production**

The configuration has been updated to use MySQL for production instead of PostgreSQL.

## 📋 **Changes Made**

### **1. Updated `backend/config/config.json`**
- Changed production dialect from `postgres` to `mysql`
- Added MySQL connection details for production
- Removed PostgreSQL-specific SSL options

### **2. Updated `backend/src/config/database.js`**
- Simplified to use MySQL for both development and production
- Removed PostgreSQL-specific code
- Uses environment variables for configuration

## 🚀 **VPS Setup Commands**

### **1. Create Database and User**
```bash
# Connect to MySQL as root
mysql -u root -p

# Create database and user
CREATE DATABASE IF NOT EXISTS cdims;
CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'password@123';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **2. Update .env File**
```bash
# Go to backend directory
cd ~/cdims/backend

# Create .env file
nano .env
```

**Add to .env:**
```env
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=password@123
DB_NAME=cdims
DB_PORT=3306
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
```

### **3. Run Migrations**
```bash
# Run migrations
npm run migrate

# Run seeders
npm run seed
```

### **4. Start Application**
```bash
# Install PM2 if not already installed
npm install -g pm2

# Start application
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## ✅ **Verification**

After setup, you should see:
- No database access errors
- Successful migration output
- Application running on port 3000
- PM2 process running

## 🔍 **Troubleshooting**

### **Check Database Connection**
```bash
# Test connection
mysql -u cdims_user -p -e "SHOW DATABASES;"
```

### **Check Application Status**
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs cdims-backend
```

### **Check Environment Variables**
```bash
# Check .env file
cat .env

# Check if .env exists
ls -la .env
```

## 📋 **Complete VPS Setup Commands**

```bash
# 1. Clone repository
git clone https://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@github.com/ndayishimiyefidel/cdims.git
cd cdims

# 2. Setup backend
cd backend
npm install

# 3. Create database and user
mysql -u root -p
CREATE DATABASE IF NOT EXISTS cdims;
CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'password@123';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Create .env file
nano .env
# Add the environment variables above

# 5. Run migrations
npm run migrate
npm run seed

# 6. Setup frontend
cd ../frontend
npm install
npm run build

# 7. Start backend with PM2
cd ../backend
npm install -g pm2
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

## 🎯 **Key Changes**

1. **Production now uses MySQL** instead of PostgreSQL
2. **Simplified database configuration** for VPS deployment
3. **Environment variables** for easy configuration
4. **PM2 process management** for production

The application is now configured to work with MySQL on your VPS! 🚀
