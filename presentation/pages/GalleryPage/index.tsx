/**
 * GalleryPage - 图集页面组件（重构后）
 *
 * @module GalleryPage
 * @description 图集浏览页面，支持树形导航、图片查看、搜索等功能
 *
 * @component
 * @example
 * ```tsx
 * <GalleryPage />
 * ```
 *
 * @category Components
 * @subcategory Pages
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Star, Heart, Camera, Sun } from 'lucide-react';
import GallerySidebar from './components/GallerySidebar';
import GalleryHeader from './components/GalleryHeader';
import GalleryGrid from './components/GalleryGrid';
import ImageGrid from './components/ImageGrid';
import ImageViewer from './components/ImageViewer';
import ChildrenImagesDisplay from './components/ChildrenImagesDisplay';
import WelcomeBanner from './components/WelcomeBanner';
import { useGalleryData } from './hooks/useGalleryData';
import { PageDecorations } from '../../components/common/PageDecorations';

const GalleryPage: React.FC = () => {
  const {
    galleryTree,
    currentGallery,
    images,
    breadcrumbs,
    loading,
    lightboxImage,
    currentImageIndex,
    sidebarOpen,
    expandedNodes,
    searchTerm,
    searchResults,
    showSearchResults,
    childrenImagesGroups,
    allChildrenImages,
    loadGalleryTree,
    handleGalleryClick,
    handleBreadcrumbClick,
    handleImageClick,
    toggleExpand,
    handlePreviousImage,
    handleNextImage,
    setLightboxImage,
    setSidebarOpen,
    setSearchTerm,
    setCurrentImageIndex
  } = useGalleryData();

  const isLeafGallery = (gallery: any): boolean => {
    return !gallery.children || gallery.children.length === 0;
  };

  return (
    <>
      <Helmet>
        <title>
          {currentGallery
            ? `${currentGallery.title} - 咻咻满图集 | 小满虫之家`
            : '咻咻满图集 - 粉丝二创、活动照片、生活瞬间 | 小满虫之家'
          }
        </title>
        <meta
          name="description"
          content={
            currentGallery
              ? `浏览${currentGallery.title}，收录${currentGallery.imageCount}张精彩图片。${currentGallery.description || ''}`
              : '欢迎来到咻咻满的图集，这里汇集了粉丝二创作品、活动照片和生活瞬间。图集持续整理更新中，欢迎各位小满虫投稿和分享。'
          }
        />
      </Helmet>

      {/* 页面装饰 - 图集主题 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDuration: '3s' }}>
          <Star className="w-6 h-6 text-yellow-400/40" />
        </div>
        <div className="absolute top-32 left-24 animate-pulse" style={{ animationDelay: '0.4s' }}>
          <Sparkles className="w-5 h-5 text-[#f8b195]/40" />
        </div>
        <div className="absolute top-24 right-16 animate-spin" style={{ animationDuration: '4s' }}>
          <Sun className="w-8 h-8 text-orange-300/30" />
        </div>
        <div className="absolute top-40 right-8 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <Heart className="w-5 h-5 text-[#f67280]/30 fill-[#f67280]/30" />
        </div>
        <div className="absolute bottom-40 right-16 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <Camera className="w-6 h-6 text-[#8eb69b]/30" />
        </div>
        <div className="absolute bottom-32 left-20 animate-pulse" style={{ animationDelay: '0.8s' }}>
          <Sparkles className="w-5 h-5 text-pink-300/30" />
        </div>
      </div>

      <div className="flex h-screen bg-[#fef5f0]">
        <GallerySidebar
          galleryTree={galleryTree}
          currentGallery={currentGallery}
          expandedNodes={expandedNodes}
          onToggle={toggleExpand}
          onSelect={handleGalleryClick}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <GalleryHeader
            breadcrumbs={breadcrumbs}
            galleryTree={galleryTree}
            currentGallery={currentGallery}
            searchTerm={searchTerm}
            searchResults={searchResults}
            showSearchResults={showSearchResults}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            onBreadcrumbClick={handleBreadcrumbClick}
            onSearchChange={setSearchTerm}
            onSearchResultClick={(gallery) => {
              handleGalleryClick(gallery);
              setSearchTerm('');
            }}
            onQuickSelect={handleGalleryClick}
          />

          <div className="flex-1 overflow-y-auto p-6">
            {!currentGallery && <WelcomeBanner />}

            {loading && (
              <div className="py-48 flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-8 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin"></div>
                <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs">正在加载...</span>
              </div>
            )}

            {!loading && currentGallery && isLeafGallery(currentGallery) && images.length > 0 && (
              <ImageGrid images={images} onImageClick={handleImageClick} />
            )}

            {!loading && currentGallery && !isLeafGallery(currentGallery) && childrenImagesGroups.length > 0 && (
              <ChildrenImagesDisplay
                childrenGroups={childrenImagesGroups}
                allChildrenImages={allChildrenImages}
                onImageClick={handleImageClick}
              />
            )}

            {!loading && currentGallery && !isLeafGallery(currentGallery) && childrenImagesGroups.length === 0 && currentGallery.children && (
              <GalleryGrid galleries={currentGallery.children} onGalleryClick={handleGalleryClick} />
            )}

            {!loading && !currentGallery && (
              <GalleryGrid galleries={galleryTree} onGalleryClick={handleGalleryClick} />
            )}
          </div>
        </main>

        {lightboxImage && (
          <ImageViewer
            images={images}
            currentIndex={currentImageIndex}
            onClose={() => setLightboxImage(null)}
            onPrevious={handlePreviousImage}
            onNext={handleNextImage}
            onIndexChange={setCurrentImageIndex}
            onSelectImage={setLightboxImage}
          />
        )}
      </div>
    </>
  );
};

export default GalleryPage;