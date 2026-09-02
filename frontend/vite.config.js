import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: true,
    },
    plugins: [react()],
    define: {
      // Force-inject env vars so they are always available as import.meta.env.*
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5000'),
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || ''),
      'import.meta.env.VITE_PORTFOLIO_SLUG': JSON.stringify(env.VITE_PORTFOLIO_SLUG || 'gabrial-deora'),
    },
  };
});
