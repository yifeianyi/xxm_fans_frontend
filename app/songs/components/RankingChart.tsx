'use client';

import React, { useState } from 'react';
import { Sparkles, Trophy, Flame, Music } from 'lucide-react';
import { useTopSongs } from '@/app/infrastructure/hooks/useSongs';
import { Song } from '@/app/domain/types';

export default function RankingChart() {
    const [range, setRange] = useState<'all' | '3m' | '1y'>('all');
    const { topSongs, isLoading } = useTopSongs(range);

    const maxCount = topSongs.length > 0 
        ? Math.max(...topSongs.map((s: Song) => s.performanceCount), 1) 
        : 1;

    const getRankStyle = (index: number) => {
        if (index === 0) return 'from-yellow-400 via-orange-400 to-red-400';
        if (index === 1) return 'from-gray-300 via-gray-400 to-gray-500';
        if (index === 2) return 'from-orange-400 via-orange-500 to-orange-600';
        return 'from-[#8eb69b] to-[#f8b195]';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 时间范围切换 */}
            <div className="flex justify-center">
                <div className="inline-flex p-1 bg-white/40 rounded-full shadow-inner border-2 border-white">
                    {[
                        { key: 'all', label: '全部' },
                        { key: '3m', label: '近3月' },
                        { key: '1y', label: '年榜' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setRange(key as any)}
                            className={`px-6 py-2 rounded-full text-sm font-black transition-all ${
                                range === key
                                    ? 'bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white shadow-md'
                                    : 'text-[#8eb69b] hover:bg-white/40'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 推荐语 */}
            <div className="px-8 py-6 bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-3xl text-white shadow-xl flex flex-col items-center justify-center gap-4 border-2 border-white/50">
                <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-yellow-200 fill-yellow-200" />
                    <span className="text-base font-black tracking-wider text-center">
                        每一首歌都是满满的用心演绎，快来发现热门作品吧！
                    </span>
                </div>
            </div>

            {/* 排行榜列表 */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {topSongs.map((song: Song, index: number) => (
                        <div
                            key={song.id}
                            className="group relative bg-white/60 rounded-2xl p-4 border-2 border-white hover:border-[#f8b195]/50 transition-all hover:shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                {/* 排名 */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${getRankStyle(index)} flex items-center justify-center shadow-lg`}>
                                    {index < 3 ? (
                                        <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-100' : index === 1 ? 'text-gray-100' : 'text-orange-100'}`} />
                                    ) : (
                                        <span className="text-white font-black text-lg">{index + 1}</span>
                                    )}
                                </div>

                                {/* 歌曲信息 */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-[#5d4037] text-lg truncate group-hover:text-[#f8b195] transition-colors">
                                        {song.name}
                                    </h3>
                                    <p className="text-[#8eb69b] text-sm">{song.originalArtist}</p>
                                    <div className="flex gap-2 mt-1">
                                        {song.genres.slice(0, 2).map((genre: string) => (
                                            <span key={genre} className="px-2 py-0.5 bg-[#8eb69b]/20 text-[#8eb69b] text-xs rounded-full">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 演唱次数 */}
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-[#f67280] font-black text-2xl">
                                        <Flame className="w-5 h-5" />
                                        {song.performanceCount}
                                    </div>
                                    <p className="text-xs text-[#8eb69b]">次演唱</p>
                                </div>

                                {/* 热度条 */}
                                <div className="hidden md:block w-24">
                                    <div className="h-2 bg-[#8eb69b]/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full transition-all duration-1000"
                                            style={{ width: `${(song.performanceCount / maxCount) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
