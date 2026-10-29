import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load properly on GitHub Pages and Android WebView
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'], // Exposes both VITE_ and NEXT_PUBLIC_ env vars
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
          'vendor-zod': ['zod'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
