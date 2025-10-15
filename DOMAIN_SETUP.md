# Setup Domain: cyangugudims.com

## 🌐 **Your Domain: cyangugudims.com**

Great! I can see you have the domain `cyangugudims.com` from Namecheap. Let's configure everything to use your actual domain.

## 🔧 **Configure Nginx for Your Domain**

### **1. Create Nginx Configuration for cyangugudims.com**
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/cdims
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name cyangugudims.com www.cyangugudims.com;

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

## 🌐 **DNS Configuration in Namecheap**

### **1. Go to Advanced DNS Tab**
In your Namecheap control panel:
1. Click on **"Advanced DNS"** tab
2. You'll see DNS records section

### **2. Add DNS Records**
Add these DNS records:

**A Record (Main Domain):**
- **Type**: A Record
- **Host**: @
- **Value**: YOUR_SERVER_IP
- **TTL**: Automatic

**A Record (WWW Subdomain):**
- **Type**: A Record  
- **Host**: www
- **Value**: YOUR_SERVER_IP
- **TTL**: Automatic

**CNAME Record (Optional - for www):**
- **Type**: CNAME Record
- **Host**: www
- **Value**: cyangugudims.com
- **TTL**: Automatic

## 🚀 **Complete Setup Commands**

### **1. Build Frontend**
```bash
cd ~/cdims/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### **2. Install and Configure Nginx**
```bash
# Install Nginx
apt update
apt install nginx -y

# Create configuration
nano /etc/nginx/sites-available/cdims
# Add the configuration above

# Enable site
ln -s /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

### **3. Setup SSL with Certbot (Recommended)**
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d cyangugudims.com -d www.cyangugudims.com
```

## 🌐 **Access Your Application**

After setup, you can access:

- **Frontend**: `http://cyangugudims.com` or `https://cyangugudims.com`
- **Backend API**: `http://cyangugudims.com/api` or `https://cyangugudims.com/api`
- **Backend Direct**: `http://cyangugudims.com/backend` or `https://cyangugudims.com/backend`

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
curl http://cyangugudims.com
```

### **Check DNS Resolution**
```bash
# Check if domain resolves to your server
nslookup cyangugudims.com
dig cyangugudims.com
```

## 🔒 **SSL Certificate Setup**

### **1. Install Certbot**
```bash
apt install certbot python3-certbot-nginx -y
```

### **2. Get SSL Certificate**
```bash
# Get SSL certificate for your domain
certbot --nginx -d cyangugudims.com -d www.cyangugudims.com
```

### **3. Auto-renewal**
```bash
# Test auto-renewal
certbot renew --dry-run

# Add to crontab for auto-renewal
crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚨 **Important Notes**

1. **Replace YOUR_SERVER_IP** with your actual VPS IP address
2. **DNS changes can take 24-48 hours** to propagate
3. **Configure firewall** to allow HTTP (80) and HTTPS (443) traffic
4. **Backend runs on port 3000** internally
5. **Frontend is served by Nginx** on port 80/443

## 📋 **Quick Setup Summary**

1. **Build frontend**: `cd ~/cdims/frontend && npm install && npm run build`
2. **Install Nginx**: `apt install nginx -y`
3. **Configure Nginx**: Create `/etc/nginx/sites-available/cdims` with your domain
4. **Enable site**: `ln -s /etc/nginx/sites-available/cdims /etc/nginx/sites-enabled/`
5. **Restart Nginx**: `systemctl restart nginx`
6. **Setup DNS**: Add A records in Namecheap pointing to your server IP
7. **Setup SSL**: `certbot --nginx -d cyangugudims.com -d www.cyangugudims.com`

Your application will be accessible at `https://cyangugudims.com`! 🎯
