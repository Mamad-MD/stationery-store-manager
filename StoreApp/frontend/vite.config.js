import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync('../192.168.1.100-key.pem'),
      cert: fs.readFileSync('../192.168.1.100.pem'),
    }
  }
})
