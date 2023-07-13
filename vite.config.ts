//import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';

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
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTest.js'],
  },
});
