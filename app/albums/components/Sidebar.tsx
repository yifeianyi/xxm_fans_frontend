'use client';

import React from 'react';
import { Folder, FolderOpen, Image as ImageIcon, Search, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Gallery } from '@/app/domain/types';

interface SidebarProps {
    galleryTree: Gallery[];
    currentGallery: Gallery | null;
    expandedNodes: Set<string>;
    searchTerm: string;
    searchResults: Gallery[];
    onSearchChange: (term: string) => void;
    onGalleryClick: (gallery: Gallery) => void;
    onToggleExpand: (galleryId: string) => void;
    onRootClick: () => void;
}

/**
 * 递归渲染图集树
 */
function GalleryTreeItem({
    gallery,
    level,
    currentGallery,
    expandedNodes,
    onGalleryClick,
    onToggleExpand,
}: {
    gallery: Gallery;
    level: number;
    currentGallery: Gallery | null;
    expandedNodes: Set<string>;
    onGalleryClick: (gallery: Gallery) => void;
    onToggleExpand: (galleryId: string) => void;
}) {
    const isExpanded = expandedNodes.has(gallery.id);
    const isActive = currentGallery?.id === gallery.id;
    const hasChildren = gallery.children && gallery.children.length > 0;
    
    return (
        <div>
            <div
                className={`
                    flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-all
                    ${isActive 
                        ? 'bg-[#f8b195]/20 text-[#f8b195]' 
                        : 'hover:bg-white/40 text-[#5d4037]'
                    }
                `}
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={() => onGalleryClick(gallery)}
            >
                {/* 展开按钮 */}
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(gallery.id);
                        }}
                        className="p-0.5 hover:bg-white/50 rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </button>
                )}
                
                {!hasChildren && <span className="w-5" />}
                
                {/* 图标 */}
                {hasChildren ? (
                    isExpanded ? (
                        <FolderOpen size={16} className="text-[#f8b195]" />
                    ) : (
                        <Folder size={16} className="text-[#8eb69b]" />
                    )
                ) : (
                    <ImageIcon size={16} className="text-[#8eb69b]" />
                )}
                
                {/* 标题 */}
                <span className="text-sm font-bold truncate flex-1">{gallery.title}</span>
                
                {/* 图片数量 */}
                <span className="text-xs text-[#8eb69b]/60">{gallery.imageCount}</span>
            </div>
            
            {/* 子图集 */}
            {hasChildren && isExpanded && (
                <div>
                    {gallery.children!.map(child => (
                        <GalleryTreeItem
                            key={child.id}
                            gallery={child}
                            level={level + 1}
                            currentGallery={currentGallery}
                            expandedNodes={expandedNodes}
                            onGalleryClick={onGalleryClick}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function Sidebar({
    galleryTree,
    currentGallery,
    expandedNodes,
    searchTerm,
    searchResults,
    onSearchChange,
    onGalleryClick,
    onToggleExpand,
    onRootClick,
}: SidebarProps) {
    const showSearchResults = searchTerm.trim().length > 0;
    
    return (
        <aside className="w-64 bg-white/40 backdrop-blur-sm border-r border-white/50 flex flex-col h-full">
            {/* 搜索框 */}
            <div className="p-4 border-b border-white/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8eb69b]" />
                    <input
                        type="text"
                        placeholder="搜索图集..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-white/60 rounded-xl text-sm font-bold text-[#5d4037] placeholder:text-[#8eb69b]/50 border-2 border-white focus:border-[#f8b195] focus:outline-none transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/50 rounded-full"
                        >
                            <X size={14} className="text-[#8eb69b]" />
                        </button>
                    )}
                </div>
            </div>
            
            {/* 图集树 */}
            <div className="flex-1 overflow-y-auto p-2">
                {/* 根目录 */}
                {!showSearchResults && (
                    <div
                        onClick={onRootClick}
                        className={`
                            flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all mb-2
                            ${!currentGallery 
                                ? 'bg-[#f8b195]/20 text-[#f8b195]' 
                                : 'hover:bg-white/40 text-[#5d4037]'
                            }
                        `}
                    >
                        <FolderOpen size={18} className="text-[#f8b195]" />
                        <span className="text-sm font-bold">全部图集</span>
                    </div>
                )}
                
                {/* 搜索结果 */}
                {showSearchResults ? (
                    <div>
                        <div className="text-xs text-[#8eb69b] px-2 py-1 mb-2">
                            找到 {searchResults.length} 个结果
                        </div>
                        {searchResults.map(gallery => (
                            <div
                                key={gallery.id}
                                onClick={() => onGalleryClick(gallery)}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-white/40 text-[#5d4037] transition-all"
                            >
                                <ImageIcon size={14} className="text-[#8eb69b]" />
                                <span className="text-sm truncate flex-1">{gallery.title}</span>
                            </div>
                        ))}
                        {searchResults.length === 0 && (
                            <div className="text-center py-4 text-[#8eb69b] text-sm">
                                未找到匹配结果
                            </div>
                        )}
                    </div>
                ) : (
                    /* 图集树 */
                    <div>
                        {galleryTree.map(gallery => (
                            <GalleryTreeItem
                                key={gallery.id}
                                gallery={gallery}
                                level={0}
                                currentGallery={currentGallery}
                                expandedNodes={expandedNodes}
                                onGalleryClick={onGalleryClick}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
