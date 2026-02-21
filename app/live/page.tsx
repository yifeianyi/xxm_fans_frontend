import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import LivestreamPageClient from './LivestreamPageClient';

export const metadata: Metadata = {
    title: '咻咻满直播日历 - 直播回放、录播补档 | 小满虫之家',
    description: '查看咻咻满的直播历史记录，包含直播回放录像、歌切列表和直播截图。支持按日期浏览，不错过任何一场精彩直播。',
    keywords: ['咻咻满', '直播', '直播回放', '录播', '歌切', '直播日历'],
};

// 主页面组件（Server Component）
export default function LivestreamPage() {
    return (
        <>
            {/* 页面装饰 - 直播主题 */}
            <PageDecorations 
                theme="live" 
                glowColors={['#f67280', '#f8b195']}
            />
            
            <LivestreamPageClient />
        </>
    );
}
