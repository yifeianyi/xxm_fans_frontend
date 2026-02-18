import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            { protocol: 'https', hostname: '**.bilibili.com' },
            { protocol: 'https', hostname: '**.hdslb.com' },
        ],
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    // typedRoutes: true,
};

export default nextConfig;
