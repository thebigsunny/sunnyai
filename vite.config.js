import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  server: {
    port: 5173,
    host: true,
    https: command === 'serve' ? false : true // Only use HTTPS in production
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth'],
          'elevenlabs': ['@11labs/client']
        }
      }
    }
  }
})); 