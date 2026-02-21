'use client';

/**
 * ChildrenImagesDisplay - 子图集图片展示组件
 * 
 * @module app/gallery/components
 * @description 父图集下的子图集图片聚合展示
 */

import React from 'react';
import Image from 'next/image';
import { Gallery, GalleryImage } from '@/app/domain/types';

interface ChildrenImagesDisplayProps {
    childrenGroups: { gallery: Gallery; images: GalleryImage[] }[];
    allChildrenImages: GalleryImage[];
    onImageClick: (img: GalleryImage, index: number, allImages?: GalleryImage[]) => void;
}

export default function ChildrenImagesDisplay({
    childrenGroups,
    allChildrenImages,
    onImageClick,
}: ChildrenImagesDisplayProps) {
    if (childrenGroups.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-[#4a3728]/60">暂无图片</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {childrenGroups.map((group) => (
                <section key={group.gallery.id} className="space-y-4">
                    {/* 子图集标题 */}
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[#4a3728]">{group.gallery.title}</h3>
                        <span className="px-2 py-0.5 bg-[#8eb69b]/20 rounded-full text-xs text-[#8eb69b] font-medium">
                            {group.images.length} 张
                        </span>
                    </div>

                    {/* 图片网格 */}
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {group.images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => onImageClick(image, index, allChildrenImages)}
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
                </section>
            ))}
        </div>
    );
}
