
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AfroditaStore',
        short_name: 'Afrodita',
        description: 'Afrodita es tu Amiga!',
        theme_color: '#eab7d3',
        background_color: '#fff',
        display: 'standalone',
        start_url: '/',
        lang: 'es',
        icons: [
          {
            src: '/assets/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/assets/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
