/**
 * ImageGrid - 图片网格组件
 *
 * @module GalleryPage/components
 * @description 图片瀑布流展示，支持图片、GIF和视频
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
 * @version 2.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { GalleryImage } from '../../../domain/types';
import { Play } from 'lucide-react';
import LazyImage from '../../../components/common/LazyImage';

interface ImageGridProps {
  images: GalleryImage[];
  onImageClick: (img: GalleryImage, index: number, allImages?: GalleryImage[]) => void;
  allImages?: GalleryImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick, allImages }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#4a3728]/60">暂无图片</p>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick(image, index, allImages)}
          className="group block w-full break-inside-avoid mb-4"
        >
          <div className="relative rounded-xl overflow-hidden bg-[#fef5f0] border border-[#8eb69b]/10
                          hover:border-[#f8b195]/50 hover:shadow-lg hover:shadow-[#f8b195]/10
                          transition-all duration-300">
            {/* 媒体内容 */}
            <div className="relative">
              {image.isGif || image.isVideo ? (
                // GIF 和视频使用原生 img 标签
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.title || image.filename}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                // 普通图片使用懒加载
                <div className="w-full h-auto group-hover:scale-105 transition-transform duration-500">
                  <LazyImage
                    src={image.thumbnailUrl || image.url}
                    alt={image.title || image.filename}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              {/* 视频播放图标遮罩 */}
              {image.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-[#f67280] fill-[#f67280] ml-0.5" />
                  </div>
                </div>
              )}
            </div>
            
            {/* 悬停遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            flex items-end p-3">
              <span className="text-white text-sm font-medium line-clamp-1">
                {image.title || image.filename}
              </span>
            </div>

            {/* GIF/Video 标签 */}
            {(image.isGif || image.isVideo) && (
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#f67280] rounded text-xs text-white font-medium">
                {image.isGif ? 'GIF' : '视频'}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ImageGrid;
