import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  /* server: {
    hmr: {
      overlay: false
    }
  }, */
  plugins: [
    svelte(),
    nodePolyfills({
      exclude: [
        'fs', // Excludes the polyfill for `fs` and `node:fs`.
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
})
