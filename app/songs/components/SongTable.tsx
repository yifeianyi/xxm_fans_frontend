'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Gift, SlidersHorizontal, ChevronDown, ChevronRight, Copy, Check, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useSongs } from '@/app/infrastructure/hooks/useSongs';
import { Song, FilterState } from '@/app/domain/types';
import { formatDate } from '@/app/shared/utils';

// 常量和类型
const GENRES = ['流行', '古风', '摇滚', '民谣', '电子', '爵士', 'R&B', '说唱', '戏腔'];
const TAGS = ['小甜歌', '高难度', '经典', '新歌', '合唱', '现场'];
const LANGUAGES = ['国语', '粤语', '英语', '日语', '韩语'];

export default function SongTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<FilterState>({ genres: [], tags: [], languages: [] });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('last_performed');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const { songs, total, isLoading, error } = useSongs({
        q: search,
        page,
        limit: 50,
        ordering: sortDir === 'asc' ? sortBy : `-${sortBy}`,
        styles: filters.genres.join(','),
        tags: filters.tags.join(','),
        language: filters.languages.join(','),
    });

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
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
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
                <p className="text-red-500 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 搜索和筛选 */}
            <div className="bg-white/60 rounded-2xl p-4 shadow-sm border-2 border-white">
                <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8eb69b]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="搜索歌曲名或歌手..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/80 rounded-xl border-2 border-white focus:border-[#f8b195] focus:outline-none text-[#5d4037] placeholder-[#8eb69b]/50"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                            showFilters ? 'bg-[#f8b195] text-white' : 'bg-white/80 text-[#8eb69b] hover:bg-[#f8b195]/20'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        筛选
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2.5 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Gift className="w-4 h-4" />
                        盲盒
                    </button>
                </form>

                {/* 筛选面板 */}
                {showFilters && (
                    <div className="space-y-3 pt-4 border-t border-[#8eb69b]/20">
                        <div>
                            <span className="text-sm font-bold text-[#8eb69b] mb-2 block">曲风</span>
                            <div className="flex flex-wrap gap-2">
                                {GENRES.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => toggleFilter('genres', genre)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                                            filters.genres.includes(genre)
                                                ? 'bg-[#f8b195] text-white'
                                                : 'bg-white/60 text-[#8eb69b] hover:bg-[#f8b195]/20'
                                        }`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-bold text-[#8eb69b] mb-2 block">标签</span>
                            <div className="flex flex-wrap gap-2">
                                {TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleFilter('tags', tag)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                                            filters.tags.includes(tag)
                                                ? 'bg-[#f8b195] text-white'
                                                : 'bg-white/60 text-[#8eb69b] hover:bg-[#f8b195]/20'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-bold text-[#8eb69b] mb-2 block">语言</span>
                            <div className="flex flex-wrap gap-2">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => toggleFilter('languages', lang)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                                            filters.languages.includes(lang)
                                                ? 'bg-[#f8b195] text-white'
                                                : 'bg-white/60 text-[#8eb69b] hover:bg-[#f8b195]/20'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 数据状态显示 */}
            <div className="flex items-center justify-between px-2">
                <p className="text-sm text-[#8eb69b]">
                    {isLoading ? '加载中...' : `共 ${total} 首歌曲`}
                </p>
                <p className="text-sm text-[#8eb69b]">
                    第 {page} / {totalPages} 页
                </p>
            </div>

            {/* 表格 */}
            <div className="bg-white/60 rounded-2xl shadow-sm border-2 border-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#8eb69b]/10">
                                <th className="px-4 py-3 text-left text-sm font-black text-[#5d4037] w-12">#</th>
                                <th className="px-4 py-3 text-left text-sm font-black text-[#5d4037]">歌曲名</th>
                                <th 
                                    className="px-4 py-3 text-left text-sm font-black text-[#5d4037] cursor-pointer hover:text-[#f8b195] transition-colors"
                                    onClick={() => handleSort('originalArtist')}
                                >
                                    原唱 {sortBy === 'singer' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-black text-[#5d4037]">曲风</th>
                                <th 
                                    className="px-4 py-3 text-center text-sm font-black text-[#5d4037] cursor-pointer hover:text-[#f8b195] transition-colors"
                                    onClick={() => handleSort('performanceCount')}
                                >
                                    演唱次数 {sortBy === 'perform_count' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-sm font-black text-[#5d4037] cursor-pointer hover:text-[#f8b195] transition-colors"
                                    onClick={() => handleSort('lastPerformance')}
                                >
                                    最后演唱 {sortBy === 'last_performed' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-black text-[#5d4037]">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-[#8eb69b]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </td>
                                </tr>
                            ) : songs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-[#8eb69b]">
                                        暂无数据
                                    </td>
                                </tr>
                            ) : (
                                songs.map((song: Song, index: number) => (
                                    <React.Fragment key={song.id}>
                                        <tr 
                                            className="border-t border-[#8eb69b]/10 hover:bg-white/40 transition-colors cursor-pointer"
                                            onClick={() => setExpandedId(expandedId === song.id ? null : song.id)}
                                        >
                                            <td className="px-4 py-3 text-sm text-[#8eb69b]">
                                                {(page - 1) * 50 + index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-[#5d4037]">{song.name}</div>
                                                {song.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {song.tags.slice(0, 2).map((tag: string) => (
                                                            <span key={tag} className="px-1.5 py-0.5 bg-[#f8b195]/20 text-[#f8b195] text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[#8eb69b]">{song.originalArtist}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {song.genres.slice(0, 2).map((genre: string) => (
                                                        <span key={genre} className="px-2 py-0.5 bg-[#8eb69b]/20 text-[#8eb69b] text-xs rounded-full">
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f8b195]/20 text-[#f8b195] rounded-full font-bold text-sm">
                                                    {song.performanceCount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[#8eb69b]">
                                                {song.lastPerformance ? formatDate(song.lastPerformance) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopy(song.name);
                                                        }}
                                                        className="p-1.5 hover:bg-white/60 rounded-lg transition-colors text-[#8eb69b]"
                                                        title="复制歌名"
                                                    >
                                                        {copyStatus === song.name ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button className="p-1.5 hover:bg-white/60 rounded-lg transition-colors text-[#8eb69b]">
                                                        {expandedId === song.id ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedId === song.id && (
                                            <tr className="bg-[#8eb69b]/5">
                                                <td colSpan={7} className="px-4 py-4">
                                                    <div className="space-y-2 text-sm">
                                                        <p><span className="text-[#8eb69b]">首次演唱:</span> <span className="text-[#5d4037]">{song.firstPerformance ? formatDate(song.firstPerformance) : '-'}</span></p>
                                                        <p><span className="text-[#8eb69b]">语言:</span> <span className="text-[#5d4037]">{song.languages.join(', ') || '-'}</span></p>
                                                        <p><span className="text-[#8eb69b]">标签:</span> <span className="text-[#5d4037]">{song.tags.join(', ') || '-'}</span></p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#8eb69b]/10">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-[#8eb69b]"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {getPageNumbers.map((p, i) => (
                            <React.Fragment key={i}>
                                {p === '...' ? (
                                    <span className="px-2 text-[#8eb69b]">...</span>
                                ) : (
                                    <button
                                        onClick={() => setPage(p as number)}
                                        className={`min-w-[36px] h-9 px-3 rounded-lg font-bold text-sm transition-colors ${
                                            page === p
                                                ? 'bg-[#f8b195] text-white'
                                                : 'bg-white/60 text-[#8eb69b] hover:bg-[#f8b195]/20'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-[#8eb69b]"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
