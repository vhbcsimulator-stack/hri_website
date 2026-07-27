import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { localContentApi } from './vite.content-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // shared/content/*.js imports its data source through this specifier.
      // The public site points it at a read-only store; the admin app points
      // the same specifier at its own read/write store, which is what keeps
      // the two apps independent while sharing the default content data.
      '@content-backend': fileURLToPath(new URL('./src/lib/contentStore.js', import.meta.url)),
    },
  },
  plugins: [
    react(),
    localContentApi(fileURLToPath(new URL('./content/site-content.json', import.meta.url))),
  ],
})
