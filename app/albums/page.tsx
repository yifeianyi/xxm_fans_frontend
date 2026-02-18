'use client';

import React from 'react';
import { Image as ImageIcon, Folder, ChevronRight } from 'lucide-react';
import { ErrorBoundary } from '@/app/shared/components';
import { useAlbumsData } from './hooks/useAlbumsData';
import { Sidebar } from './components/Sidebar';
import { ImageGrid } from './components/ImageGrid';
import { ImageViewer } from './components/ImageViewer';

/**
 * 图集卡片组件
 */
function GalleryCard({
    gallery,
    onClick,
}: {
    gallery: { id: string; title: string; description?: string; coverUrl?: string; coverThumbnailUrl?: string; imageCount: number; isLeaf: boolean };
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="group bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
            {/* 封面 */}
            <div className="aspect-[4/3] relative overflow-hidden">
                {gallery.coverUrl ? (
                    <img
                        src={gallery.coverThumbnailUrl || gallery.coverUrl}
                        alt={gallery.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/20 flex items-center justify-center">
                        <ImageIcon size={48} className="text-[#f8b195]/50" />
                    </div>
                )}
                
                {/* 图片数量 */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1">
                    <ImageIcon size={12} />
                    {gallery.imageCount}
                </div>
                
                {/* 文件夹标记 */}
                {!gallery.isLeaf && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#f8b195] rounded-full text-white text-xs font-bold flex items-center gap-1">
                        <Folder size={12} />
                        文件夹
                    </div>
                )}
            </div>
            
            {/* 信息 */}
            <div className="p-5">
                <h3 className="font-black text-[#5d4037] text-lg mb-2 truncate group-hover:text-[#f8b195] transition-colors">
                    {gallery.title}
                </h3>
                {gallery.description && (
                    <p className="text-sm text-[#8eb69b] line-clamp-2 mb-3">{gallery.description}</p>
                )}
            </div>
        </div>
    );
}

/**
 * 面包屑组件
 */
function Breadcrumb({
    items,
    onRootClick,
}: {
    items: Array<{ id: string; title: string }>;
    onRootClick: () => void;
}) {
    return (
        <nav className="flex items-center gap-2 text-sm flex-wrap">
            <button
                onClick={onRootClick}
                className="text-[#8eb69b] hover:text-[#f8b195] font-bold transition-colors"
            >
                全部图集
            </button>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <ChevronRight size={16} className="text-[#8eb69b]/50 flex-shrink-0" />
                    {index === items.length - 1 ? (
                        <span className="text-[#5d4037] font-bold">{item.title}</span>
                    ) : (
                        <span className="text-[#8eb69b]">{item.title}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

/**
 * 加载状态
 */
function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin" />
            <p className="mt-4 text-[#8eb69b] font-bold">正在加载...</p>
        </div>
    );
}

/**
 * 空状态
 */
function EmptyState({ message = '暂无内容' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-[#8eb69b]">
            <ImageIcon size={64} className="mb-4 opacity-30" />
            <p className="font-bold text-lg">{message}</p>
        </div>
    );
}

export default function AlbumsPage() {
    const {
        galleryTree,
        currentGallery,
        images,
        breadcrumbs,
        loading,
        loadingImages,
        expandedNodes,
        searchTerm,
        searchResults,
        lightboxOpen,
        currentImageIndex,
        setSearchTerm,
        handleGalleryClick,
        handleRootClick,
        toggleExpand,
        handleImageClick,
        handleCloseLightbox,
        handlePreviousImage,
        handleNextImage,
        navigateToImage,
    } = useAlbumsData();
    
    // 获取当前显示的子图集
    const displayGalleries = React.useMemo(() => {
        if (currentGallery?.children) {
            return currentGallery.children;
        }
        return galleryTree;
    }, [currentGallery, galleryTree]);
    
    return (
        <ErrorBoundary>
            <div className="h-[calc(100vh-64px)] flex bg-[#fef5f0]">
                {/* 侧边栏 */}
                <Sidebar
                    galleryTree={galleryTree}
                    currentGallery={currentGallery}
                    expandedNodes={expandedNodes}
                    searchTerm={searchTerm}
                    searchResults={searchResults}
                    onSearchChange={setSearchTerm}
                    onGalleryClick={handleGalleryClick}
                    onToggleExpand={toggleExpand}
                    onRootClick={handleRootClick}
                />
                
                {/* 主内容区 */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* 头部 */}
                    <div className="bg-white/40 backdrop-blur-sm border-b border-white/50 px-6 py-4">
                        {/* 面包屑 */}
                        {(currentGallery || breadcrumbs.length > 0) && (
                            <div className="mb-3">
                                <Breadcrumb items={breadcrumbs} onRootClick={handleRootClick} />
                            </div>
                        )}
                        
                        {/* 标题 */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-[#5d4037]">
                                    {currentGallery?.title || '满の图册'}
                                </h1>
                                {currentGallery?.description && (
                                    <p className="text-[#8eb69b] mt-1 text-sm">{currentGallery.description}</p>
                                )}
                            </div>
                            {currentGallery?.isLeaf && (
                                <span className="text-sm text-[#8eb69b] font-bold">
                                    {images.length} 张图片
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <LoadingState />
                        ) : currentGallery?.isLeaf ? (
                            // 叶子节点 - 显示图片
                            loadingImages ? (
                                <LoadingState />
                            ) : (
                                <ImageGrid images={images} onImageClick={handleImageClick} />
                            )
                        ) : displayGalleries.length > 0 ? (
                            // 非叶子节点 - 显示子图集
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayGalleries.map((gallery) => (
                                    <GalleryCard
                                        key={gallery.id}
                                        gallery={gallery}
                                        onClick={() => handleGalleryClick(gallery)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message={currentGallery ? '该图集暂无子图集' : '暂无图集'} />
                        )}
                    </div>
                </main>
                
                {/* 图片查看器 */}
                <ImageViewer
                    images={images}
                    currentIndex={currentImageIndex}
                    isOpen={lightboxOpen}
                    onClose={handleCloseLightbox}
                    onPrevious={handlePreviousImage}
                    onNext={handleNextImage}
                    onNavigate={navigateToImage}
                />
            </div>
        </ErrorBoundary>
    );
}
