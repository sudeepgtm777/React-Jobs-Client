import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load .env variables based on current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000',
          // target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  });
};
