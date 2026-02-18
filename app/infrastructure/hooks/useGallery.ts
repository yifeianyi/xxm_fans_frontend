'use client';

import useSWR from 'swr';
import { Gallery, GalleryImage } from '@/app/domain/types';
import { PaginatedResult } from '../api/apiTypes';

const fetcher = (url: string) => fetch(url).then(r => r.json());

/**
 * 图集列表 Hook
 */
export function useGalleries(parentId?: string, fallbackData?: Gallery[]) {
    const endpoint = parentId 
        ? `/api/gallery/?parent=${parentId}` 
        : '/api/gallery/';

    const { data, error, isLoading, mutate } = useSWR(
        endpoint,
        fetcher,
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
 */
export function useGallery(id: string, fallbackData?: Gallery) {
    const { data, error, isLoading } = useSWR(
        id ? `/api/gallery/${id}/` : null,
        fetcher,
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
 */
export function useGalleryImages(
    galleryId: string,
    page: number = 1,
    fallbackData?: PaginatedResult<GalleryImage>
) {
    const { data, error, isLoading } = useSWR(
        galleryId ? `/api/gallery/${galleryId}/items/?page=${page}` : null,
        fetcher,
        { fallbackData }
    );

    return {
        images: data?.results || [],
        total: data?.count || 0,
        isLoading,
        error,
    };
}
