/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

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
        include: ['src/**/*.test.{ts,tsx}'],
      },
    };
  }

  // 📦 Library build mode
  return {
    plugins: [
      react(),
      dts({
        tsconfigPath: './tsconfig.app.json',
        insertTypesEntry: true,
        outDir: 'dist',
        include: ['src'],
        exclude: ['playground', '**/*.test.*'],
        entryRoot: 'src',
      }),
      tailwindcss(),
      cssInjectedByJsPlugin(),
    ],
    test: {
      // ✅ Vitest config for library build mode
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      include: ['src/**/*.test.{ts,tsx}'],
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Renotion',
        formats: ['es', 'umd'],
        fileName: (format) => `renotion.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
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
