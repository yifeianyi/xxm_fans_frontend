'use client';

/**
 * ImageViewer - 图片/视频查看器组件
 * 
 * @module app/gallery/components
 * @description Lightbox 图片/视频/GIF查看器
 */

import React, { useEffect, useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

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
            case ' ':
                e.preventDefault();
                if (currentImage?.isVideo && videoRef.current) {
                    if (videoRef.current.paused) {
                        videoRef.current.play();
                        setIsPlaying(true);
                    } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
                    }
                }
                break;
        }
    }, [onClose, onPrevious, onNext, currentImage]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    // 切换图片时重置视频状态
    useEffect(() => {
        setIsPlaying(true);
        setIsMuted(true);
    }, [currentIndex]);

    if (!currentImage) return null;

    const isVideo = currentImage.isVideo;
    const isGif = currentImage.isGif;

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
            {/* 顶部工具栏 */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
                {/* 媒体计数 */}
                <div className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                    {currentIndex + 1} / {images.length}
                    {isVideo && ' · 视频'}
                    {isGif && ' · GIF'}
                </div>

                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="关闭"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* 主内容区域 - 使用 flex 布局让内容自适应 */}
            <div className="flex-1 flex items-center justify-center min-h-0">
                {/* 左侧切换按钮 - 紧贴内容 */}
                {images.length > 1 && (
                    <button
                        onClick={onPrevious}
                        className="flex-shrink-0 p-2 md:p-3 mx-1 md:mx-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        aria-label="上一张"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                )}

                {/* 媒体内容容器 - 占据剩余空间 */}
                <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
                    <div className="relative max-w-full max-h-full">
                        {isVideo ? (
                            // 视频播放
                            <div className="relative flex flex-col items-center">
                                <video
                                    ref={videoRef}
                                    src={currentImage.url}
                                    className="max-w-full max-h-[calc(100vh-180px)] object-contain"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onClick={togglePlay}
                                />
                                {/* 视频控制栏 */}
                                <div className="mt-3 flex items-center gap-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm">
                                    <button
                                        onClick={togglePlay}
                                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                        aria-label={isPlaying ? '暂停' : '播放'}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-5 h-5 text-white" />
                                        ) : (
                                            <Play className="w-5 h-5 text-white" />
                                        )}
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                        aria-label={isMuted ? '取消静音' : '静音'}
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-5 h-5 text-white" />
                                        ) : (
                                            <Volume2 className="w-5 h-5 text-white" />
                                        )}
                                    </button>
                                    <span className="text-white text-sm hidden sm:inline">
                                        空格键播放/暂停
                                    </span>
                                </div>
                            </div>
                        ) : isGif ? (
                            // GIF 使用原生 img 标签以支持动画
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={currentImage.url}
                                alt={currentImage.title || currentImage.filename}
                                className="max-w-full max-h-[calc(100vh-140px)] object-contain"
                            />
                        ) : (
                            // 普通图片使用 Next.js Image
                            <div className="relative max-w-full max-h-[calc(100vh-140px)]">
                                <Image
                                    src={currentImage.url}
                                    alt={currentImage.title || currentImage.filename}
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-[calc(100vh-140px)] object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧切换按钮 - 紧贴内容 */}
                {images.length > 1 && (
                    <button
                        onClick={onNext}
                        className="flex-shrink-0 p-2 md:p-3 mx-1 md:mx-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        aria-label="下一张"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                )}
            </div>

            {/* 底部缩略图导航 */}
            {images.length > 1 && (
                <div className="px-4 py-3 flex-shrink-0">
                    <div className="flex gap-2 overflow-x-auto max-w-full mx-auto p-2 rounded-xl bg-black/50 backdrop-blur-sm justify-center">
                        {images.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => onIndexChange(index)}
                                className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                    index === currentIndex
                                        ? 'border-[#f8b195] scale-110'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                {/* 缩略图 */}
                                {img.isVideo || img.isGif ? (
                                    // 视频/GIF 缩略图使用原生 img
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={img.thumbnailUrl || img.url}
                                        alt={img.title || img.filename}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={img.thumbnailUrl || img.url}
                                        alt={img.title || img.filename}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                {/* 视频/GIF 标识 */}
                                {(img.isVideo || img.isGif) && (
                                    <div className="absolute top-0.5 right-0.5 px-1 py-0.5 bg-[#f67280] rounded text-[8px] text-white font-medium leading-none">
                                        {img.isVideo ? '视频' : 'GIF'}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
