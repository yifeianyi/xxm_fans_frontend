import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            { protocol: 'https', hostname: '**.bilibili.com' },
            { protocol: 'https', hostname: '**.hdslb.com' },
            { protocol: 'http', hostname: 'localhost' },
        ],
        unoptimized: true, // 开发环境禁用图片优化
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    // 开发代理配置
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
};

export default nextConfig;
