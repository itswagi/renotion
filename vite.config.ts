/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
// import { visualizer } from 'rollup-plugin-visualizer';

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
          '@': path.resolve(__dirname, './lib'),
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
      dts({
        tsconfigPath: './tsconfig.build.json', // 👈 use build-only config
        insertTypesEntry: true,
        outDir: 'dist',
        include: ['lib'],
        exclude: [
          'playground',
          '**/*.test.*',
          'lib/**/*.stories.*',
          '**/stories/**',
          '.storybook',
        ],
        entryRoot: 'lib',
      }),
      tailwindcss(),
      cssInjectedByJsPlugin(),
      // visualizer({ open: true }),
    ],
    test: {
      // ✅ Vitest config for library build mode
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      include: ['lib/**/*.test.{ts,tsx}'],
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'lib/index.ts'),
        name: 'Renotion',
        formats: ['es', 'cjs'],
        fileName: (format) => `renotion.${format}.js`,
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react-dom/server',
          'react/jsx-runtime',
          'react-jsx',
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-dom/server': 'ReactDOMServer',
            'react/jsx-runtime': 'jsxRuntime',
            'react-jsx': 'jsxRuntime',
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
        '@': path.resolve(__dirname, './lib'),
      },
    },
  };
});
