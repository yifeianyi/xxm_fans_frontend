/**
 * Gallery Hooks
 * 
 * 基于 SWR 的图集数据获取 Hooks
 * 内部使用 Repository 模式访问数据
 * 
 * @module infrastructure/hooks
 */

'use client';

import useSWR from 'swr';
import { Gallery, GalleryImage } from '@/app/domain/types';
import { galleryRepository } from '../repositories';
import { GetGalleriesParams, GetGalleryImagesParams } from '@/app/domain/repositories';

// ============ SWR Keys ============

const SWR_KEYS = {
    galleries: (params?: GetGalleriesParams) => ['galleries', params],
    gallery: (id: string) => ['gallery', id],
    galleryImages: (galleryId: string, params?: GetGalleryImagesParams) => ['galleryImages', galleryId, params],
};

// ============ Hooks ============

/**
 * 图集列表 Hook
 * 
 * @param params 查询参数
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 图集列表和状态
 * 
 * @example
 * ```typescript
 * const { galleries, isLoading, error } = useGalleries({ parentId: '123' });
 * ```
 */
export function useGalleries(params?: GetGalleriesParams, fallbackData?: Gallery[]) {
    const { data, error, isLoading, mutate } = useSWR(
        SWR_KEYS.galleries(params),
        async () => galleryRepository.getGalleries(params),
        { fallbackData }
    );

    return {
        galleries: data || [],
        isLoading,
        error,
        mutate,
    };
}

/**
 * 图集详情 Hook
 * 
 * @param id 图集 ID
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 图集详情和状态
 * 
 * @example
 * ```typescript
 * const { gallery, isLoading, error } = useGallery('123');
 * ```
 */
export function useGallery(id: string, fallbackData?: Gallery) {
    const { data, error, isLoading } = useSWR(
        id ? SWR_KEYS.gallery(id) : null,
        async () => galleryRepository.getGalleryById(id),
        { fallbackData }
    );

    return {
        gallery: data,
        isLoading,
        error,
    };
}

/**
 * 图集图片 Hook
 * 
 * @param galleryId 图集 ID
 * @param params 分页参数
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 图片列表和状态
 * 
 * @example
 * ```typescript
 * const { images, total, isLoading } = useGalleryImages('123', { page: 1, page_size: 20 });
 * ```
 */
export function useGalleryImages(
    galleryId: string,
    params?: GetGalleryImagesParams,
    fallbackData?: { images: GalleryImage[]; total: number }
) {
    const { data, error, isLoading } = useSWR(
        galleryId ? SWR_KEYS.galleryImages(galleryId, params) : null,
        async () => galleryRepository.getGalleryImages(galleryId, params),
        { fallbackData }
    );

    return {
        images: data?.images || [],
        total: data?.total || 0,
        isLoading,
        error,
    };
}
