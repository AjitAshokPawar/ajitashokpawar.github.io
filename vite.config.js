import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // For root deployment (ajitashokpawar.github.io)
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
});