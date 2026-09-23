import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Força o PWA a funcionar no localhost
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Plataforma de Simulado Digital - IFPA',
        short_name: 'Simulado IFPA',
        description: 'Módulo de Gestão Acadêmica e Banco de Questões',
        start_url: '/',
        theme_color: '#15803d',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
  {
    src: '/pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: '/pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any maskable'
  }
]
      }
    })
  ],
})