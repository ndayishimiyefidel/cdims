# Fix Database Access Issues on VPS

## 🚨 **Current Issue: Access Denied for User 'root'@'localhost'**

The error shows:
```
ERROR: Access denied for user 'root'@'localhost'
```

This happens because the database user doesn't have the correct permissions.

## 🔧 **Solution: Fix Database Permissions**

### **1. Connect to MySQL as Root**
```bash
# Connect to MySQL as root
mysql -u root -p
```

### **2. Create Database and User (if not exists)**
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS cdims;

-- Create user with proper permissions
CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'password@123';

-- Grant all privileges on cdims database
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### **3. Test Database Connection**
```bash
# Test connection with the user
mysql -u cdims_user -p -e "SHOW DATABASES;"
```

### **4. Update Backend .env File**
```bash
# Go to backend directory
cd ~/cdims/backend

# Edit .env file
nano .env
```

**Make sure your .env contains:**
```env
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=password@123
DB_NAME=cdims
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
```

### **5. Run Migrations Manually**
```bash
# Run migrations
npm run migrate

# Run seeders
npm run seed
```

## 🚀 **Alternative: Use Root User (Quick Fix)**

If you want to use root user temporarily:

### **1. Update .env to use root**
```bash
# Edit .env file
nano .env
```

**Change to:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_root_password
DB_NAME=cdims
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
```

### **2. Create Database**
```bash
# Connect to MySQL as root
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS cdims;
EXIT;
```

### **3. Run Migrations**
```bash
# Run migrations
npm run migrate

# Run seeders
npm run seed
```

## 🔍 **Troubleshooting Commands**

### **Check MySQL Status**
```bash
# Check if MySQL is running
systemctl status mysql

# Start MySQL if not running
systemctl start mysql
```

### **Check Database Connection**
```bash
# Test connection
mysql -u cdims_user -p -e "SELECT 1;"
```

### **Check .env File**
```bash
# View .env file
cat .env

# Check if .env exists
ls -la .env
```

## 📋 **Complete Setup Commands**

### **Option A: Use Dedicated User (Recommended)**
```bash
# 1. Create database and user
mysql -u root -p
CREATE DATABASE IF NOT EXISTS cdims;
CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'password@123';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 2. Update .env
cd ~/cdims/backend
nano .env
# Make sure DB_USER=cdims_user and DB_PASSWORD=password@123

# 3. Run migrations
npm run migrate
npm run seed
```

### **Option B: Use Root User (Quick)**
```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE IF NOT EXISTS cdims;
EXIT;

# 2. Update .env
cd ~/cdims/backend
nano .env
# Change to DB_USER=root and DB_PASSWORD=your_root_password

# 3. Run migrations
npm run migrate
npm run seed
```

## ✅ **Verification**

After fixing, you should see:
- No database access errors
- Successful migration output
- Database tables created
- Seed data inserted

## 🚨 **Common Issues**

1. **Wrong password**: Make sure the password in .env matches the MySQL user password
2. **User doesn't exist**: Create the user with proper permissions
3. **Database doesn't exist**: Create the database first
4. **MySQL not running**: Start MySQL service

Try the dedicated user approach first (Option A) as it's more secure! 🎯
