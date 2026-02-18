'use client';

import React, { useState } from 'react';
import { Song } from '@/app/domain/types';
import { useSongTable } from '@/app/presentation/hooks/useSongTable';
import { songService } from '@/app/infrastructure/api';
import { SongFilters } from '@/app/presentation/components/songs/SongFilters';
import { SongPagination } from '@/app/presentation/components/songs/SongPagination';
import { SongTableHeader } from './SongTableHeader';
import { SongTableRow } from './SongTableRow';
import VideoModal from '@/app/songs/components/VideoModal';
import MysteryBoxModal from '@/app/songs/components/MysteryBoxModal';

// ============ Loading Component ============

function LoadingRow() {
    return (
        <tr>
            <td colSpan={9} className="py-24">
                <div className="flex items-center justify-center gap-2">
                    <div
                        className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                    />
                    <div
                        className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                    />
                    <div
                        className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                    />
                </div>
            </td>
        </tr>
    );
}

// ============ Error Component ============

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-bold mb-2">数据加载失败</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors"
            >
                重试
            </button>
        </div>
    );
}

// ============ Main Component ============

export function SongTable() {
    // 使用自定义 Hook 管理状态
    const {
        songs,
        total,
        isLoading,
        error,
        state,
        setShowFilters,
        actions,
    } = useSongTable();

    // 本地 UI 状态
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isRandomLoading, setIsRandomLoading] = useState(false);
    const [mysterySong, setMysterySong] = useState<Song | null>(null);

    // 处理复制
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(text);
            setTimeout(() => setCopyStatus(null), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    // 处理展开/收起
    const handleToggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // 处理播放
    const handlePlay = (url: string) => {
        setVideoUrl(url);
    };

    // 处理盲盒点击 - 随机抽取一首歌曲并弹窗
    const handleMysteryBoxClick = async () => {
        if (isRandomLoading) return;
        setIsRandomLoading(true);
        try {
            const result = await songService.getRandomSong();
            if (result.data) {
                // 弹出盲盒弹窗
                setMysterySong(result.data);
            } else if (songs.length > 0) {
                // API 不可用，从当前列表随机选择一首
                const randomIndex = Math.floor(Math.random() * songs.length);
                setMysterySong(songs[randomIndex]);
            }
        } catch (err) {
            console.error('Failed to get random song:', err);
        } finally {
            setIsRandomLoading(false);
        }
    };

    // 错误处理
    if (error) {
        return (
            <ErrorDisplay
                error={error instanceof Error ? error.message : '加载失败'}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* 筛选栏 */}
            <SongFilters
                search={state.search}
                filters={state.filters}
                showFilters={state.showFilters}
                onSearchChange={actions.setSearch}
                onSearchSubmit={actions.submitSearch}
                onToggleFilterPanel={() => setShowFilters(!state.showFilters)}
                onToggleFilter={actions.toggleFilter}
                onMysteryBoxClick={handleMysteryBoxClick}
            />

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
                    <SongTableHeader
                        sortBy={state.sortBy}
                        sortDir={state.sortDir}
                        onSort={actions.handleSort}
                    />
                    <tbody className="text-[#4a3728] text-[11px] lg:text-base font-bold">
                        {isLoading ? (
                            <LoadingRow />
                        ) : (
                            songs.map((song: Song) => (
                                <SongTableRow
                                    key={song.id}
                                    song={song}
                                    isExpanded={expandedId === song.id}
                                    onToggleExpand={() => handleToggleExpand(song.id)}
                                    onQuickFilter={actions.handleQuickFilter}
                                    onCopy={handleCopy}
                                    copyStatus={copyStatus}
                                    onPlay={handlePlay}
                                />
                            ))
                        )}
                    </tbody>
                </table>

                {/* 分页器 */}
                <SongPagination
                    page={state.page}
                    totalPages={state.totalPages}
                    total={total}
                    onPageChange={actions.setPage}
                />
            </div>

            {/* 视频弹框 */}
            <VideoModal
                isOpen={!!videoUrl}
                onClose={() => setVideoUrl(null)}
                videoUrl={videoUrl || ''}
            />

            {/* 盲盒弹框 */}
            <MysteryBoxModal
                isOpen={!!mysterySong}
                onClose={() => setMysterySong(null)}
                song={mysterySong}
                onPlay={handlePlay}
                title="盲盒时间"
            />
        </div>
    );
}

export default SongTable;
