import React from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Star, Heart, Music, Crown, Flame } from 'lucide-react';
import OriginalsList from '../components/features/OriginalsList';
import { PageDecorations, TitleDecoration } from '../components/common/PageDecorations';

const OriginalsPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>咻咻满原唱作品 - 个人原创单曲 | 小满虫之家</title>
                <meta name="description" content="浏览咻咻满的原创音乐作品，感受独特的音乐风格和创作理念。每首原创作品都记录着满老师的音乐心路历程。" />
            </Helmet>
            
            {/* 页面装饰 */}
            <PageDecorations theme="music" glowColors={['#f8b195', '#f67280']} />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 页面标题区域 */}
                <div className="relative mb-8">
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-[#f8b195] to-[#f67280] opacity-10 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 opacity-10 blur-3xl rounded-full" />
                    </div>
                    
                    <div className="text-center space-y-4 py-6">
                        {/* 装饰图标行 */}
                        <div className="flex items-center justify-center gap-3">
                            <Star className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                            <Crown className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <Sparkles className="w-6 h-6 text-[#f8b195] animate-pulse" />
                        </div>
                        
                        {/* 主标题 */}
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                            原唱作品
                        </h1>
                        
                        {/* 副标题带装饰 */}
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f8b195]" />
                            <Music className="w-4 h-4 text-[#f8b195]" />
                            <p className="text-[#8eb69b] font-bold">
                                每一首原创作品，都是满老师的音乐心路
                            </p>
                            <Heart className="w-4 h-4 text-[#f67280] fill-[#f67280]" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f8b195]" />
                        </div>
                    </div>
                </div>
                
                <OriginalsList />
            </div>
        </>
    );
};

export default OriginalsPage;