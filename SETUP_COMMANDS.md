# CDIMS Setup Commands

## After Pulling Changes from GitHub

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables (if not exists)
# Create .env file with your database credentials
# Example .env content:
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=cdims
# JWT_SECRET=your_jwt_secret
# PORT=3000

# Run database migrations
npm run migrate

# Seed initial data
npm run seed

# Start backend server
npm run dev
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

### 3. Database Setup (First Time Only)
```sql
-- Create MySQL database
CREATE DATABASE cdims;
```

### 4. Quick Start Commands
```bash
# From project root directory
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

### 5. Access URLs
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 6. Default Admin Credentials
- **Email**: admin@cdims.rw
- **Password**: admin123

### 7. Troubleshooting Commands
```bash
# Check if ports are in use
netstat -an | findstr :3000
netstat -an | findstr :3001

# Kill processes on ports (if needed)
npx kill-port 3000
npx kill-port 3001

# Reset database (if needed)
cd backend
npm run migrate:undo:all
npm run migrate
npm run seed
```

### 8. Development Commands
```bash
# Backend commands
cd backend
npm run dev          # Start development server
npm run migrate      # Run migrations
npm run seed         # Seed data
npm start           # Start production server

# Frontend commands
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### 9. Git Commands for Updates
```bash
# Pull latest changes
git pull origin main

# Check for changes
git status

# If there are conflicts, resolve them and then:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### 10. Environment Variables Template
Create `.env` file in backend directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=cdims
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=development
```

## Quick Setup Script
Save this as `setup.bat` (Windows) or `setup.sh` (Linux/Mac):

### Windows (setup.bat)
```batch
@echo off
echo Setting up CDIMS...

echo Installing backend dependencies...
cd backend
npm install

echo Installing frontend dependencies...
cd ../frontend
npm install

echo Setup complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && npm run dev
echo 2. Frontend: cd frontend && npm run dev
```

### Linux/Mac (setup.sh)
```bash
#!/bin/bash
echo "Setting up CDIMS..."

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
```

## Notes
- Make sure MySQL is running
- Ensure ports 3000 and 3001 are available
- Check that all environment variables are set correctly
- Run migrations before starting the application
