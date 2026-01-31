/**
 * GalleryGrid - 图集网格组件
 *
 * @module GalleryPage/components
 * @description 显示图集网格布局
 *
 * @component
 * @example
 * ```tsx
 * <GalleryGrid galleries={galleries} onGalleryClick={handleGalleryClick} />
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
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  galleries: Gallery[];
  onGalleryClick: (gallery: Gallery) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ galleries, onGalleryClick }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {galleries.map(gallery => (
          <GalleryCard
            key={gallery.id}
            gallery={gallery}
            onClick={onGalleryClick}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;