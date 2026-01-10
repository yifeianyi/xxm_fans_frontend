import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://172.27.171.134:8000',
        changeOrigin: true,
        secure: false,
      },
      // '/covers': {
      //   target: 'http://172.27.171.134:8000',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})