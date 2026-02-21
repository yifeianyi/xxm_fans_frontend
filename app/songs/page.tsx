import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import SongsPageClient from './SongsPageClient';

export const metadata: Metadata = {
    title: '咻咻满歌曲列表 - 翻唱作品、原唱歌曲、演出记录 | 小满虫之家',
    description: '浏览咻咻满的所有歌曲作品，包括热门翻唱、原唱单曲和精彩演出记录。支持按风格、语种筛选，发现更多精彩内容。',
    keywords: ['咻咻满', '歌曲', '翻唱', '原唱', '演出记录', '热歌榜'],
};

// 加载状态
function Loading() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

// 主页面组件（Server Component）
export default function SongsPage() {
    return (
        <>
            {/* 页面装饰 - 音乐主题 */}
            <PageDecorations 
                theme="music" 
                glowColors={['#f8b195', '#f6d365']}
            />
            
            <Suspense fallback={<Loading />}>
                <SongsPageClient />
            </Suspense>
        </>
    );
}
