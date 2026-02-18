/**
 * 获取歌曲列表用例
 * 
 * 属于 Application 层，负责编排获取歌曲列表的业务逻辑
 * 可以组合多个 Repository，添加缓存、权限检查等逻辑
 * 
 * @module application/songs
 */

import { Song } from '@/app/domain/types';
import {
    ISongRepository,
    GetSongsParams,
    PaginatedResult,
} from '@/app/domain/repositories';

/** 用例输出 DTO */
export interface GetSongListOutput {
    songs: Song[];
    total: number;
    hasMore: boolean;
    currentPage: number;
}

/**
 * 获取歌曲列表用例
 */
export class GetSongListUseCase {
    constructor(private songRepository: ISongRepository) {}

    /**
     * 执行用例
     * @param params 查询参数
     * @returns 歌曲列表和分页信息
     */
    async execute(params: GetSongsParams = {}): Promise<GetSongListOutput> {
        const result = await this.songRepository.getSongs(params);
        
        const limit = params.limit || 20;
        const hasMore = result.results.length >= limit && 
                       (result.page * limit) < result.total;

        return {
            songs: result.results,
            total: result.total,
            hasMore,
            currentPage: result.page,
        };
    }
}
