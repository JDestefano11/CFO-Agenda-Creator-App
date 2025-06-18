import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Create _redirects file for Netlify if it doesn't exist
const redirectsPath = path.resolve(__dirname, 'public', '_redirects')
if (!fs.existsSync(redirectsPath)) {
  fs.writeFileSync(redirectsPath, '/* /index.html 200')
  console.log('Created _redirects file for SPA routing')
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    'process.env': {}
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper MIME types in the build output
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})