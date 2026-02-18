'use client';

import useSWR from 'swr';
import { Song, SongRecord } from '@/app/domain/types';
import { songService } from '../api';
import { PaginatedResult, GetSongsParams, GetRecordsParams, GetTopSongsParams } from '../api/apiTypes';

// ============ SWR Keys ============

const SWR_KEYS = {
    songs: (params: GetSongsParams) => ['songs', params],
    song: (id: string) => ['song', id],
    records: (songId: string, params?: GetRecordsParams) => ['records', songId, params],
    topSongs: (params?: GetTopSongsParams) => ['topSongs', params],
    styles: () => ['styles'],
    tags: () => ['tags'],
};

// ============ Hooks ============

/**
 * 歌曲列表 Hook
 */
export function useSongs(
    params: GetSongsParams = {},
    fallbackData?: PaginatedResult<Song>
) {
    const { data, error, isLoading, mutate } = useSWR(
        SWR_KEYS.songs(params),
        async () => {
            const result = await songService.getSongs(params);
            if (result.error) throw result.error;
            return result.data!;
        },
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
 */
export function useSong(id: string, fallbackData?: Song) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? SWR_KEYS.song(id) : null,
        async () => {
            const result = await songService.getSongById(id);
            if (result.error) throw result.error;
            return result.data!;
        },
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
 */
export function useSongRecords(
    songId: string,
    params?: GetRecordsParams,
    fallbackData?: PaginatedResult<SongRecord>
) {
    const { data, error, isLoading, mutate } = useSWR(
        songId ? SWR_KEYS.records(songId, params) : null,
        async () => {
            const result = await songService.getRecords(songId, params);
            if (result.error) throw result.error;
            return result.data!;
        },
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
 */
export function useTopSongs(
    params?: GetTopSongsParams,
    fallbackData?: Song[]
) {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.topSongs(params),
        async () => {
            const result = await songService.getTopSongs(params);
            if (result.error) throw result.error;
            return result.data!;
        },
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
 */
export function useStyles() {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.styles(),
        async () => {
            const result = await songService.getStyles();
            if (result.error) throw result.error;
            return result.data!;
        },
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
 */
export function useTags() {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.tags(),
        async () => {
            const result = await songService.getTags();
            if (result.error) throw result.error;
            return result.data!;
        },
        { revalidateOnFocus: false }
    );

    return {
        tags: data || [],
        isLoading,
        error,
    };
}

/**
 * 筛选选项 Hook（曲风 + 标签）
 */
export function useFilterOptions() {
    const stylesQuery = useStyles();
    const tagsQuery = useTags();

    return {
        styles: stylesQuery.styles,
        tags: tagsQuery.tags,
        isLoading: stylesQuery.isLoading || tagsQuery.isLoading,
        error: stylesQuery.error || tagsQuery.error,
    };
}
