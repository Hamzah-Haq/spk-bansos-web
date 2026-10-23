import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin /api in dev (mirrors nginx in Docker), so session cookies work without CORS.
    proxy: {
      '/api': process.env.VITE_API_PROXY ?? 'http://localhost:3000',
    },
  },
})
