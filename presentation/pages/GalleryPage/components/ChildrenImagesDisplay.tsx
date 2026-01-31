/**
 * ChildrenImagesDisplay - 子图集图片显示组件
 *
 * @module GalleryPage/components
 * @description 显示父图集下所有子图集的图片
 *
 * @component
 * @example
 * ```tsx
 * <ChildrenImagesDisplay
 *   childrenGroups={childrenImagesGroups}
 *   allChildrenImages={allChildrenImages}
 *   onImageClick={handleImageClick}
 * />
 * ```
 *
 * @category Components
 * @subcategory GalleryPage
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { Gallery, GalleryImage } from '../../../domain/types';
import ImageGrid from './ImageGrid';

interface ChildrenImagesDisplayProps {
  childrenGroups: { gallery: Gallery; images: GalleryImage[] }[];
  allChildrenImages: GalleryImage[];
  onImageClick: (img: GalleryImage, index: number, allImages?: GalleryImage[]) => void;
}

const ChildrenImagesDisplay: React.FC<ChildrenImagesDisplayProps> = ({
  childrenGroups,
  allChildrenImages,
  onImageClick
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {childrenGroups.map((group, groupIndex) => (
        <div key={group.gallery.id} className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-[#4a3728]">{group.gallery.title}</h3>
            <span className="px-3 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-full text-xs font-black uppercase tracking-widest">
              {group.images.length} 张
            </span>
          </div>

          <ImageGrid images={group.images} onImageClick={onImageClick} allImages={allChildrenImages} />

          {groupIndex < childrenGroups.length - 1 && (
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
              <span className="text-[#f8b195]/40 text-xs font-black uppercase tracking-[0.3em]">↓</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChildrenImagesDisplay;