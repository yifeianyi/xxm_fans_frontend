/**
 * FansDIY 仓储实现
 * 
 * 实现 IFansDIYRepository 接口，负责粉丝二创数据的实际获取
 * 
 * @module infrastructure/repositories
 */

import { FanWork, FanCollection } from '@/app/domain/types';
import {
    IFansDIYRepository,
    GetCollectionsParams,
    GetWorksParams,
} from '@/app/domain/repositories';
import { ApiClient } from '../api/base';
import { FansDIYMapper } from '../mappers/FansDIYMapper';

/**
 * 粉丝二创仓储实现类
 */
export class FansDIYRepository implements IFansDIYRepository {
    private apiClient: ApiClient;

    constructor(apiClient?: ApiClient) {
        this.apiClient = apiClient || new ApiClient();
    }

    async getCollections(params: GetCollectionsParams = {}): Promise<{
        collections: FanCollection[];
        total: number;
    }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());

        const result = await this.apiClient.get<any>(`/fansDIY/collections/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        if (Array.isArray(data)) {
            return {
                collections: FansDIYMapper.collectionListFromBackend(data),
                total: data.length,
            };
        }

        return {
            collections: FansDIYMapper.collectionListFromBackend(data.results || []),
            total: data.total || data.results?.length || 0,
        };
    }

    async getCollectionById(id: string): Promise<FanCollection> {
        const result = await this.apiClient.get<any>(`/fansDIY/collections/${id}/`);

        if (result.error) {
            throw result.error;
        }

        return FansDIYMapper.collectionFromBackend(result.data);
    }

    async getWorks(params: GetWorksParams = {}): Promise<{
        works: FanWork[];
        total: number;
    }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.collection) queryParams.set('collection', params.collection);

        const result = await this.apiClient.get<any>(`/fansDIY/works/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        if (Array.isArray(data)) {
            return {
                works: FansDIYMapper.workListFromBackend(data),
                total: data.length,
            };
        }

        return {
            works: FansDIYMapper.workListFromBackend(data.results || []),
            total: data.total || data.results?.length || 0,
        };
    }

    async getWorkById(id: string): Promise<FanWork> {
        const result = await this.apiClient.get<any>(`/fansDIY/works/${id}/`);

        if (result.error) {
            throw result.error;
        }

        return FansDIYMapper.workFromBackend(result.data);
    }

    async getWorksByCollection(
        collectionId: string,
        params: Omit<GetWorksParams, 'collection'> = {}
    ): Promise<{
        works: FanWork[];
        total: number;
    }> {
        // 复用 getWorks，传入 collection 参数
        return this.getWorks({ ...params, collection: collectionId });
    }
}

/**
 * 默认粉丝二创仓储实例
 */
export const fansDIYRepository = new FansDIYRepository();
