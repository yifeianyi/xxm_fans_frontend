'use client';

import React, { useState, useEffect } from 'react';
import { PlayCircle, Shuffle, Disc, ExternalLink } from 'lucide-react';
import { getOriginals } from '@/app/infrastructure/api/songService';
import { OriginalWork } from '@/app/domain/types';

export default function OriginalsList() {
    const [works, setWorks] = useState<OriginalWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWork, setCurrentWork] = useState<OriginalWork | null>(null);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const result = await getOriginals();
                setWorks(result);
            } catch (err) {
                console.error('Failed to load originals:', err);
            } finally {
                setLoading(false);
            }
        };
        loadWorks();
    }, []);

    const featuredOriginals = works.filter(w => w.featured);
    const archivedOriginals = works.filter(w => !w.featured);

    const handleRandomPlay = () => {
        if (works.length === 0) return;
        const playableWorks = works.filter(w => w.neteaseId || w.songId || w.bilibiliBvid);
        if (playableWorks.length === 0) {
            alert('暂无可播放的歌曲');
            return;
        }
        const randomIdx = Math.floor(Math.random() * playableWorks.length);
        setCurrentWork(playableWorks[randomIdx]);
    };

    const handleWorkClick = (work: OriginalWork) => {
        const hasNetease = work.neteaseId || work.songId;
        const hasBilibili = work.bilibiliBvid;
        if (!hasNetease && !hasBilibili) {
            alert('该歌曲暂无播放链接，敬请期待！');
            return;
        }
        if (currentWork && currentWork.title === work.title) {
            setCurrentWork(null);
            return;
        }
        setCurrentWork(work);
    };

    const getPlayUrl = (work: OriginalWork) => {
        if (work.neteaseId || work.songId) {
            return `https://music.163.com/#/song?id=${work.neteaseId || work.songId}`;
        }
        if (work.bilibiliBvid) {
            return `https://www.bilibili.com/video/${work.bilibiliBvid}`;
        }
        return null;
    };

    if (loading) {
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

    return (
        <div className="space-y-16 relative py-8">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-[#8eb69b]/5 rounded-[3rem] -z-10 mx-4 md:mx-0"></div>

            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-end justify-between px-8 gap-6">
                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 text-[#f8b195] font-black text-xs uppercase tracking-[0.5em]">
                        <Disc size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
                        Original Archive
                    </div>
                    <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">咻咻满原唱作品集 ({works.length})</h2>
                    <p className="text-[#8eb69b] font-bold text-sm">记录在满满的每一个音符</p>
                </div>
                <button
                    onClick={handleRandomPlay}
                    className="flex items-center gap-3 px-8 py-4 bg-[#f8b195] text-white rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Shuffle size={18} />
                    随机听一首原唱
                </button>
            </div>

            {/* 精选展示 */}
            {featuredOriginals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
                    {featuredOriginals.map((work, idx) => (
                        <div key={idx} className="group flex flex-col items-center gap-6">
                            <div 
                                className="relative w-full aspect-square cursor-pointer" 
                                onClick={() => handleWorkClick(work)}
                            >
                                {/* 唱片机外壳 */}
                                <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]">
                                    {/* 唱片纹理 */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.3)_100%)]"></div>
                                    <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"></div>

                                    {/* 圆形封面 */}
                                    <div className="relative w-full h-full flex items-center justify-center p-8">
                                        <div className={`relative w-[70%] aspect-square rounded-full overflow-hidden border-4 border-[#1a1a1a] shadow-2xl transition-transform duration-700 ${currentWork?.title === work.title ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                                            {work.cover ? (
                                                <img 
                                                    src={work.cover} 
                                                    alt={work.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#f8b195] to-[#f67280] flex items-center justify-center">
                                                    <Disc className="w-16 h-16 text-white/50" />
                                                </div>
                                            )}
                                            {/* 中心孔 */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a1a] rounded-full border-2 border-[#333]"></div>
                                        </div>
                                    </div>

                                    {/* 播放按钮 */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                            <PlayCircle className="w-8 h-8 text-[#f8b195]" />
                                        </div>
                                    </div>
                                </div>

                                {/* 装饰光晕 */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#f8b195]/20 to-[#f67280]/20 rounded-[3rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* 歌曲信息 */}
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors">
                                    {work.title}
                                </h3>
                                <p className="text-[#8eb69b] text-sm font-bold">{work.date}</p>
                                {work.desc && (
                                    <p className="text-[#8eb69b]/70 text-xs max-w-[250px]">{work.desc}</p>
                                )}
                                {/* 播放链接 */}
                                {getPlayUrl(work) && (
                                    <a
                                        href={getPlayUrl(work)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-4 py-2 mt-2 bg-[#f8b195]/10 text-[#f8b195] rounded-full text-xs font-bold hover:bg-[#f8b195]/20 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        去播放
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 归档列表 */}
            {archivedOriginals.length > 0 && (
                <div className="px-8">
                    <h3 className="text-2xl font-black text-[#4a3728] mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#8eb69b]/20 flex items-center justify-center">
                            <Disc className="w-4 h-4 text-[#8eb69b]" />
                        </span>
                        更多原唱 ({archivedOriginals.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {archivedOriginals.map((work, idx) => (
                            <div 
                                key={idx}
                                className="group flex items-center gap-4 p-4 bg-white/40 rounded-2xl border-2 border-white hover:border-[#f8b195]/50 transition-all cursor-pointer"
                                onClick={() => handleWorkClick(work)}
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/20 flex items-center justify-center flex-shrink-0">
                                    {work.cover ? (
                                        <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Disc className="w-8 h-8 text-[#f8b195]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#4a3728] truncate group-hover:text-[#f8b195] transition-colors">
                                        {work.title}
                                    </h4>
                                    <p className="text-[#8eb69b] text-xs">{work.date}</p>
                                </div>
                                {getPlayUrl(work) && (
                                    <a
                                        href={getPlayUrl(work)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-[#f8b195]/20 rounded-full transition-colors text-[#f8b195]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
