/**
 * Songs Hooks
 * 
 * 基于 SWR 的歌曲数据获取 Hooks
 * 内部使用 Repository 模式访问数据
 * 
 * @module infrastructure/hooks
 */

'use client';

import useSWR from 'swr';
import { Song, SongRecord } from '@/app/domain/types';
import { songRepository } from '../repositories';
import {
    GetSongsParams,
    GetRecordsParams,
    GetTopSongsParams,
    PaginatedResult,
} from '@/app/domain/repositories';

// ============ SWR Keys ============

const SWR_KEYS = {
    songs: (params: GetSongsParams) => ['songs', params],
    song: (id: string) => ['song', id],
    records: (songId: string, params?: GetRecordsParams) => ['records', songId, params],
    topSongs: (params?: GetTopSongsParams) => ['topSongs', params],
    styles: () => ['styles'],
    tags: () => ['tags'],
    randomSong: () => ['randomSong'],
    originalWorks: () => ['originalWorks'],
};

// ============ Hooks ============

/**
 * 歌曲列表 Hook
 * 
 * @param params 查询参数
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 歌曲列表和状态
 * 
 * @example
 * ```typescript
 * const { songs, total, isLoading, error } = useSongs({ page: 1, limit: 20 });
 * ```
 */
export function useSongs(
    params: GetSongsParams = {},
    fallbackData?: PaginatedResult<Song>
) {
    const { data, error, isLoading, mutate } = useSWR(
        SWR_KEYS.songs(params),
        async () => songRepository.getSongs(params),
        { 
            fallbackData,
            keepPreviousData: true,
        }
    );

    return {
        songs: data?.results || [],
        total: data?.total || 0,
        page: data?.page || 1,
        pageSize: data?.page_size || 20,
        isLoading,
        error,
        mutate,
    };
}

/**
 * 歌曲详情 Hook
 * 
 * @param id 歌曲 ID
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 歌曲详情和状态
 * 
 * @example
 * ```typescript
 * const { song, isLoading, error } = useSong('123');
 * ```
 */
export function useSong(id: string, fallbackData?: Song) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? SWR_KEYS.song(id) : null,
        async () => songRepository.getSongById(id),
        { fallbackData }
    );

    return {
        song: data,
        isLoading,
        error,
        mutate,
    };
}

/**
 * 歌曲演唱记录 Hook
 * 
 * @param songId 歌曲 ID
 * @param params 分页参数
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 演唱记录和状态
 * 
 * @example
 * ```typescript
 * const { records, total, isLoading } = useSongRecords('123', { page: 1 });
 * ```
 */
export function useSongRecords(
    songId: string,
    params?: GetRecordsParams,
    fallbackData?: PaginatedResult<SongRecord>
) {
    const { data, error, isLoading, mutate } = useSWR(
        songId ? SWR_KEYS.records(songId, params) : null,
        async () => songRepository.getRecords(songId, params),
        { fallbackData }
    );

    return {
        records: data?.results || [],
        total: data?.total || 0,
        isLoading,
        error,
        mutate,
    };
}

/**
 * 排行榜 Hook
 * 
 * @param params 查询参数（时间范围、数量限制）
 * @param fallbackData 初始数据（用于 SSR）
 * @returns 热门歌曲和状态
 * 
 * @example
 * ```typescript
 * const { topSongs, isLoading } = useTopSongs({ range: '1m', limit: 10 });
 * ```
 */
export function useTopSongs(
    params?: GetTopSongsParams,
    fallbackData?: Song[]
) {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.topSongs(params),
        async () => songRepository.getTopSongs(params),
        { fallbackData }
    );

    return {
        topSongs: data || [],
        isLoading,
        error,
    };
}

/**
 * 曲风列表 Hook
 * 
 * @returns 曲风列表和状态
 */
export function useStyles() {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.styles(),
        async () => songRepository.getStyles(),
        { revalidateOnFocus: false }
    );

    return {
        styles: data || [],
        isLoading,
        error,
    };
}

/**
 * 标签列表 Hook
 * 
 * @returns 标签列表和状态
 */
export function useTags() {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.tags(),
        async () => songRepository.getTags(),
        { revalidateOnFocus: false }
    );

    return {
        tags: data || [],
        isLoading,
        error,
    };
}

/**
 * 筛选选项 Hook（曲风 + 标签 + 语种）
 * 
 * @returns 所有筛选选项和状态
 */
export function useFilterOptions() {
    const stylesQuery = useStyles();
    const tagsQuery = useTags();

    return {
        styles: stylesQuery.styles,
        tags: tagsQuery.tags,
        languages: ['国语', '粤语', '英语', '日语', '韩语', '其他'],
        isLoading: stylesQuery.isLoading || tagsQuery.isLoading,
        error: stylesQuery.error || tagsQuery.error,
    };
}

/**
 * 随机歌曲 Hook
 * 
 * @returns 随机歌曲和相关操作
 * 
 * @example
 * ```typescript
 * const { song, isLoading, fetchRandom } = useRandomSong();
 * ```
 */
export function useRandomSong() {
    const { data, error, isLoading, mutate } = useSWR(
        SWR_KEYS.randomSong(),
        async () => songRepository.getRandomSong(),
        { revalidateOnFocus: false }
    );

    return {
        song: data,
        isLoading,
        error,
        fetchRandom: () => mutate(),
    };
}

/**
 * 原唱作品 Hook
 * 
 * @returns 原唱作品列表和状态
 */
export function useOriginalWorks() {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.originalWorks(),
        async () => songRepository.getOriginalWorks(),
        { revalidateOnFocus: false }
    );

    return {
        originalWorks: data || [],
        isLoading,
        error,
    };
}
