import { defineConfig } from 'tsup';

export default defineConfig(options => {
  return {
    minify: !options.sourcemap,
    entry: {
      'index': 'src/index.ts',
      'bin/index': 'src/bin/designTokens.ts'
    },
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: !!options.sourcemap,
    clean: true
  };
});
