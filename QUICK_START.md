# CDIMS Quick Start Guide

After Pulling from GitHub

1. Backend Setup
cd backend
npm install
npm run migrate
npm run seed
npm run dev

2. Frontend Setup

cd frontend
npm install
npm run dev

### 3. Access URLs
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **Admin Login**: admin@cdims.rw / admin123

## 🔧 Common Commands

### Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Database Commands
```bash
cd backend
npm run migrate    # Run migrations
npm run seed      # Seed data
```

### Troubleshooting
```bash
# Check ports
netstat -an | findstr :3000
netstat -an | findstr :3001

# Kill processes
npx kill-port 3000
npx kill-port 3001
```

## 📝 Environment Setup
Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=cdims
JWT_SECRET=your_secret_key
PORT=3000
```

## ✅ Verification
1. Backend running: http://localhost:3000/health
2. Frontend running: http://localhost:3001
3. Login with admin credentials
4. Check inventory report filtering works
