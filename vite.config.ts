import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/contacts': 'http://localhost:8000',
      '/blogs': 'http://localhost:8000',
      '/faqs': 'http://localhost:8000',
      '/insta-posts': 'http://localhost:8000',
      '/dashboard': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000',
      '/public': 'http://localhost:8000',
    },
  },
})
