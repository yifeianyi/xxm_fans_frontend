/**
 * GalleryCard - 图集卡片组件
 *
 * @module GalleryPage/components
 * @description 显示单个图集的卡片
 *
 * @component
 * @example
 * ```tsx
 * <GalleryCard gallery={gallery} onClick={handleGalleryClick} />
 * ```
 *
 * @category Components
 * @subcategory GalleryPage
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { Gallery } from '../../../domain/types';
import { ArrowLeft } from 'lucide-react';
import LazyImage from '../../../components/common/LazyImage';

interface GalleryCardProps {
  gallery: Gallery;
  onClick: (gallery: Gallery) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ gallery, onClick }) => {
  return (
    <div
      className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      onClick={() => onClick(gallery)}
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-[#f8b195]/20 to-[#8eb69b]/20">
        <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
          <LazyImage
            src={gallery.coverUrl || '/placeholder.jpg'}
            alt={gallery.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
      </div>

      <div className="p-4 space-y-3">
        {gallery.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {gallery.tags.map(t => (
              <span
                key={t}
                className="px-2 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-md text-[9px] font-black uppercase tracking-widest"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-lg font-black text-[#4a3728] line-clamp-1">
          {gallery.title}
        </h2>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-bold">{gallery.imageCount} 张</span>
          <ArrowLeft
            className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 text-[#8eb69b]"
            size={16}
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;