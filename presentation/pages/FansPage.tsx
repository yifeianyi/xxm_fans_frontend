import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Users, MessageCircle, Search, TrendingUp, ExternalLink, Star } from 'lucide-react';
import { fansService } from '../../infrastructure/api';
import { FanRankingItem, DanmakuRankingItem, FansSearchResult, FansStats } from '../../domain/types';
import { Loading } from '../components/common/Loading';
import { PageDecorations } from '../components/common/PageDecorations';
import { CircularProgress } from '../components/common/CircularProgress';
import { BarProgress } from '../components/common/BarProgress';

type TabKey = 'attendance' | 'danmaku' | 'search';

const getAvatarUrl = (avatarUrl: string): string => {
    if (!avatarUrl) return '/favicon-32x32.png';
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return avatarUrl;
};

const formatUsername = (name: string): string => {
    if (name.length > 12) return name.substring(0, 10) + '...';
    return name;
};

const FansPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('attendance');

    const [attendanceData, setAttendanceData] = useState<FanRankingItem[]>([]);
    const [attendanceTotal, setAttendanceTotal] = useState(0);
    const [attendancePage, setAttendancePage] = useState(1);
    const [attendanceLoading, setAttendanceLoading] = useState(true);
    const [attendanceYear, setAttendanceYear] = useState<number | undefined>(2026);

    const [danmakuData, setDanmakuData] = useState<DanmakuRankingItem[]>([]);
    const [danmakuTotal, setDanmakuTotal] = useState(0);
    const [danmakuPage, setDanmakuPage] = useState(1);
    const [danmakuLoading, setDanmakuLoading] = useState(false);
    const [danmakuYear, setDanmakuYear] = useState<number | undefined>(2026);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchData, setSearchData] = useState<FansSearchResult[]>([]);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchPage, setSearchPage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);

    const [stats, setStats] = useState<FansStats | null>(null);

    const searchAbortRef = useRef<AbortController | null>(null);

    const pageSize = 20;

    useEffect(() => {
        fansService.getStats().then((r) => {
            if (r.data) setStats(r.data);
        });
    }, []);

    useEffect(() => {
        if (activeTab !== 'attendance') return;
        const fetchAttendance = async () => {
            setAttendanceLoading(true);
            const result = await fansService.getAttendanceRanking({
                year: attendanceYear,
                page: attendancePage,
                page_size: pageSize,
            });
            if (result.data) {
                setAttendanceData(result.data.results || []);
                setAttendanceTotal(result.data.total || 0);
            }
            setAttendanceLoading(false);
        };
        fetchAttendance();
    }, [activeTab, attendancePage, attendanceYear]);

    useEffect(() => {
        if (activeTab !== 'danmaku') return;
        const fetchDanmaku = async () => {
            setDanmakuLoading(true);
            const result = await fansService.getDanmakuRanking({
                year: danmakuYear,
                page: danmakuPage,
                page_size: pageSize,
            });
            if (result.data) {
                setDanmakuData(result.data.results || []);
                setDanmakuTotal(result.data.total || 0);
            }
            setDanmakuLoading(false);
        };
        fetchDanmaku();
    }, [activeTab, danmakuPage, danmakuYear]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchData([]);
            setSearchTotal(0);
            return;
        }

        searchAbortRef.current?.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        const timer = setTimeout(async () => {
            setSearchLoading(true);
            const result = await fansService.searchFans({
                q: searchQuery,
                page: searchPage,
                page_size: pageSize,
            }, controller.signal);
            if (!controller.signal.aborted && result.data) {
                setSearchData(result.data.results || []);
                setSearchTotal(result.data.total || 0);
            }
            if (!controller.signal.aborted) {
                setSearchLoading(false);
            }
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchQuery, searchPage]);

    const handleTabChange = useCallback((tab: TabKey) => {
        setActiveTab(tab);
    }, []);

    const handleYearChange = useCallback((year: number | undefined) => {
        if (activeTab === 'attendance') {
            setAttendanceYear(year);
            setAttendancePage(1);
        } else {
            setDanmakuYear(year);
            setDanmakuPage(1);
        }
    }, [activeTab]);

    const totalPages = (total: number) => Math.max(1, Math.ceil(total / pageSize));

    const yearsList = (() => {
        const startYear = 2026;
        const currentYear = new Date().getFullYear();
        const years: number[] = [];
        for (let y = currentYear; y >= startYear; y--) {
            years.push(y);
        }
        return years;
    })();

    const currentSelectedYear = activeTab === 'attendance' ? attendanceYear : danmakuYear;

    return (
        <>
            <Helmet>
                <title>满の粉丝 - 小满虫之家</title>
                <meta name="description" content="咻咻满直播间粉丝出勤率排名、弹幕排名，搜索你的满虫好友" />
            </Helmet>
            <PageDecorations />

            <div className="min-h-screen py-8 md:py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-3">
                            <Users className="w-7 h-7 md:w-8 md:h-8 text-[#f8b195]" />
                            <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-[#f8b195] to-[#8eb69b] bg-clip-text text-transparent">
                                满の粉丝
                            </h1>
                        </div>
                        <p className="text-sm text-[#8eb69b] max-w-lg mx-auto leading-relaxed">
                            记录每一位小满虫在直播间的陪伴时刻
                        </p>
                    </div>

                    {/* Stats bar */}
                    {stats && (
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8">
                            <div className="glass-card px-4 py-2 rounded-2xl text-center min-w-[80px]">
                                <div className="text-xs text-[#8eb69b] font-medium">{stats.fans_label || '出勤粉丝'}</div>
                                <div className="text-lg font-black text-[#f8b195]">{stats.total_fans}</div>
                            </div>
                            <div className="glass-card px-4 py-2 rounded-2xl text-center min-w-[80px]">
                                <div className="text-xs text-[#8eb69b] font-medium">直播场次</div>
                                <div className="text-lg font-black text-[#f8b195]">{stats.total_livestreams}</div>
                            </div>
                            <div className="glass-card px-4 py-2 rounded-2xl text-center min-w-[80px]">
                                <div className="text-xs text-[#8eb69b] font-medium">总出勤</div>
                                <div className="text-lg font-black text-[#f8b195]">{stats.total_attendances}</div>
                            </div>
                            <div className="glass-card px-4 py-2 rounded-2xl text-center min-w-[80px]">
                                <div className="text-xs text-[#8eb69b] font-medium">总弹幕</div>
                                <div className="text-lg font-black text-[#f8b195]">{stats.total_danmaku}</div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-6">
                        {([
                            { key: 'attendance' as TabKey, label: '出勤率排名', icon: TrendingUp },
                            { key: 'danmaku' as TabKey, label: '弹幕排名', icon: MessageCircle },
                            { key: 'search' as TabKey, label: '搜索小满虫', icon: Search },
                        ]).map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-[#f8b195] text-white shadow-md'
                                        : 'bg-white/60 text-[#8eb69b] hover:bg-white/80'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Year selector (attendance & danmaku) */}
                    {activeTab !== 'search' && (
                        <div className="flex justify-center gap-2 mb-6">
                            <button
                                onClick={() => handleYearChange(undefined)}
                                className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                                    !currentSelectedYear ? 'bg-[#8eb69b] text-white' : 'bg-white/60 text-[#8eb69b]'
                                }`}
                            >
                                全部
                            </button>
                            {yearsList.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => handleYearChange(y)}
                                    className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                                        currentSelectedYear === y ? 'bg-[#8eb69b] text-white' : 'bg-white/60 text-[#8eb69b]'
                                    }`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Attendance ranking */}
                    {activeTab === 'attendance' && (
                        <div className="space-y-1.5">
                            {attendanceLoading ? (
                                <div className="flex justify-center py-12"><Loading size="lg" /></div>
                            ) : attendanceData.length === 0 ? (
                                <div className="text-center py-12 text-[#8eb69b]">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-black">暂无出勤数据</p>
                                    <p className="text-xs mt-1">待数据采集后将自动展示排名</p>
                                </div>
                            ) : (
                                <>
                                    {attendanceData.map((item) => renderRankingItem(item, 'attendance', danmakuData))}
                                    <Pagination
                                        page={attendancePage}
                                        totalPages={totalPages(attendanceTotal)}
                                        onPageChange={setAttendancePage}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {/* Danmaku ranking */}
                    {activeTab === 'danmaku' && (
                        <div className="space-y-1.5">
                            {danmakuLoading ? (
                                <div className="flex justify-center py-12"><Loading size="lg" /></div>
                            ) : danmakuData.length === 0 ? (
                                <div className="text-center py-12 text-[#8eb69b]">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-black">暂无弹幕数据</p>
                                    <p className="text-xs mt-1">待数据采集后将自动展示排名</p>
                                </div>
                            ) : (
                                <>
                                    {danmakuData.map((item) => renderRankingItem(item, 'danmaku', danmakuData))}
                                    <Pagination
                                        page={danmakuPage}
                                        totalPages={totalPages(danmakuTotal)}
                                        onPageChange={setDanmakuPage}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {/* Search */}
                    {activeTab === 'search' && (
                        <div>
                            <div className="relative max-w-md mx-auto mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8eb69b]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setSearchPage(1);
                                    }}
                                    placeholder="搜索用户名或 B站 UID..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/70 border border-white/50 text-sm text-[#8eb69b] placeholder:text-[#8eb69b]/50 focus:outline-none focus:border-[#f8b195] transition-colors"
                                />
                            </div>
                            {searchLoading ? (
                                <div className="flex justify-center py-12"><Loading size="lg" /></div>
                            ) : searchQuery.trim() && searchData.length === 0 ? (
                                <div className="text-center py-12 text-[#8eb69b]">
                                    <p className="font-black">未找到相关粉丝</p>
                                </div>
                            ) : searchData.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {searchData.map((fan) => (
                                            <a
                                                key={fan.uid}
                                                href={`https://space.bilibili.com/${fan.uid}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block glass-card rounded-2xl hover:shadow-md transition-all group p-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={getAvatarUrl(fan.avatar_url)}
                                                        alt={fan.username}
                                                        className="w-12 h-12 rounded-full border-2 border-white object-cover shrink-0 mt-0.5"
                                                        loading="lazy"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-black text-[#8eb69b] truncate">
                                                                {fan.username}
                                                            </span>
                                                            {fan.fan_badge_level > 0 && (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#f8b195]/15 text-[#f8b195] text-[10px] font-black shrink-0">
                                                                    <Star className="w-2.5 h-2.5 fill-[#f8b195]" />
                                                                    Lv.{fan.fan_badge_level}
                                                                </span>
                                                            )}
                                                            <ExternalLink className="w-3 h-3 text-[#8eb69b]/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto" />
                                                        </div>
                                                        <div className="bg-[#8eb69b]/5 rounded-xl p-3">
                                                            <div className="grid grid-cols-3 text-center gap-3">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-[10px] text-[#8eb69b]/50 font-medium">年度出勤率</span>
                                                                    <CircularProgress pct={fan.year_attendance_rate} size={44} strokeWidth={3.5} />
                                                                    <span className="text-[11px] text-[#f8b195] font-black">
                                                                        {fan.year_attendance_rate.toFixed(1)}%
                                                                    </span>
                                                                    {fan.year_attendance_rank != null && (
                                                                        <span className="text-[10px] text-[#8eb69b]/60 font-medium">出勤排名 #{fan.year_attendance_rank}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                                    <span className="text-[10px] text-[#8eb69b]/50 font-medium">年度弹幕</span>
                                                                    <span className="text-lg font-black text-[#f8b195]">{fan.year_danmaku_count}</span>
                                                                    <span className="text-[10px] text-[#8eb69b]/50 -mt-1">条</span>
                                                                    <BarProgress
                                                                        value={fan.year_danmaku_count}
                                                                        max={Math.max(...searchData.map(f => f.year_danmaku_count), 1)}
                                                                    />
                                                                    {fan.year_danmaku_rank != null && (
                                                                        <span className="text-[10px] text-[#8eb69b]/60 font-medium">弹幕排名 #{fan.year_danmaku_rank}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-[10px] text-[#8eb69b]/50 font-medium">综合出勤率</span>
                                                                    <CircularProgress pct={fan.overall_attendance_rate} size={44} strokeWidth={3.5} />
                                                                    <span className="text-[11px] text-[#f8b195] font-black">
                                                                        {fan.overall_attendance_rate.toFixed(1)}%
                                                                    </span>
                                                                    {fan.overall_attendance_rank != null && (
                                                                        <span className="text-[10px] text-[#8eb69b]/60 font-medium">出勤排名 #{fan.overall_attendance_rank}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <Pagination
                                        page={searchPage}
                                        totalPages={totalPages(searchTotal)}
                                        onPageChange={setSearchPage}
                                    />
                                </>
                            ) : (
                                !searchQuery.trim() && (
                                    <div className="text-center py-12 text-[#8eb69b]">
                                        <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="font-black">搜索你的满虫好友</p>
                                        <p className="text-xs mt-1">输入用户名或 B站 UID 搜索</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

type RankingMode = 'attendance' | 'danmaku';

const renderRankingItem = (
    item: FanRankingItem | DanmakuRankingItem,
    mode: RankingMode,
    allDanmakuData?: DanmakuRankingItem[]
) => {
    const isTop3 = item.rank <= 3;
    const rankColor = mode === 'attendance' || isTop3 ? 'text-[#f8b195]' : 'text-[#8eb69b]';

    const infoLine = mode === 'attendance'
        ? `${(item as FanRankingItem).attended_count} / ${(item as FanRankingItem).total_livestreams} 场`
        : `${(item as DanmakuRankingItem).danmaku_count} 条弹幕 · 占比 ${(item as DanmakuRankingItem).percentage.toFixed(1)}%`;

    const metric = mode === 'attendance'
        ? <CircularProgress pct={(item as FanRankingItem).attendance_rate} size={38} strokeWidth={3} />
        : (
            <BarProgress
                value={(item as DanmakuRankingItem).danmaku_count}
                max={Math.max(...(allDanmakuData || []).map(d => d.danmaku_count), 1)}
            />
        );

    return (
        <a
            key={`${item.uid}-${item.rank}`}
            href={`https://space.bilibili.com/${item.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 glass-card rounded-2xl hover:shadow-md transition-all group"
        >
            <div className="w-10 md:w-12 text-center shrink-0">
                <span className={`text-lg md:text-xl font-black ${rankColor}`}>
                    {item.rank}
                </span>
            </div>
            <img
                src={getAvatarUrl(item.avatar_url)}
                alt={item.username}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shrink-0"
                loading="lazy"
            />
            <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-[#8eb69b] truncate flex items-center gap-1">
                    {formatUsername(item.username)}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <div className="text-xs text-[#8eb69b]/60">
                    {infoLine}
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {metric}
            </div>
        </a>
    );
};

const Pagination: React.FC<{
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages: (number | '...')[] = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (right < totalPages) pages.push(totalPages);

    return (
        <div className="flex justify-center items-center gap-1.5 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-full text-xs font-black bg-white/60 text-[#8eb69b] disabled:opacity-30 hover:bg-white/80 transition-colors"
            >
                上一页
            </button>
            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-[#8eb69b]/50 text-xs">...</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className={`w-8 h-8 rounded-full text-xs font-black transition-all ${
                            page === p
                                ? 'bg-[#f8b195] text-white'
                                : 'bg-white/60 text-[#8eb69b] hover:bg-white/80'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-full text-xs font-black bg-white/60 text-[#8eb69b] disabled:opacity-30 hover:bg-white/80 transition-colors"
            >
                下一页
            </button>
        </div>
    );
};

export default FansPage;
