'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Music, Image as ImageIcon } from 'lucide-react';
import { livestreamRepository } from '@/app/infrastructure/repositories';
import { Livestream } from '@/app/domain/types';
import { ErrorBoundary } from '@/app/shared/components';

// 日历组件
function LivestreamCalendar({ 
    currentDate, 
    onDateChange, 
    livestreams 
}: { 
    currentDate: Date;
    onDateChange: (date: Date) => void;
    livestreams: Livestream[];
}) {
    const [calendarDays, setCalendarDays] = useState<Array<{ date: number; hasLive: boolean; livestream?: Livestream; isToday: boolean }>>([]);
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 生成日历数据
    useEffect(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const days: Array<{ date: number; hasLive: boolean; livestream?: Livestream; isToday: boolean }> = [];
        
        // 填充月初空白
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ date: 0, hasLive: false, isToday: false });
        }
        
        // 填充日期
        const today = new Date();
        for (let date = 1; date <= daysInMonth; date++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            const live = livestreams.find(l => l.date === dateStr);
            days.push({
                date,
                hasLive: !!live,
                livestream: live,
                isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === date
            });
        }
        
        setCalendarDays(days);
    }, [year, month, livestreams]);
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    const handlePrevMonth = () => {
        onDateChange(new Date(year, month - 1, 1));
    };
    
    const handleNextMonth = () => {
        onDateChange(new Date(year, month + 1, 1));
    };
    
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-xl p-6">
            {/* 日历头部 */}
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors text-[#8eb69b]"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-black text-[#5d4037]">
                    {year}年{month + 1}月
                </h2>
                <button 
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors text-[#8eb69b]"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
            
            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-bold text-[#8eb69b] py-2">
                        {day}
                    </div>
                ))}
            </div>
            
            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`
                            aspect-square rounded-xl flex flex-col items-center justify-center relative
                            ${day.date === 0 ? 'invisible' : ''}
                            ${day.isToday ? 'bg-[#f8b195]/20 border-2 border-[#f8b195]' : 'hover:bg-white/40'}
                            ${day.hasLive ? 'cursor-pointer' : ''}
                            transition-all
                        `}
                    >
                        <span className={`text-sm font-bold ${day.isToday ? 'text-[#f8b195]' : 'text-[#5d4037]'}`}>
                            {day.date || ''}
                        </span>
                        {day.hasLive && (
                            <div className="absolute bottom-1 flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#f67280]" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// 直播列表组件
function LivestreamList({ livestreams, onSelect }: { livestreams: Livestream[]; onSelect: (live: Livestream) => void }) {
    if (livestreams.length === 0) {
        return (
            <div className="text-center py-12 text-[#8eb69b]">
                <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-bold">本月暂无直播记录</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {livestreams.map(live => (
                <div
                    key={live.id}
                    onClick={() => onSelect(live)}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-white shadow-lg p-4 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        {live.coverUrl && (
                            <img 
                                src={live.coverUrl} 
                                alt={live.title || '直播封面'}
                                className="w-24 h-16 object-cover rounded-xl"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#5d4037] truncate">
                                {live.title || `${live.date} 直播`}
                            </h3>
                            <p className="text-sm text-[#8eb69b]">{live.date}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-[#8eb69b]/70">
                                {live.viewCount && (
                                    <span className="flex items-center gap-1">
                                        <Video size={12} />
                                        {live.viewCount} 观看
                                    </span>
                                )}
                                {live.songCuts && live.songCuts.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Music size={12} />
                                        {live.songCuts.length} 首歌
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// 直播详情弹窗
function LivestreamDetailModal({ live, onClose }: { live: Livestream | null; onClose: () => void }) {
    if (!live) return null;
    
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* 头部 */}
                <div className="relative">
                    {live.coverUrl ? (
                        <img 
                            src={live.coverUrl} 
                            alt={live.title || '直播封面'}
                            className="w-full h-48 object-cover rounded-t-[2rem]"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[#f8b195] to-[#f67280] rounded-t-[2rem]" />
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
                    >
                        <CalendarIcon size={20} />
                    </button>
                </div>
                
                {/* 内容 */}
                <div className="p-6 space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-[#5d4037] mb-2">
                            {live.title || `${live.date} 直播`}
                        </h2>
                        <p className="text-[#8eb69b]">{live.date}</p>
                    </div>
                    
                    {live.summary && (
                        <p className="text-[#5d4037]/80 leading-relaxed">{live.summary}</p>
                    )}
                    
                    {/* 统计信息 */}
                    <div className="flex flex-wrap gap-4">
                        {live.viewCount && (
                            <div className="flex items-center gap-2 text-[#8eb69b]">
                                <Video size={18} />
                                <span className="font-bold">{live.viewCount} 观看</span>
                            </div>
                        )}
                        {live.danmakuCount && (
                            <div className="flex items-center gap-2 text-[#8eb69b]">
                                <ImageIcon size={18} />
                                <span className="font-bold">{live.danmakuCount} 弹幕</span>
                            </div>
                        )}
                        {live.duration && (
                            <div className="flex items-center gap-2 text-[#8eb69b]">
                                <CalendarIcon size={18} />
                                <span className="font-bold">{live.duration}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* 操作按钮 */}
                    {live.bvid && (
                        <a
                            href={`https://www.bilibili.com/video/${live.bvid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white text-center font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            在 B 站观看回放
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// 主页面
export default function LivestreamPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [livestreams, setLivestreams] = useState<Livestream[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLive, setSelectedLive] = useState<Livestream | null>(null);
    
    // 获取直播数据
    useEffect(() => {
        const fetchLivestreams = async () => {
            setLoading(true);
            try {
                const result = await livestreamRepository.getLivestreams({
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                    limit: 100
                });
                setLivestreams(result.livestreams);
            } catch (error) {
                console.error('Failed to fetch livestreams:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLivestreams();
    }, [currentDate.getFullYear(), currentDate.getMonth()]);
    
    return (
        <ErrorBoundary>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 页面标题 */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#f8b195] to-[#f67280] bg-clip-text text-transparent mb-4">
                        直播日历
                    </h1>
                    <p className="text-[#8eb69b] font-bold">
                        查看咻咻满的历史直播记录和精彩回放
                    </p>
                </div>
                
                {/* 内容区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 日历 */}
                    <div>
                        <h2 className="text-xl font-black text-[#5d4037] mb-4 flex items-center gap-2">
                            <CalendarIcon className="text-[#f8b195]" />
                            日历
                        </h2>
                        <LivestreamCalendar 
                            currentDate={currentDate}
                            onDateChange={setCurrentDate}
                            livestreams={livestreams}
                        />
                    </div>
                    
                    {/* 直播列表 */}
                    <div>
                        <h2 className="text-xl font-black text-[#5d4037] mb-4 flex items-center gap-2">
                            <Video className="text-[#f8b195]" />
                            {currentDate.getMonth() + 1}月直播
                        </h2>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" />
                                    <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        ) : (
                            <LivestreamList 
                                livestreams={livestreams}
                                onSelect={setSelectedLive}
                            />
                        )}
                    </div>
                </div>
                
                {/* 详情弹窗 */}
                <LivestreamDetailModal 
                    live={selectedLive}
                    onClose={() => setSelectedLive(null)}
                />
            </div>
        </ErrorBoundary>
    );
}
