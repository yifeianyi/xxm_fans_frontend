/**
 * Gallery 数据映射器
 * 
 * 负责将后端 API 返回的原始数据转换为领域模型 (Gallery)
 * 
 * @module infrastructure/mappers
 */

import { Gallery, GalleryImage, Breadcrumb } from '@/app/domain/types';
import { getFullCoverUrl } from '../api/base';

/**
 * 后端图集数据结构（原始）
 */
interface BackendGalleryItem {
    id?: number | string;
    title?: string;
    description?: string;
    cover_url?: string;
    cover_thumbnail_url?: string;
    level?: number;
    image_count?: number;
    folder_path?: string;
    tags?: string[];
    is_leaf?: boolean;
    children?: BackendGalleryItem[];
    breadcrumbs?: BackendBreadcrumbItem[];
    created_at?: string;
}

/**
 * 后端面包屑数据结构
 */
interface BackendBreadcrumbItem {
    id?: number | string;
    title?: string;
}

/**
 * 后端图片数据结构
 */
interface BackendImageItem {
    id?: number | string;
    url?: string;
    thumbnail_url?: string;
    title?: string;
    filename?: string;
    is_gif?: boolean;
    is_video?: boolean;
}

/**
 * Gallery 数据映射器类
 */
export class GalleryMapper {
    /**
     * 将后端图集数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 Gallery
     */
    static fromBackend(item: BackendGalleryItem): Gallery {
        return {
            id: item.id?.toString() || '',
            title: item.title || '',
            description: item.description || '',
            coverUrl: getFullCoverUrl(item.cover_url),
            coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url || item.cover_url),
            level: item.level || 0,
            imageCount: item.image_count || 0,
            folderPath: item.folder_path || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            isLeaf: item.is_leaf ?? true,
            children: item.children ? this.fromBackendList(item.children) : undefined,
            breadcrumbs: item.breadcrumbs ? this.breadcrumbsFromBackend(item.breadcrumbs) : undefined,
            createdAt: item.created_at || '',
        };
    }

    /**
     * 批量转换后端图集数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static fromBackendList(items: BackendGalleryItem[]): Gallery[] {
        if (!Array.isArray(items)) {
            console.warn('GalleryMapper.fromBackendList: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.fromBackend(item));
    }

    /**
     * 将后端面包屑数据转换为领域模型
     * @param items 后端返回的原始数据数组
     * @returns 面包屑模型数组
     */
    static breadcrumbsFromBackend(items: BackendBreadcrumbItem[]): Breadcrumb[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            id: item.id?.toString() || '',
            title: item.title || '',
        }));
    }

    /**
     * 将后端图片数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 GalleryImage
     */
    static imageFromBackend(item: BackendImageItem): GalleryImage {
        return {
            id: item.id?.toString() || '',
            url: getFullCoverUrl(item.url),
            thumbnailUrl: getFullCoverUrl(item.thumbnail_url || item.url),
            title: item.title || '',
            filename: item.filename || '',
            isGif: item.is_gif || false,
            isVideo: item.is_video || false,
        };
    }

    /**
     * 批量转换后端图片数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static imageListFromBackend(items: BackendImageItem[]): GalleryImage[] {
        if (!Array.isArray(items)) {
            console.warn('GalleryMapper.imageListFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.imageFromBackend(item));
    }

    /**
     * 构建树形结构（用于层级展示）
     * @param galleries 平铺的图集列表
     * @param parentId 父级 ID（可选，用于筛选）
     * @returns 树形结构
     */
    static buildTree(galleries: Gallery[], parentId?: string): Gallery[] {
        // 这里简化处理，实际可能需要根据后端返回的 children 字段
        if (parentId) {
            return galleries.filter(g => g.breadcrumbs?.some(b => b.id === parentId));
        }
        return galleries;
    }
}
