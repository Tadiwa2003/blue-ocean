import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5182,
    host: true, // Allow external connections for 21st.dev
    strictPort: false,
    // Enable HMR for 21st.dev extension with optimized settings
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5182,
      clientPort: 5182, // Explicit client port for 21st.dev
      overlay: false, // Prevent HMR overlay from causing refreshes
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
  // Optimize build to prevent refresh issues
  optimizeDeps: {
    include: ['react', 'react-dom', 'lenis'],
  },
});
