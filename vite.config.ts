import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
                configure: (proxy, options) => {
                    proxy.on('error', (err, req, res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            },
            '/covers': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            }
            // '/media': {
            //     target: 'http://127.0.0.1:8000',
            //     changeOrigin: true,
            //     secure: false,
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