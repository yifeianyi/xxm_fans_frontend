/**
 * ImageGrid - 图片网格组件
 *
 * @module GalleryPage/components
 * @description 显示图片九宫格布局
 *
 * @component
 * @example
 * ```tsx
 * <ImageGrid images={images} onImageClick={handleImageClick} />
 * ```
 *
 * @category Components
 * @subcategory GalleryPage
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { GalleryImage } from '../../../domain/types';
import { Maximize2, Play } from 'lucide-react';
import LazyImage from '../../../components/common/LazyImage';

interface ImageGridProps {
  images: GalleryImage[];
  onImageClick: (img: GalleryImage, index: number, allImages?: GalleryImage[]) => void;
  allImages?: GalleryImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick, allImages }) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-4xl mx-auto">
      {images.map((img, idx) => (
        <div
          key={img.id}
          className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => onImageClick(img, idx, allImages)}
        >
          <div className="w-full h-full overflow-hidden bg-[#fef5f0]">
            {img.isVideo ? (
              <video
                src={img.url}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="none"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            ) : (
              <div className="w-full h-full group-hover:scale-110 transition-transform duration-500">
                <LazyImage
                  src={img.thumbnail_url || img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {(img.isGif || img.isVideo) && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Play size={10} fill="white" />
                <span className="text-[10px] font-bold">{img.isVideo ? 'VIDEO' : 'GIF'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 size={24} className="text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;