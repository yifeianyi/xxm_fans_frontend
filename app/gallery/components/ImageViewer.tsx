'use client';

/**
 * ImageViewer - 图片查看器组件
 * 
 * @module app/gallery/components
 * @description Lightbox 图片查看器
 */

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '@/app/domain/types';

interface ImageViewerProps {
    images: GalleryImage[];
    currentIndex: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onIndexChange: (index: number) => void;
    onSelectImage: (image: GalleryImage) => void;
}

export default function ImageViewer({
    images,
    currentIndex,
    onClose,
    onPrevious,
    onNext,
    onIndexChange,
}: ImageViewerProps) {
    const currentImage = images[currentIndex];

    // 键盘导航
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
    }, [onClose, onPrevious, onNext]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    if (!currentImage) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* 关闭按钮 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="关闭"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* 图片计数 */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                {currentIndex + 1} / {images.length}
            </div>

            {/* 上一张 */}
            {images.length > 1 && (
                <button
                    onClick={onPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="上一张"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}

            {/* 图片 */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
                <Image
                    src={currentImage.url}
                    alt={currentImage.title || currentImage.filename}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                />
            </div>

            {/* 下一张 */}
            {images.length > 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="下一张"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            )}

            {/* 缩略图导航 */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90%] p-2 rounded-xl bg-black/50 backdrop-blur-sm">
                    {images.map((img, index) => (
                        <button
                            key={img.id}
                            onClick={() => onIndexChange(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentIndex
                                    ? 'border-[#f8b195] scale-110'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <Image
                                src={img.thumbnailUrl || img.url}
                                alt={img.title || img.filename}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
