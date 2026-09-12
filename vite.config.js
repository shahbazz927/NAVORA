import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 0.0.0.0 binds all interfaces so 'localhost' works on both IPv4 (127.0.0.1)
    // and IPv6 (::1), and the site is reachable on your LAN IP too.
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Route /api/* (the NAVORA AI Career Advisor backend) to the Node server.
    // The browser only ever talks to this proxy — never directly to Ollama.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
  },
})
