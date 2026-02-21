import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import GalleryPageClient from './components/GalleryPageClient';

export const metadata: Metadata = {
    title: '咻咻满图集 - 精彩瞬间 | 小满虫之家',
    description: '浏览咻咻满的精彩图片和动图，记录每一个美好瞬间。',
    keywords: ['咻咻满', '图集', '照片', '动图', '精彩瞬间'],
};

// 主页面组件（Server Component）
export default function AlbumsPage() {
    return (
        <>
            {/* 页面装饰 - 图集主题 */}
            <PageDecorations theme="gallery" />
            
            <GalleryPageClient />
        </>
    );
}
