import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'landing',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './landing/src'),
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: true
  },
  preview: {
    port: 5000,
    host: '0.0.0.0'
  }
})
