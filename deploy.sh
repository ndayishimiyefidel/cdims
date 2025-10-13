#!/bin/bash

# CDIMS VPS Deployment Script
# Run this script on your VPS after connecting via SSH

echo "🚀 Starting CDIMS VPS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
apt install -y curl wget git nginx mysql-server nodejs npm

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify Node.js installation
print_status "Verifying Node.js installation..."
node --version
npm --version

# Setup MySQL
print_status "Setting up MySQL..."
systemctl start mysql
systemctl enable mysql

# Create database and user
print_status "Creating database and user..."
mysql -e "CREATE DATABASE IF NOT EXISTS cdims;"
mysql -e "CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'cdims_secure_2024';"
mysql -e "GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Clone repository
print_status "Cloning CDIMS repository..."
if [ -d "cdims" ]; then
    print_warning "CDIMS directory already exists. Updating..."
    cd cdims
    git pull origin main
else
    git clone https://github.com/ndayishimiyefidel/cdims.git
    cd cdims
fi

# Setup backend
print_status "Setting up backend..."
cd backend
npm install

# Create .env file
print_status "Creating environment configuration..."
cat > .env << EOF
DB_HOST=localhost
DB_USER=cdims_user
DB_PASSWORD=cdims_secure_2024
DB_NAME=cdims
JWT_SECRET=cdims_jwt_secret_key_2024_production
PORT=3000
NODE_ENV=production
EOF

# Run database migrations
print_status "Running database migrations..."
npm run migrate

# Seed database
print_status "Seeding database..."
npm run seed

# Install PM2
print_status "Installing PM2 process manager..."
npm install -g pm2

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
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

# Start backend with PM2
print_status "Starting backend with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup frontend
print_status "Setting up frontend..."
cd ../frontend
npm install
npm run build

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/cdims << EOF
server {
    listen 80;
    server_name _;

    # Frontend (React build)
    location / {
        root /root/cdims/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx site
print_status "Enabling Nginx site..."
ln -sf /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
print_status "Testing and restarting Nginx..."
nginx -t
systemctl restart nginx
systemctl enable nginx

# Configure firewall
print_status "Configuring firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000
ufw --force enable

# Final status check
print_status "Checking deployment status..."
echo ""
echo "=== DEPLOYMENT STATUS ==="
echo "PM2 Status:"
pm2 status
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager -l
echo ""
echo "MySQL Status:"
systemctl status mysql --no-pager -l
echo ""

print_status "🎉 CDIMS deployment completed!"
print_status "Frontend: http://$(curl -s ifconfig.me)"
print_status "Backend API: http://$(curl -s ifconfig.me)/api"
print_status "Health Check: http://$(curl -s ifconfig.me)/api/health"
print_status "Admin Login: admin@cdims.rw / admin123"
echo ""
print_warning "Remember to:"
print_warning "1. Configure your domain name in Nginx"
print_warning "2. Install SSL certificate with: certbot --nginx -d your-domain.com"
print_warning "3. Update DNS records to point to this server"
