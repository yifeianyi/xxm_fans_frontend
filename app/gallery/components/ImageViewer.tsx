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
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* 关闭按钮 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="关闭"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* 媒体计数 */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                {currentIndex + 1} / {images.length}
                {isVideo && ' · 视频'}
                {isGif && ' · GIF'}
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

            {/* 媒体内容 */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
                {isVideo ? (
                    // 视频播放
                    <div className="relative w-full h-full flex items-center justify-center">
                        <video
                            ref={videoRef}
                            src={currentImage.url}
                            className="max-w-full max-h-full object-contain"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onClick={togglePlay}
                        />
                        {/* 视频控制栏 */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm">
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
                            <span className="text-white text-sm">
                                点击视频播放/暂停
                            </span>
                        </div>
                    </div>
                ) : isGif ? (
                    // GIF 使用原生 img 标签以支持动画
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={currentImage.url}
                        alt={currentImage.title || currentImage.filename}
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    // 普通图片使用 Next.js Image
                    <Image
                        src={currentImage.url}
                        alt={currentImage.title || currentImage.filename}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                )}
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
                            className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
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
            )}
        </div>
    );
}
