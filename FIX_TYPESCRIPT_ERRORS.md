# Fix TypeScript Build Errors

## 🚨 **Current Issues**

- **15,806 TypeScript errors** found
- **Missing React types**: `@types/react` not installed
- **Missing Vite types**: `vite` and `@vitejs/plugin-react` not found
- **Missing JSX runtime types**: `react/jsx-runtime` not found

## 🔧 **Solution: Install Missing Dependencies**

### **1. Install Missing Type Definitions**
```bash
cd ~/cdims/frontend

# Install React types
npm install --save-dev @types/react @types/react-dom

# Install Vite and plugin
npm install --save-dev vite @vitejs/plugin-react

# Install other missing types
npm install --save-dev @types/node
```

### **2. Install All Dependencies**
```bash
# Install all dependencies
npm install

# Check if all packages are installed
npm list --depth=0
```

### **3. Try Building Again**
```bash
# Try build
npm run build

# If still errors, try with verbose output
npm run build -- --verbose
```

## 🚀 **Alternative: Complete Clean Install**

If the above doesn't work:

### **1. Clean Everything**
```bash
cd ~/cdims/frontend

# Remove all node_modules and lock files
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force
```

### **2. Reinstall Everything**
```bash
# Reinstall all dependencies
npm install

# Install missing types
npm install --save-dev @types/react @types/react-dom @types/node

# Install Vite and plugin
npm install --save-dev vite @vitejs/plugin-react

# Try build
npm run build
```

## 🔍 **Check Package.json**

### **1. Verify Dependencies**
```bash
# Check package.json
cat package.json

# Check if all dependencies are installed
npm list --depth=0
```

### **2. Check TypeScript Configuration**
```bash
# Check tsconfig.json
cat tsconfig.json

# Check if TypeScript is working
npx tsc --version
```

## 📋 **Complete Fix Commands**

### **Option A: Install Missing Types**
```bash
cd ~/cdims/frontend

# Install missing types
npm install --save-dev @types/react @types/react-dom @types/node

# Install Vite and plugin
npm install --save-dev vite @vitejs/plugin-react

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

# Install missing types
npm install --save-dev @types/react @types/react-dom @types/node
npm install --save-dev vite @vitejs/plugin-react

# Try build
npm run build
```

### **Option C: Skip TypeScript Check (Quick Fix)**
```bash
cd ~/cdims/frontend

# Build without TypeScript check
npx vite build --mode production

# Or modify package.json to skip TypeScript
# Change "build": "tsc -b && vite build" to "build": "vite build"
```

## ✅ **Verification**

After fixing, you should see:
- No TypeScript errors
- Successful build
- `dist` folder created
- No "not found" errors

## 🚨 **Common Issues**

1. **Missing types**: Install `@types/react`, `@types/react-dom`
2. **Missing Vite**: Install `vite`, `@vitejs/plugin-react`
3. **Corrupted node_modules**: Clean reinstall
4. **TypeScript config**: Check `tsconfig.json`

Try Option A first (install missing types)! 🎯
