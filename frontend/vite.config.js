import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, requests to /api are forwarded to the local backend,
    // so VITE_API_URL can stay empty while working locally.
    proxy: { '/api': 'http://localhost:4000' },
  },
});
