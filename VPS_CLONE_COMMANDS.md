# VPS Clone Commands for CDIMS

## 🚀 Clone Main Branch to VPS

### 1. Connect to Your VPS
```bash
ssh root@your-vps-ip
```

### 2. Clone the Repository
```bash
# Clone the main branch
git clone https://github.com/ndayishimiyefidel/cdims.git

# Navigate to the project
cd cdims

# Verify you're on main branch
git branch
```

### 3. Setup Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
```

### 4. Environment Configuration (.env)
```env
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=password@123
DB_NAME=cdims
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
```

### 5. Setup Database with Sequelize
```bash
# Run migrations to create all tables
npm run migrate

# Seed initial data
npm run seed
```

### 6. Setup Frontend
```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 7. Install PM2 and Start Application
```bash
# Install PM2 globally
npm install -g pm2

# Go back to backend
cd ../backend

# Create PM2 ecosystem file
nano ecosystem.config.js
```

### 8. PM2 Configuration (ecosystem.config.js)
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

### 9. Start with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 10. Configure Nginx
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/cdims
```

### 11. Nginx Configuration
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

### 12. Enable Nginx Site
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

### 13. Configure Firewall
```bash
# Configure UFW firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000
ufw --force enable
```

### 14. Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Test API endpoint
curl http://localhost:3000/health

# Test frontend
curl http://localhost
```

## 🔧 Quick Clone Script

Save this as `clone-setup.sh` on your VPS:

```bash
#!/bin/bash

echo "🚀 Cloning CDIMS to VPS..."

# Clone repository
git clone https://github.com/ndayishimiyefidel/cdims.git
cd cdims

# Setup backend
cd backend
npm install

# Create .env
cat > .env << EOF
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=password@123
DB_NAME=cdims
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
EOF

# Run migrations and seed
npm run migrate
npm run seed

# Setup frontend
cd ../frontend
npm install
npm run build

# Install PM2
npm install -g pm2

# Create PM2 config
cd ../backend
cat > ecosystem.config.js << EOF
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
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ CDIMS cloned and setup complete!"
echo "Frontend: http://your-vps-ip"
echo "Backend API: http://your-vps-ip/api"
```

## 📋 One-Line Commands

### Complete Setup in One Go
```bash
git clone https://github.com/ndayishimiyefidel/cdims.git && cd cdims && cd backend && npm install && npm run migrate && npm run seed && cd ../frontend && npm install && npm run build && cd ../backend && npm install -g pm2 && pm2 start src/app.js --name cdims-backend && pm2 save && pm2 startup
```

### Quick Verification
```bash
# Check if everything is running
pm2 status && systemctl status nginx && curl http://localhost:3000/health
```

## 🌐 Access URLs After Setup

- **Frontend**: `http://your-vps-ip`
- **Backend API**: `http://your-vps-ip/api`
- **Health Check**: `http://your-vps-ip/api/health`
- **Admin Login**: `admin@cdims.rw` / `admin123`

## 🚨 Troubleshooting

### If Clone Fails
```bash
# Check internet connection
ping google.com

# Check if git is installed
git --version

# Try cloning with verbose output
git clone -v https://github.com/ndayishimiyefidel/cdims.git
```

### If Dependencies Fail
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### If Database Fails
```bash
# Check MySQL status
systemctl status mysql

# Test database connection
mysql -u cdims_user -p cdims -e "SELECT 1;"

# Check if tables exist
mysql -u cdims_user -p cdims -e "SHOW TABLES;"
```

This guide will help you clone and set up CDIMS on your VPS! 🎯
