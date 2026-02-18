'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, Maximize2, Play } from 'lucide-react';
import { GalleryImage } from '@/app/domain/types';

interface ImageGridProps {
    images: GalleryImage[];
    onImageClick: (index: number) => void;
}

/**
 * 图片卡片组件（支持懒加载）
 */
function ImageCard({
    image,
    index,
    onClick,
}: {
    image: GalleryImage;
    index: number;
    onClick: () => void;
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);
    
    // 使用 Intersection Observer 实现懒加载
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px' }
        );
        
        if (imgRef.current) {
            observer.observe(imgRef.current);
        }
        
        return () => observer.disconnect();
    }, []);
    
    return (
        <div
            ref={imgRef}
            className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-white"
            onClick={onClick}
        >
            {/* 骨架屏占位 */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            )}
            
            {/* 图片内容 */}
            {isInView && (
                image.isVideo ? (
                    <video
                        src={image.url}
                        poster={image.thumbnailUrl || image.url}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setIsLoaded(true)}
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                ) : (
                    <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.title || image.filename}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)}
                    />
                )
            )}
            
            {/* 媒体类型标签 */}
            {(image.isGif || image.isVideo) && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <Play size={10} fill="white" />
                    <span className="text-[10px] font-bold">{image.isVideo ? 'VIDEO' : 'GIF'}</span>
                </div>
            )}
            
            {/* 悬停效果 */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 size={28} className="text-white drop-shadow-lg" />
            </div>
        </div>
    );
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
    if (!images || images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#8eb69b]">
                <ImageIcon size={64} className="mb-4 opacity-30" />
                <p className="font-bold text-lg">暂无图片</p>
                <p className="text-sm mt-2 opacity-60">该图集暂时没有图片</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {images.map((image, index) => (
                <ImageCard
                    key={image.id || index}
                    image={image}
                    index={index}
                    onClick={() => onImageClick(index)}
                />
            ))}
        </div>
    );
}
