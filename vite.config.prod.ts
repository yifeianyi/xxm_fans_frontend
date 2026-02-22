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
                // 让 Vite 自动处理代码分割，避免手动配置导致的循环依赖问题
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