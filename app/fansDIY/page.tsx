import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import FansDIYContent from './FansDIYContent';

export const metadata: Metadata = {
    title: '咻咻满粉丝二创 - 精选混剪、手书、翻唱作品 | 小满虫之家',
    description: '欣赏小满虫们的精彩二创作品，包括混剪、手书、翻唱等。每一份热爱都在这里闪闪发光，欢迎投稿分享你的创作。',
    keywords: ['咻咻满', '粉丝二创', '混剪', '手书', '翻唱', 'XXM'],
};

// 加载状态
function LoadingFallback() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#f8b195]/20 rounded-full"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-[#8eb69b] font-black tracking-[0.3em] uppercase text-xs animate-pulse">正在布置展厅...</span>
            </div>
        </div>
    );
}

// 主页面组件（Server Component）
export default function FansDIYPage() {
    return (
        <>
            {/* 页面装饰 - 粉丝主题 */}
            <PageDecorations 
                theme="fans" 
                glowColors={['#f67280', '#f8b195']}
            />
            
            <Suspense fallback={<LoadingFallback />}>
                <FansDIYContent />
            </Suspense>
        </>
    );
}
