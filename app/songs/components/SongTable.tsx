'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Gift, SlidersHorizontal, ChevronDown, ChevronRight, Copy, Check, ChevronLeft, ChevronRight as ChevronRightIcon, MoreHorizontal } from 'lucide-react';
import { getSongsClient } from '@/app/infrastructure/api/clientApi';
import { Song, FilterState } from '@/app/domain/types';
import RecordList from './RecordList';
import VideoModal from './VideoModal';

// 常量和类型
const GENRES = ['流行', '古风', '摇滚', '民谣', '电子', '爵士', 'R&B', '说唱', '戏腔'];
const TAGS = ['小甜歌', '高难度', '经典', '新歌', '合唱', '现场'];
const LANGUAGES = ['国语', '粤语', '英语', '日语', '韩语'];

export default function SongTable() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<FilterState>({ genres: [], tags: [], languages: [] });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('last_performed');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // 加载数据
    useEffect(() => {
        let cancelled = false;
        
        async function loadSongs() {
            setLoading(true);
            setError(null);
            
            try {
                const data = await getSongsClient({
                    q: search,
                    page,
                    limit: 50,
                    ordering: sortDir === 'asc' ? sortBy : `-${sortBy}`,
                    styles: filters.genres.join(','),
                    tags: filters.tags.join(','),
                    language: filters.languages.join(','),
                });
                
                if (!cancelled) {
                    // 转换数据格式
                    const transformedSongs: Song[] = data.results.map((item: any) => ({
                        id: item.id?.toString() || '',
                        name: item.song_name || '未知歌曲',
                        originalArtist: item.singer || '未知歌手',
                        genres: Array.isArray(item.styles) ? item.styles : [],
                        languages: item.language ? [item.language] : [],
                        firstPerformance: item.first_perform || '',
                        lastPerformance: item.last_performed || '',
                        performanceCount: item.perform_count || 0,
                        tags: Array.isArray(item.tags) ? item.tags : [],
                    }));
                    
                    setSongs(transformedSongs);
                    setTotal(data.total);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('[SongTable] Error:', err);
                    setError(err instanceof Error ? err.message : '加载失败');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        loadSongs();
    }, [search, page, sortBy, sortDir, filters]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(text);
            setTimeout(() => setCopyStatus(null), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleQuickFilter = (type: keyof FilterState | 'artist', value: string) => {
        if (type === 'artist') {
            setSearch(value);
            setFilters({ genres: [], tags: [], languages: [] });
        } else {
            setSearch('');
            setFilters({ genres: [], tags: [], languages: [], [type]: [value] });
        }
        setPage(1);
    };

    const toggleFilter = (type: keyof FilterState, value: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value) 
                ? prev[type].filter(v => v !== value) 
                : [...prev[type], value]
        }));
        setPage(1);
    };

    const handleSort = (field: string) => {
        const mapField: Record<string, string> = {
            'originalArtist': 'singer',
            'lastPerformance': 'last_performed',
            'firstPerformance': 'first_perform',
            'performanceCount': 'perform_count',
        };
        const mappedField = mapField[field] || field;
        if (sortBy === mappedField) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(mappedField);
            setSortDir('desc');
        }
        setPage(1);
    };

    const totalPages = useMemo(() => Math.ceil(total / 50), [total]);

    const getPageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    }, [page, totalPages]);

    // 错误提示
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 font-bold mb-2">数据加载失败</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* 搜索栏 */}
            <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 relative flex items-center group">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="搜一搜信件..."
                        className="w-full pl-12 pr-4 h-11 rounded-full bg-white border-2 border-[#8eb69b]/20 focus:border-[#f8b195] transition-all outline-none text-[#4a3728] placeholder:text-[#8eb69b]/40 font-bold text-sm"
                    />
                    <button type="submit" className="absolute left-4 text-[#f8b195] hover:scale-110 transition-all">
                        <Search size={18} strokeWidth={3} />
                    </button>
                </form>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none h-11 flex items-center justify-center gap-2 px-5 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full hover:brightness-105 transition-all font-bold shadow-md shadow-[#f8b195]/10 text-xs">
                        <Gift size={16} /> <span>盲盒</span>
                    </button>
                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className={`flex-1 md:flex-none h-11 flex items-center justify-center gap-2 px-5 rounded-full transition-all font-bold border-2 text-xs ${showFilters ? 'bg-[#4a3728] text-white border-[#4a3728]' : 'bg-white text-[#f8b195] border-[#f8b195]/20'}`}
                    >
                        <SlidersHorizontal size={16} /> <span>筛选</span>
                    </button>
                </div>
            </div>

            {/* 筛选面板 */}
            {showFilters && (
                <div className="p-6 glass-card rounded-[2rem] border-2 border-white shadow-xl animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: '曲风', type: 'genres' as const, data: GENRES },
                            { title: '标签', type: 'tags' as const, data: TAGS },
                            { title: '语种', type: 'languages' as const, data: LANGUAGES }
                        ].map(group => (
                            <div key={group.type}>
                                <h4 className="font-bold text-[#4a3728] mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider">
                                    <div className="w-1 h-3 bg-[#f8b195] rounded-full"></div>
                                    {group.title}
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {group.data.map(item => (
                                        <button 
                                            key={item} 
                                            onClick={() => toggleFilter(group.type, item)} 
                                            className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-all ${filters[group.type].includes(item) ? 'bg-[#f8b195] text-white border-[#f8b195]' : 'bg-white/50 text-[#8eb69b] border-[#8eb69b]/20 hover:border-[#f8b195]'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 表格主体 */}
            <div className="glass-card rounded-[2.5rem] border-2 border-white/50 shadow-2xl overflow-hidden">
                <table className="w-full text-center border-collapse table-fixed">
                    <colgroup>
                        <col className="w-[14%]" />
                        <col className="w-[12%]" />
                        <col className="w-[14%]" />
                        <col className="w-[10%]" />
                        <col className="w-[11%]" />
                        <col className="w-[11%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[8%]" />
                    </colgroup>
                    <thead>
                        <tr className="bg-[#f2f9f1]/90 text-[#8eb69b] text-[11px] lg:text-base font-black border-b border-white/40 uppercase tracking-tighter">
                            <th className="px-1 py-4">歌名</th>
                            <th className="px-1 py-4 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('originalArtist')}>
                                原唱 {sortBy === 'singer' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-1 py-4">风格</th>
                            <th className="px-1 py-4">语种</th>
                            <th className="px-1 py-4 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('firstPerformance')}>
                                首次 {sortBy === 'first_perform' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-1 py-4 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('lastPerformance')}>
                                最近 {sortBy === 'last_performed' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-1 py-4 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('performanceCount')}>
                                演唱次数 {sortBy === 'perform_count' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-1 py-4">标签</th>
                            <th className="px-1 py-4">记录</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#4a3728] text-[11px] lg:text-base font-bold">
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="py-24">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </td>
                            </tr>
                        ) : songs.map((song: Song) => (
                            <React.Fragment key={song.id}>
                                <tr className={`border-b border-white/10 hover:bg-white/40 transition-all ${expandedId === song.id ? 'bg-white/50' : ''}`}>
                                    <td className="px-1 py-4">
                                        <button 
                                            onClick={() => handleCopy(song.name)} 
                                            className="group flex flex-col items-center hover:text-[#f8b195] font-black transition-all mx-auto max-w-full leading-tight"
                                        >
                                            <span className="text-[12px] lg:text-base break-words px-1">{song.name}</span>
                                            {copyStatus === song.name && <span className="text-[8px] text-green-500 font-normal">已复制</span>}
                                        </button>
                                    </td>
                                    <td className="px-1 py-4">
                                        <button 
                                            onClick={() => handleQuickFilter('artist', song.originalArtist)} 
                                            className="text-[#f8b195] hover:text-[#f67280] font-black truncate w-full px-1"
                                        >
                                            {song.originalArtist}
                                        </button>
                                    </td>
                                    <td className="px-1 py-4">
                                        <div className="grid grid-cols-2 gap-1 w-fit mx-auto">
                                            {song.genres.map((g: string) => (
                                                <button 
                                                    key={g} 
                                                    onClick={() => handleQuickFilter('genres', g)} 
                                                    className="text-[8px] lg:text-xs px-1.5 py-0.5 bg-[#f1f8f1] text-[#8eb69b] rounded-md font-bold border border-[#8eb69b]/10 whitespace-nowrap"
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-1 py-4">
                                        <div className="flex flex-wrap gap-0.5 justify-center font-black">
                                            {song.languages.map((l: string) => (
                                                <button 
                                                    key={l} 
                                                    onClick={() => handleQuickFilter('languages', l)} 
                                                    className="hover:text-[#f8b195]"
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-1 py-4 text-[10px] lg:text-sm text-[#8eb69b] font-black whitespace-nowrap">
                                        {song.firstPerformance ? song.firstPerformance.slice(2) : '-'}
                                    </td>
                                    <td className="px-1 py-4 text-[10px] lg:text-sm text-[#8eb69b] font-black whitespace-nowrap">
                                        {song.lastPerformance ? song.lastPerformance.slice(2) : '-'}
                                    </td>
                                    <td className="px-1 py-4">
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-[#fef5f0] text-[#f8b195] rounded-full text-[13px] lg:text-base font-black">
                                                {song.performanceCount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-1 py-4">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {song.tags.map((t: string) => (
                                                <button 
                                                    key={t} 
                                                    onClick={() => handleQuickFilter('tags', t)} 
                                                    className="text-[8px] lg:text-xs px-2 py-0.5 bg-[#fffceb] text-[#d4af37] border border-[#d4af37]/20 rounded-md font-black whitespace-nowrap"
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-1 py-4">
                                        <button 
                                            onClick={() => setExpandedId(expandedId === song.id ? null : song.id)} 
                                            className={`p-1 rounded-lg transition-all mx-auto block ${expandedId === song.id ? 'bg-[#f8b195] text-white shadow-sm' : 'text-[#f8b195] hover:bg-[#fef5f0]'}`}
                                        >
                                            {expandedId === song.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === song.id && (
                                    <tr className="bg-white/30">
                                        <td colSpan={9} className="p-2">
                                            <RecordList songId={song.id} onPlay={setVideoUrl} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {/* 紧凑型分页器 */}
                {totalPages > 1 && (
                    <div className="px-4 py-4 flex items-center justify-between bg-white/10 border-t border-white/20">
                        <span className="text-[10px] lg:text-xs text-[#8eb69b] font-black tracking-widest hidden sm:inline">
                            {total} SONGS • PAGE {page}/{totalPages}
                        </span>
                        <div className="flex items-center gap-1 mx-auto sm:mx-0">
                            <button 
                                disabled={page === 1} 
                                onClick={() => setPage(p => p - 1)} 
                                className="p-1.5 rounded-lg bg-white/60 text-[#f8b195] disabled:opacity-20 hover:bg-white transition-all border border-white/40"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <div className="flex items-center gap-1">
                                {getPageNumbers.map((p, i) => (
                                    p === '...' ? (
                                        <span key={`ellipsis-${i}`} className="min-w-[28px] h-7 flex items-center justify-center text-[#8eb69b] text-xs">
                                            <MoreHorizontal size={14} />
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p as number)}
                                            className={`min-w-[28px] h-7 rounded-lg text-[10px] lg:text-xs font-black transition-all border ${page === p ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-sm' : 'bg-white/40 text-[#8eb69b] border-white/60 hover:border-[#f8b195]/40'}`}
                                        >
                                            {p}
                                        </button>
                                    )
                                ))}
                            </div>
                            <button 
                                disabled={page === totalPages} 
                                onClick={() => setPage(p => p + 1)} 
                                className="p-1.5 rounded-lg bg-white/60 text-[#f8b195] disabled:opacity-20 hover:bg-white transition-all border border-white/40"
                            >
                                <ChevronRightIcon size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* 视频弹框 - 放在最外层确保全局显示 */}
            <VideoModal 
                isOpen={!!videoUrl} 
                onClose={() => setVideoUrl(null)} 
                videoUrl={videoUrl || ''} 
            />
        </div>
    );
}
