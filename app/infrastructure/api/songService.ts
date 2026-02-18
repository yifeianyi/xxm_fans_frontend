/**
 * Song Service
 * 
 * ⚠️ 注意：此文件为兼容层，内部已重构为调用 SongRepository
 * 推荐使用 Repository 模式直接访问：
 * ```typescript
 * import { songRepository } from '@/app/infrastructure/repositories';
 * const result = await songRepository.getSongs(params);
 * ```
 * 
 * @deprecated 建议使用 songRepository 替代
 * @module infrastructure/api
 */

import { Song, SongRecord, OriginalWork, Recommendation } from '@/app/domain/types';
import {
    ApiResult, ApiError,
    PaginatedResult,
    GetSongsParams,
    GetRecordsParams,
    GetTopSongsParams,
} from './apiTypes';
import { songRepository } from '../repositories/SongRepository';

/**
 * 歌曲服务类
 * 
 * @deprecated 请直接使用 songRepository
 */
class SongService {
    /**
     * 获取歌曲列表
     * @deprecated 使用 songRepository.getSongs 替代
     */
    async getSongs(params: GetSongsParams): Promise<ApiResult<PaginatedResult<Song>>> {
        try {
            const result = await songRepository.getSongs(params);
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch songs') };
        }
    }

    /**
     * 根据 ID 获取歌曲详情
     * @deprecated 使用 songRepository.getSongById 替代
     */
    async getSongById(id: string): Promise<ApiResult<Song>> {
        try {
            const result = await songRepository.getSongById(id);
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch song') };
        }
    }

    /**
     * 获取歌曲的演唱记录
     * @deprecated 使用 songRepository.getRecords 替代
     */
    async getRecords(songId: string, params?: GetRecordsParams): Promise<ApiResult<PaginatedResult<SongRecord>>> {
        try {
            const result = await songRepository.getRecords(songId, params);
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch records') };
        }
    }

    /**
     * 获取所有曲风列表
     * @deprecated 使用 songRepository.getStyles 替代
     */
    async getStyles(): Promise<ApiResult<string[]>> {
        try {
            const result = await songRepository.getStyles();
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch styles') };
        }
    }

    /**
     * 获取所有标签列表
     * @deprecated 使用 songRepository.getTags 替代
     */
    async getTags(): Promise<ApiResult<string[]>> {
        try {
            const result = await songRepository.getTags();
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch tags') };
        }
    }

    /**
     * 获取热门歌曲排行榜
     * @deprecated 使用 songRepository.getTopSongs 替代
     */
    async getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>> {
        try {
            const result = await songRepository.getTopSongs(params);
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch top songs') };
        }
    }

    /**
     * 获取原唱作品列表
     * @deprecated 使用 songRepository.getOriginalWorks 替代
     */
    async getOriginalWorks(): Promise<ApiResult<OriginalWork[]>> {
        try {
            const result = await songRepository.getOriginalWorks();
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch original works') };
        }
    }

    /**
     * 获取随机歌曲
     * @deprecated 使用 songRepository.getRandomSong 替代
     */
    async getRandomSong(): Promise<ApiResult<Song>> {
        try {
            const result = await songRepository.getRandomSong();
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch random song') };
        }
    }

    /**
     * 获取推荐内容
     * @deprecated 使用 songRepository.getRecommendation 替代
     */
    async getRecommendation(): Promise<ApiResult<Recommendation & { recommendedSongsDetails?: any[] }>> {
        try {
            const result = await songRepository.getRecommendation();
            return { data: result };
        } catch (error) {
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Failed to fetch recommendation') };
        }
    }
}

/**
 * 歌曲服务单例实例
 * 
 * @deprecated 请直接使用 songRepository
 */
export const songService = new SongService();
