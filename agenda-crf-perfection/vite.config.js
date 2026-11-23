import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Couleurs de la charte CRF Perfection
const BLEU_NUIT = '#1B2A41'

export default defineConfig({
  define: {
    __VERSION_APP__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.png', 'logo-entete.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Agenda CRF Perfection',
        short_name: 'Agenda CRF',
        description: 'Agenda électronique de suivi des tâches de CRF Perfection',
        lang: 'fr',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFFFFF',
        theme_color: BLEU_NUIT,
        categories: ['productivity', 'business'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Nouvelle tâche', short_name: 'Ajouter', url: '/taches/nouvelle', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Tâches échues', short_name: 'Échues', url: '/taches?filtre=echues', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] }
        ]
      },
      workbox: {
        // On ne pré-charge que l'essentiel (connexions faibles) ;
        // les modules d'export/import sont téléchargés au premier usage puis gardés en cache.
        globPatterns: ['index.html', 'assets/index-*.{js,css}', 'assets/inter-latin-wght-*.woff2', 'icons/*.png', 'favicon.png', 'logo-entete.png'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        // Gestionnaire des notifications push (inactif tant que les rappels ne sont pas activés)
        importScripts: ['/sw-rappels.js'],
        runtimeCaching: [
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/assets/'),
            handler: 'CacheFirst',
            options: { cacheName: 'modules-a-la-demande', expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 60 } }
          },
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname === '/logo.png',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'images' }
          }
          // Les appels Supabase ne sont jamais mis en cache par le service worker (données toujours fraîches).
        ]
      },
      devOptions: { enabled: false }
    })
  ],
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 700
    // Les modules d'export/import (jsPDF, Excel) sont chargés à la demande (import dynamique)
  },
  server: { port: 5173, host: true }
})
