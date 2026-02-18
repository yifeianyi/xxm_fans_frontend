'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Gallery, GalleryImage } from '@/app/domain/types';
import { galleryRepository } from '@/app/infrastructure/repositories';

interface UseAlbumsDataReturn {
    // 数据
    galleryTree: Gallery[];
    currentGallery: Gallery | null;
    images: GalleryImage[];
    breadcrumbs: Array<{ id: string; title: string }>;
    
    // 加载状态
    loading: boolean;
    loadingImages: boolean;
    
    // UI 状态
    expandedNodes: Set<string>;
    searchTerm: string;
    searchResults: Gallery[];
    
    // 图片查看器状态
    lightboxOpen: boolean;
    currentImageIndex: number;
    
    // 操作
    setSearchTerm: (term: string) => void;
    handleGalleryClick: (gallery: Gallery) => void;
    handleRootClick: () => void;
    toggleExpand: (galleryId: string) => void;
    handleImageClick: (index: number) => void;
    handleCloseLightbox: () => void;
    handlePreviousImage: () => void;
    handleNextImage: () => void;
    navigateToImage: (index: number) => void;
}

/**
 * 递归搜索图集
 */
const searchGalleries = (tree: Gallery[], term: string): Gallery[] => {
    const results: Gallery[] = [];
    const lowerTerm = term.toLowerCase();
    
    const search = (galleries: Gallery[]) => {
        for (const gallery of galleries) {
            if (gallery.title.toLowerCase().includes(lowerTerm) ||
                gallery.description?.toLowerCase().includes(lowerTerm) ||
                gallery.tags?.some(tag => tag.toLowerCase().includes(lowerTerm))) {
                results.push(gallery);
            }
            if (gallery.children) {
                search(gallery.children);
            }
        }
    };
    
    search(tree);
    return results;
};

/**
 * 递归查找图集
 */
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

/**
 * 查找图集在树中的路径
 */
const findGalleryPath = (tree: Gallery[], targetId: string, path: Gallery[] = []): Gallery[] => {
    for (const gallery of tree) {
        const currentPath = [...path, gallery];
        if (gallery.id === targetId) {
            return currentPath;
        }
        if (gallery.children) {
            const result = findGalleryPath(gallery.children, targetId, currentPath);
            if (result.length > 0) return result;
        }
    }
    return [];
};

export function useAlbumsData(): UseAlbumsDataReturn {
    // 数据状态
    const [galleryTree, setGalleryTree] = useState<Gallery[]>([]);
    const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingImages, setLoadingImages] = useState(false);
    
    // UI 状态
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    
    // 图片查看器状态
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // 初始化加载图集树
    useEffect(() => {
        const fetchGalleryTree = async () => {
            try {
                setLoading(true);
                const result = await galleryRepository.getGalleries();
                setGalleryTree(result);
            } catch (error) {
                console.error('Failed to fetch gallery tree:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchGalleryTree();
    }, []);
    
    // 计算面包屑
    const breadcrumbs = useMemo(() => {
        if (!currentGallery) return [];
        return currentGallery.breadcrumbs || [];
    }, [currentGallery]);
    
    // 搜索结果
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return searchGalleries(galleryTree, searchTerm.trim());
    }, [galleryTree, searchTerm]);
    
    // 处理图集点击
    const handleGalleryClick = useCallback(async (gallery: Gallery) => {
        setCurrentGallery(gallery);
        
        // 展开当前节点
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            newSet.add(gallery.id);
            return newSet;
        });
        
        // 如果是叶子节点，加载图片
        if (gallery.isLeaf) {
            setLoadingImages(true);
            try {
                const result = await galleryRepository.getGalleryImages(gallery.id);
                setImages(result.images);
                setCurrentImageIndex(0);
            } catch (error) {
                console.error('Failed to fetch images:', error);
                setImages([]);
            } finally {
                setLoadingImages(false);
            }
        } else {
            setImages([]);
        }
    }, []);
    
    // 返回根目录
    const handleRootClick = useCallback(() => {
        setCurrentGallery(null);
        setImages([]);
        setSearchTerm('');
    }, []);
    
    // 切换节点展开状态
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
    
    // 处理图片点击
    const handleImageClick = useCallback((index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    }, []);
    
    // 关闭图片查看器
    const handleCloseLightbox = useCallback(() => {
        setLightboxOpen(false);
    }, []);
    
    // 上一张图片
    const handlePreviousImage = useCallback(() => {
        setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    }, [images.length]);
    
    // 下一张图片
    const handleNextImage = useCallback(() => {
        setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }, [images.length]);
    
    // 跳转到指定图片
    const navigateToImage = useCallback((index: number) => {
        setCurrentImageIndex(index);
    }, []);
    
    return {
        // 数据
        galleryTree,
        currentGallery,
        images,
        breadcrumbs,
        
        // 加载状态
        loading,
        loadingImages,
        
        // UI 状态
        expandedNodes,
        searchTerm,
        searchResults,
        
        // 图片查看器状态
        lightboxOpen,
        currentImageIndex,
        
        // 操作
        setSearchTerm,
        handleGalleryClick,
        handleRootClick,
        toggleExpand,
        handleImageClick,
        handleCloseLightbox,
        handlePreviousImage,
        handleNextImage,
        navigateToImage,
    };
}
