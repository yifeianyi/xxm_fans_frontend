import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
    title: '联系我们 - 小满虫之家 | 咻咻满粉丝站',
    description: '联系小满虫之家，提供反馈建议、合作洽谈或投稿分享。我们欢迎小满虫们与我们联系交流！',
    keywords: ['咻咻满', '联系我们', '粉丝站', '投稿', '合作'],
};

// 主页面组件（Server Component）
export default function ContactPage() {
    return (
        <>
            {/* 页面装饰 - 默认主题 */}
            <PageDecorations 
                theme="default" 
                glowColors={['#f8b195', '#8eb69b']}
            />
            
            <ContactPageClient />
        </>
    );
}
