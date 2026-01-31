/**
 * GalleryHeader - 图集页面头部组件
 *
 * @module GalleryPage/components
 * @description 包含侧边栏切换、面包屑导航、搜索框、快速选择器
 *
 * @component
 * @example
 * ```tsx
 * <GalleryHeader
 *   breadcrumbs={breadcrumbs}
 *   galleryTree={galleryTree}
 *   currentGallery={currentGallery}
 *   searchTerm={searchTerm}
 *   onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
 *   onBreadcrumbClick={handleBreadcrumbClick}
 *   onSearchChange={setSearchTerm}
 *   onSearchResultClick={handleGalleryClick}
 *   onQuickSelect={handleGalleryClick}
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
import { Gallery, Breadcrumb } from '../../../domain/types';
import { Menu, Search, ChevronRight } from 'lucide-react';

interface GalleryHeaderProps {
  breadcrumbs: Breadcrumb[];
  galleryTree: Gallery[];
  currentGallery: Gallery | null;
  searchTerm: string;
  searchResults: Gallery[];
  showSearchResults: boolean;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onBreadcrumbClick: (breadcrumb: Breadcrumb) => void;
  onSearchChange: (term: string) => void;
  onSearchResultClick: (gallery: Gallery) => void;
  onQuickSelect: (gallery: Gallery) => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  breadcrumbs,
  galleryTree,
  currentGallery,
  searchTerm,
  searchResults,
  showSearchResults,
  sidebarOpen,
  onSidebarToggle,
  onBreadcrumbClick,
  onSearchChange,
  onSearchResultClick,
  onQuickSelect
}) => {
  const renderQuickSelectOptions = (galleries: Gallery[], level: number = 0): JSX.Element[] => {
    return galleries.flatMap(gallery => {
      const indent = '　'.repeat(level);
      const prefix = gallery.children?.length ? '📁 ' : '📄 ';

      return [
        <option key={gallery.id} value={gallery.id}>
          {indent}{prefix}{gallery.title} ({gallery.imageCount})
        </option>,
        ...(gallery.children?.length ? renderQuickSelectOptions(gallery.children, level + 1) : [])
      ];
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-[#8eb69b]" />
        </button>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          <button
            onClick={() => onBreadcrumbClick({ id: 'root', title: '首页' })}
            className="text-[#8eb69b] hover:text-[#f8b195] transition-colors whitespace-nowrap"
          >
            首页
          </button>
          {breadcrumbs.map((breadcrumb, idx) => (
            <React.Fragment key={breadcrumb.id}>
              <ChevronRight size={16} className="text-[#8eb69b]/50 flex-shrink-0" />
              <button
                onClick={() => onBreadcrumbClick(breadcrumb)}
                className={`font-black transition-colors whitespace-nowrap ${
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="搜索图集..."
            className="w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8eb69b] text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto z-50">
              {searchResults.map(gallery => (
                <div
                  key={gallery.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSearchResultClick(gallery)}
                >
                  <div className="font-medium text-[#4a3728]">{gallery.title}</div>
                  <div className="text-xs text-gray-500">{gallery.folderPath}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8eb69b] text-sm bg-white"
          value={currentGallery?.id || ''}
          onChange={(e) => {
            if (e.target.value) {
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
              const gallery = findGallery(galleryTree, e.target.value);
              if (gallery) onQuickSelect(gallery);
            }
          }}
        >
          <option value="">快速跳转</option>
          {renderQuickSelectOptions(galleryTree)}
        </select>
      </div>
    </header>
  );
};

export default GalleryHeader;