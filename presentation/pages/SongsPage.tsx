
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SongTable from '../components/features/SongTable';
import RankingChart from '../components/features/RankingChart';
import OriginalsList from '../components/features/OriginalsList';
import TimelineChart from '../components/features/TimelineChart';

const SongsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'hot' | 'all' | 'originals' | 'submit'>('all');

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

    const getPageTitle = () => {
        switch (activeTab) {
            case 'hot': return '咻咻满热歌榜 - 热门歌曲排行';
            case 'originals': return '咻咻满原唱作品 - 个人原创单曲';
            case 'submit': return '投稿时刻 - 演唱投稿记录';
            default: return '咻咻满歌曲列表 - 翻唱作品、原唱歌曲、演出记录';
        }
    };

    const getPageDescription = () => {
        switch (activeTab) {
            case 'hot': return '浏览咻咻满的热门歌曲排行榜，发现最受欢迎的演唱作品。每首歌都记录着咻咻满的音乐历程和粉丝的喜爱。';
            case 'originals': return '浏览咻咻满的原创音乐作品，感受独特的音乐风格和创作理念。';
            case 'submit': return '记录咻咻满在各个平台的投稿历史和重要时刻。';
            default: return '浏览咻咻满的所有歌曲作品，包括翻唱、原唱和演出记录。每首歌曲都记录着咻咻满的音乐历程和情感表达。支持搜索、筛选和排序功能。';
        }
    };

    return (
        <>
            <Helmet>
                <title>{getPageTitle()} | 小满虫之家</title>
                <meta name="description" content={getPageDescription()} />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">
                        {getTitle()}
                    </h1>
                    <p className="text-[#8eb69b] font-bold">
                        {getDescription()}
                    </p>
                </div>

                <div className="w-full max-w-xl mx-auto">
                    <div className="relative flex p-1.5 bg-white/40 rounded-full shadow-inner border-2 border-white overflow-hidden">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(25%-6px)] bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full transition-all duration-500 ease-out z-0`}
                            style={{
                                left: activeTab === 'hot' ? '6px' : activeTab === 'all' ? 'calc(25% - 2px)' : activeTab === 'originals' ? 'calc(50% - 2px)' : 'calc(75% - 2px)'
                            }}
                        ></div>
                        <button onClick={() => setActiveTab('hot')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'hot' ? 'text-white' : 'text-[#8eb69b]'}`}>热歌榜</button>
                        <button onClick={() => setActiveTab('all')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'all' ? 'text-white' : 'text-[#8eb69b]'}`}>全部歌曲</button>
                        <button onClick={() => setActiveTab('originals')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'originals' ? 'text-white' : 'text-[#8eb69b]'}`}>原创作品</button>
                        <button onClick={() => setActiveTab('submit')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'submit' ? 'text-white' : 'text-[#8eb69b]'}`}>投稿时刻</button>
                    </div>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'hot' && <RankingChart />}
                    {activeTab === 'all' && <SongTable />}
                    {activeTab === 'originals' && <OriginalsList />}
                    {activeTab === 'submit' && <TimelineChart />}
                </div>
            </div>
        </>
    );
};

export default SongsPage;
