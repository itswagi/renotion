/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import { peerDependencies } from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // 👨‍💻 Playground mode
    return {
      plugins: [react(), tailwindcss()],
      root: 'playground', // use playground folder as root
      resolve: {
        alias: {
          'lucide-react/icons': fileURLToPath(
            new URL(
              './node_modules/lucide-react/dist/esm/icons',
              import.meta.url,
            ),
          ),
        },
      },
      test: {
        // ✅ add this so vitest runs in dev mode too
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        include: ['lib/**/*.test.{ts,tsx}'],
      },
    };
  }

  // 📦 Library build mode
  return {
    plugins: [
      react(),
      tailwindcss(),
      cssInjectedByJsPlugin(),
      dts({
        tsconfigPath: './tsconfig.build.json', // 👈 use build-only config
        rollupTypes: true,
      }),
      // visualizer({ open: true }),
    ],
    build: {
      target: 'esnext',
      lib: {
        entry: resolve(__dirname, join('lib', 'index.ts')),
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        external: [
          'react-dom/server',
          'react/jsx-runtime',
          'react-jsx',
          ...Object.keys(peerDependencies),
        ],
      },
    },
    test: {
      // ✅ Vitest config for library build mode
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      include: ['lib/**/*.test.{ts,tsx}'],
    },
    resolve: {
      alias: {
        'lucide-react/icons': fileURLToPath(
          new URL(
            './node_modules/lucide-react/dist/esm/icons',
            import.meta.url,
          ),
        ),
      },
    },
  };
});
