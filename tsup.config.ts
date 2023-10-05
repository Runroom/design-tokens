import { defineConfig } from 'tsup';


export default defineConfig((options) => {
  return {
    minify: !options.watch,
    entry: {
      'index': 'src/index.ts',
      'bin/index': 'src/design-tokens.ts'
    },
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: !!options.watch,
    clean: true
  }
});
