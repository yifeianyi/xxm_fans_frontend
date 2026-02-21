'use client';

import React, { useState, useEffect } from 'react';
import { Play, Heart, Sparkles, Palette, Wand2, Paintbrush } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCollections, getWorks } from '@/app/infrastructure/api/fansDIYService';
import { FanWork, FanCollection } from '@/app/domain/types';
import VideoModal from '@/app/presentation/components/songs/VideoModal';

// 标题装饰组件
const TitleDecoration: React.FC = () => {
    return (
        <div className="flex items-center gap-3">
            <Palette className="w-7 h-7 text-pink-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <Heart className="w-6 h-6 text-red-400 animate-pulse fill-red-400" />
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            <Wand2 className="w-6 h-6 text-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Paintbrush className="w-7 h-7 text-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
    );
};

// 加载组件
const Loading: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ text = '加载中...', size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className={`${sizeClasses[size]} border-4 border-[#f8b195]/20 rounded-full`}></div>
                <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin`}></div>
            </div>
            <span className="text-[#8eb69b] font-black tracking-[0.3em] uppercase text-xs animate-pulse">{text}</span>
        </div>
    );
};

// 页面内容组件（Client Component）
export default function FansDIYContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const collectionId = searchParams.get('collection');

    const [collections, setCollections] = useState<FanCollection[]>([]);
    const [works, setWorks] = useState<FanWork[]>([]);
    const [selectedCol, setSelectedCol] = useState<string>(collectionId || 'all');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 根据URL参数设置初始分类
    useEffect(() => {
        if (collectionId) {
            setSelectedCol(collectionId);
        } else {
            setSelectedCol('all');
        }
    }, [collectionId]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [colsResult, worksResult] = await Promise.all([
                    getCollections(),
                    getWorks({ page_size: 100 })
                ]);
                setCollections(colsResult);
                setWorks(worksResult.results);
            } catch (error) {
                // 数据加载失败，静默处理
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // 分类切换时更新URL并加载对应作品
    const handleCollectionChange = async (newCol: string) => {
        setSelectedCol(newCol);
        if (newCol !== 'all') {
            router.push(`/fansDIY?collection=${newCol}`, { scroll: false });
            // 加载该合集的作品
            setLoading(true);
            try {
                const result = await getWorks({ collection: newCol, page_size: 100 });
                setWorks(result.results);
            } catch (error) {
                // 加载合集作品失败，静默处理
            } finally {
                setLoading(false);
            }
        } else {
            router.push('/fansDIY', { scroll: false });
            // 重新加载所有作品
            setLoading(true);
            try {
                const result = await getWorks({ page_size: 100 });
                setWorks(result.results);
            } catch (error) {
                // 加载所有作品失败，静默处理
            } finally {
                setLoading(false);
            }
        }
    };

    // 作品已经根据选择的合集加载，不需要再过滤
    const filteredWorks = works;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
            {/* 标题区域 - 带装饰 */}
            <div className="relative">
                {/* 背景装饰 */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/3 w-40 h-40 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-15 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 opacity-15 blur-3xl rounded-full" />
                </div>

                <div className="text-center space-y-4 py-6">
                    {/* 装饰图标行 */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <TitleDecoration />
                    </div>

                    {/* 标签 */}
                    <div className="inline-block px-4 py-1 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-pink-200/50 mb-2">
                        ✨ Community Creations ✨
                    </div>

                    {/* 主标题 */}
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                        精选二创展厅
                    </h2>

                    {/* 副标题带装饰线 */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />
                        <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                        <p className="text-[#8eb69b] font-bold max-w-lg">
                            每一份热爱，都在这里闪闪发光
                        </p>
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />
                    </div>
                </div>
            </div>

            {/* 筛选分类 */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => handleCollectionChange('all')}
                    className={`px-8 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 border-2 ${selectedCol === 'all' ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-lg shadow-[#f8b195]/20 scale-105' : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]/20'}`}
                >
                    全部作品
                </button>
                {collections.map(col => (
                    <button
                        key={col.id}
                        onClick={() => handleCollectionChange(col.id)}
                        className={`px-8 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 border-2 ${selectedCol === col.id ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-lg shadow-[#f8b195]/20 scale-105' : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]/20'}`}
                    >
                        {col.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-32 flex justify-center"><Loading text="正在布置展厅..." size="lg" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredWorks.map(work => (
                        <div
                            key={work.id}
                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(248,177,149,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-white"
                            onClick={() => setVideoUrl(work.videoUrl)}
                        >
                            <div className="aspect-video relative overflow-hidden bg-[#fef5f0]">
                                <img 
                                    src={work.coverThumbnailUrl || work.cover} 
                                    alt={work.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    loading="lazy" 
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#f8b195] shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                        <Play fill="currentColor" size={24} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors line-clamp-1 text-lg">{work.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-[#fef5f0] flex items-center justify-center text-[8px] font-black text-[#f8b195]">@</div>
                                        <span className="text-xs font-black text-[#8eb69b]">{work.author}</span>
                                    </div>
                                </div>
                                {work.note && (
                                    <p className="text-[11px] text-[#8eb69b]/80 font-bold leading-relaxed line-clamp-2 bg-[#fef5f0]/50 p-4 rounded-2xl border border-white">
                                        {work.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 底部装饰 */}
            {!loading && filteredWorks.length > 0 && (
                <div className="pt-12 text-center opacity-20">
                    <div className="flex items-center justify-center gap-4 text-[#8eb69b]">
                        <div className="h-px w-16 bg-current"></div>
                        <span className="text-xs font-black uppercase tracking-[0.5em]">End of Gallery</span>
                        <div className="h-px w-16 bg-current"></div>
                    </div>
                </div>
            )}

            <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
        </div>
    );
}
