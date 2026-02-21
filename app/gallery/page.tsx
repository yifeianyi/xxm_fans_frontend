/**
 * GalleryPage - 图集页面
 * 
 * @module app/gallery
 * @description 图集浏览页面，支持树形导航、图片查看、搜索等功能
 * 
 * 使用 Next.js App Router 模式
 * - Metadata API 替代 react-helmet
 * - Server Component 导出动态元数据
 * - Client Component 处理交互逻辑
 */

import { Metadata } from 'next';
import GalleryPageClient from './components/GalleryPageClient';
import { galleryRepository } from '@/app/infrastructure/repositories';

// 生成页面元数据
export async function generateMetadata(): Promise<Metadata> {
    // 获取基础图集数据用于 SEO
    let galleryTree: { id: string; title: string; description: string; imageCount: number; tags?: string[] }[] = [];
    
    try {
        const galleries = await galleryRepository.getGalleries();
        galleryTree = galleries.map(g => ({
            id: g.id,
            title: g.title,
            description: g.description,
            imageCount: g.imageCount,
            tags: g.tags,
        }));
    } catch (error) {
        console.error('Failed to fetch gallery data for metadata:', error);
    }

    const totalImages = galleryTree.reduce((sum, g) => sum + g.imageCount, 0);
    const title = '咻咻满图集 - 粉丝二创、活动照片、生活瞬间 | 小满虫之家';
    const description = `欢迎来到咻咻满的图集，这里汇集了粉丝二创作品、活动照片和生活瞬间。共收录${galleryTree.length}个图集，${totalImages}张精彩图片。图集持续整理更新中，欢迎各位小满虫投稿和分享。`;
    const keywords = '咻咻满, XXM, 图集, 粉丝二创, 活动照片, 生活瞬间, 小满虫之家';
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.xxm8777.cn';
    const ogImage = `${baseUrl}/og-image-gallery.jpg`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            type: 'website',
            url: `${baseUrl}/gallery`,
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: '咻咻满图集',
                },
            ],
            siteName: '小满虫之家',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: `${baseUrl}/gallery`,
        },
    };
}

// 页面组件 - Server Component
export default function GalleryPage() {
    return <GalleryPageClient />;
}
