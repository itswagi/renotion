import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: !options.watch, // don’t nuke dist on every rebuild in watch mode
  minify: false, // skip minify while developing
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom'],
  watch: options.watch, // enable watch if --watch is passed
}));
