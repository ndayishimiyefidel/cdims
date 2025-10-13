# CDIMS VPS Deployment Guide

## 🚀 VPS Setup Commands

### 1. Connect to Your VPS
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Or if you have a specific user
ssh username@your-vps-ip
```

### 2. Update System
```bash
# Update package lists
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git nginx mysql-server nodejs npm
```

### 3. Install Node.js (Latest LTS)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_22.19 | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Setup MySQL Database
```bash
# Secure MySQL installation
mysql_secure_installation

# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE cdims;
CREATE USER 'cdims_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Clone and Setup Application
```bash
# Clone your repository
git clone https://github.com/ndayishimiyefidel/cdims.git
cd cdims

# Setup backend
cd backend
npm install
```

### 6. Configure Environment Variables
```bash
# Create .env file
nano .env
```

**Add this content to .env:**
```env
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=your_secure_password
DB_NAME=cdims
JWT_SECRET=your_super_secure_jwt_secret_key_here
PORT=3000
NODE_ENV=production
```

### 7. Setup Database
```bash
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

### 8. Setup Frontend
```bash
# Go to frontend directory
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 9. Install PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cd ../backend
nano ecosystem.config.js
```

**Create ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'cdims-backend',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 10. Start Application with PM2
```bash
# Start backend with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 11. Configure Nginx
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/cdims
```

**Add this Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React build)
    location / {
        root /root/cdims/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 12. Enable Nginx Configuration
```bash
# Enable the site
ln -s /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

### 13. Setup SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 14. Firewall Configuration
```bash
# Configure UFW firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000
ufw --force enable
```

### 15. Monitoring and Logs
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs cdims-backend

# Monitor resources
pm2 monit

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🔧 Maintenance Commands

### Update Application
```bash
# Pull latest changes
cd /root/cdims
git pull origin main

# Update backend
cd backend
npm install
npm run migrate
pm2 restart cdims-backend

# Update frontend
cd ../frontend
npm install
npm run build
systemctl reload nginx
```

### Database Backup
```bash
# Create backup
mysqldump -u cdims_user -p cdims > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u cdims_user -p cdims < backup_file.sql
```

### Health Checks
```bash
# Check if services are running
systemctl status nginx
pm2 status
systemctl status mysql

# Test API endpoint
curl http://localhost:3000/health

# Test frontend
curl http://localhost
```

## 🚨 Troubleshooting

### Common Issues
```bash
# If PM2 process dies
pm2 restart cdims-backend

# If Nginx fails
nginx -t
systemctl restart nginx

# If database connection fails
mysql -u cdims_user -p
SHOW DATABASES;

# Check disk space
df -h

# Check memory usage
free -h
```

### Log Locations
- **Application logs**: `pm2 logs cdims-backend`
- **Nginx logs**: `/var/log/nginx/`
- **MySQL logs**: `/var/log/mysql/`
- **System logs**: `journalctl -u nginx`

## 📋 Quick Deployment Checklist

- [ ] VPS access established
- [ ] System updated
- [ ] Node.js installed
- [ ] MySQL configured
- [ ] Repository cloned
- [ ] Environment variables set
- [ ] Database migrated and seeded
- [ ] Frontend built
- [ ] PM2 configured
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Application tested

## 🌐 Access URLs After Deployment

- **Frontend**: `https://your-domain.com`
- **Backend API**: `https://your-domain.com/api`
- **Health Check**: `https://your-domain.com/api/health`
- **Admin Login**: `admin@cdims.rw` / `admin123`
