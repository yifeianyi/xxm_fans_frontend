'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { Song } from '@/app/domain/types';
import { songService } from '@/app/infrastructure/api';
import useSWR from 'swr';
import MysteryBoxModal from './MysteryBoxModal';
import VideoModal from './VideoModal';

type TimeRange = 'all' | '3m' | '1y';

const RANKING_KEY = 'top-songs';
const RECOMMENDATION_KEY = 'recommendation';

export default function RankingChart() {
    const [range, setRange] = useState<TimeRange>('all');
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    
    // 获取排行榜数据
    const { data: topSongs = [], isLoading: isLoadingSongs, error: songsError } = useSWR(
        `${RANKING_KEY}-${range}`,
        async () => {
            const result = await songService.getTopSongs({ range, limit: 50 });
            if (result.error) throw result.error;
            return result.data!;
        }
    );

    // 获取推荐语数据
    const { data: recommendation, isLoading: isLoadingRec } = useSWR(
        RECOMMENDATION_KEY,
        async () => {
            const result = await songService.getRecommendation();
            if (result.error) throw result.error;
            return result.data;
        },
        {
            shouldRetryOnError: false,
        }
    );

    const maxCount = useMemo(() => 
        topSongs.length > 0 
            ? Math.max(...topSongs.map((s: Song) => s.performanceCount), 1) 
            : 1,
        [topSongs]
    );

    const getRankStyle = (index: number) => {
        if (index === 0) return 'from-yellow-400 via-orange-400 to-red-400';
        if (index === 1) return 'from-gray-300 via-gray-400 to-gray-500';
        if (index === 2) return 'from-orange-400 via-orange-500 to-orange-600';
        return 'from-[#8eb69b] to-[#f8b195]';
    };

    // 错误提示
    if (songsError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 font-bold mb-2">排行榜加载失败</p>
                <p className="text-red-500 text-sm">{songsError instanceof Error ? songsError.message : '加载失败'}</p>
            </div>
        );
    }

    // 推荐语内容 - 优先使用后端数据，否则使用默认值
    const recommendationContent = recommendation?.content || '每一首歌都是满满的用心演绎，快来发现热门作品吧！';
    const recommendedSongs = recommendation?.recommendedSongsDetails || [];

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
                            onClick={() => setRange(key as TimeRange)}
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

            {/* 推荐语 - 从后端获取 */}
            <div className="px-8 py-6 bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-3xl text-white shadow-xl flex flex-col items-center justify-center gap-4 border-2 border-white/50">
                <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-yellow-200 fill-yellow-200" />
                    <span className="text-base font-black tracking-wider text-center">
                        {recommendationContent}
                    </span>
                </div>
                {/* 推荐歌曲标签 */}
                {recommendedSongs.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {recommendedSongs.map((song: any) => (
                            <button
                                key={song.id}
                                onClick={() => setSelectedSong({
                                    id: song.id,
                                    name: song.name,
                                    originalArtist: song.singer,
                                    genres: [],
                                    languages: song.language ? [song.language] : [],
                                    firstPerformance: '',
                                    lastPerformance: '',
                                    performanceCount: 0,
                                    tags: []
                                })}
                                className="px-3 py-1 bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 rounded-full text-xs font-bold transition-all"
                                title={`${song.name} - ${song.singer}`}
                            >
                                {song.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 排行榜列表 */}
            {isLoadingSongs ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            ) : topSongs.length === 0 ? (
                <div className="text-center py-12 text-[#8eb69b]">
                    <p>暂无排行榜数据</p>
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
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedSong(song)}>
                                    <h3 className="font-black text-[#5d4037] text-lg truncate group-hover:text-[#f8b195] transition-colors">
                                        {song.name}
                                    </h3>
                                    <p className="text-[#8eb69b] text-sm">{song.originalArtist}</p>
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

            {/* 歌曲详情弹窗 */}
            <MysteryBoxModal
                isOpen={!!selectedSong}
                onClose={() => setSelectedSong(null)}
                song={selectedSong}
                onPlay={setVideoUrl}
                title="歌曲详情"
            />

            {/* 视频播放弹窗 */}
            <VideoModal
                isOpen={!!videoUrl}
                onClose={() => setVideoUrl(null)}
                videoUrl={videoUrl || ''}
            />
        </div>
    );
}
