'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { SongRecord } from '@/app/domain/types';
import { useSongRecords } from '@/app/infrastructure/hooks/useSongs';

// API 基础 URL - 用于拼接图片路径
const API_BASE_URL = 'http://localhost:8000';

interface RecordListProps {
    songId: string;
    onPlay: (videoUrl: string) => void;
}

export default function RecordList({ songId, onPlay }: RecordListProps) {
    const { records, isLoading, error } = useSongRecords(songId, { page: 1, page_size: 20 });

    // 构建完整图片 URL
    const getFullImageUrl = (path: string | null | undefined): string => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    };

    if (isLoading) {
        return (
            <div className="p-10 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <div className="text-red-500 mb-2 text-xs font-bold">{error instanceof Error ? error.message : '加载失败'}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#8eb69b] text-white rounded-lg hover:bg-[#7da58a] transition-colors text-xs font-bold"
                >
                    重试
                </button>
            </div>
        );
    }

    if (records.length === 0) {
        return <div className="p-10 text-center text-[#8eb69b]/40 font-black">暂无记录</div>;
    }

    return (
        <div className="max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                {records.map((rec: SongRecord) => (
                    <div 
                        key={rec.id} 
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                        onClick={() => {
                            if (rec.videoUrl) {
                                onPlay(rec.videoUrl);
                            }
                        }}
                    >
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <img 
                                src={getFullImageUrl(rec.coverThumbnailUrl || rec.cover)} 
                                alt={rec.date}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }} 
                            />
                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-2.5 bg-white/95 rounded-full text-[#f8b195] shadow-lg transform group-hover:scale-110 transition-all">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 text-center">
                            <div className="text-[#f8b195] font-black text-[10px] tracking-wider mb-1">{rec.date}</div>
                            <p className="text-[10px] font-bold text-[#8eb69b] line-clamp-2 leading-tight">{rec.note || '无备注'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
