/**
 * FansDIY 数据映射器
 * 
 * 负责将后端 API 返回的原始数据转换为领域模型 (FanWork, FanCollection)
 * 
 * @module infrastructure/mappers
 */

import { FanWork, FanCollection } from '@/app/domain/types';
import { getFullCoverUrl } from '../api/base';

/**
 * 后端合集数据结构（原始）
 */
interface BackendCollectionItem {
    id?: number | string;
    name?: string;
    description?: string;
    works_count?: number;
}

/**
 * 后端作品数据结构（原始）
 */
interface BackendWorkItem {
    id?: number | string;
    title?: string;
    author?: string;
    cover?: string;
    cover_thumbnail_url?: string;
    video_url?: string;
    note?: string;
    collection_id?: number | string;
    position?: number;
}

/**
 * FansDIY 数据映射器类
 */
export class FansDIYMapper {
    /**
     * 将后端合集数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 FanCollection
     */
    static collectionFromBackend(item: BackendCollectionItem): FanCollection {
        return {
            id: item.id?.toString() || '',
            name: item.name || '',
            description: item.description || '',
            worksCount: item.works_count || 0,
        };
    }

    /**
     * 批量转换后端合集数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static collectionListFromBackend(items: BackendCollectionItem[]): FanCollection[] {
        if (!Array.isArray(items)) {
            console.warn('FansDIYMapper.collectionListFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.collectionFromBackend(item));
    }

    /**
     * 将后端作品数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 FanWork
     */
    static workFromBackend(item: BackendWorkItem): FanWork {
        const coverUrl = item.cover || '';
        
        return {
            id: item.id?.toString() || '',
            title: item.title || '',
            author: item.author || '',
            cover: getFullCoverUrl(coverUrl),
            coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url || coverUrl),
            videoUrl: item.video_url || '',
            note: item.note || '',
            collectionId: item.collection_id?.toString() || '',
            position: item.position || 0,
        };
    }

    /**
     * 批量转换后端作品数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static workListFromBackend(items: BackendWorkItem[]): FanWork[] {
        if (!Array.isArray(items)) {
            console.warn('FansDIYMapper.workListFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.workFromBackend(item));
    }
}
