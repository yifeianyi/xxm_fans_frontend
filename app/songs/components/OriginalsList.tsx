'use client';

import React, { useState, useMemo } from 'react';
import { PlayCircle, Shuffle, ListMusic, Disc, ChevronRight, Music2 } from 'lucide-react';
import { OriginalWork } from '@/app/domain/types';
import { songService } from '@/app/infrastructure/api';
import useSWR from 'swr';
import SmartPlayController from './SmartPlayController';

const ORIGINALS_KEY = 'original-works';

export default function OriginalsList() {
    const [currentWork, setCurrentWork] = useState<OriginalWork | null>(null);
    const [showAllOriginals, setShowAllOriginals] = useState(false);

    const { data: works = [], error, isLoading } = useSWR(
        ORIGINALS_KEY,
        async () => {
            const result = await songService.getOriginalWorks();
            if (result.error) throw result.error;
            return result.data!;
        }
    );

    const featuredOriginals = useMemo(() => works.filter(w => w.featured), [works]);
    const archivedOriginals = useMemo(() => works.filter(w => !w.featured), [works]);

    const handleRandomPlay = () => {
        if (works.length === 0) return;

        // 过滤出有播放链接的作品
        const playableWorks = works.filter(w => w.neteaseId || w.songId || w.bilibiliBvid);

        if (playableWorks.length === 0) {
            alert('暂无可播放的歌曲');
            return;
        }

        const randomIdx = Math.floor(Math.random() * playableWorks.length);
        setCurrentWork(playableWorks[randomIdx]);
    };

    const handleWorkClick = (work: OriginalWork) => {
        // 检查是否有播放链接
        const hasNetease = work.neteaseId || work.songId;
        const hasBilibili = work.bilibiliBvid;

        if (!hasNetease && !hasBilibili) {
            alert('该歌曲暂无播放链接，敬请期待！');
            return;
        }

        // 如果点击的是当前正在播放的歌曲，则停止播放
        if (currentWork && currentWork.title === work.title) {
            setCurrentWork(null);
            return;
        }

        setCurrentWork(work);
    };

    const isWorkPlaying = (work: OriginalWork) => {
        if (!currentWork) return false;
        return currentWork.title === work.title;
    };

    // 错误提示
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 font-bold mb-2">原唱作品加载失败</p>
                <p className="text-red-500 text-sm">{error instanceof Error ? error.message : '加载失败'}</p>
            </div>
        );
    }

    if (isLoading) {
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
            {/* Background Decoration */}
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

            {/* Featured Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
                {featuredOriginals.map((work, idx) => (
                    <div key={idx} className="group flex flex-col items-center gap-6">
                        <div 
                            className="relative w-full aspect-square cursor-pointer" 
                            onClick={() => handleWorkClick(work)}
                        >
                            {/* 唱片机外壳 */}
                            <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]">
                                {/* 唱片纹理背景 */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.3)_100%)]"></div>
                                <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"></div>

                                {/* 圆形封面 */}
                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                    <div className={`relative w-full h-full rounded-full overflow-hidden border-4 border-[#4a4a4a] shadow-2xl transition-transform duration-500 ${isWorkPlaying(work) ? 'animate-spin-slow' : ''}`}>
                                        {work.cover ? (
                                            <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#f8b195] to-[#f67280] flex items-center justify-center">
                                                <Disc className="w-16 h-16 text-white/50" />
                                            </div>
                                        )}
                                        {/* 唱片中心孔效果 */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-[#4a4a4a]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 播放覆盖层 */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2.5rem]">
                                    <div className="w-24 h-24 rounded-full bg-[#f8b195]/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                        <PlayCircle size={48} className="text-white fill-white/30" />
                                    </div>
                                </div>

                                {/* 唱片机装饰线条 */}
                                <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#8eb69b]/30 to-transparent"></div>
                            </div>
                        </div>
                        <div className="text-center space-y-1">
                            <span className="text-[10px] font-black text-[#f8b195] uppercase tracking-widest">{work.date} Release</span>
                            <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">{work.title}</h3>
                            <p className="text-xs text-[#8eb69b] font-medium opacity-80 px-4">{work.desc}</p>
                            <div className="flex items-center justify-center gap-2 text-[#8eb69b] font-bold text-[11px] opacity-70">
                                {work.neteaseId || work.songId ? (
                                    <><Music2 size={12} /> 网易云音乐</>
                                ) : work.bilibiliBvid ? (
                                    <><PlayCircle size={12} /> B站视频</>
                                ) : (
                                    <><PlayCircle size={12} /> 暂无链接</>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Archive Library - High Density List */}
            {archivedOriginals.length > 0 && (
                <div className="px-8 pb-12">
                    <div className="glass-card rounded-[3rem] border-2 border-white overflow-hidden shadow-xl">
                        <div className="p-6 md:p-10 bg-[#f2f9f1]/50 border-b border-white flex items-center justify-between">
                            <h4 className="flex items-center gap-3 text-[#4a3728] font-black">
                                <ListMusic size={20} className="text-[#8eb69b]" />
                                作品档案库
                            </h4>
                            <span className="text-[10px] text-[#8eb69b] font-black uppercase tracking-widest">Sorting by Date Desc</span>
                        </div>

                        <div className={`divide-y divide-white/50 ${!showAllOriginals ? 'max-h-[500px]' : 'max-h-[1000px]'} overflow-y-auto custom-scrollbar transition-all duration-700`}>
                            {archivedOriginals.map((work, i) => (
                                <div
                                    key={i}
                                    className={`group flex items-center gap-6 p-6 hover:bg-white/40 transition-all cursor-pointer ${isWorkPlaying(work) ? 'bg-white/60' : ''}`}
                                    onClick={() => handleWorkClick(work)}
                                >
                                    <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-transform ${isWorkPlaying(work) ? 'border-[#f8b195] rotate-6' : 'border-white group-hover:rotate-6'}`}>
                                        {work.cover ? (
                                            <img src={work.cover} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/20 flex items-center justify-center">
                                                <Disc className="w-6 h-6 text-[#f8b195]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between mb-0.5">
                                            <h5 className={`text-lg font-black transition-colors truncate ${isWorkPlaying(work) ? 'text-[#f8b195]' : 'text-[#4a3728] group-hover:text-[#f8b195]'}`}>{work.title}</h5>
                                            <span className="text-[10px] font-bold text-[#8eb69b] tabular-nums">{work.date}</span>
                                        </div>
                                        <p className="text-[10px] text-[#8eb69b] font-bold truncate opacity-60 italic">{work.desc}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isWorkPlaying(work) ? 'bg-[#f8b195] text-white opacity-100' : 'bg-white text-[#f8b195] opacity-0 group-hover:opacity-100'}`}>
                                        {isWorkPlaying(work) ? (
                                            <div className="flex gap-0.5 items-end h-3">
                                                <span className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></span>
                                                <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></span>
                                                <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-1.5"></span>
                                            </div>
                                        ) : (
                                            <PlayCircle size={20} fill="currentColor" className="text-white" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!showAllOriginals && archivedOriginals.length > 5 && (
                            <button
                                onClick={() => setShowAllOriginals(true)}
                                className="w-full p-6 bg-white/40 text-[#8eb69b] font-black text-sm hover:text-[#f8b195] transition-colors flex items-center justify-center gap-2"
                            >
                                展开全部 {archivedOriginals.length} 首存档作品 <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Smart Play Controller */}
            <SmartPlayController work={currentWork} onClose={() => setCurrentWork(null)} />

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
            `}</style>
        </div>
    );
}
