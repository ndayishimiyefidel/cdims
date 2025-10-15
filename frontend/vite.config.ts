import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // 👈 change port here
    open: true, // optional: auto-open browser
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip all warnings during build
        return;
      }
    }
  },
  esbuild: {
    // Skip TypeScript errors during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
