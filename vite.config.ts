import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('pdf-lib')) {
                return 'pdf-lib-util';
              }
              if (id.includes('browser-image-compression')) {
                return 'image-compression-util';
              }
              if (id.includes('qrcode')) {
                return 'qrcode-util';
              }
              if (id.includes('react') || id.includes('scheduler')) {
                return 'react-core';
              }
              if (id.includes('lucide-react')) {
                return 'icons-util';
              }
              if (id.includes('motion')) {
                return 'motion-util';
              }
              return 'vendor-common';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
