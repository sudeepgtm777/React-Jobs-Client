import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite default frontend port (avoid conflict with backend)
    proxy: {
      '/api': {
        target: process.env.VITE_REACT_APP_BACKEND_URL
          ? 'https://react-jobs-client-h8qq-git-main-sudeep-gautams-projects.vercel.app/'
          : 'http://localhost:3000', // Backend port
        changeOrigin: true,
        // No rewrite needed since backend routes start with /api
      },
    },
  },
});
