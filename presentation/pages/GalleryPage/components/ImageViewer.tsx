/**
 * ImageViewer - 图片查看器（灯箱）组件
 *
 * @module GalleryPage/components
 * @description 全屏查看图片，支持切换和缩略图导航
 *
 * @component
 * @example
 * ```tsx
 * <ImageViewer
 *   images={images}
 *   currentIndex={currentIndex}
 *   onClose={() => setLightboxImage(null)}
 *   onPrevious={handlePreviousImage}
 *   onNext={handleNextImage}
 *   onIndexChange={setCurrentImageIndex}
 *   onSelectImage={setLightboxImage}
 * />
 * ```
 *
 * @category Components
 * @subcategory GalleryPage
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import React, { useRef, useEffect } from 'react';
import { GalleryImage } from '../../../domain/types';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface ImageViewerProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onIndexChange: (index: number) => void;
  onSelectImage: (image: GalleryImage) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  onIndexChange,
  onSelectImage
}) => {
  const currentImage = images[currentIndex];
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrevious, onNext, onClose]);

  useEffect(() => {
    if (thumbnailsContainerRef.current && images.length > 0) {
      const thumbnailElements = thumbnailsContainerRef.current.querySelectorAll('[data-thumbnail-index]');
      const currentThumbnail = thumbnailElements[currentIndex] as HTMLElement;

      if (currentThumbnail) {
        setTimeout(() => {
          currentThumbnail.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }, 100);
      }
    }
  }, [currentIndex, images]);

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col" onClick={onClose}>
      <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10">
        <X size={40} />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-3 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-3 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="flex-1 flex items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
        <div className="relative max-w-full max-h-full flex flex-col items-center gap-8">
          {currentImage.isVideo ? (
            <video
              src={currentImage.url}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
              controls
              autoPlay
              loop
              preload="auto"
            />
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
            />
          )}
          <div className="text-center text-white space-y-2">
            <h3 className="text-3xl font-black tracking-tight">{currentImage.title}</h3>
            <p className="text-white/40 font-bold tracking-widest uppercase text-sm">
              {currentImage.filename}
              {images.length > 1 && ` (${currentIndex + 1} / ${images.length})`}
            </p>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div
          className="h-32 bg-black/50 border-t border-white/10 flex items-center overflow-x-auto"
          ref={thumbnailsContainerRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 px-4">
            {images.map((img, idx) => (
              <button
                key={img.id}
                data-thumbnail-index={idx}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                  idx === currentIndex
                    ? 'ring-2 ring-[#f8b195] scale-110'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
                onClick={() => {
                  onIndexChange(idx);
                  onSelectImage(images[idx]);
                }}
              >
                {img.isVideo ? (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <Play size={20} fill="white" className="text-white" />
                  </div>
                ) : (
                  <img
                    src={img.thumbnailUrl || img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {idx === currentIndex && (
                  <div className="absolute inset-0 bg-[#f8b195]/20"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;