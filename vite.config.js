import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5182,
    host: true, // Allow external connections for 21st.dev
    strictPort: false,
    // Enable HMR for 21st.dev extension
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5182,
      clientPort: 5182, // Explicit client port for 21st.dev
    },
    // CORS configuration for 21st.dev extension
    cors: {
      origin: true,
      credentials: true,
    },
    // WebSocket configuration for 21st.dev
    ws: {
      port: 5182,
    },
  },
});
