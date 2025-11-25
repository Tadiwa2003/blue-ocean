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
  // Production build configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        // Remove console statements in production
        drop_console: true, // Remove all console.* calls
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.debug', 'console.info'], // Specifically remove these
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'animation-vendor': ['gsap', '@gsap/react', 'animejs', 'lenis'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
});
