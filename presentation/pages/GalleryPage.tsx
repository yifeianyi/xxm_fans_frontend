import React, { useState, useEffect } from 'react';
import { galleryService } from '../../infrastructure/api/RealGalleryService';
import { Gallery, GalleryImage, Breadcrumb } from '../../domain/types';
import { Camera, ArrowLeft, Maximize2, X, ChevronRight, Play, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const GalleryPage: React.FC = () => {
  const [galleryTree, setGalleryTree] = useState<Gallery[]>([]);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // 加载图集树
  useEffect(() => {
    loadGalleryTree();
  }, []);

  const loadGalleryTree = async () => {
    setLoading(true);
    const data = await galleryService.getGalleryTree();
    setGalleryTree(data);
    setLoading(false);
  };

  // 判断是否为叶子节点
  const isLeafGallery = (gallery: Gallery): boolean => {
    return !gallery.children || gallery.children.length === 0;
  };

  // 处理图集点击
  const handleGalleryClick = async (gallery: Gallery) => {
    if (isLeafGallery(gallery)) {
      // 叶子节点：加载图片
      setCurrentGallery(gallery);
      await loadImages(gallery.id);
      updateBreadcrumbs(gallery);
    } else {
      // 非叶子节点：进入子图集
      setCurrentGallery(gallery);
      updateBreadcrumbs(gallery);
    }
  };

  // 加载图片
  const loadImages = async (galleryId: string) => {
    setLoading(true);
    const data = await galleryService.getGalleryImages(galleryId);
    setImages(data);
    setCurrentImageIndex(0); // 重置图片索引
    setLoading(false);
  };

  // 更新面包屑
  const updateBreadcrumbs = async (gallery: Gallery) => {
    const data = await galleryService.getGalleryDetail(gallery.id);
    if (data && data.breadcrumbs) {
      setBreadcrumbs(data.breadcrumbs);
    }
  };

  // 返回上级
  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (breadcrumb.id === currentGallery?.id) return;

    if (breadcrumb.id === 'root') {
      setCurrentGallery(null);
      setBreadcrumbs([]);
      setImages([]);
    } else {
      // 查找对应的图集
      const findGallery = (tree: Gallery[], id: string): Gallery | null => {
        for (const gallery of tree) {
          if (gallery.id === id) return gallery;
          if (gallery.children) {
            const found = findGallery(gallery.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const gallery = findGallery(galleryTree, breadcrumb.id);
      if (gallery) {
        handleGalleryClick(gallery);
      }
    }
  };

  // 图片点击处理
  const handleImageClick = (img: GalleryImage, index: number) => {
    setLightboxImage(img);
    setCurrentImageIndex(index);
  };

  // 上一张图片
  const handlePreviousImage = () => {
    if (images.length === 0) return;
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(images[newIndex]);
  };

  // 下一张图片
  const handleNextImage = () => {
    if (images.length === 0) return;
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(images[newIndex]);
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePreviousImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case 'Escape':
          setLightboxImage(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentImageIndex, images]);

  // 返回列表
  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      handleBreadcrumbClick(breadcrumbs[breadcrumbs.length - 2]);
    } else {
      setCurrentGallery(null);
      setBreadcrumbs([]);
      setImages([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#fef5f0] text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-sm">
          <Camera size={18} />
          <span className="text-xs font-black uppercase tracking-[0.4em]">Forest Collection</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#4a3728] tracking-tighter">
          {currentGallery ? currentGallery.title : '森林图册'}
        </h1>
        <p className="text-[#8eb69b] font-bold text-lg max-w-2xl mx-auto">
          {currentGallery ? currentGallery.description : '每一帧定格，都是藏在时光信封里的绝色。'}
        </p>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => handleBreadcrumbClick({id: 'root', title: '首页'})}
            className="text-[#8eb69b] hover:text-[#f8b195] transition-colors"
          >
            首页
          </button>
          {breadcrumbs.map((breadcrumb, idx) => (
            <React.Fragment key={breadcrumb.id}>
              <ChevronRight size={16} className="text-[#8eb69b]/50" />
              <button
                onClick={() => handleBreadcrumbClick(breadcrumb)}
                className={`font-black transition-colors ${
                  idx === breadcrumbs.length - 1
                    ? 'text-[#f8b195]'
                    : 'text-[#8eb69b] hover:text-[#f8b195]'
                }`}
              >
                {breadcrumb.title}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Back Button */}
      {currentGallery && (
        <button
          onClick={handleBack}
          className="group flex items-center gap-3 px-8 py-4 bg-white rounded-3xl text-[#8eb69b] font-black hover:text-[#f8b195] transition-all border-2 border-white shadow-sm hover:shadow-xl active:scale-95 mx-auto"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>返回</span>
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-48 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-8 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin"></div>
          <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs">正在加载...</span>
        </div>
      )}

      {/* Image Gallery (Leaf Node) */}
      {!loading && currentGallery && isLeafGallery(currentGallery) && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
              onClick={() => handleImageClick(img, idx)}
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#fef5f0]">
                {img.isVideo ? (
                  <video
                    src={img.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                )}
                {/* GIF 或视频标识 */}
                {(img.isGif || img.isVideo) && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <Play size={12} fill="white" />
                    <span className="text-xs font-bold">{img.isVideo ? 'VIDEO' : 'GIF'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 size={32} className="text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-[#4a3728] text-lg">{img.title}</h3>
                <p className="text-[#8eb69b] text-xs font-black uppercase tracking-wider mt-2">{img.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery List (Non-leaf Node) */}
      {!loading && currentGallery && !isLeafGallery(currentGallery) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {currentGallery.children?.map((gallery, idx) => (
            <GalleryCard key={gallery.id} gallery={gallery} onClick={handleGalleryClick} />
          ))}
        </div>
      )}

      {/* Root Gallery List */}
      {!loading && !currentGallery && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {galleryTree.map((gallery, idx) => (
            <GalleryCard key={gallery.id} gallery={gallery} onClick={handleGalleryClick} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>

          {/* 左右切换按钮 */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousImage();
                }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
              >
                <ChevronRightIcon size={32} />
              </button>
            </>
          )}

          <div className="relative max-w-full max-h-full flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
            {lightboxImage.isVideo ? (
              <video
                src={lightboxImage.url}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
                controls
                autoPlay
                loop
              />
            ) : (
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
              />
            )}
            <div className="text-center text-white space-y-2">
              <h3 className="text-3xl font-black tracking-tight">{lightboxImage.title}</h3>
              <p className="text-white/40 font-bold tracking-widest uppercase text-sm">
                {lightboxImage.filename}
                {images.length > 1 && ` (${currentImageIndex + 1} / ${images.length})`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Gallery Card Component
const GalleryCard: React.FC<{gallery: Gallery, onClick: (gallery: Gallery) => void}> = ({ gallery, onClick }) => (
  <div
    className="group relative cursor-pointer"
    onClick={() => onClick(gallery)}
  >
    <div className="absolute inset-0 bg-white rounded-[3.5rem] rotate-3 translate-y-2 translate-x-1 shadow-sm opacity-50 transition-transform group-hover:rotate-6"></div>
    <div className="absolute inset-0 bg-white rounded-[3.5rem] -rotate-2 translate-y-1 shadow-sm opacity-80 transition-transform group-hover:-rotate-4"></div>
    <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-lg border-4 border-white transition-all group-hover:-translate-y-4">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={gallery.coverUrl}
          alt={gallery.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
        <div className="flex items-center gap-2">
          {gallery.tags.map(t => (
            <span key={t} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black uppercase tracking-widest">{t}</span>
          ))}
        </div>
        <h2 className="text-3xl font-black tracking-tight">{gallery.title}</h2>
        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <span className="text-xs font-bold opacity-80">{gallery.imageCount} 张瞬间</span>
          <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" size={18} />
        </div>
      </div>
    </div>
  </div>
);

export default GalleryPage;