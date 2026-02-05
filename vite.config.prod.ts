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
                manualChunks: (id) => {
                    // React 核心库
                    if (id.includes('node_modules/react') || 
                        id.includes('node_modules/react-dom') ||
                        id.includes('node_modules/react-router-dom')) {
                        return 'react-vendor';
                    }
                    // UI 组件库
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide';
                    }
                    // 页面组件 - 按页面分割
                    if (id.includes('/presentation/pages/')) {
                        const match = id.match(/pages\/([^/]+)/);
                        if (match) {
                            return `page-${match[1].toLowerCase()}`;
                        }
                    }
                    // 基础设施层
                    if (id.includes('/infrastructure/')) {
                        return 'infrastructure';
                    }
                },
                chunkFileNames: 'assets/[name]-[hash:8].js',
                entryFileNames: 'assets/[name]-[hash:8].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name || '';
                    // 图片资源使用原始名称加哈希
                    if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info)) {
                        return 'assets/images/[name]-[hash:8][extname]';
                    }
                    // CSS 文件
                    if (/\.css$/i.test(info)) {
                        return 'assets/styles/[name]-[hash:8][extname]';
                    }
                    return 'assets/[name]-[hash:8][extname]';
                },
            },
        },
        chunkSizeWarningLimit: 500,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                drop_comments: true,
            },
            format: {
                comments: false,
            },
        },
        // 启用源码映射（生产环境调试使用，可关闭以减小体积）
        sourcemap: false,
        // CSS 代码分割
        cssCodeSplit: true,
        // 资源内联阈值（小于 4KB 的资源内联为 base64）
        assetsInlineLimit: 4096,
    }
})