'use client';

import React from 'react';
import { Gallery, GalleryImage } from '@/app/domain/types';
import { ImageGrid } from './ImageGrid';

interface ChildrenImagesDisplayProps {
    childrenGroups: Array<{
        gallery: Gallery;
        images: GalleryImage[];
    }>;
    allChildrenImages: GalleryImage[];
    onImageClick: (img: GalleryImage, index: number) => void;
}

export function ChildrenImagesDisplay({
    childrenGroups,
    allChildrenImages,
    onImageClick,
}: ChildrenImagesDisplayProps) {
    if (!childrenGroups || childrenGroups.length === 0) {
        return null;
    }

    // 计算全局索引
    const getGlobalIndex = (groupIndex: number, imageIndex: number): number => {
        let index = 0;
        for (let i = 0; i < groupIndex; i++) {
            index += childrenGroups[i].images.length;
        }
        return index + imageIndex;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {childrenGroups.map((group, groupIndex) => (
                <div key={group.gallery.id} className="space-y-6">
                    {/* 分组标题 */}
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-[#5d4037]">{group.gallery.title}</h3>
                        <span className="px-3 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-full text-xs font-black uppercase tracking-widest">
                            {group.images.length} 张
                        </span>
                    </div>

                    {/* 图片网格 - 使用全局索引 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {group.images.map((image, imageIndex) => {
                            const globalIndex = getGlobalIndex(groupIndex, imageIndex);
                            return (
                                <div
                                    key={image.id || `${groupIndex}-${imageIndex}`}
                                    className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-white"
                                    onClick={() => onImageClick(image, globalIndex)}
                                >
                                    <img
                                        src={image.thumbnailUrl || image.url}
                                        alt={image.title || image.filename}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    
                                    {/* 悬停效果 */}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 分隔线 */}
                    {groupIndex < childrenGroups.length - 1 && (
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
                            <span className="text-[#f8b195]/40 text-xs font-black uppercase tracking-[0.3em]">↓</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
