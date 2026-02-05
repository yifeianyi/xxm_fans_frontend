/**
 * 数据获取 Hooks
 * 
 * 基于 SWR 的数据获取封装，提供统一的加载状态和错误处理
 */
import useSWR, { SWRConfiguration } from 'swr';
import { swrConfig, fetchers, cacheKeys } from './useSWRConfig';
import { GetSongsParams, GetRecordsParams, GetWorksParams, GetTopSongsParams } from '../api/apiTypes';

// 合并配置
const mergeConfig = (config?: SWRConfiguration): SWRConfiguration => ({
    ...swrConfig,
    ...config,
});

/**
 * 获取歌曲列表
 */
export const useSongs = (params: GetSongsParams, config?: SWRConfiguration) => {
    const key = cacheKeys.songs(params);
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.songs(params),
        mergeConfig(config)
    );

    return {
        songs: data?.results || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取歌曲演唱记录
 */
export const useSongRecords = (
    songId: string,
    params?: GetRecordsParams,
    config?: SWRConfiguration
) => {
    const key = songId ? cacheKeys.songRecords(songId, params) : null;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.songRecords(songId, params),
        mergeConfig(config)
    );

    return {
        records: data?.results || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取排行榜
 */
export const useTopSongs = (params?: GetTopSongsParams, config?: SWRConfiguration) => {
    const key = cacheKeys.topSongs(params);
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.topSongs(params),
        mergeConfig({
            ...config,
            // 排行榜数据缓存 10 分钟
            dedupingInterval: 600000,
        })
    );

    return {
        songs: data || [],
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取随机歌曲
 */
export const useRandomSong = (config?: SWRConfiguration) => {
    const key = cacheKeys.randomSong();
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.randomSong(),
        mergeConfig({
            ...config,
            // 随机歌曲不缓存
            dedupingInterval: 0,
            revalidateOnFocus: false,
        })
    );

    return {
        song: data,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取推荐内容
 */
export const useRecommendation = (config?: SWRConfiguration) => {
    const key = cacheKeys.recommendation();
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.recommendation(),
        mergeConfig({
            ...config,
            // 推荐内容缓存 30 分钟
            dedupingInterval: 1800000,
        })
    );

    return {
        recommendation: data,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取原创作品列表
 */
export const useOriginalWorks = (config?: SWRConfiguration) => {
    const key = cacheKeys.originalWorks();
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.originalWorks(),
        mergeConfig({
            ...config,
            // 原创作品缓存 1 小时
            dedupingInterval: 3600000,
        })
    );

    return {
        works: data || [],
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取二创合集列表
 */
export const useCollections = (params?: GetWorksParams, config?: SWRConfiguration) => {
    const key = cacheKeys.collections(params);
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.collections(params),
        mergeConfig(config)
    );

    return {
        collections: data?.results || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取二创合集详情
 */
export const useCollection = (id: number, config?: SWRConfiguration) => {
    const key = id ? cacheKeys.collection(id) : null;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.collection(id),
        mergeConfig(config)
    );

    return {
        collection: data,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取作品列表
 */
export const useWorks = (params?: GetWorksParams, config?: SWRConfiguration) => {
    const key = cacheKeys.works(params);
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.works(params),
        mergeConfig(config)
    );

    return {
        works: data?.results || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: mutate,
    };
};

/**
 * 获取作品详情
 */
export const useWork = (id: number, config?: SWRConfiguration) => {
    const key = id ? cacheKeys.work(id) : null;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        fetchers.work(id),
        mergeConfig(config)
    );

    return {
        work: data,
        isLoading,
        error,
        refresh: mutate,
    };
};
