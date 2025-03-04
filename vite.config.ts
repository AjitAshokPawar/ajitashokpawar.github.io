import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // For GitHub Pages (ajitashokpawar.github.io)
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
