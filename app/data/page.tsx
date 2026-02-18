'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Video, Heart, MessageSquare, Calendar, ArrowUpRight } from 'lucide-react';
import { analyticsRepository } from '@/app/infrastructure/repositories';
import { AccountData, VideoStats, TimeGranularity } from '@/app/domain/types';
import { ErrorBoundary } from '@/app/shared/components';

// 粉丝数卡片
function FollowerCard({ title, value, change, icon: Icon }: { 
    title: string; 
    value: string; 
    change?: number;
    icon: React.ElementType;
}) {
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#f8b195]/20 rounded-2xl">
                    <Icon size={24} className="text-[#f8b195]" />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <ArrowUpRight size={16} className={change < 0 ? 'rotate-90' : ''} />
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <h3 className="text-[#8eb69b] font-bold text-sm mb-1">{title}</h3>
            <p className="text-3xl font-black text-[#5d4037]">{value}</p>
        </div>
    );
}

// 简单趋势图组件
function SimpleTrendChart({ data, color = '#f8b195' }: { data: number[]; color?: string }) {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // 生成 SVG 路径
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80 - 10;
        return `${x},${y}`;
    }).join(' ');
    
    return (
        <div className="h-32 w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* 填充区域 */}
                <polygon
                    points={`0,100 ${points} 100,100`}
                    fill={`url(#gradient-${color.replace('#', '')})`}
                />
                {/* 线条 */}
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

// 账号数据卡片
function AccountCard({ account }: { account: AccountData }) {
    const [granularity, setGranularity] = useState<TimeGranularity>('DAY');
    
    const data = account.history[granularity] || [];
    const values = data.map(d => d.value);
    
    // 计算变化
    const latestChange = data.length > 1 ? data[data.length - 1].delta : 0;
    
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-black text-[#5d4037]">{account.name}</h3>
                    <p className="text-[#8eb69b] font-bold">{account.totalFollowers.toLocaleString()} 粉丝</p>
                </div>
                <div className="flex items-center gap-2">
                    {(['DAY', 'WEEK', 'MONTH'] as TimeGranularity[]).map(g => (
                        <button
                            key={g}
                            onClick={() => setGranularity(g)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                granularity === g
                                    ? 'bg-[#f8b195] text-white'
                                    : 'bg-white/40 text-[#8eb69b] hover:bg-white/60'
                            }`}
                        >
                            {g === 'DAY' ? '日' : g === 'WEEK' ? '周' : '月'}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* 趋势图 */}
            <SimpleTrendChart data={values} />
            
            {/* 最新变化 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/50">
                <span className="text-sm text-[#8eb69b]">最新变化</span>
                <span className={`font-bold ${latestChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {latestChange >= 0 ? '+' : ''}{latestChange.toLocaleString()}
                </span>
            </div>
        </div>
    );
}

// 视频数据卡片
function VideoCard({ video }: { video: VideoStats }) {
    return (
        <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-white shadow-lg p-4 hover:shadow-xl transition-all">
            {video.cover && (
                <img
                    src={video.cover}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded-xl flex-shrink-0"
                />
            )}
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#5d4037] truncate mb-1">{video.title}</h4>
                <p className="text-xs text-[#8eb69b] mb-2">{video.publishTime}</p>
                <div className="flex items-center gap-4 text-xs text-[#8eb69b]/70">
                    <span className="flex items-center gap-1">
                        <Video size={12} />
                        {(video.views / 10000).toFixed(1)}万
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart size={12} />
                        {video.likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {video.comments}
                    </span>
                </div>
            </div>
        </div>
    );
}

// 主页面
export default function DataPage() {
    const [accounts, setAccounts] = useState<AccountData[]>([]);
    const [videos, setVideos] = useState<VideoStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [followerOverview, setFollowerOverview] = useState({
        totalFollowers: 0,
        todayGrowth: 0,
        weekGrowth: 0,
        monthGrowth: 0
    });
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 获取粉丝概览
                const overview = await analyticsRepository.getFollowerOverview();
                setFollowerOverview(overview);
                
                // 获取账号列表
                const accountList = await analyticsRepository.getAccounts();
                
                // 获取每个账号的详细数据
                const accountData = await Promise.all(
                    accountList.slice(0, 2).map(async acc => {
                        try {
                            return await analyticsRepository.getAccountData({
                                accountId: acc.id,
                                granularity: 'DAY'
                            });
                        } catch {
                            return null;
                        }
                    })
                );
                setAccounts(accountData.filter(Boolean) as AccountData[]);
                
                // 获取视频列表
                const videoList = await analyticsRepository.getVideos({ limit: 5 });
                setVideos(videoList.videos);
            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    // 格式化数字
    const formatNumber = (num: number) => {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toLocaleString();
    };
    
    return (
        <ErrorBoundary>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 页面标题 */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#f8b195] to-[#f67280] bg-clip-text text-transparent mb-4">
                        满の数据
                    </h1>
                    <p className="text-[#8eb69b] font-bold">
                        咻咻满的粉丝数据和作品表现分析
                    </p>
                </div>
                
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" />
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* 核心数据卡片 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FollowerCard
                                title="总粉丝数"
                                value={formatNumber(followerOverview.totalFollowers)}
                                change={followerOverview.monthGrowth}
                                icon={Users}
                            />
                            <FollowerCard
                                title="今日增长"
                                value={(followerOverview.todayGrowth > 0 ? '+' : '') + followerOverview.todayGrowth}
                                icon={TrendingUp}
                            />
                            <FollowerCard
                                title="本周增长"
                                value={(followerOverview.weekGrowth > 0 ? '+' : '') + formatNumber(followerOverview.weekGrowth)}
                                icon={Calendar}
                            />
                            <FollowerCard
                                title="本月增长"
                                value={(followerOverview.monthGrowth > 0 ? '+' : '') + formatNumber(followerOverview.monthGrowth)}
                                icon={BarChart3}
                            />
                        </div>
                        
                        {/* 账号趋势 */}
                        {accounts.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-black text-[#5d4037] mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-[#f8b195]" />
                                    粉丝趋势
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {accounts.map(account => (
                                        <AccountCard key={account.id} account={account} />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* 热门视频 */}
                        {videos.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-black text-[#5d4037] mb-6 flex items-center gap-2">
                                    <Video className="text-[#f8b195]" />
                                    热门视频
                                </h2>
                                <div className="space-y-4">
                                    {videos.map(video => (
                                        <VideoCard key={video.id} video={video} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
