'use client';

/**
 * ImageGrid - 图片网格组件
 * 
 * @module app/gallery/components
 * @description 图片网格展示（叶子图集）
 */

import React from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/app/domain/types';

interface ImageGridProps {
    images: GalleryImage[];
    onImageClick: (img: GalleryImage, index: number) => void;
}

export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
    if (images.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-[#4a3728]/60">暂无图片</p>
            </div>
        );
    }

    return (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((image, index) => (
                <button
                    key={image.id}
                    onClick={() => onImageClick(image, index)}
                    className="group block w-full break-inside-avoid mb-4"
                >
                    <div className="relative rounded-xl overflow-hidden bg-[#fef5f0] border border-[#8eb69b]/10
                                    hover:border-[#f8b195]/50 hover:shadow-lg hover:shadow-[#f8b195]/10
                                    transition-all duration-300">
                        <Image
                            src={image.thumbnailUrl || image.url}
                            alt={image.title || image.filename}
                            width={400}
                            height={300}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        
                        {/* 悬停遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                        flex items-end p-3">
                            <span className="text-white text-sm font-medium line-clamp-1">
                                {image.title || image.filename}
                            </span>
                        </div>

                        {/* GIF/Video 标签 */}
                        {(image.isGif || image.isVideo) && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#f67280] rounded text-xs text-white font-medium">
                                {image.isGif ? 'GIF' : '视频'}
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
