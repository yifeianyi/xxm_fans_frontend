import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import GalleryDetailClient from '../../gallery/components/GalleryDetailClient';
import { galleryRepository } from '@/app/infrastructure/repositories';

interface AlbumDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// 生成动态元数据
export async function generateMetadata({ params }: AlbumDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    
    try {
        const gallery = await galleryRepository.getGalleryById(id);
        return {
            title: `${gallery.title} - 咻咻满图集 | 小满虫之家`,
            description: gallery.description || `浏览 ${gallery.title} 的精彩图片`,
        };
    } catch {
        return {
            title: '图集详情 - 小满虫之家',
            description: '浏览精彩图片',
        };
    }
}

// 服务端数据获取
async function getGalleryDetail(id: string) {
    try {
        const gallery = await galleryRepository.getGalleryById(id);
        return gallery;
    } catch (error) {
        console.error('Failed to fetch gallery detail:', error);
        return null;
    }
}

// 主页面组件（Server Component）
export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
    const { id } = await params;
    const gallery = await getGalleryDetail(id);
    
    if (!gallery) {
        redirect('/albums');
    }
    
    return (
        <>
            {/* 页面装饰 - 图集主题 */}
            <PageDecorations theme="gallery" />
            
            <GalleryDetailClient galleryId={id} />
        </>
    );
}
