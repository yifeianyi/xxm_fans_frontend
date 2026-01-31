/**
 * GallerySidebar - 图集侧边栏组件
 *
 * @module GalleryPage/components
 * @description 显示图集树形导航
 *
 * @component
 * @example
 * ```tsx
 * <GallerySidebar
 *   galleryTree={galleryTree}
 *   currentGallery={currentGallery}
 *   expandedNodes={expandedNodes}
 *   onToggle={toggleExpand}
 *   onSelect={handleGalleryClick}
 *   isOpen={sidebarOpen}
 *   onClose={() => setSidebarOpen(false)}
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
import { Gallery } from '../../../domain/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface GallerySidebarProps {
  galleryTree: Gallery[];
  currentGallery: Gallery | null;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (gallery: Gallery) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 树形节点组件
 */
const GalleryTreeNode: React.FC<{
  gallery: Gallery;
  currentGallery: Gallery | null;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (gallery: Gallery) => void;
  level: number;
}> = ({ gallery, currentGallery, expandedNodes, onToggle, onSelect, level }) => {
  const isExpanded = expandedNodes.has(gallery.id);
  const hasChildren = gallery.children && gallery.children.length > 0;
  const isActive = currentGallery?.id === gallery.id;
  const paddingLeft = level * 16;

  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
          isActive ? 'bg-[#f8b195] text-white' : 'hover:bg-gray-100 text-[#4a3728]'
        }`}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            onToggle(gallery.id);
          }
          onSelect(gallery);
        }}
      >
        {hasChildren && (
          <span className="text-xs flex-shrink-0">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}

        <span className="font-medium flex-1 truncate">{gallery.title}</span>

        <span className="text-xs flex-shrink-0 opacity-60">({gallery.imageCount})</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="border-l border-gray-200 ml-4">
          {gallery.children!.map(child => (
            <GalleryTreeNode
              key={child.id}
              gallery={child}
              currentGallery={currentGallery}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 侧边栏组件
 */
const GallerySidebar: React.FC<GallerySidebarProps> = ({
  galleryTree,
  currentGallery,
  expandedNodes,
  onToggle,
  onSelect,
  isOpen,
  onClose
}) => {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-black text-[#4a3728]">图集导航</h2>
            <p className="text-xs text-gray-500 mt-1">点击展开/收起</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {galleryTree.map(gallery => (
              <GalleryTreeNode
                key={gallery.id}
                gallery={gallery}
                currentGallery={currentGallery}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
                onSelect={onSelect}
                level={0}
              />
            ))}
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default GallerySidebar;