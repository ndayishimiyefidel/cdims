# CDIMS Sequelize Database Setup Guide

## 🗄️ Database Setup Using Sequelize

### 1. Prerequisites
```bash
# Ensure MySQL is running
sudo systemctl start mysql
sudo systemctl enable mysql

# Create database and user (one-time setup)
mysql -u root -p
```

**MySQL Commands:**
```sql
CREATE DATABASE cdims;
CREATE USER 'cdims_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Environment Configuration
```bash
# Create .env file in backend directory
cd backend
nano .env
```

**Add this content:**
```env
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=your_secure_password
DB_NAME=cdims
JWT_SECRET=your_super_secure_jwt_secret_key_here
PORT=3000
NODE_ENV=production
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install Sequelize CLI globally (if not already installed)
npm install -g sequelize-cli
```

### 4. Run Database Migrations
```bash
# This will create all database tables
npm run migrate

# Or using Sequelize CLI directly
npx sequelize-cli db:migrate
```

### 5. Seed Initial Data
```bash
# This will populate the database with initial data
npm run seed

# Or using Sequelize CLI directly
npx sequelize-cli db:seed:all
```

### 6. Verify Database Setup
```bash
# Check if tables were created
mysql -u cdims_user -p cdims -e "SHOW TABLES;"

# Check if data was seeded
mysql -u cdims_user -p cdims -e "SELECT * FROM Users LIMIT 5;"
mysql -u cdims_user -p cdims -e "SELECT * FROM Roles;"
```

## 🔧 Sequelize Commands Reference

### Migration Commands
```bash
# Create a new migration
npx sequelize-cli migration:generate --name migration-name

# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Check migration status
npx sequelize-cli db:migrate:status
```

### Seeder Commands
```bash
# Create a new seeder
npx sequelize-cli seed:generate --name seeder-name

# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed seeder-filename.js

# Undo last seeder
npx sequelize-cli db:seed:undo

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

### Database Commands
```bash
# Create database
npx sequelize-cli db:create

# Drop database
npx sequelize-cli db:drop

# Show database info
npx sequelize-cli db:show
```

## 📋 Complete Setup Process

### Step-by-Step VPS Setup
```bash
# 1. Connect to VPS
ssh root@your-vps-ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Node.js and MySQL
apt install -y curl wget git nginx mysql-server nodejs npm

# 4. Start MySQL
systemctl start mysql
systemctl enable mysql

# 5. Create database and user
mysql -u root -p
# Run the SQL commands above
exit

# 6. Clone repository
git clone https://github.com/ndayishimiyefidel/cdims.git
cd cdims

# 7. Setup backend
cd backend
npm install

# 8. Create .env file
nano .env
# Add environment variables

# 9. Run migrations (creates all tables)
npm run migrate

# 10. Seed database (adds initial data)
npm run seed

# 11. Start application
npm start
```

## 🚨 Troubleshooting

### Common Issues

#### Migration Errors
```bash
# If migrations fail, check database connection
mysql -u cdims_user -p cdims -e "SELECT 1;"

# Reset migrations (WARNING: This will drop all data)
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

#### Seeder Errors
```bash
# If seeders fail, check if tables exist
mysql -u cdims_user -p cdims -e "SHOW TABLES;"

# Run seeders individually
npx sequelize-cli db:seed --seed 20250101000000-simple-seed.js
```

#### Connection Issues
```bash
# Test database connection
mysql -u cdims_user -p cdims -e "SELECT 'Connection successful';"

# Check if user has proper permissions
mysql -u root -p -e "SHOW GRANTS FOR 'cdims_user'@'localhost';"
```

### Log Files
```bash
# Check application logs
pm2 logs cdims-backend

# Check MySQL logs
tail -f /var/log/mysql/error.log

# Check system logs
journalctl -u mysql
```

## ✅ Verification Checklist

- [ ] MySQL service running
- [ ] Database `cdims` created
- [ ] User `cdims_user` created with proper permissions
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Migrations run successfully
- [ ] Seeders run successfully
- [ ] Application starts without errors
- [ ] Database tables created (check with `SHOW TABLES`)
- [ ] Initial data seeded (check with `SELECT * FROM Users`)

## 📊 Database Schema Overview

After running migrations, you should have these tables:
- `Users` - User accounts
- `Roles` - User roles
- `Sites` - Construction sites
- `Materials` - Material catalog
- `Stores` - Storage locations
- `Stock` - Inventory levels
- `Requests` - Material requests
- `RequestItems` - Request line items
- `Approvals` - Approval workflow
- `StockMovements` - Inventory transactions
- And more...

## 🔄 Production Considerations

### Database Backup
```bash
# Create backup
mysqldump -u cdims_user -p cdims > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u cdims_user -p cdims < backup_file.sql
```

### Performance Optimization
```bash
# Add database indexes for better performance
mysql -u cdims_user -p cdims -e "SHOW INDEX FROM Users;"

# Monitor database performance
mysql -u cdims_user -p cdims -e "SHOW PROCESSLIST;"
```

This guide ensures your CDIMS database is properly set up using Sequelize migrations and seeders! 🎯
