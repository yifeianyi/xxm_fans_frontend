/**
 * FansDIY 仓储接口
 * 
 * 定义粉丝二创领域模型的数据访问契约
 * 
 * @module domain/repositories
 */

import { FanWork, FanCollection } from '../types';

/** 获取合集列表参数 */
export interface GetCollectionsParams {
    page?: number;
    limit?: number;
}

/** 获取作品列表参数 */
export interface GetWorksParams {
    page?: number;
    limit?: number;
    collection?: string;
}

/**
 * 粉丝二创仓储接口
 */
export interface IFansDIYRepository {
    /**
     * 获取合集列表
     * @param params 查询参数
     * @returns 合集列表和总数
     */
    getCollections(params?: GetCollectionsParams): Promise<{
        collections: FanCollection[];
        total: number;
    }>;

    /**
     * 根据 ID 获取合集详情
     * @param id 合集 ID
     * @returns 合集详情
     */
    getCollectionById(id: string): Promise<FanCollection>;

    /**
     * 获取作品列表
     * @param params 查询参数
     * @returns 作品列表和总数
     */
    getWorks(params?: GetWorksParams): Promise<{
        works: FanWork[];
        total: number;
    }>;

    /**
     * 根据 ID 获取作品详情
     * @param id 作品 ID
     * @returns 作品详情
     */
    getWorkById(id: string): Promise<FanWork>;

    /**
     * 获取合集中的作品
     * @param collectionId 合集 ID
     * @param params 分页参数
     * @returns 作品列表
     */
    getWorksByCollection(
        collectionId: string,
        params?: Omit<GetWorksParams, 'collection'>
    ): Promise<{
        works: FanWork[];
        total: number;
    }>;
}

/** 仓储接口标识符 */
export const FANSDIY_REPOSITORY_TOKEN = Symbol('IFansDIYRepository');
