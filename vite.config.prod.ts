import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        devSourcemap: false,
    },
    server: {
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            },
            '/covers': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                secure: false,
            },
            '/media': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                secure: false,
            },
            '/gallery': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                secure: false,
            },
            '/footprint': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: './index.html'
            },
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'lucide': ['lucide-react'],
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        chunkSizeWarningLimit: 1000,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    }
})