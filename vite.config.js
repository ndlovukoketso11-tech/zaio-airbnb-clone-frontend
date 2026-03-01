import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://zaio-airbnb-clone-5bedc68c59e8.herokuapp.com',
        changeOrigin: true,
      },
    },
  },
});
