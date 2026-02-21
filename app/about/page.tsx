import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
    title: '关于咻咻满 - 独立音乐人、音乐主播 | 小满虫之家',
    description: '了解咻咻满的音乐故事、声线特色、成长历程。她是独立音乐人、音乐主播、B站up主，用治愈系歌声温暖每一位听众。',
    keywords: ['咻咻满', 'XXM', '独立音乐人', '音乐主播', 'B站up主', '关于'],
};

// 主页面组件（Server Component）
export default function AboutPage() {
    return (
        <>
            {/* 页面装饰 - 默认主题 */}
            <PageDecorations 
                theme="default" 
                glowColors={['#f8b195', '#f6d365']}
            />
            
            <AboutPageClient />
        </>
    );
}
