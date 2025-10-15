# Fix Database Access Issue - Final Solution

## 🚨 **Current Issue: Still Getting "Access denied for user 'root'@'localhost'"**

The problem is that the system is still using the "development" environment and trying to connect as 'root' user.

## 🔧 **Solution: Fix Environment and Database Setup**

### **1. First, Pull Latest Changes on VPS**
```bash
cd ~/cdims
git pull origin main
```

### **2. Create .env File in Backend**
```bash
cd ~/cdims/backend

# Create .env file
nano .env
```

**Add this content to .env:**
```env
NODE_ENV=production
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=password@123
DB_NAME=cdims
DB_PORT=3306
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
```

### **3. Create Database and User**
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

### **4. Test Database Connection**
```bash
# Test connection with the user
mysql -u cdims_user -p -e "SHOW DATABASES;"
```

### **5. Run Migrations with Production Environment**
```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Run migrations
npm run migrate

# Run seeders
npm run seed
```

## 🚀 **Alternative: Quick Fix with Root User**

If you want to use root user temporarily:

### **1. Update .env to use root**
```bash
cd ~/cdims/backend
nano .env
```

**Change to:**
```env
NODE_ENV=production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_root_password
DB_NAME=cdims
DB_PORT=3306
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
```

### **2. Create Database**
```bash
mysql -u root -p
CREATE DATABASE IF NOT EXISTS cdims;
EXIT;
```

### **3. Run Migrations**
```bash
export NODE_ENV=production
npm run migrate
npm run seed
```

## 🔍 **Troubleshooting Commands**

### **Check Current Environment**
```bash
# Check if .env exists
ls -la .env

# Check .env content
cat .env

# Check NODE_ENV
echo $NODE_ENV
```

### **Check Database Connection**
```bash
# Test with cdims_user
mysql -u cdims_user -p -e "SELECT 1;"

# Test with root
mysql -u root -p -e "SELECT 1;"
```

### **Check MySQL Status**
```bash
# Check if MySQL is running
systemctl status mysql

# Start MySQL if not running
systemctl start mysql
```

## 📋 **Complete Setup Commands**

### **Option A: Use Dedicated User (Recommended)**
```bash
# 1. Pull latest changes
cd ~/cdims
git pull origin main

# 2. Create .env file
cd backend
nano .env
# Add the environment variables above

# 3. Create database and user
mysql -u root -p
CREATE DATABASE IF NOT EXISTS cdims;
CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'password@123';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Set environment and run migrations
export NODE_ENV=production
npm run migrate
npm run seed
```

### **Option B: Use Root User (Quick)**
```bash
# 1. Pull latest changes
cd ~/cdims
git pull origin main

# 2. Create .env file
cd backend
nano .env
# Add environment variables with root user

# 3. Create database
mysql -u root -p
CREATE DATABASE IF NOT EXISTS cdims;
EXIT;

# 4. Set environment and run migrations
export NODE_ENV=production
npm run migrate
npm run seed
```

## ✅ **Verification**

After fixing, you should see:
- No database access errors
- Successful migration output
- Database tables created
- Seed data inserted

## 🚨 **Key Points**

1. **NODE_ENV must be set to 'production'** to use the correct database configuration
2. **Create .env file** with proper database credentials
3. **Database user must exist** with proper permissions
4. **Use `export NODE_ENV=production`** before running migrations

Try Option A first (dedicated user) as it's more secure! 🎯
