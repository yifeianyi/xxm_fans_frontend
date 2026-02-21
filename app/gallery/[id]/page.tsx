import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GalleryDetailClient from '../components/GalleryDetailClient';
import { galleryRepository } from '@/app/infrastructure/repositories';

interface GalleryDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// 生成动态元数据
export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    
    try {
        const gallery = await galleryRepository.getGalleryById(id);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.xxm8777.cn';
        
        return {
            title: `${gallery.title} - 咻咻满图集 | 小满虫之家`,
            description: `浏览${gallery.title}，收录${gallery.imageCount}张精彩图片。${gallery.description || '咻咻满粉丝图集，包含精彩照片和珍贵瞬间。'}`,
            keywords: `咻咻满, XXM, 图集, ${gallery.title}, 粉丝二创, 活动照片, 小满虫之家`,
            openGraph: {
                type: 'article',
                url: `${baseUrl}/gallery/${id}`,
                title: `${gallery.title} - 咻咻满图集 | 小满虫之家`,
                description: `浏览${gallery.title}，收录${gallery.imageCount}张精彩图片。`,
                images: gallery.coverUrl ? [gallery.coverUrl] : [],
                siteName: '小满虫之家',
            },
        };
    } catch {
        return {
            title: '图集 - 小满虫之家',
            description: '咻咻满粉丝图集',
        };
    }
}

// 页面组件
export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
    const { id } = await params;
    
    // 验证图集是否存在
    try {
        await galleryRepository.getGalleryById(id);
    } catch {
        notFound();
    }
    
    return <GalleryDetailClient galleryId={id} />;
}
