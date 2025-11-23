import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5182,
    host: true, // Allow external connections for 21st.dev
    strictPort: true,
    // Optimized HMR configuration
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5182,
      clientPort: 5182,
      overlay: false, // Disable error overlay to prevent refresh issues
    },
    // CORS configuration for 21st.dev extension
    cors: {
      origin: true,
      credentials: true,
    },
    // Watch options to prevent excessive file watching
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
  },
});
