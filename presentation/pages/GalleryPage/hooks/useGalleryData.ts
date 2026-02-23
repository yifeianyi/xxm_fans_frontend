/**
 * useGalleryData - 图集数据Hook
 *
 * @module GalleryPage/hooks
 * @description 管理图集数据的状态和操作
 *
 * @example
 * ```tsx
 * const {
 *   galleryTree,
 *   currentGallery,
 *   images,
 *   breadcrumbs,
 *   loading,
 *   lightboxImage,
 *   currentImageIndex,
 *   sidebarOpen,
 *   expandedNodes,
 *   searchTerm,
 *   searchResults,
 *   childrenImagesGroups,
 *   allChildrenImages,
 *   loadGalleryTree,
 *   handleGalleryClick,
 *   handleBreadcrumbClick,
 *   handleImageClick,
 *   toggleExpand,
 *   updateBreadcrumbs,
 *   handlePreviousImage,
 *   handleNextImage,
 *   setLightboxImage,
 *   setSidebarOpen,
 *   setSearchTerm
 * } = useGalleryData();
 * ```
 *
 * @category Hooks
 * @subcategory GalleryPage
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { galleryService } from '../../../../infrastructure/api/RealGalleryService';
import { Gallery, GalleryImage, Breadcrumb } from '../../../domain/types';

interface UseGalleryDataReturn {
  galleryTree: Gallery[];
  currentGallery: Gallery | null;
  images: GalleryImage[];
  breadcrumbs: Breadcrumb[];
  loading: boolean;
  lightboxImage: GalleryImage | null;
  currentImageIndex: number;
  sidebarOpen: boolean;
  expandedNodes: Set<string>;
  searchTerm: string;
  searchResults: Gallery[];
  showSearchResults: boolean;
  childrenImagesGroups: { gallery: Gallery; images: GalleryImage[] }[];
  allChildrenImages: GalleryImage[];
  loadGalleryTree: () => Promise<void>;
  handleGalleryClick: (gallery: Gallery) => Promise<void>;
  handleBreadcrumbClick: (breadcrumb: Breadcrumb) => void;
  handleImageClick: (img: GalleryImage, index: number, allImages?: GalleryImage[]) => void;
  toggleExpand: (galleryId: string) => void;
  updateBreadcrumbs: (gallery: Gallery) => Promise<void>;
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  setLightboxImage: (image: GalleryImage | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  setCurrentImageIndex: (index: number) => void;
}

export const useGalleryData = (): UseGalleryDataReturn => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();
  
  const [galleryTree, setGalleryTree] = useState<Gallery[]>([]);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Gallery[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [childrenImagesGroups, setChildrenImagesGroups] = useState<{ gallery: Gallery; images: GalleryImage[] }[]>([]);
  const [allChildrenImages, setAllChildrenImages] = useState<GalleryImage[]>([]);

  const hasLoadedRef = useRef(false);
  const loadingRef = useRef<string | null>(null);

  const loadGalleryTree = useCallback(async () => {
    if (galleryTree.length > 0) return;
    setLoading(true);
    const data = await galleryService.getGalleryTree();
    setGalleryTree(data);
    setLoading(false);
  }, [galleryTree.length]);

  const isLeafGallery = useCallback((gallery: Gallery): boolean => {
    return !gallery.children || gallery.children.length === 0;
  }, []);

  /**
   * 判断是否应该聚合显示子图集图片
   * 只有所有子节点都是叶子节点时，才聚合显示
   * @param gallery 当前图集
   * @returns 是否应该聚合
   */
  const shouldAggregateChildren = useCallback((gallery: Gallery): boolean => {
    if (!gallery.children || gallery.children.length === 0) {
      return false; // 本身就是叶子节点，不需要聚合
    }
    // 检查所有子节点是否都是叶子节点
    return gallery.children.every(child => isLeafGallery(child));
  }, [isLeafGallery]);

  const loadImages = useCallback(async (galleryId: string) => {
    if (loadingRef.current === galleryId) return;
    loadingRef.current = galleryId;
    setLoading(true);

    try {
      const data = await galleryService.getGalleryImages(galleryId);
      setImages(data);
      setCurrentImageIndex(0);
    } finally {
      setLoading(false);
      loadingRef.current = null;
    }
  }, []);

  const loadChildrenImages = useCallback(async (galleryId: string) => {
    if (loadingRef.current === galleryId) return;
    loadingRef.current = galleryId;
    setLoading(true);

    try {
      const data = await galleryService.getGalleryChildrenImages(galleryId);
      setChildrenImagesGroups(data);
      const allImages = data.flatMap(group => group.images);
      setAllChildrenImages(allImages);
    } finally {
      setLoading(false);
      loadingRef.current = null;
    }
  }, []);

  const updateBreadcrumbs = useCallback(async (gallery: Gallery) => {
    const data = await galleryService.getGalleryDetail(gallery.id);
    if (data && data.breadcrumbs) {
      setBreadcrumbs(data.breadcrumbs);
    }
  }, []);

  /**
   * 在图集树中根据 ID 查找图集
   */
  const findGalleryById = useCallback((tree: Gallery[], id: string): Gallery | null => {
    for (const gallery of tree) {
      if (gallery.id === id) return gallery;
      if (gallery.children) {
        const found = findGalleryById(gallery.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleGalleryClick = useCallback(async (gallery: Gallery, updateUrl: boolean = true) => {
    if (currentGallery?.id === gallery.id) return;

    setSearchTerm('');
    setShowSearchResults(false);
    setCurrentGallery(gallery);
    await updateBreadcrumbs(gallery);

    // 更新 URL 路由
    if (updateUrl) {
      navigate(`/albums/${gallery.id}`);
    }

    if (isLeafGallery(gallery)) {
      // 叶子节点：直接加载图片
      await loadImages(gallery.id);
      setChildrenImagesGroups([]);
    } else if (shouldAggregateChildren(gallery)) {
      // 所有子节点都是叶子节点：聚合显示子图集图片
      await loadChildrenImages(gallery.id);
      setImages([]);
    } else {
      // 有非叶子子节点：不聚合，显示子图集列表
      setImages([]);
      setChildrenImagesGroups([]);
    }
  }, [currentGallery, isLeafGallery, shouldAggregateChildren, loadImages, loadChildrenImages, updateBreadcrumbs, navigate]);

  const handleBreadcrumbClick = useCallback((breadcrumb: Breadcrumb) => {
    if (breadcrumb.id === currentGallery?.id) return;

    if (breadcrumb.id === 'root') {
      setCurrentGallery(null);
      setBreadcrumbs([]);
      setImages([]);
      navigate('/albums');
    } else {
      const gallery = findGalleryById(galleryTree, breadcrumb.id);
      if (gallery) handleGalleryClick(gallery);
    }
  }, [currentGallery, galleryTree, handleGalleryClick, navigate, findGalleryById]);

  const handleImageClick = useCallback((img: GalleryImage, index: number, allImages?: GalleryImage[]) => {
    setLightboxImage(img);

    if (allImages) {
      const globalIndex = allImages.findIndex(image => image.id === img.id);
      setCurrentImageIndex(globalIndex >= 0 ? globalIndex : 0);
      setImages(allImages);
    } else {
      setCurrentImageIndex(index);
    }
  }, []);

  const toggleExpand = useCallback((galleryId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(galleryId)) {
        newSet.delete(galleryId);
      } else {
        newSet.add(galleryId);
      }
      return newSet;
    });
  }, []);

  const handlePreviousImage = useCallback(() => {
    if (images.length === 0) return;
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(images[newIndex]);
  }, [images, currentImageIndex]);

  const handleNextImage = useCallback(() => {
    if (images.length === 0) return;
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setLightboxImage(images[newIndex]);
  }, [images, currentImageIndex]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadGalleryTree();
    }
  }, [loadGalleryTree]);

  // 监听 URL 参数变化，自动加载对应图集
  useEffect(() => {
    if (galleryTree.length === 0) return;
    
    if (galleryId) {
      // URL 中有 galleryId，加载对应图集
      const gallery = findGalleryById(galleryTree, galleryId);
      if (gallery && gallery.id !== currentGallery?.id) {
        // 使用 updateUrl=false 避免重复更新 URL
        handleGalleryClick(gallery, false);
      }
    } else {
      // URL 中没有 galleryId，重置到根节点
      if (currentGallery !== null) {
        setCurrentGallery(null);
        setBreadcrumbs([]);
        setImages([]);
        setChildrenImagesGroups([]);
      }
    }
  }, [galleryId, galleryTree, currentGallery, findGalleryById, handleGalleryClick]);

  useEffect(() => {
    if (currentGallery) {
      const path = findPathToGallery(galleryTree, currentGallery.id, []);
      if (path.length > 0) {
        setExpandedNodes(new Set(path.map(g => g.id)));
      }
    }
  }, [currentGallery, galleryTree]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchGalleries(galleryTree, searchTerm.trim().toLowerCase());
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm, galleryTree]);

  const findPathToGallery = (tree: Gallery[], targetId: string, path: Gallery[]): Gallery[] => {
    for (const gallery of tree) {
      const currentPath = [...path, gallery];
      if (gallery.id === targetId) {
        return currentPath;
      }
      if (gallery.children) {
        const result = findPathToGallery(gallery.children, targetId, currentPath);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };

  const searchGalleries = (tree: Gallery[], term: string, results: Gallery[] = []): Gallery[] => {
    for (const gallery of tree) {
      if (gallery.title.toLowerCase().includes(term) || gallery.description.toLowerCase().includes(term)) {
        results.push(gallery);
      }
      if (gallery.children) {
        searchGalleries(gallery.children, term, results);
      }
    }
    return results;
  };

  return {
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
    updateBreadcrumbs,
    handlePreviousImage,
    handleNextImage,
    setLightboxImage,
    setSidebarOpen,
    setSearchTerm,
    setCurrentImageIndex
  };
};

export default useGalleryData;