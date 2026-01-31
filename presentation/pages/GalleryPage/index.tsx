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
import GallerySidebar from './components/GallerySidebar';
import GalleryHeader from './components/GalleryHeader';
import GalleryGrid from './components/GalleryGrid';
import ImageGrid from './components/ImageGrid';
import ImageViewer from './components/ImageViewer';
import ChildrenImagesDisplay from './components/ChildrenImagesDisplay';
import WelcomeBanner from './components/WelcomeBanner';
import { useGalleryData } from './hooks/useGalleryData';

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
    setSearchTerm
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