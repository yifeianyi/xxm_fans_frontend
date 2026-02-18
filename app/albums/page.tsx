'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Grid, List, ChevronRight, Folder, Clock, Calendar } from 'lucide-react';
import { galleryRepository } from '@/app/infrastructure/repositories';
import { Gallery } from '@/app/domain/types';
import { ErrorBoundary } from '@/app/shared/components';
import Link from 'next/link';

// 图集卡片组件
function GalleryCard({ gallery, onClick }: { gallery: Gallery; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
            {/* 封面图 */}
            <div className="aspect-[4/3] relative overflow-hidden">
                {gallery.coverUrl ? (
                    <img
                        src={gallery.coverThumbnailUrl || gallery.coverUrl}
                        alt={gallery.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/20 flex items-center justify-center">
                        <ImageIcon size={48} className="text-[#f8b195]/50" />
                    </div>
                )}
                
                {/* 图片数量徽章 */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1">
                    <ImageIcon size={12} />
                    {gallery.imageCount}
                </div>
                
                {/* 非叶子节点标记 */}
                {!gallery.isLeaf && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#f8b195] rounded-full text-white text-xs font-bold flex items-center gap-1">
                        <Folder size={12} />
                        文件夹
                    </div>
                )}
            </div>
            
            {/* 信息 */}
            <div className="p-5">
                <h3 className="font-black text-[#5d4037] text-lg mb-2 truncate group-hover:text-[#f8b195] transition-colors">
                    {gallery.title}
                </h3>
                {gallery.description && (
                    <p className="text-sm text-[#8eb69b] line-clamp-2 mb-3">
                        {gallery.description}
                    </p>
                )}
                <div className="flex items-center justify-between text-xs text-[#8eb69b]/70">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {gallery.createdAt ? new Date(gallery.createdAt).toLocaleDateString() : '未知日期'}
                    </span>
                    {!gallery.isLeaf && (
                        <span className="flex items-center gap-1 text-[#f8b195]">
                            查看
                            <ChevronRight size={12} />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// 面包屑组件
function Breadcrumb({ items }: { items: Array<{ id: string; title: string }> }) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6">
            <Link 
                href="/albums"
                className="text-[#8eb69b] hover:text-[#f8b195] font-bold transition-colors"
            >
                全部图集
            </Link>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <ChevronRight size={16} className="text-[#8eb69b]/50" />
                    {index === items.length - 1 ? (
                        <span className="text-[#5d4037] font-bold">{item.title}</span>
                    ) : (
                        <Link
                            href={`/albums?parent=${item.id}`}
                            className="text-[#8eb69b] hover:text-[#f8b195] font-bold transition-colors"
                        >
                            {item.title}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

// 主页面
export default function AlbumsPage() {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
    
    // 获取图集数据
    useEffect(() => {
        const fetchGalleries = async () => {
            setLoading(true);
            try {
                const result = await galleryRepository.getGalleries();
                setGalleries(result);
            } catch (error) {
                console.error('Failed to fetch galleries:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchGalleries();
    }, []);
    
    // 处理图集点击
    const handleGalleryClick = (gallery: Gallery) => {
        if (gallery.isLeaf) {
            // 叶子节点，显示图片详情
            setCurrentGallery(gallery);
        } else {
            // 非叶子节点，进入子目录
            // TODO: 实现子目录导航
            console.log('Navigate to sub-gallery:', gallery.id);
        }
    };
    
    return (
        <ErrorBoundary>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 页面标题 */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#f8b195] to-[#f67280] bg-clip-text text-transparent mb-4">
                        满の图册
                    </h1>
                    <p className="text-[#8eb69b] font-bold">
                        收集活动照片、生活瞬间和高清壁纸
                    </p>
                </div>
                
                {/* 工具栏 */}
                <div className="flex items-center justify-between mb-8">
                    <Breadcrumb items={[]} />
                    
                    {/* 视图切换 */}
                    <div className="flex items-center gap-2 bg-white/40 rounded-full p-1 border-2 border-white">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-full transition-all ${
                                viewMode === 'grid' 
                                    ? 'bg-[#f8b195] text-white' 
                                    : 'text-[#8eb69b] hover:bg-white/50'
                            }`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-full transition-all ${
                                viewMode === 'list' 
                                    ? 'bg-[#f8b195] text-white' 
                                    : 'text-[#8eb69b] hover:bg-white/50'
                            }`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
                
                {/* 图集列表 */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" />
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                ) : galleries.length === 0 ? (
                    <div className="text-center py-20 text-[#8eb69b]">
                        <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold text-lg">暂无图集</p>
                        <p className="text-sm mt-2">图集正在整理中，敬请期待...</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {galleries.map(gallery => (
                            <GalleryCard
                                key={gallery.id}
                                gallery={gallery}
                                onClick={() => handleGalleryClick(gallery)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {galleries.map(gallery => (
                            <div
                                key={gallery.id}
                                onClick={() => handleGalleryClick(gallery)}
                                className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-white shadow-lg p-4 hover:shadow-xl transition-all cursor-pointer"
                            >
                                {gallery.coverUrl ? (
                                    <img
                                        src={gallery.coverThumbnailUrl || gallery.coverUrl}
                                        alt={gallery.title}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/20 rounded-xl flex items-center justify-center">
                                        <ImageIcon size={32} className="text-[#f8b195]/50" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-[#5d4037] text-lg mb-1 truncate">
                                        {gallery.title}
                                    </h3>
                                    {gallery.description && (
                                        <p className="text-sm text-[#8eb69b] line-clamp-1 mb-2">
                                            {gallery.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-[#8eb69b]/70">
                                        <span className="flex items-center gap-1">
                                            <ImageIcon size={12} />
                                            {gallery.imageCount} 张图片
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {gallery.createdAt ? new Date(gallery.createdAt).toLocaleDateString() : '未知日期'}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={24} className="text-[#8eb69b]" />
                            </div>
                        ))}
                    </div>
                )}
                
                {/* TODO: 图片详情弹窗 */}
                {currentGallery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-black text-[#5d4037]">{currentGallery.title}</h2>
                                <button
                                    onClick={() => setCurrentGallery(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 text-center text-[#8eb69b]">
                                <p>图片浏览功能开发中...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
