'use client';

import useSWR from 'swr';
import { Song, SongRecord } from '@/app/domain/types';
import { PaginatedResult, GetSongsParams, GetRecordsParams } from '../api/apiTypes';

// 处理后端统一响应格式: { code, message, data }
const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    // 如果后端返回统一格式 { code, message, data }
    if (result && typeof result === 'object' && 'code' in result) {
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message || 'API error');
        }
    }
    
    // 直接返回数据
    return result;
};

/**
 * 歌曲列表 Hook - 用于 Client Components
 */
export function useSongs(
    params: GetSongsParams = {},
    fallbackData?: PaginatedResult<Song>
) {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.ordering) queryParams.set('ordering', params.ordering);
    if (params.styles) queryParams.set('styles', params.styles);
    if (params.tags) queryParams.set('tags', params.tags);
    if (params.language) queryParams.set('language', params.language);

    const { data, error, isLoading, mutate } = useSWR(
        `/api/songs/?${queryParams.toString()}`,
        fetcher,
        { fallbackData }
    );

    // 后端返回 total，不是 count
    return {
        songs: data?.results || [],
        total: data?.total || data?.count || 0,
        isLoading,
        error,
        mutate,
    };
}

/**
 * 歌曲详情 Hook
 */
export function useSong(id: string, fallbackData?: Song) {
    const { data, error, isLoading } = useSWR(
        id ? `/api/songs/${id}/` : null,
        fetcher,
        { fallbackData }
    );

    return {
        song: data,
        isLoading,
        error,
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
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const { data, error, isLoading } = useSWR(
        songId ? `/api/songs/${songId}/records/?${queryParams.toString()}` : null,
        fetcher,
        { fallbackData }
    );

    return {
        records: data?.results || [],
        total: data?.total || data?.count || 0,
        isLoading,
        error,
    };
}

/**
 * 排行榜 Hook
 */
export function useTopSongs(timeRange?: string, fallbackData?: Song[]) {
    const queryParams = new URLSearchParams();
    if (timeRange) queryParams.set('time_range', timeRange);

    const { data, error, isLoading } = useSWR(
        `/api/top_songs/?${queryParams.toString()}`,
        fetcher,
        { fallbackData }
    );

    return {
        topSongs: data || [],
        isLoading,
        error,
    };
}
