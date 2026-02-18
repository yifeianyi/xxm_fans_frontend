// 图集服务 - 适配 Next.js Server Components
import { get } from './base';
import { Gallery, GalleryImage, Breadcrumb } from '@/app/domain/types';
import { PaginatedResult } from './apiTypes';

const CACHE_TIMES = {
    GALLERY_LIST: 300,   // 图集列表缓存 5 分钟
    GALLERY_DETAIL: 300, // 图集详情缓存 5 分钟
};

/**
 * 获取图集列表
 */
export async function getGalleries(parentId?: string): Promise<Gallery[]> {
    const endpoint = parentId ? `/gallery/?parent=${parentId}` : '/gallery/';
    const result = await get<any[]>(endpoint, CACHE_TIMES.GALLERY_LIST);
    
    if (result.data) {
        return result.data.map(transformGallery);
    }
    throw result.error || new Error('Failed to fetch galleries');
}

/**
 * 获取图集详情
 */
export async function getGalleryById(id: string): Promise<Gallery> {
    const result = await get<any>(`/gallery/${id}/`, CACHE_TIMES.GALLERY_DETAIL);
    
    if (result.data) {
        return transformGallery(result.data);
    }
    throw result.error || new Error('Failed to fetch gallery');
}

/**
 * 获取图集图片列表
 */
export async function getGalleryImages(
    galleryId: string,
    page: number = 1
): Promise<PaginatedResult<GalleryImage>> {
    const result = await get<PaginatedResult<any>>(
        `/gallery/${galleryId}/items/?page=${page}`,
        CACHE_TIMES.GALLERY_LIST
    );
    
    if (result.data) {
        return {
            ...result.data,
            results: result.data.results.map(transformGalleryImage),
        };
    }
    throw result.error || new Error('Failed to fetch gallery images');
}

// ========== 数据转换函数 ==========

function transformGallery(item: any): Gallery {
    return {
        id: item.id?.toString() || '',
        title: item.title || '',
        description: item.description || '',
        coverUrl: item.cover_url || '',
        coverThumbnailUrl: item.cover_thumbnail_url,
        level: item.level || 0,
        imageCount: item.image_count || 0,
        folderPath: item.folder_path || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        isLeaf: item.is_leaf || false,
        children: item.children?.map(transformGallery),
        breadcrumbs: item.breadcrumbs?.map((b: any) => ({
            id: b.id?.toString() || '',
            title: b.title || '',
        })),
        createdAt: item.created_at,
    };
}

function transformGalleryImage(item: any): GalleryImage {
    return {
        id: item.id?.toString() || '',
        url: item.url || '',
        thumbnailUrl: item.thumbnail_url,
        title: item.title || '',
        filename: item.filename || '',
        isGif: item.is_gif || false,
        isVideo: item.is_video || false,
    };
}
