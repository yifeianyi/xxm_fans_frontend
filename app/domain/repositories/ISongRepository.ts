/**
 * Song 仓储接口
 * 
 * 定义歌曲领域模型的数据访问契约
 * 属于 Domain 层，不依赖于具体的技术实现
 * 
 * @module domain/repositories
 */

import {
    Song,
    SongRecord,
    OriginalWork,
    Recommendation,
    FilterState,
} from '../types';

/** 分页结果通用接口 */
export interface PaginatedResult<T> {
    total: number;
    page: number;
    page_size: number;
    results: T[];
}

/** 获取歌曲列表参数 */
export interface GetSongsParams {
    /** 搜索关键词 */
    q?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 排序字段 */
    ordering?: string;
    /** 曲风筛选（逗号分隔） */
    styles?: string;
    /** 标签筛选（逗号分隔） */
    tags?: string;
    /** 语种筛选（逗号分隔） */
    language?: string;
}

/** 获取演唱记录参数 */
export interface GetRecordsParams {
    page?: number;
    page_size?: number;
}

/** 获取排行榜参数 */
export interface GetTopSongsParams {
    /** 时间范围: 'all' | '1m' | '3m' | '1y' */
    range?: string;
    /** 限制数量 */
    limit?: number;
}

/**
 * 歌曲仓储接口
 * 
 * 抽象定义歌曲相关的所有数据访问操作
 * 实现可以是 HTTP API、LocalStorage、IndexedDB 等
 */
export interface ISongRepository {
    /**
     * 获取歌曲列表
     * @param params 查询参数
     * @returns 分页的歌曲列表
     */
    getSongs(params?: GetSongsParams): Promise<PaginatedResult<Song>>;

    /**
     * 根据 ID 获取歌曲详情
     * @param id 歌曲 ID
     * @returns 歌曲详情
     */
    getSongById(id: string): Promise<Song>;

    /**
     * 获取歌曲的演唱记录
     * @param songId 歌曲 ID
     * @param params 分页参数
     * @returns 分页的演唱记录
     */
    getRecords(songId: string, params?: GetRecordsParams): Promise<PaginatedResult<SongRecord>>;

    /**
     * 获取所有曲风列表
     * @returns 曲风名称数组
     */
    getStyles(): Promise<string[]>;

    /**
     * 获取所有标签列表
     * @returns 标签名称数组
     */
    getTags(): Promise<string[]>;

    /**
     * 获取热门歌曲排行榜
     * @param params 查询参数
     * @returns 热门歌曲列表
     */
    getTopSongs(params?: GetTopSongsParams): Promise<Song[]>;

    /**
     * 获取原唱作品列表
     * @returns 原唱作品列表
     */
    getOriginalWorks(): Promise<OriginalWork[]>;

    /**
     * 获取随机歌曲
     * @returns 随机一首歌曲
     */
    getRandomSong(): Promise<Song>;

    /**
     * 获取推荐内容
     * @returns 推荐内容和推荐歌曲
     */
    getRecommendation(): Promise<Recommendation & { recommendedSongsDetails?: any[] }>;

    /**
     * 获取筛选选项
     * @returns 所有可用的筛选选项
     */
    getFilterOptions(): Promise<{
        styles: string[];
        tags: string[];
        languages: string[];
    }>;
}

/** 仓储接口标识符（用于依赖注入） */
export const SONG_REPOSITORY_TOKEN = Symbol('ISongRepository');
