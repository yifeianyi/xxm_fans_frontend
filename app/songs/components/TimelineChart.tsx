'use client';

import React, { useState } from 'react';
import { Clock, Calendar, Video, Heart, BarChart3 } from 'lucide-react';

// 模拟数据，实际应从 API 获取
const MOCK_DATA = [
    { month: '2024-01', count: 12, valid: 10, highlight: '《新歌首发》' },
    { month: '2024-02', count: 8, valid: 8, highlight: '春节特别节目' },
    { month: '2024-03', count: 15, valid: 14, highlight: '' },
    { month: '2024-04', count: 10, valid: 9, highlight: '生日会直播' },
    { month: '2024-05', count: 18, valid: 16, highlight: '' },
    { month: '2024-06', count: 14, valid: 13, highlight: '端午特辑' },
];

export default function TimelineChart() {
    const [selectedYear, setSelectedYear] = useState(2024);
    const [viewMode, setViewMode] = useState<'timeline' | 'stats'>('timeline');

    const maxCount = Math.max(...MOCK_DATA.map(d => d.count), 1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 控制栏 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8">
                <div className="flex items-center gap-2">
                    {[2022, 2023, 2024].map(year => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${
                                selectedYear === year
                                    ? 'bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white shadow-md'
                                    : 'bg-white/60 text-[#8eb69b] hover:bg-[#f8b195]/20'
                            }`}
                        >
                            {year}年
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 p-1 bg-white/40 rounded-full">
                    <button
                        onClick={() => setViewMode('timeline')}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                            viewMode === 'timeline'
                                ? 'bg-[#f8b195] text-white'
                                : 'text-[#8eb69b] hover:bg-white/40'
                        }`}
                    >
                        <Clock className="w-4 h-4 inline mr-1" />
                        时间线
                    </button>
                    <button
                        onClick={() => setViewMode('stats')}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                            viewMode === 'stats'
                                ? 'bg-[#f8b195] text-white'
                                : 'text-[#8eb69b] hover:bg-white/40'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4 inline mr-1" />
                        统计
                    </button>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
                {[
                    { label: '总投稿数', value: '156', icon: Video, color: 'from-blue-400 to-blue-500' },
                    { label: '有效投稿', value: '142', icon: Heart, color: 'from-pink-400 to-pink-500' },
                    { label: '活跃月份', value: '11', icon: Calendar, color: 'from-[#f8b195] to-[#f67280]' },
                    { label: '月均投稿', value: '13', icon: BarChart3, color: 'from-[#8eb69b] to-[#6b9b7a]' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/60 rounded-2xl p-6 border-2 border-white hover:border-[#f8b195]/50 transition-all text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-3xl font-black text-[#5d4037]">{stat.value}</div>
                        <div className="text-sm text-[#8eb69b] font-bold">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* 时间线视图 */}
            {viewMode === 'timeline' && (
                <div className="px-8 space-y-4">
                    <h3 className="text-xl font-black text-[#5d4037] mb-6">{selectedYear}年投稿时间线</h3>
                    <div className="relative">
                        {/* 时间线轴线 */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f8b195] via-[#f67280] to-[#8eb69b]"></div>
                        
                        {MOCK_DATA.map((item, index) => (
                            <div key={index} className="relative flex items-start gap-6 mb-8 group">
                                {/* 时间点 */}
                                <div className="relative z-10 w-16 h-16 rounded-full bg-white border-4 border-[#f8b195] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="text-xs font-black text-[#f8b195]">
                                        {item.month.split('-')[1]}月
                                    </span>
                                </div>
                                
                                {/* 内容卡片 */}
                                <div className="flex-1 bg-white/60 rounded-2xl p-5 border-2 border-white group-hover:border-[#f8b195]/50 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-bold text-[#5d4037] text-lg">{item.month}</h4>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-[#8eb69b]">
                                                投稿: <span className="font-black text-[#f8b195]">{item.count}</span>
                                            </span>
                                            <span className="text-[#8eb69b]">
                                                有效: <span className="font-black text-[#8eb69b]">{item.valid}</span>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* 进度条 */}
                                    <div className="h-2 bg-[#8eb69b]/20 rounded-full overflow-hidden mb-3">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full transition-all duration-1000"
                                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                                        />
                                    </div>
                                    
                                    {item.highlight && (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#f8b195]/20 text-[#f8b195] rounded-full text-xs font-bold">
                                            <Heart className="w-3 h-3 fill-current" />
                                            {item.highlight}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 统计视图 */}
            {viewMode === 'stats' && (
                <div className="px-8">
                    <div className="bg-white/60 rounded-3xl p-8 border-2 border-white">
                        <h3 className="text-xl font-black text-[#5d4037] mb-6">投稿趋势分析</h3>
                        <div className="h-64 flex items-end justify-around gap-2">
                            {MOCK_DATA.map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full flex items-end justify-center">
                                        {/* 柱状图 */}
                                        <div 
                                            className="w-full max-w-[60px] bg-gradient-to-t from-[#f8b195] to-[#f67280] rounded-t-xl transition-all duration-500 group-hover:opacity-80"
                                            style={{ height: `${(item.count / maxCount) * 200}px` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-black text-[#f8b195] opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.count}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#8eb69b]">{item.month.split('-')[1]}月</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
