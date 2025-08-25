import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // point to Nest root

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  build: {
    outDir: 'dist', // default; you can change this if Nest expects another folder
  },
  worker: {
    format: 'es', // Ensure Web Workers use ES module format
  },
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.min.mjs'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- maps '@' to /src
    },
  },
  define: {
    'import.meta.env.VITE_CESIUM_API_KEY': JSON.stringify(
      process.env.VITE_CESIUM_API_KEY,
    ),
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://192.168.1.7:3000', changeOrigin: true },
      '/media': { target: 'http://192.168.1.7:3000', changeOrigin: true },
    },
  },
});
