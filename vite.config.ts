import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // Offline-first: a service worker precaches the app shell (JS, CSS, fonts, images)
    // so the console opens without a connection; Firestore's own cache covers the data.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'KALASAG Console',
        short_name: 'KALASAG',
        description: 'Post-earthquake survivor distress network via pre-configured LoRa nodes.',
        theme_color: '#a5482b',
        background_color: '#f4f7fa',
        display: 'standalone',
        icons: [{ src: 'favicon.png', sizes: '215x255', type: 'image/png' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
  // GitHub Pages serves the site from /<repo>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH || '/',
})
