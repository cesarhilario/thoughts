import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Exemplo de alias para a pasta src
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/types/**', '**.config.**'],
    },
  },
});
