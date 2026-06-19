import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/LessPass-Helper/',
  resolve: {
    alias: {
      'lesspass': path.resolve(__dirname, './lesspass/packages/lesspass/src/index.ts')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020'
  }
});
