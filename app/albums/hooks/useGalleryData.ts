'use client';

/**
 * useGalleryData - 图集数据 Hook
 * 
 * @module app/gallery/hooks
 * @description 管理图集数据的状态和操作
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { galleryRepository } from '@/app/infrastructure/repositories';
import { Gallery, GalleryImage, Breadcrumb } from '@/app/domain/types';

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
    handlePreviousImage: () => void;
    handleNextImage: () => void;
    setLightboxImage: (image: GalleryImage | null) => void;
    setSidebarOpen: (open: boolean) => void;
    setSearchTerm: (term: string) => void;
    setCurrentImageIndex: (index: number) => void;
}

export function useGalleryData(): UseGalleryDataReturn {
    const params = useParams();
    const router = useRouter();
    const galleryId = params?.galleryId as string | undefined;

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
    const initialGalleryLoadedRef = useRef(false);

    const loadGalleryTree = useCallback(async () => {
        if (galleryTree.length > 0) return;
        setLoading(true);
        try {
            const data = await galleryRepository.getGalleries();
            setGalleryTree(data);
        } catch (error) {
            console.error('Failed to load gallery tree:', error);
        } finally {
            setLoading(false);
        }
    }, [galleryTree.length]);

    const isLeafGallery = useCallback((gallery: Gallery): boolean => {
        return !gallery.children || gallery.children.length === 0;
    }, []);

    const loadImages = useCallback(async (galleryId: string) => {
        if (loadingRef.current === galleryId) return;
        loadingRef.current = galleryId;
        setLoading(true);

        try {
            const result = await galleryRepository.getGalleryImages(galleryId);
            setImages(result.images);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('Failed to load images:', error);
            setImages([]);
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
            // @ts-ignore - getChildrenImages 是 GalleryRepository 的扩展方法
            const result = await galleryRepository.getChildrenImages(galleryId);
            setChildrenImagesGroups(result.children);
            const allImages = result.children.flatMap((group: { images: GalleryImage[] }) => group.images);
            setAllChildrenImages(allImages);
        } catch (error) {
            console.error('Failed to load children images:', error);
            setChildrenImagesGroups([]);
            setAllChildrenImages([]);
        } finally {
            setLoading(false);
            loadingRef.current = null;
        }
    }, []);

    const handleGalleryClick = useCallback(async (gallery: Gallery) => {
        if (currentGallery?.id === gallery.id) return;

        // 更新 URL
        router.push(`/gallery/${gallery.id}`);

        setSearchTerm('');
        setShowSearchResults(false);
        setCurrentGallery(gallery);

        // 更新面包屑
        if (gallery.breadcrumbs) {
            setBreadcrumbs(gallery.breadcrumbs);
        }

        if (isLeafGallery(gallery)) {
            await loadImages(gallery.id);
            setChildrenImagesGroups([]);
        } else {
            await loadChildrenImages(gallery.id);
            setImages([]);
        }
    }, [currentGallery, isLeafGallery, loadImages, loadChildrenImages, router]);

    const handleBreadcrumbClick = useCallback((breadcrumb: Breadcrumb) => {
        if (breadcrumb.id === currentGallery?.id) return;

        if (breadcrumb.id === 'root') {
            router.push('/gallery');
            setCurrentGallery(null);
            setBreadcrumbs([]);
            setImages([]);
        } else {
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

            const gallery = findGallery(galleryTree, breadcrumb.id);
            if (gallery) handleGalleryClick(gallery);
        }
    }, [currentGallery, galleryTree, handleGalleryClick, router]);

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

    // 初始加载
    useEffect(() => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            loadGalleryTree();
        }
    }, [loadGalleryTree]);

    // 根据 URL 参数加载图集
    useEffect(() => {
        if (galleryTree.length > 0 && galleryId && !initialGalleryLoadedRef.current) {
            initialGalleryLoadedRef.current = true;

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

            const gallery = findGallery(galleryTree, galleryId);
            if (gallery) {
                handleGalleryClick(gallery);
            }
        }
    }, [galleryTree, galleryId, handleGalleryClick]);

    // 自动展开当前图集路径
    useEffect(() => {
        if (currentGallery) {
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

            const path = findPathToGallery(galleryTree, currentGallery.id, []);
            if (path.length > 0) {
                setExpandedNodes(new Set(path.map(g => g.id)));
            }
        }
    }, [currentGallery, galleryTree]);

    // 搜索功能
    useEffect(() => {
        if (searchTerm.trim()) {
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

            const results = searchGalleries(galleryTree, searchTerm.trim().toLowerCase());
            setSearchResults(results);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchTerm, galleryTree]);

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
        handlePreviousImage,
        handleNextImage,
        setLightboxImage,
        setSidebarOpen,
        setSearchTerm,
        setCurrentImageIndex,
    };
}

export default useGalleryData;
