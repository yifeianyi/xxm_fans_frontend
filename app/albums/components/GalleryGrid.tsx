'use client';

/**
 * GalleryGrid - 图集网格组件
 * 
 * @module app/albums/components
 * @description 图集卡片网格展示
 */

import React from 'react';
import Image from 'next/image';
import { Folder, ImageIcon } from 'lucide-react';
import { Gallery } from '@/app/domain/types';

interface GalleryGridProps {
    galleries: Gallery[];
    onGalleryClick: (gallery: Gallery) => void;
}

export default function GalleryGrid({ galleries, onGalleryClick }: GalleryGridProps) {
    if (galleries.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-[#4a3728]/60">暂无图集</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleries.map((gallery) => (
                <button
                    key={gallery.id}
                    onClick={() => onGalleryClick(gallery)}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm
                               border border-[#8eb69b]/10 hover:border-[#f8b195]/50
                               hover:shadow-lg hover:shadow-[#f8b195]/10
                               transition-all duration-300 text-left"
                >
                    {/* 封面图 */}
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-[#fef5f0] to-[#f8b195]/10">
                        {gallery.coverUrl ? (
                            <Image
                                src={gallery.coverThumbnailUrl || gallery.coverUrl}
                                alt={gallery.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Folder className="w-16 h-16 text-[#8eb69b]/30" />
                            </div>
                        )}
                        
                        {/* 图片数量标签 */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-white" />
                            <span className="text-xs text-white font-medium">{gallery.imageCount}</span>
                        </div>
                    </div>

                    {/* 信息 */}
                    <div className="p-4">
                        <h3 className="font-bold text-[#4a3728] group-hover:text-[#f8b195] transition-colors line-clamp-1">
                            {gallery.title}
                        </h3>
                        {gallery.description && (
                            <p className="mt-1 text-sm text-[#4a3728]/60 line-clamp-2">
                                {gallery.description}
                            </p>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
