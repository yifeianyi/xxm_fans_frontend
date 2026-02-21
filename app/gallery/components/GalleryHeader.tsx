'use client';

/**
 * GalleryHeader - 图集页面头部组件
 * 
 * @module app/gallery/components
 * @description 面包屑导航、搜索、快速选择
 */

import React from 'react';
import { Menu, Search, ChevronRight } from 'lucide-react';
import { Gallery, Breadcrumb } from '@/app/domain/types';

interface GalleryHeaderProps {
    breadcrumbs: Breadcrumb[];
    galleryTree: Gallery[];
    currentGallery: Gallery | null;
    searchTerm: string;
    searchResults: Gallery[];
    showSearchResults: boolean;
    sidebarOpen: boolean;
    onSidebarToggle: () => void;
    onBreadcrumbClick: (breadcrumb: Breadcrumb) => void;
    onSearchChange: (term: string) => void;
    onSearchResultClick: (gallery: Gallery) => void;
    onQuickSelect: (gallery: Gallery) => void;
}

export default function GalleryHeader({
    breadcrumbs,
    currentGallery,
    searchTerm,
    searchResults,
    showSearchResults,
    sidebarOpen,
    onSidebarToggle,
    onBreadcrumbClick,
    onSearchChange,
    onSearchResultClick,
}: GalleryHeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#8eb69b]/20 px-6 py-4">
            <div className="flex items-center gap-4">
                {/* 侧边栏切换按钮 */}
                <button
                    onClick={onSidebarToggle}
                    className="lg:hidden p-2 rounded-lg hover:bg-[#8eb69b]/10 transition-colors"
                    aria-label={sidebarOpen ? '关闭侧边栏' : '打开侧边栏'}
                >
                    <Menu className="w-5 h-5 text-[#4a3728]" />
                </button>

                {/* 面包屑导航 */}
                <nav className="flex-1 flex items-center gap-2 overflow-x-auto">
                    <button
                        onClick={() => onBreadcrumbClick({ id: 'root', title: '首页' })}
                        className="text-sm text-[#4a3728]/60 hover:text-[#f8b195] transition-colors whitespace-nowrap"
                    >
                        图集首页
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.id}>
                            <ChevronRight className="w-4 h-4 text-[#4a3728]/30 flex-shrink-0" />
                            <button
                                onClick={() => onBreadcrumbClick(crumb)}
                                className={`text-sm whitespace-nowrap transition-colors ${
                                    index === breadcrumbs.length - 1
                                        ? 'text-[#f8b195] font-medium'
                                        : 'text-[#4a3728]/60 hover:text-[#f8b195]'
                                }`}
                            >
                                {crumb.title}
                            </button>
                        </React.Fragment>
                    ))}
                </nav>

                {/* 搜索框 */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a3728]/40" />
                    <input
                        type="text"
                        placeholder="搜索图集..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-full bg-[#fef5f0] border border-[#8eb69b]/20
                                   text-sm text-[#4a3728] placeholder:text-[#4a3728]/40
                                   focus:outline-none focus:border-[#f8b195] focus:ring-2 focus:ring-[#f8b195]/20
                                   transition-all w-48 focus:w-64"
                    />
                    
                    {/* 搜索结果下拉框 */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#8eb69b]/20 py-2 z-50">
                            {searchResults.map((gallery) => (
                                <button
                                    key={gallery.id}
                                    onClick={() => onSearchResultClick(gallery)}
                                    className="w-full px-4 py-2 text-left text-sm text-[#4a3728] hover:bg-[#fef5f0] transition-colors"
                                >
                                    {gallery.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 当前图集标题 */}
            {currentGallery && (
                <div className="mt-4">
                    <h1 className="text-2xl font-bold text-[#4a3728]">{currentGallery.title}</h1>
                    {currentGallery.description && (
                        <p className="mt-1 text-sm text-[#4a3728]/60">{currentGallery.description}</p>
                    )}
                </div>
            )}
        </header>
    );
}
