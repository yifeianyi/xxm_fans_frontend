import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, MessageCircle, Search, TrendingUp, ExternalLink } from 'lucide-react';
import { fansService } from '../../infrastructure/api';
import { FanRankingItem, DanmakuRankingItem, FansSearchResult, FansStats } from '../../domain/types';
import { Loading } from '../components/common/Loading';
import { PageDecorations } from '../components/common/PageDecorations';

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
    const [selectedYear, setSelectedYear] = useState<number | undefined>(2026);

    const [danmakuData, setDanmakuData] = useState<DanmakuRankingItem[]>([]);
    const [danmakuTotal, setDanmakuTotal] = useState(0);
    const [danmakuPage, setDanmakuPage] = useState(1);
    const [danmakuLoading, setDanmakuLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchData, setSearchData] = useState<FansSearchResult[]>([]);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchPage, setSearchPage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);

    const [stats, setStats] = useState<FansStats | null>(null);

    const pageSize = 20;

    useEffect(() => {
        fansService.getStats().then((r) => {
            if (r.data) setStats(r.data);
        });
    }, []);

    useEffect(() => {
        const fetchAttendance = async () => {
            setAttendanceLoading(true);
            const result = await fansService.getAttendanceRanking({
                year: selectedYear,
                page: attendancePage,
                page_size: pageSize,
            });
            if (result.data) {
                setAttendanceData(result.data.results || []);
                setAttendanceTotal(result.data.total || 0);
            }
            setAttendanceLoading(false);
        };
        if (activeTab === 'attendance') fetchAttendance();
    }, [activeTab, attendancePage, selectedYear]);

    useEffect(() => {
        const fetchDanmaku = async () => {
            setDanmakuLoading(true);
            const result = await fansService.getDanmakuRanking({
                year: selectedYear,
                page: danmakuPage,
                page_size: pageSize,
            });
            if (result.data) {
                setDanmakuData(result.data.results || []);
                setDanmakuTotal(result.data.total || 0);
            }
            setDanmakuLoading(false);
        };
        if (activeTab === 'danmaku') fetchDanmaku();
    }, [activeTab, danmakuPage, selectedYear]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchData([]);
            setSearchTotal(0);
            return;
        }
        const timer = setTimeout(async () => {
            setSearchLoading(true);
            const result = await fansService.searchFans({
                q: searchQuery,
                page: searchPage,
                page_size: pageSize,
            });
            if (result.data) {
                setSearchData(result.data.results || []);
                setSearchTotal(result.data.total || 0);
            }
            setSearchLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, searchPage]);

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
    };

    const handleYearChange = (year: number | undefined) => {
        setSelectedYear(year);
        setAttendancePage(1);
        setDanmakuPage(1);
    };

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
                                    !selectedYear ? 'bg-[#8eb69b] text-white' : 'bg-white/60 text-[#8eb69b]'
                                }`}
                            >
                                全部
                            </button>
                            {yearsList.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => handleYearChange(y)}
                                    className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                                        selectedYear === y ? 'bg-[#8eb69b] text-white' : 'bg-white/60 text-[#8eb69b]'
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
                                    {renderAttendanceRanking(attendanceData)}
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
                                    {renderDanmakuRanking(danmakuData)}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {searchData.map((fan) => (
                                            <a
                                                key={fan.uid}
                                                href={`https://space.bilibili.com/${fan.uid}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 glass-card rounded-2xl hover:shadow-md transition-all group"
                                            >
                                                <img
                                                    src={getAvatarUrl(fan.avatar_url)}
                                                    alt={fan.username}
                                                    className="w-10 h-10 rounded-full border-2 border-white object-cover shrink-0"
                                                    loading="lazy"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-black text-[#8eb69b] truncate flex items-center gap-1">
                                                        {fan.username}
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="text-xs text-[#8eb69b]/60">
                                                        出勤 {fan.attended_count} 次 · 弹幕 {fan.total_danmaku}
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
                                <div className="text-center py-12 text-[#8eb69b]">
                                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-black">搜索小满虫</p>
                                    <p className="text-xs mt-1">输入用户名或 B站 UID 搜索</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* About section */}
                    <div className="mt-12 glass-card rounded-3xl p-6">
                        <h3 className="text-lg font-black text-[#8eb69b] mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#f8b195]" />
                            关于出勤率
                        </h3>
                        <div className="space-y-2 text-sm text-[#8eb69b]">
                            <p>数据来源于B站直播间 <span className="font-black text-[#f8b195]">8777</span>（咻咻满），统计自 2026年5月10日 起的B站直播场次。</p>
                            <p>上舰续舰、SC醒目留言、投喂礼物、发弹幕、观看一定时长，达成任何一项都会视为成功出勤。</p>
                            <p>出勤率会在每场直播结束后结算，短时间的直播中断、重启等会视为同一场直播。</p>
                            <p className="text-xs text-[#8eb69b]/60 mt-3">
                                出勤率排名同一排名可能会有超过一个人。数据每天凌晨更新。数据的准确度会因直播间系统、网络波动及服务器异常等情况而受影响。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const renderAttendanceRanking = (data: FanRankingItem[]) => (
    data.map((item) => (
        <a
            key={`${item.uid}-${item.rank}`}
            href={`https://space.bilibili.com/${item.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 glass-card rounded-2xl hover:shadow-md transition-all group"
        >
            <div className="w-10 md:w-12 text-center shrink-0">
                <span className="text-lg md:text-xl font-black text-[#f8b195]">{item.rank}</span>
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
                    {item.attended_count} / {item.total_livestreams} 场
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="text-lg md:text-xl font-black text-[#f8b195]">
                    {item.attendance_rate.toFixed(2)}%
                </div>
                <div className="text-xs text-[#8eb69b]/60">出勤率</div>
            </div>
        </a>
    ))
);

const renderDanmakuRanking = (data: DanmakuRankingItem[]) => (
    data.map((item) => (
        <a
            key={`${item.uid}-${item.rank}`}
            href={`https://space.bilibili.com/${item.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 glass-card rounded-2xl hover:shadow-md transition-all group"
        >
            <div className="w-10 md:w-12 text-center shrink-0">
                <span className={`text-lg md:text-xl font-black ${item.rank <= 3 ? 'text-[#f8b195]' : 'text-[#8eb69b]'}`}>
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
                    占全年弹幕 {item.percentage.toFixed(2)}%
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="text-lg md:text-xl font-black text-[#f8b195]">
                    {item.danmaku_count.toLocaleString()}
                </div>
                <div className="text-xs text-[#8eb69b]/60">弹幕</div>
            </div>
        </a>
    ))
);

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
