'use client';

/**
 * GalleryDetailClient - 图集详情页客户端组件
 * 
 * @module app/gallery/components
 * @description 处理特定图集的详情展示
 * 
 * 显示逻辑：
 * 1. 叶子节点：直接显示自己的图片
 * 2. 倒数第二层父节点（子节点都是叶子节点）：聚合显示所有子节点的图片
 * 3. 中间层级父节点：显示子图集网格列表
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Star, Heart, Camera, Sun, ArrowLeft } from 'lucide-react';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import { galleryRepository } from '@/app/infrastructure/repositories';
import { Gallery, GalleryImage } from '@/app/domain/types';
import ImageGrid from './ImageGrid';
import ImageViewer from './ImageViewer';
import GalleryGrid from './GalleryGrid';
import ChildrenImagesDisplay from './ChildrenImagesDisplay';

interface GalleryDetailClientProps {
    galleryId: string;
}

export default function GalleryDetailClient({ galleryId }: GalleryDetailClientProps) {
    const router = useRouter();
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [children, setChildren] = useState<Gallery[]>([]);
    const [childrenImagesGroups, setChildrenImagesGroups] = useState<{ gallery: Gallery; images: GalleryImage[] }[]>([]);
    const [allChildrenImages, setAllChildrenImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [displayMode, setDisplayMode] = useState<'images' | 'children' | 'grid'>('grid');

    useEffect(() => {
        const loadGallery = async () => {
            setLoading(true);
            try {
                // 加载图集详情
                const galleryData = await galleryRepository.getGalleryById(galleryId);
                setGallery(galleryData);

                // 判断是否是叶子节点
                const isLeaf = !galleryData.children || galleryData.children.length === 0;

                if (isLeaf) {
                    // 叶子节点：直接加载自己的图片
                    const imagesResult = await galleryRepository.getGalleryImages(galleryId);
                    setImages(imagesResult.images);
                    setDisplayMode('images');
                } else {
                    // 父节点：检查子节点是否都是叶子节点
                    const childGalleries = galleryData.children || [];
                    setChildren(childGalleries);
                    
                    // 判断是否是倒数第二层（所有子节点都是叶子节点）
                    // 注意：后端返回的子节点数据中只有 isLeaf 字段，没有 children 字段
                    const allChildrenAreLeaves = childGalleries.every(child => child.isLeaf);
                    
                    if (allChildrenAreLeaves) {
                        // 倒数第二层：聚合显示所有子节点图片
                        try {
                            // @ts-ignore - getChildrenImages 是扩展方法
                            const childrenData = await galleryRepository.getChildrenImages(galleryId);
                            const groups = childrenData.children || [];
                            setChildrenImagesGroups(groups);
                            
                            // 聚合所有子图集图片
                            const allImages = groups.flatMap(
                                (group: { gallery: Gallery; images: GalleryImage[] }) => group.images
                            );
                            setAllChildrenImages(allImages);
                            setDisplayMode('children');
                        } catch (error) {
                            console.error('Failed to load children images:', error);
                            setDisplayMode('grid');
                        }
                    } else {
                        // 中间层级：显示子图集网格
                        setDisplayMode('grid');
                    }
                }
            } catch (error) {
                console.error('Failed to load gallery:', error);
            } finally {
                setLoading(false);
            }
        };

        loadGallery();
    }, [galleryId]);

    const handleImageClick = (img: GalleryImage, index: number, allImages?: GalleryImage[]) => {
        setLightboxImage(img);
        setCurrentImageIndex(index);
        if (allImages && allImages.length > 0) {
            setAllChildrenImages(allImages);
        }
    };

    const handlePreviousImage = () => {
        const currentImages = allChildrenImages.length > 0 ? allChildrenImages : images;
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            setLightboxImage(currentImages[currentImageIndex - 1]);
        }
    };

    const handleNextImage = () => {
        const currentImages = allChildrenImages.length > 0 ? allChildrenImages : images;
        if (currentImageIndex < currentImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setLightboxImage(currentImages[currentImageIndex + 1]);
        }
    };

    const handleGalleryClick = (childGallery: Gallery) => {
        router.push(`/gallery/${childGallery.id}`);
    };

    // 计算总图片数
    const totalImageCount = displayMode === 'children' 
        ? allChildrenImages.length 
        : displayMode === 'images' 
            ? images.length 
            : gallery?.imageCount || 0;

    return (
        <>
            {/* 页面装饰 - 图集主题 */}
            <PageDecorations theme="gallery" />

            {/* 额外装饰 */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
                <div className="absolute top-20 left-10 animate-bounce" style={{ animationDuration: '3s' }}>
                    <Star className="w-6 h-6 text-yellow-400/40" />
                </div>
                <div className="absolute top-32 left-24 animate-pulse" style={{ animationDelay: '0.4s' }}>
                    <Sparkles className="w-5 h-5 text-[#f8b195]/40" />
                </div>
                <div className="absolute top-24 right-16 animate-spin" style={{ animationDuration: '4s' }}>
                    <Sun className="w-8 h-8 text-orange-300/30" />
                </div>
                <div className="absolute top-40 right-8 animate-pulse" style={{ animationDelay: '0.6s' }}>
                    <Heart className="w-5 h-5 text-[#f67280]/30 fill-[#f67280]/30" />
                </div>
                <div className="absolute bottom-40 right-16 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                    <Camera className="w-6 h-6 text-[#8eb69b]/30" />
                </div>
                <div className="absolute bottom-32 left-20 animate-pulse" style={{ animationDelay: '0.8s' }}>
                    <Sparkles className="w-5 h-5 text-pink-300/30" />
                </div>
            </div>

            <div className="min-h-screen bg-[#fef5f0] p-6">
                {/* 返回按钮 */}
                <div className="max-w-7xl mx-auto mb-6">
                    <button
                        onClick={() => router.push('/gallery')}
                        className="flex items-center gap-2 text-[#8eb69b] hover:text-[#f8b195] transition-colors font-bold"
                    >
                        <ArrowLeft size={20} />
                        <span>返回图集</span>
                    </button>
                </div>

                {/* 图集标题 */}
                {gallery && (
                    <div className="max-w-7xl mx-auto mb-8">
                        <h1 className="text-3xl md:text-4xl font-black text-[#4a3728] mb-2">
                            {gallery.title}
                        </h1>
                        {gallery.description && (
                            <p className="text-[#8eb69b] font-bold">{gallery.description}</p>
                        )}
                        <p className="text-sm text-[#8eb69b]/70 mt-2">
                            共 {totalImageCount} 张图片
                            {displayMode === 'children' && children.length > 0 && (
                                <span className="ml-2">（来自 {children.length} 个子图集）</span>
                            )}
                        </p>
                    </div>
                )}

                {/* 加载状态 */}
                {loading && (
                    <div className="py-48 flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-8 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin"></div>
                        <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs">正在加载...</span>
                    </div>
                )}

                {/* 图片网格 - 叶子节点 */}
                {!loading && displayMode === 'images' && images.length > 0 && (
                    <div className="max-w-7xl mx-auto">
                        <ImageGrid images={images} onImageClick={(img, idx) => handleImageClick(img, idx)} />
                    </div>
                )}

                {/* 子图集图片聚合 - 倒数第二层父节点 */}
                {!loading && displayMode === 'children' && childrenImagesGroups.length > 0 && (
                    <div className="max-w-7xl mx-auto">
                        <ChildrenImagesDisplay
                            childrenGroups={childrenImagesGroups}
                            allChildrenImages={allChildrenImages}
                            onImageClick={handleImageClick}
                        />
                    </div>
                )}

                {/* 子图集网格 - 中间层级父节点 */}
                {!loading && displayMode === 'grid' && children.length > 0 && (
                    <div className="max-w-7xl mx-auto">
                        <GalleryGrid galleries={children} onGalleryClick={handleGalleryClick} />
                    </div>
                )}

                {/* 空状态 */}
                {!loading && displayMode === 'images' && images.length === 0 && (
                    <div className="py-48 text-center">
                        <p className="text-[#8eb69b] font-bold">暂无图片</p>
                    </div>
                )}
            </div>

            {/* 图片查看器 */}
            {lightboxImage && (
                <ImageViewer
                    images={allChildrenImages.length > 0 ? allChildrenImages : images}
                    currentIndex={currentImageIndex}
                    onClose={() => setLightboxImage(null)}
                    onPrevious={handlePreviousImage}
                    onNext={handleNextImage}
                    onIndexChange={setCurrentImageIndex}
                    onSelectImage={setLightboxImage}
                />
            )}
        </>
    );
}
