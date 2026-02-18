// 粉丝二创服务 - 适配 Next.js Server Components
import { get, getFullCoverUrl } from './base';
import { FanCollection, FanWork } from '@/app/domain/types';
import { PaginatedResult, GetWorksParams } from './apiTypes';

const CACHE_TIMES = {
    COLLECTIONS: 300,    // 合集列表缓存 5 分钟
    COLLECTION_DETAIL: 300,
    WORKS: 60,           // 作品列表缓存 1 分钟
};

/**
 * 获取二创合集列表
 */
export async function getCollections(): Promise<FanCollection[]> {
    const result = await get<any>('/fansDIY/collections/', CACHE_TIMES.COLLECTIONS);
    
    if (result.data) {
        // 后端返回分页格式: { total, page, results: [...] }
        const items = result.data.results || result.data;
        return items.map(transformCollection);
    }
    throw result.error || new Error('Failed to fetch collections');
}

/**
 * 获取合集详情
 */
export async function getCollection(id: string): Promise<FanCollection> {
    const result = await get<any>(`/fansDIY/collections/${id}/`, CACHE_TIMES.COLLECTION_DETAIL);
    
    if (result.data) {
        return transformCollection(result.data);
    }
    throw result.error || new Error('Failed to fetch collection');
}

/**
 * 获取合集中的作品
 */
export async function getCollectionWorks(
    collectionId: string,
    params?: GetWorksParams
): Promise<PaginatedResult<FanWork>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const result = await get<PaginatedResult<any>>(
        `/fansDIY/collections/${collectionId}/works/?${queryParams.toString()}`,
        CACHE_TIMES.WORKS
    );
    
    if (result.data) {
        return {
            ...result.data,
            results: result.data.results.map(transformWork),
        };
    }
    throw result.error || new Error('Failed to fetch works');
}

/**
 * 获取作品列表
 */
export async function getWorks(params?: GetWorksParams): Promise<PaginatedResult<FanWork>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const result = await get<PaginatedResult<any>>(
        `/fansDIY/works/?${queryParams.toString()}`,
        CACHE_TIMES.WORKS
    );
    
    if (result.data) {
        return {
            ...result.data,
            results: result.data.results.map(transformWork),
        };
    }
    throw result.error || new Error('Failed to fetch works');
}

/**
 * 获取作品详情
 */
export async function getWorkById(id: string): Promise<FanWork> {
    const result = await get<any>(`/fansDIY/works/${id}/`, CACHE_TIMES.WORKS);
    
    if (result.data) {
        return transformWork(result.data);
    }
    throw result.error || new Error('Failed to fetch work');
}

/**
 * 获取最近的二创作品
 */
export async function getRecentWorks(limit: number = 6): Promise<FanWork[]> {
    const result = await get<any[]>(`/fansDIY/works/recent/?limit=${limit}`, CACHE_TIMES.WORKS);
    
    if (result.data) {
        return result.data.map(transformWork);
    }
    throw result.error || new Error('Failed to fetch recent works');
}

// ========== 数据转换函数 ==========

function transformCollection(item: any): FanCollection {
    return {
        id: item.id?.toString() || '',
        name: item.name || '',
        description: item.description || '',
        worksCount: item.works_count || 0,
    };
}

function transformWork(item: any): FanWork {
    // 后端返回的 collection 可能是对象 { id, name } 或 ID
    let collectionId = '';
    if (item.collection) {
        if (typeof item.collection === 'object') {
            collectionId = item.collection.id?.toString() || '';
        } else {
            collectionId = item.collection.toString();
        }
    }
    
    return {
        id: item.id?.toString() || '',
        title: item.title || '',
        author: item.author || '',
        cover: getFullCoverUrl(item.cover_url || item.cover),
        coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url || item.cover_thumbnail),
        videoUrl: item.video_url || item.view_url || '',
        note: item.note || item.notes || '',
        collectionId: collectionId,
        position: item.position || 0,
    };
}
