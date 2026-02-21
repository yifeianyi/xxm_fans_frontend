import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import DataAnalysisPageClient from './DataAnalysisPageClient';

export const metadata: Metadata = {
    title: '咻咻满数据分析 - 粉丝趋势、作品数据 | 小满虫之家',
    description: '查看咻咻满的粉丝增长趋势、作品播放量分析等数据。基于B站开放接口，每小时同步更新。',
    keywords: ['咻咻满', '数据分析', '粉丝趋势', '作品数据', 'B站数据'],
};

// 主页面组件（Server Component）
export default function DataAnalysisPage() {
    return (
        <>
            {/* 页面装饰 - 数据主题 */}
            <PageDecorations 
                theme="data" 
                glowColors={['#f8b195', '#8eb69b']}
            />
            
            <DataAnalysisPageClient />
        </>
    );
}
