# Fix Frontend Build Issues

## 🚨 **Current Issues**

1. **Missing TypeScript compiler**: `sh: 1: tsc: not found`
2. **Missing Vite**: `sh: 1: vite: not found`
3. **High severity vulnerability** in dependencies
4. **Deprecated package**: `lodash.isequal@4.5.0`

## 🔧 **Solution: Fix Frontend Build**

### **1. Fix Node.js PATH Issue**
```bash
cd ~/cdims/frontend

# Check if node_modules/.bin exists
ls -la node_modules/.bin

# Add node_modules/.bin to PATH
export PATH=$PATH:$(pwd)/node_modules/.bin

# Verify PATH
echo $PATH
```

### **2. Install Missing Dependencies**
```bash
# Install TypeScript globally
npm install -g typescript

# Install Vite globally
npm install -g vite

# Or install locally
npm install --save-dev typescript vite
```

### **3. Fix Security Vulnerabilities**
```bash
# Fix security vulnerabilities
npm audit fix

# Check remaining vulnerabilities
npm audit
```

### **4. Try Building Again**
```bash
# Try build with full path
./node_modules/.bin/tsc -b && ./node_modules/.bin/vite build

# Or use npx
npx tsc -b && npx vite build

# Or try npm run build again
npm run build
```

## 🚀 **Alternative: Complete Reinstall**

If the above doesn't work:

### **1. Clean Install**
```bash
cd ~/cdims/frontend

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Try build again
npm run build
```

### **2. Check Package.json Scripts**
```bash
# Check package.json scripts
cat package.json | grep -A 10 '"scripts"'
```

## 🔍 **Troubleshooting Commands**

### **Check Node.js and NPM**
```bash
# Check Node.js version
node --version

# Check NPM version
npm --version

# Check if TypeScript is installed
which tsc
tsc --version

# Check if Vite is installed
which vite
vite --version
```

### **Check Frontend Dependencies**
```bash
# Check if dependencies are installed
ls -la node_modules/.bin | grep tsc
ls -la node_modules/.bin | grep vite

# Check package.json
cat package.json
```

## 📋 **Complete Fix Commands**

### **Option A: Fix PATH and Dependencies**
```bash
cd ~/cdims/frontend

# Fix PATH
export PATH=$PATH:$(pwd)/node_modules/.bin

# Install missing dependencies
npm install -g typescript vite

# Fix vulnerabilities
npm audit fix

# Try build
npm run build
```

### **Option B: Clean Reinstall**
```bash
cd ~/cdims/frontend

# Clean everything
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstall
npm install

# Try build
npm run build
```

### **Option C: Use NPX**
```bash
cd ~/cdims/frontend

# Use npx to run commands
npx tsc -b && npx vite build
```

## ✅ **Verification**

After fixing, you should see:
- No "not found" errors
- Successful TypeScript compilation
- Successful Vite build
- `dist` folder created with built files

## 🚨 **Common Issues**

1. **PATH not set**: Add `node_modules/.bin` to PATH
2. **Missing dependencies**: Install TypeScript and Vite
3. **Corrupted node_modules**: Clean reinstall
4. **Version conflicts**: Use npx or global installs

Try Option A first (fix PATH and dependencies)! 🎯
