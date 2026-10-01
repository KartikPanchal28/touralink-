import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api/rto': {
        target: 'https://rto-vehicle-information-india.p.rapidapi.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/rto/, '')
      }
    }
  }
});
