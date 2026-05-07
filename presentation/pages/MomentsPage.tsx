import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Newspaper, ExternalLink, Heart, MessageCircle, Share2, Rss, Play } from 'lucide-react';
import { momentsService } from '../../infrastructure/api';
import { Moment } from '../../domain/types';
import { Loading } from '../components/common/Loading';
import VideoModal from '../components/common/VideoModal';
import { PageDecorations } from '../components/common/PageDecorations';

const SourceLabel: React.FC<{ source: 'weibo' | 'bilibili' }> = ({ source }) => {
    if (source === 'weibo') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-400 border border-red-200">
                <Rss className="w-3 h-3" />微博
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-400 border border-blue-200">
            <Rss className="w-3 h-3" />B站
        </span>
    );
};

const formatTime = (timeStr: string): string => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const formatCount = (num: number): string => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
};

const MomentsPage: React.FC = () => {
    const [moments, setMoments] = useState<Moment[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filter, setFilter] = useState<'all' | 'weibo' | 'bilibili'>('all');
    const [hasMore, setHasMore] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const pageRef = useRef(1);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef(filter);

    const pageSize = 20;

    const fetchMoments = useCallback(async (pageNum: number, append: boolean) => {
        const params: { page: number; limit: number; source?: 'weibo' | 'bilibili' } = { page: pageNum, limit: pageSize };
        if (filterRef.current !== 'all') params.source = filterRef.current as 'weibo' | 'bilibili';

        const result = await momentsService.getMoments(params);
        if (result.data) {
            const newItems = result.data.results || [];
            if (append) {
                setMoments(prev => [...prev, ...newItems]);
            } else {
                setMoments(newItems);
            }
            setHasMore(newItems.length >= pageSize);
        } else {
            setHasMore(false);
        }
    }, []);

    useEffect(() => {
        filterRef.current = filter;
        pageRef.current = 1;
        setHasMore(true);
        setInitialLoading(true);
        fetchMoments(1, false).then(() => setInitialLoading(false));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filter, fetchMoments]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !initialLoading && !loadingMore) {
                    setLoadingMore(true);
                    const nextPage = pageRef.current + 1;
                    pageRef.current = nextPage;
                    fetchMoments(nextPage, true).then(() => setLoadingMore(false));
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, initialLoading, loadingMore, fetchMoments]);

    const handleFilterChange = (newFilter: 'all' | 'weibo' | 'bilibili') => {
        setFilter(newFilter);
    };

    return (
        <>
            <Helmet>
                <title>满の动态 - 咻咻满微博&B站动态 | 小满虫之家</title>
                <meta name="description" content="查看咻咻满的最新微博和B站动态，第一时间获取满满的精彩内容。" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        'name': '满の动态 - 咻咻满微博&B站动态',
                        'description': '查看咻咻满的最新微博和B站动态',
                        'url': 'https://www.xxm8777.cn/moments',
                        'isPartOf': { '@type': 'WebSite', 'name': '小满虫之家', 'url': 'https://www.xxm8777.cn' },
                        'about': { '@type': 'Person', 'name': '咻咻满', 'alternateName': 'XXM' }
                    })}
                </script>
            </Helmet>

            <PageDecorations theme="fans" glowColors={['#f8b195', '#f67280']} />

            <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-3 py-4">
                    <div className="inline-block px-4 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-amber-200/50 mb-2">
                        Moments
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                        满の动态
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300" />
                        <Newspaper className="w-4 h-4 text-amber-400" />
                        <p className="text-[#8eb69b] font-bold text-sm">
                            微博 & B站动态快照，随时了解满满的最新分享
                        </p>
                        <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300" />
                    </div>
                </div>

                <div className="flex justify-center gap-3">
                    {([{ key: 'all', label: '全部动态' }, { key: 'weibo', label: '微博' }, { key: 'bilibili', label: 'B站' }] as const).map(item => (
                        <button
                            key={item.key}
                            onClick={() => handleFilterChange(item.key)}
                            className={`px-6 py-2.5 rounded-[1.2rem] font-black text-sm transition-all duration-300 border-2 ${
                                filter === item.key
                                    ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-lg shadow-[#f8b195]/20 scale-105'
                                    : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]/20'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {initialLoading ? (
                    <div className="py-32"><Loading text="正在加载动态..." size="lg" /></div>
                ) : moments.length === 0 ? (
                    <div className="text-center py-20">
                        <Newspaper className="w-12 h-12 mx-auto text-[#8eb69b]/30 mb-4" />
                        <p className="text-[#8eb69b] font-bold">暂无动态，稍后再来看看吧</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {moments.map(moment => (
                            <div key={moment.id} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(248,177,149,0.12)] transition-all duration-300 border-2 border-transparent hover:border-white">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <SourceLabel source={moment.source} />
                                        <span className="text-xs text-[#8eb69b]/60 font-bold">
                                            {formatTime(moment.publish_time)}
                                        </span>
                                    </div>
                                    <a href={moment.source_url} target="_blank" rel="noopener noreferrer" className="text-[#8eb69b]/40 hover:text-[#f8b195] transition-colors" title="查看原文">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>

                                <div className="mb-4">
                                    <p className={`text-[#4a3728] font-bold leading-relaxed ${expandedId !== moment.id && moment.content.length > 200 ? 'line-clamp-4' : ''}`}>
                                        {moment.content}
                                    </p>
                                    {moment.content.length > 200 && (
                                        <button onClick={() => setExpandedId(expandedId === moment.id ? null : moment.id)} className="text-[#f8b195] text-xs font-black mt-1 hover:underline">
                                            {expandedId === moment.id ? '收起' : '展开全文'}
                                        </button>
                                    )}
                                </div>

                                {moment.images.length > 0 && (
                                    <div className={`grid gap-2 mb-4 ${moment.images.length === 1 ? 'grid-cols-1' : moment.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                        {moment.images.slice(0, 9).map((img, idx) => {
                                            const isVideo = moment.video_bvid && idx === 0;
                                            return (
                                                <a
                                                    key={idx}
                                                    href={isVideo ? undefined : img.original_url}
                                                    target={isVideo ? undefined : '_blank'}
                                                    rel={isVideo ? undefined : 'noopener noreferrer'}
                                                    onClick={isVideo ? (e) => { e.preventDefault(); setVideoUrl(`https://www.bilibili.com/video/${moment.video_bvid}`); } : undefined}
                                                    className="block aspect-square rounded-2xl overflow-hidden bg-[#fef5f0] border border-white/50 relative group cursor-pointer"
                                                >
                                                    <img src={img.thumbnail_url} alt={`图片 ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                                                    {isVideo && (
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-[#f8b195] shadow-xl group-hover:scale-110 transition-transform">
                                                                <Play fill="currentColor" size={20} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}

                                {moment.images.length === 0 && moment.video_bvid && (
                                    <div className="mb-4">
                                        <button onClick={() => setVideoUrl(`https://www.bilibili.com/video/${moment.video_bvid}`)} className="w-full aspect-video rounded-2xl bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/10 border-2 border-dashed border-[#f8b195]/30 flex items-center justify-center gap-3 hover:bg-[#f8b195]/10 transition-all group">
                                            <div className="w-14 h-14 bg-[#f8b195] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                                <Play fill="currentColor" size={24} className="ml-1" />
                                            </div>
                                            <span className="text-[#f8b195] font-black text-sm">播放视频</span>
                                        </button>
                                    </div>
                                )}

                                {moment.images.length === 0 && moment.video_url && !moment.video_bvid && (
                                    <div className="mb-4">
                                        <button onClick={() => {
                                            if (moment.video_url.includes('.mp4') || moment.video_url.includes('sinaimg.cn')) {
                                                setVideoUrl(moment.video_url);
                                            } else {
                                                window.open(moment.video_url, '_blank');
                                            }
                                        }} className="w-full aspect-video rounded-2xl bg-gradient-to-br from-red-100/40 to-orange-50/40 border-2 border-dashed border-red-200/50 flex items-center justify-center gap-3 hover:bg-red-50/50 transition-all group">
                                            <div className="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                                <Play fill="currentColor" size={24} className="ml-1" />
                                            </div>
                                            <span className="text-red-400 font-black text-sm">播放微博视频</span>
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-5 text-[#8eb69b]/60">
                                    <span className="inline-flex items-center gap-1 text-xs font-bold"><Heart className="w-3.5 h-3.5" />{formatCount(moment.like_count)}</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold"><MessageCircle className="w-3.5 h-3.5" />{formatCount(moment.comment_count)}</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold"><Share2 className="w-3.5 h-3.5" />{formatCount(moment.share_count)}</span>
                                </div>
                            </div>
                        ))}

                        <div ref={sentinelRef} className="h-4" />

                        {loadingMore && <div className="py-8"><Loading text="加载更多..." size="sm" /></div>}

                        {!hasMore && moments.length > 0 && (
                            <p className="text-center text-[10px] text-[#8eb69b]/40 font-bold pt-4">
                                已加载全部动态，每5分钟自动更新一次
                            </p>
                        )}
                    </div>
                )}

                <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
            </div>
        </>
    );
};

export default MomentsPage;
