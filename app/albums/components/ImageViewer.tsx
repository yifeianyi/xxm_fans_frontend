'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { GalleryImage } from '@/app/domain/types';

interface ImageViewerProps {
    images: GalleryImage[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onNavigate: (index: number) => void;
}

export function ImageViewer({
    images,
    currentIndex,
    isOpen,
    onClose,
    onPrevious,
    onNext,
    onNavigate,
}: ImageViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [scale, setScale] = useState(1);
    const thumbnailRef = useRef<HTMLDivElement>(null);
    
    const currentImage = images[currentIndex];
    
    // 预加载前后图片
    useEffect(() => {
        if (!isOpen) return;
        
        const preloadImages = () => {
            // 预加载后 2 张
            for (let i = 1; i <= 2; i++) {
                const nextIndex = (currentIndex + i) % images.length;
                const img = new Image();
                img.src = images[nextIndex]?.url || '';
            }
            // 预加载前 2 张
            for (let i = 1; i <= 2; i++) {
                const prevIndex = (currentIndex - i + images.length) % images.length;
                const img = new Image();
                img.src = images[prevIndex]?.url || '';
            }
        };
        
        preloadImages();
        setIsLoaded(false);
        setScale(1);
    }, [currentIndex, isOpen, images]);
    
    // 键盘导航
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrevious();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, onPrevious, onNext]);
    
    // 缩略图滚动到当前
    useEffect(() => {
        if (thumbnailRef.current) {
            const thumbnail = thumbnailRef.current.children[currentIndex] as HTMLElement;
            if (thumbnail) {
                thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentIndex]);
    
    const handleZoomIn = useCallback(() => {
        setScale(prev => Math.min(prev + 0.25, 3));
    }, []);
    
    const handleZoomOut = useCallback(() => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    }, []);
    
    const handleDownload = useCallback(() => {
        if (currentImage?.url) {
            const link = document.createElement('a');
            link.href = currentImage.url;
            link.download = currentImage.filename || 'image';
            link.click();
        }
    }, [currentImage]);
    
    if (!isOpen || !currentImage) return null;
    
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-sm">
            {/* 顶部工具栏 */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/50">
                {/* 计数器 */}
                <div className="flex items-center gap-4">
                    <span className="text-white font-bold">
                        {currentIndex + 1} / {images.length}
                    </span>
                    <span className="text-white/60 text-sm truncate max-w-[200px] sm:max-w-md">
                        {currentImage.filename}
                    </span>
                </div>
                
                {/* 工具按钮 */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-all"
                        title="缩小"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-white text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={handleZoomIn}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-all"
                        title="放大"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-all ml-2"
                        title="下载"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-all ml-2"
                        title="关闭"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
            
            {/* 主图片区域 */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                {/* 上一张按钮 */}
                <button
                    onClick={onPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-10"
                >
                    <ChevronLeft size={28} />
                </button>
                
                {/* 下一张按钮 */}
                <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-10"
                >
                    <ChevronRight size={28} />
                </button>
                
                {/* 图片容器 */}
                <div 
                    className="max-w-[90vw] max-h-[75vh] flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                    
                    {currentImage.isVideo ? (
                        <video
                            src={currentImage.url}
                            className="max-w-full max-h-[75vh] rounded-lg"
                            controls
                            autoPlay
                            onLoadedData={() => setIsLoaded(true)}
                        />
                    ) : (
                        <img
                            src={currentImage.url}
                            alt={currentImage.title || currentImage.filename}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg transition-transform duration-200"
                            style={{ transform: `scale(${scale})` }}
                            onLoad={() => setIsLoaded(true)}
                        />
                    )}
                </div>
            </div>
            
            {/* 底部缩略图栏 */}
            <div className="bg-black/50 py-3">
                <div
                    ref={thumbnailRef}
                    className="flex gap-2 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {images.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => onNavigate(index)}
                            className={`
                                relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                                ${index === currentIndex 
                                    ? 'border-[#f8b195] ring-2 ring-[#f8b195]/50' 
                                    : 'border-transparent hover:border-white/50'
                                }
                            `}
                            style={{ scrollSnapAlign: 'center' }}
                        >
                            <img
                                src={image.thumbnailUrl || image.url}
                                alt={image.title || image.filename}
                                className="w-full h-full object-cover"
                            />
                            {(image.isGif || image.isVideo) && (
                                <div className="absolute top-0.5 right-0.5 bg-black/60 text-white text-[8px] px-1 rounded">
                                    {image.isVideo ? '▶' : 'GIF'}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
