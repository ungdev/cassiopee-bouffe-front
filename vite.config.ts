import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  base: process.env.PREFIX || '/',
  server: {
    port: parseInt(process.env.PORT) || 8080,
  },
});
