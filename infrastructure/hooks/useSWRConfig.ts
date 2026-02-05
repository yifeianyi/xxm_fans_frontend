/**
 * SWR 全局配置
 * 
 * 提供数据获取的缓存、去重、自动刷新等功能
 */
import { SWRConfiguration } from 'swr';
import { songService, fanDIYService } from '../api/RealSongService';

// 全局 SWR 配置
export const swrConfig: SWRConfiguration = {
    // 错误重试
    errorRetryCount: 3,
    errorRetryInterval: (retryCount: number) => Math.min(1000 * 2 ** retryCount, 30000),
    
    // 去重间隔
    dedupingInterval: 2000,
    
    // 聚焦时重新验证
    revalidateOnFocus: false,
    
    // 重新连接时重新验证
    revalidateOnReconnect: true,
    
    // 挂载时重新验证
    revalidateIfStale: true,
    
    // 加载超时
    loadingTimeout: 3000,
    
    // 自定义 fetcher 错误处理
    onError: (error, key) => {
        console.error(`SWR Error [${key}]:`, error);
    },
};

// 带缓存的 fetcher 包装器
export const createFetcher = <T>(fetchFn: () => Promise<{ data?: T; error?: any }>) => {
    return async (): Promise<T> => {
        const result = await fetchFn();
        if (result.error) {
            throw result.error;
        }
        if (result.data === undefined) {
            throw new Error('No data returned');
        }
        return result.data;
    };
};

// 预定义的数据获取函数
export const fetchers = {
    // 歌曲相关
    songs: (params: any) => createFetcher(() => songService.getSongs(params)),
    songRecords: (songId: string, params?: any) => 
        createFetcher(() => songService.getRecords(songId, params)),
    topSongs: (params?: any) => 
        createFetcher(() => songService.getTopSongs(params)),
    randomSong: () => 
        createFetcher(() => songService.getRandomSong()),
    recommendation: () => 
        createFetcher(() => songService.getRecommendation()),
    originalWorks: () => 
        createFetcher(() => songService.getOriginalWorks()),
    
    // 二创相关
    collections: (params?: any) => 
        createFetcher(() => fanDIYService.getCollections(params)),
    collection: (id: number) => 
        createFetcher(() => fanDIYService.getCollection(id)),
    works: (params?: any) => 
        createFetcher(() => fanDIYService.getWorks(params)),
    work: (id: number) => 
        createFetcher(() => fanDIYService.getWork(id)),
};

// 缓存键生成器
export const cacheKeys = {
    songs: (params: any) => ['songs', JSON.stringify(params)],
    songRecords: (songId: string, params?: any) => 
        ['song-records', songId, JSON.stringify(params || {})],
    topSongs: (params?: any) => ['top-songs', JSON.stringify(params || {})],
    randomSong: () => ['random-song'],
    recommendation: () => ['recommendation'],
    originalWorks: () => ['original-works'],
    collections: (params?: any) => ['collections', JSON.stringify(params || {})],
    collection: (id: number) => ['collection', id],
    works: (params?: any) => ['works', JSON.stringify(params || {})],
    work: (id: number) => ['work', id],
};
