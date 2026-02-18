'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Grid, ChevronRight, Folder, X, ChevronLeft, Maximize2, Play } from 'lucide-react';
import { galleryRepository } from '@/app/infrastructure/repositories';
import { Gallery, GalleryImage } from '@/app/domain/types';
import { ErrorBoundary } from '@/app/shared/components';
import Link from 'next/link';

// 图片网格组件
function ImageGrid({ 
    images, 
    onImageClick 
}: { 
    images: GalleryImage[]; 
    onImageClick: (img: GalleryImage, index: number) => void;
}) {
    if (!images || images.length === 0) {
        return (
            <div className="text-center py-12 text-[#8eb69b]">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>暂无图片</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((img, idx) => (
                <div
                    key={img.id || idx}
                    className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-white"
                    onClick={() => onImageClick(img, idx)}
                >
                    {img.isVideo ? (
                        <video
                            src={img.url}
                            poster={img.thumbnailUrl || img.url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                    ) : (
                        <img
                            src={img.thumbnailUrl || img.url}
                            alt={img.title || img.filename}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                        />
                    )}
                    
                    {/* 媒体类型标签 */}
                    {(img.isGif || img.isVideo) && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                            <Play size={10} fill="white" />
                            <span className="text-[10px] font-bold">{img.isVideo ? 'VIDEO' : 'GIF'}</span>
                        </div>
                    )}
                    
                    {/* 悬停效果 */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 size={28} className="text-white drop-shadow-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}

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
                    <span>{gallery.imageCount} 张图片</span>
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
function Breadcrumb({ 
    items, 
    onRootClick 
}: { 
    items: Array<{ id: string; title: string }>;
    onRootClick: () => void;
}) {
    return (
        <nav className="flex items-center gap-2 text-sm flex-wrap">
            <button 
                onClick={onRootClick}
                className="text-[#8eb69b] hover:text-[#f8b195] font-bold transition-colors"
            >
                全部图集
            </button>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <ChevronRight size={16} className="text-[#8eb69b]/50 flex-shrink-0" />
                    {index === items.length - 1 ? (
                        <span className="text-[#5d4037] font-bold">{item.title}</span>
                    ) : (
                        <span className="text-[#8eb69b]">{item.title}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

// 图片查看器弹窗
function ImageViewer({
    images,
    currentIndex,
    onClose,
    onPrevious,
    onNext
}: {
    images: GalleryImage[];
    currentIndex: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}) {
    if (!images || images.length === 0) return null;
    
    const currentImage = images[currentIndex];
    
    // 键盘导航
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrevious();
            if (e.key === 'ArrowRight') onNext();
        };
        
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, onPrevious, onNext]);
    
    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* 关闭按钮 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
            >
                <X size={24} />
            </button>
            
            {/* 计数器 */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm font-bold">
                {currentIndex + 1} / {images.length}
            </div>
            
            {/* 上一张 */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-50"
            >
                <ChevronLeft size={28} />
            </button>
            
            {/* 下一张 */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-50"
            >
                <ChevronRight size={28} />
            </button>
            
            {/* 图片容器 */}
            <div 
                className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {currentImage?.isVideo ? (
                    <video
                        src={currentImage.url}
                        className="max-w-full max-h-[85vh] rounded-lg"
                        controls
                        autoPlay
                    />
                ) : (
                    <img
                        src={currentImage?.url}
                        alt={currentImage?.title || currentImage?.filename}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                    />
                )}
            </div>
        </div>
    );
}

// 主页面
export default function AlbumsPage() {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string; title: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    
    // 图片查看器状态
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // 加载图集树
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
    const handleGalleryClick = useCallback(async (gallery: Gallery) => {
        setCurrentGallery(gallery);
        
        // 更新面包屑
        if (gallery.breadcrumbs) {
            setBreadcrumbs(gallery.breadcrumbs);
        }
        
        // 如果是叶子节点，加载图片
        if (gallery.isLeaf) {
            setLoadingImages(true);
            try {
                const result = await galleryRepository.getGalleryImages(gallery.id);
                setImages(result.images);
            } catch (error) {
                console.error('Failed to fetch images:', error);
                setImages([]);
            } finally {
                setLoadingImages(false);
            }
        } else {
            setImages([]);
        }
    }, []);
    
    // 返回根目录
    const handleRootClick = useCallback(() => {
        setCurrentGallery(null);
        setBreadcrumbs([]);
        setImages([]);
    }, []);
    
    // 处理图片点击
    const handleImageClick = useCallback((img: GalleryImage, index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    }, []);
    
    // 上一张图片
    const handlePreviousImage = useCallback(() => {
        setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    }, [images.length]);
    
    // 下一张图片
    const handleNextImage = useCallback(() => {
        setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }, [images.length]);
    
    // 获取当前显示的内容
    const getDisplayGalleries = () => {
        if (currentGallery) {
            // 如果有子图集，显示子图集
            if (currentGallery.children && currentGallery.children.length > 0) {
                return currentGallery.children;
            }
            // 如果是叶子节点且有图片，不显示图集卡片
            if (currentGallery.isLeaf) {
                return [];
            }
        }
        return galleries;
    };
    
    const displayGalleries = getDisplayGalleries();
    const showImageGrid = currentGallery?.isLeaf;
    
    return (
        <ErrorBoundary>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 页面标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#f8b195] to-[#f67280] bg-clip-text text-transparent mb-4">
                        满の图册
                    </h1>
                    <p className="text-[#8eb69b] font-bold">
                        收集活动照片、生活瞬间和高清壁纸
                    </p>
                </div>
                
                {/* 面包屑 */}
                {(currentGallery || breadcrumbs.length > 0) && (
                    <div className="mb-6">
                        <Breadcrumb 
                            items={breadcrumbs} 
                            onRootClick={handleRootClick}
                        />
                    </div>
                )}
                
                {/* 当前图集标题 */}
                {currentGallery && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-[#5d4037]">{currentGallery.title}</h2>
                        {currentGallery.description && (
                            <p className="text-[#8eb69b] mt-2">{currentGallery.description}</p>
                        )}
                    </div>
                )}
                
                {/* 加载状态 */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" />
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                
                {/* 图片网格 */}
                {showImageGrid && (
                    <div className="mb-8">
                        {loadingImages ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" />
                                    <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-3 h-3 bg-[#f8b195] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        ) : (
                            <ImageGrid 
                                images={images} 
                                onImageClick={handleImageClick} 
                            />
                        )}
                    </div>
                )}
                
                {/* 图集网格 */}
                {!loading && displayGalleries.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayGalleries.map(gallery => (
                            <GalleryCard
                                key={gallery.id}
                                gallery={gallery}
                                onClick={() => handleGalleryClick(gallery)}
                            />
                        ))}
                    </div>
                )}
                
                {/* 空状态 */}
                {!loading && !currentGallery && galleries.length === 0 && (
                    <div className="text-center py-20 text-[#8eb69b]">
                        <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold text-lg">暂无图集</p>
                        <p className="text-sm mt-2">图集正在整理中，敬请期待...</p>
                    </div>
                )}
                
                {/* 图片查看器 */}
                {lightboxOpen && (
                    <ImageViewer
                        images={images}
                        currentIndex={currentImageIndex}
                        onClose={() => setLightboxOpen(false)}
                        onPrevious={handlePreviousImage}
                        onNext={handleNextImage}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}
