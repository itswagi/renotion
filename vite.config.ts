/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // 👨‍💻 Playground mode
    return {
      plugins: [react(), tailwindcss()],
      root: 'playground', // use playground folder as root
      resolve: {
        alias: {
          renotion: path.resolve(__dirname, 'src'), // alias to source code
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
        entry: 'src/index.ts',
        name: 'Renotion',
        formats: ['es', 'cjs'],
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
  };
});
