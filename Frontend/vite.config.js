import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

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
  }
})