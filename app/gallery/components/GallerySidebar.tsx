'use client';

/**
 * GallerySidebar - 图集侧边栏组件
 * 
 * @module app/gallery/components
 * @description 图集树形导航侧边栏
 */

import React from 'react';
import { Gallery } from '@/app/domain/types';

interface GallerySidebarProps {
    galleryTree: Gallery[];
    currentGallery: Gallery | null;
    expandedNodes: Set<string>;
    onToggle: (galleryId: string) => void;
    onSelect: (gallery: Gallery) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function GallerySidebar({
    galleryTree,
    currentGallery,
    expandedNodes,
    onToggle,
    onSelect,
    isOpen,
    onClose,
}: GallerySidebarProps) {
    return (
        <>
            {/* 移动端遮罩 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* 侧边栏 */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-72 bg-white/90 backdrop-blur-sm border-r border-[#8eb69b]/20
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* 头部 */}
                <div className="p-4 border-b border-[#8eb69b]/20">
                    <h2 className="text-lg font-bold text-[#4a3728]">图集导航</h2>
                </div>

                {/* 树形导航 */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* TODO: 实现树形导航 */}
                    <div className="text-sm text-[#4a3728]/60">
                        图集列表加载中...
                    </div>
                </div>
            </aside>
        </>
    );
}
