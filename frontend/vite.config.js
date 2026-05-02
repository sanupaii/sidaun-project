import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Membuka akses jaringan lokal (IP Address)
    port: 5173, // Pastikan port tetap 5173
  },
  build: {
    // TF.js bundle besar (~1MB+), naikkan batas warning agar tidak jadi error
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        // Aktifkan service worker di mode dev untuk testing
        enabled: true,
      },
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'SiDaun - Deteksi Penyakit Daun Cabai',
        short_name: 'SiDaun',
        description: 'Aplikasi deteksi penyakit daun cabai berbasis AI yang bekerja secara offline.',
        theme_color: '#16a34a',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // [KRUSIAL] Override batas default Workbox 2MB → 10MB
        // Diperlukan agar file .bin model TF.js (~4MB) ter-cache untuk mode offline
        maximumFileSizeToCacheInBytes: 10_000_000,
        // Cache semua aset termasuk file model TF.js
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,webp,svg,json,bin,wasm}'],
        runtimeCaching: [
          {
            // Cache tambahan runtime untuk Google Fonts jika ada
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
              },
            },
          },
        ],
      },
    }),
  ],
})
