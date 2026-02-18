'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Sparkles, Flame, Music, Rocket, Crown, Star, Heart } from 'lucide-react';
import SongTable from './components/SongTable';
import RankingChart from './components/RankingChart';
import OriginalsList from './components/OriginalsList';
import TimelineChart from './components/TimelineChart';

type TabType = 'hot' | 'all' | 'originals' | 'submit';

// 标题装饰组件
const TitleDecoration: React.FC<{ type: TabType }> = ({ type }) => {
    const decorations = {
        hot: (
            <>
                <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                <Crown className="w-6 h-6 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </>
        ),
        all: (
            <>
                <Music className="w-8 h-8 text-[#8eb69b] animate-bounce" style={{ animationDelay: '0.1s' }} />
                <Sparkles className="w-6 h-6 text-[#f8b195] animate-pulse" />
            </>
        ),
        originals: (
            <>
                <Star className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
            </>
        ),
        submit: (
            <>
                <Rocket className="w-8 h-8 text-blue-500 animate-bounce" />
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </>
        ),
    };

    return (
        <div className="flex items-center gap-2">
            {decorations[type]}
        </div>
    );
};

// 主要内容组件
function SongsPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // 从URL参数获取当前标签
    const tabFromUrl = searchParams.get('tab') as TabType | null;
    const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl || 'all');

    // 标签切换时更新URL
    const handleTabChange = (newTab: TabType) => {
        setActiveTab(newTab);
        const params = new URLSearchParams(searchParams);
        if (newTab !== 'all') {
            params.set('tab', newTab);
        } else {
            params.delete('tab');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'hot': return '咻咻满热歌榜';
            case 'originals': return '咻咻满原唱作品';
            case 'submit': return '咻咻满投稿时刻';
            default: return '咻咻满歌曲列表';
        }
    };

    const getDescription = () => {
        switch (activeTab) {
            case 'hot': return '发现咻咻满最受欢迎的歌曲作品';
            case 'originals': return '浏览咻咻满的原创音乐作品';
            case 'submit': return '记录每一次重要的投稿时刻';
            default: return '浏览咻咻满的所有歌曲，包括翻唱、原唱和演出记录';
        }
    };

    const getTitleGradient = () => {
        switch (activeTab) {
            case 'hot': return 'from-orange-400 via-red-400 to-pink-400';
            case 'originals': return 'from-yellow-400 via-orange-400 to-pink-400';
            case 'submit': return 'from-blue-400 via-purple-400 to-pink-400';
            default: return 'from-[#8eb69b] via-[#f8b195] to-[#f67280]';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
            {/* 标题区域 */}
            <div className="relative">
                {/* 背景装饰 */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className={`absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br ${getTitleGradient()} opacity-10 blur-3xl rounded-full`} />
                    <div className={`absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br ${getTitleGradient()} opacity-10 blur-3xl rounded-full`} />
                </div>
                
                <div className="text-center space-y-4 py-6">
                    {/* 装饰图标行 */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <TitleDecoration type={activeTab} />
                    </div>
                    
                    {/* 主标题 */}
                    <h1 className={`text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r ${getTitleGradient()} bg-clip-text text-transparent drop-shadow-sm`}>
                        {getTitle()}
                    </h1>
                    
                    {/* 副标题 */}
                    <div className="flex items-center justify-center gap-3">
                        <div className={`h-px w-12 bg-gradient-to-r from-transparent to-[#f8b195]`} />
                        <Sparkles className="w-4 h-4 text-[#f8b195]" />
                        <p className="text-[#8eb69b] font-bold">
                            {getDescription()}
                        </p>
                        <Sparkles className="w-4 h-4 text-[#f8b195]" />
                        <div className={`h-px w-12 bg-gradient-to-l from-transparent to-[#f8b195]`} />
                    </div>
                </div>
            </div>

            {/* 标签切换 */}
            <div className="w-full max-w-xl mx-auto">
                <div className="relative flex p-1.5 bg-white/40 rounded-full shadow-inner border-2 border-white overflow-hidden">
                    <div
                        className={`absolute top-1.5 bottom-1.5 w-[calc(25%-6px)] bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full transition-all duration-500 ease-out z-0`}
                        style={{
                            left: activeTab === 'hot' ? '6px' : activeTab === 'all' ? 'calc(25% - 2px)' : activeTab === 'originals' ? 'calc(50% - 2px)' : 'calc(75% - 2px)'
                        }}
                    ></div>
                    <button onClick={() => handleTabChange('hot')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'hot' ? 'text-white' : 'text-[#8eb69b]'}`}>热歌榜</button>
                    <button onClick={() => handleTabChange('all')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'all' ? 'text-white' : 'text-[#8eb69b]'}`}>全部歌曲</button>
                    <button onClick={() => handleTabChange('originals')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'originals' ? 'text-white' : 'text-[#8eb69b]'}`}>原唱作品</button>
                    <button onClick={() => handleTabChange('submit')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'submit' ? 'text-white' : 'text-[#8eb69b]'}`}>投稿时刻</button>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {activeTab === 'hot' && <RankingChart />}
                {activeTab === 'all' && <SongTable />}
                {activeTab === 'originals' && <OriginalsList />}
                {activeTab === 'submit' && <TimelineChart />}
            </div>
        </div>
    );
}

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

// 主页面组件
export default function SongsPage() {
    return (
        <Suspense fallback={<Loading />}>
            <SongsPageContent />
        </Suspense>
    );
}
