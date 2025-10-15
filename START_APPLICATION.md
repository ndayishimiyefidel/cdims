# Start Backend and Frontend with Domain Routing

## 🎉 **Database Setup Complete!**

Great! The database is now working:
- ✅ Migrations completed
- ✅ Database seeded
- ✅ PM2 installed

## 🚀 **Start Backend Application**

### **1. Start Backend with PM2**
```bash
cd ~/cdims/backend

# Start backend with PM2
pm2 start src/app.js --name cdims-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### **2. Check Backend Status**
```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs cdims-backend

# Check if backend is running
curl http://localhost:3000/api/health
```

## 🌐 **Setup Frontend**

### **1. Build Frontend**
```bash
cd ~/cdims/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### **2. Install Nginx (Web Server)**
```bash
# Update package list
apt update

# Install Nginx
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check Nginx status
systemctl status nginx
```

## 🔧 **Configure Nginx for Domain Routing**

### **1. Create Nginx Configuration**
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/cdims
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React App)
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

    # Backend direct access
    location /backend {
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

### **2. Enable Site**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

## 🔒 **Setup SSL with Certbot (Optional)**

### **1. Install Certbot**
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y
```

### **2. Get SSL Certificate**
```bash
# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📋 **Complete Setup Commands**

### **1. Start Backend**
```bash
cd ~/cdims/backend
pm2 start src/app.js --name cdims-backend
pm2 save
pm2 startup
```

### **2. Build Frontend**
```bash
cd ~/cdims/frontend
npm install
npm run build
```

### **3. Setup Nginx**
```bash
# Install Nginx
apt update
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# Create configuration
nano /etc/nginx/sites-available/cdims
# Add the configuration above

# Enable site
ln -s /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 🌐 **Access Your Application**

After setup, you can access:

- **Frontend**: `http://your-domain.com` or `http://your-server-ip`
- **Backend API**: `http://your-domain.com/api` or `http://your-server-ip/api`
- **Backend Direct**: `http://your-domain.com/backend` or `http://your-server-ip/backend`

## ✅ **Verification Commands**

### **Check Backend**
```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs cdims-backend

# Test API
curl http://localhost:3000/api/health
```

### **Check Frontend**
```bash
# Check if build exists
ls -la ~/cdims/frontend/dist

# Check Nginx status
systemctl status nginx

# Test frontend
curl http://localhost
```

## 🚨 **Important Notes**

1. **Replace `your-domain.com`** with your actual domain
2. **Update DNS** to point to your server IP
3. **Configure firewall** to allow HTTP (80) and HTTPS (443) traffic
4. **Backend runs on port 3000** internally
5. **Frontend is served by Nginx** on port 80

Your application will be accessible at your domain! 🎯
