/**
 * 获取热门歌曲用例
 * 
 * 属于 Application 层，负责编排获取热门歌曲的业务逻辑
 * 可以添加缓存、计算热度分数等业务逻辑
 * 
 * @module application/songs
 */

import { Song } from '@/app/domain/types';
import { ISongRepository, GetTopSongsParams } from '@/app/domain/repositories';

/** 热度时间范围 */
export type HotSongsTimeRange = 'all' | '1m' | '3m' | '1y';

/** 用例输出 DTO */
export interface GetHotSongsOutput {
    songs: Song[];
    timeRange: HotSongsTimeRange;
    generatedAt: Date;
}

/**
 * 获取热门歌曲用例
 */
export class GetHotSongsUseCase {
    // 简单的内存缓存（实际项目中可以使用更复杂的缓存策略）
    private cache: Map<string, { data: GetHotSongsOutput; expiry: number }> = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

    constructor(private songRepository: ISongRepository) {}

    /**
     * 执行用例
     * @param timeRange 时间范围
     * @param limit 数量限制
     * @param useCache 是否使用缓存
     * @returns 热门歌曲列表
     */
    async execute(
        timeRange: HotSongsTimeRange = 'all',
        limit: number = 10,
        useCache: boolean = true
    ): Promise<GetHotSongsOutput> {
        const cacheKey = `${timeRange}_${limit}`;

        // 检查缓存
        if (useCache) {
            const cached = this.cache.get(cacheKey);
            if (cached && cached.expiry > Date.now()) {
                return cached.data;
            }
        }

        // 获取数据
        const params: GetTopSongsParams = {
            range: timeRange,
            limit,
        };

        const songs = await this.songRepository.getTopSongs(params);

        const output: GetHotSongsOutput = {
            songs,
            timeRange,
            generatedAt: new Date(),
        };

        // 更新缓存
        if (useCache) {
            this.cache.set(cacheKey, {
                data: output,
                expiry: Date.now() + this.CACHE_TTL,
            });
        }

        return output;
    }

    /**
     * 清除缓存
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * 获取缓存大小
     */
    getCacheSize(): number {
        return this.cache.size;
    }
}
