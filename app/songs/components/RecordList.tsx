'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play } from 'lucide-react';
import { getSongRecords } from '@/app/infrastructure/api/clientApi';
import { SongRecord } from '@/app/domain/types';

interface RecordListProps {
    songId: string;
}

export default function RecordList({ songId }: RecordListProps) {
    const [records, setRecords] = useState<SongRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 修正封面路径
    const normalizeCoverPath = (coverPath: string): string => {
        if (!coverPath) return '';
        return coverPath.startsWith('/') ? coverPath : `/${coverPath}`;
    };

    useEffect(() => {
        let cancelled = false;
        
        async function loadRecords() {
            setLoading(true);
            setError(null);
            
            try {
                const data = await getSongRecords(songId, { page: 1, page_size: 20 });
                
                if (!cancelled) {
                    // 转换数据格式
                    const transformedRecords: SongRecord[] = data.results.map((item: any) => ({
                        id: item.id?.toString() || '',
                        songId: item.song?.toString() || '',
                        songName: item.song_name || '',
                        date: item.performed_at || '',
                        cover: item.cover || '',
                        coverThumbnailUrl: item.cover_thumbnail_url,
                        note: item.note || '',
                        videoUrl: item.video_url || '',
                    }));
                    
                    setRecords(transformedRecords);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('[RecordList] Error:', err);
                    setError(err instanceof Error ? err.message : '加载失败');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        loadRecords();
        
        return () => {
            cancelled = true;
        };
    }, [songId]);

    if (loading) {
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
                <div className="text-red-500 mb-2 text-xs font-bold">{error}</div>
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
        <div ref={containerRef} className="max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                {records.map((rec: SongRecord) => (
                    <div 
                        key={rec.id} 
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                        onClick={() => {
                            if (rec.videoUrl) {
                                window.open(rec.videoUrl, '_blank');
                            }
                        }}
                    >
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <img 
                                src={rec.coverThumbnailUrl || normalizeCoverPath(rec.cover)} 
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
