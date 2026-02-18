// 歌曲服务 - 适配 Next.js Server/Client Components
// 基于原项目 RealSongService 实现

import { Song, SongRecord, OriginalWork, Recommendation } from '@/app/domain/types';
import {
    ApiResult,
    PaginatedResult,
    GetSongsParams,
    GetRecordsParams,
    GetTopSongsParams,
    ApiError
} from './apiTypes';
import { getFullCoverUrl } from './base';

// API 基础 URL - 从环境变量获取
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * API 客户端 - 内部类
 */
class ApiClient {
    private baseURL = API_BASE_URL;

    private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
        try {
            // 确保 URL 正确拼接（处理斜杠）
            const normalizedBaseURL = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
            const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
            const url = `${normalizedBaseURL}${normalizedEndpoint}`;

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers
                }
            });

            if (!response.ok) {
                throw new ApiError(response.status, `Request failed: ${response.statusText}`);
            }

            const responseData = await response.json();

            // 处理后端的统一响应格式: { code, message, data }
            if (responseData && typeof responseData === 'object' && 'code' in responseData) {
                if (responseData.code === 200) {
                    return { data: responseData.data as T };
                } else {
                    throw new ApiError(responseData.code, responseData.message || 'Request failed');
                }
            }

            // 如果不是统一格式，直接返回数据
            return { data: responseData as T };
        } catch (error) {
            console.error(`[API Error] ${endpoint}:`, error);
            if (error instanceof ApiError) {
                return { error };
            }
            return { error: new ApiError(500, 'Network error') };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResult<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }
}

const apiClient = new ApiClient();

/**
 * 歌曲服务类
 */
class SongService {
    async getSongs(params: GetSongsParams): Promise<ApiResult<PaginatedResult<Song>>> {
        const queryParams = new URLSearchParams();
        if (params.q) queryParams.set('q', params.q);
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.ordering) queryParams.set('ordering', params.ordering);
        if (params.styles) queryParams.set('styles', params.styles);
        if (params.tags) queryParams.set('tags', params.tags);
        if (params.language) queryParams.set('language', params.language);

        const result = await apiClient.get<PaginatedResult<any>>(`/songs/?${queryParams.toString()}`);

        if (result.data) {
            const transformed: PaginatedResult<Song> = {
                ...result.data,
                results: result.data.results.map((item: any) => ({
                    id: item.id?.toString() || '',
                    name: item.song_name || '未知歌曲',
                    originalArtist: item.singer || '未知歌手',
                    genres: Array.isArray(item.styles) ? item.styles : [],
                    languages: item.language ? [item.language] : [],
                    firstPerformance: item.first_perform || '',
                    lastPerformance: item.last_performed || item.last_perform || '',
                    performanceCount: item.perform_count || 0,
                    tags: Array.isArray(item.tags) ? item.tags : []
                }))
            };
            return { data: transformed };
        }
        return result;
    }

    async getSongById(id: string): Promise<ApiResult<Song>> {
        const result = await apiClient.get<any>(`/songs/${id}/`);

        if (result.data) {
            const transformed: Song = {
                id: result.data.id?.toString() || '',
                name: result.data.song_name || '未知歌曲',
                originalArtist: result.data.singer || '未知歌手',
                genres: Array.isArray(result.data.styles) ? result.data.styles : [],
                languages: result.data.language ? [result.data.language] : [],
                firstPerformance: result.data.first_perform || '',
                lastPerformance: result.data.last_performed || result.data.last_perform || '',
                performanceCount: result.data.perform_count || 0,
                tags: Array.isArray(result.data.tags) ? result.data.tags : []
            };
            return { data: transformed };
        }
        return result;
    }

    async getRecords(songId: string, params?: GetRecordsParams): Promise<ApiResult<PaginatedResult<SongRecord>>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

        const result = await apiClient.get<any>(`/songs/${songId}/records/?${queryParams.toString()}`);

        if (result.data) {
            // 兼容处理两种数据格式：分页格式 和 数组格式
            let recordsArray: any[];
            let totalCount: number;

            if (Array.isArray(result.data)) {
                recordsArray = result.data;
                totalCount = result.data.length;
            } else if (result.data.results && Array.isArray(result.data.results)) {
                recordsArray = result.data.results;
                totalCount = result.data.total || result.data.results.length;
            } else {
                console.warn('⚠️ getRecords 返回未知数据格式:', result.data);
                return { data: { results: [], total: 0, page: 1, page_size: 10 } };
            }

            const transformed: PaginatedResult<SongRecord> = {
                results: recordsArray.map((item: any) => ({
                    id: item.id?.toString() || '',
                    songId: songId,
                    songName: item.song_name || '',
                    date: item.performed_at || '',
                    cover: getFullCoverUrl(item.cover_url || item.cover),
                    coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url || item.cover_url || item.cover),
                    note: item.notes || item.note || '',
                    videoUrl: item.url || item.video_url || ''
                })),
                total: totalCount,
                page: result.data.page || 1,
                page_size: result.data.page_size || 10
            };
            return { data: transformed };
        }
        return result;
    }

    async getStyles(): Promise<ApiResult<string[]>> {
        const result = await apiClient.get<{ styles: string[] }>('/styles/');
        if (result.data) {
            return { data: result.data.styles || [] };
        }
        return { error: result.error || new ApiError(500, 'Failed to fetch styles') };
    }

    async getTags(): Promise<ApiResult<string[]>> {
        const result = await apiClient.get<{ tags: string[] }>('/tags/');
        if (result.data) {
            return { data: result.data.tags || [] };
        }
        return { error: result.error || new ApiError(500, 'Failed to fetch tags') };
    }

    async getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>> {
        const queryParams = new URLSearchParams();
        if (params?.range) {
            queryParams.set('range', params.range);
        }
        if (params?.limit) queryParams.set('limit', params.limit.toString());

        const result = await apiClient.get<any[]>(`/top_songs/?${queryParams.toString()}`);

        if (result.data) {
            const transformed: Song[] = result.data.map((item: any) => ({
                id: item.id?.toString() || '',
                name: item.song_name || '未知歌曲',
                originalArtist: item.singer || '未知歌手',
                genres: Array.isArray(item.styles) ? item.styles : [],
                languages: item.language ? [item.language] : [],
                firstPerformance: item.first_perform || '',
                lastPerformance: item.last_performed || '',
                performanceCount: item.perform_count || 0,
                tags: Array.isArray(item.tags) ? item.tags : []
            }));
            return { data: transformed };
        }
        return result;
    }

    async getOriginalWorks(): Promise<ApiResult<OriginalWork[]>> {
        const result = await apiClient.get<any[]>('/original-works/');

        if (result.data && Array.isArray(result.data)) {
            const transformed: OriginalWork[] = result.data.map((item: any) => ({
                title: item.title || '',
                date: item.date || '',
                desc: item.desc || '',
                cover: getFullCoverUrl(item.cover),
                // 支持两种字段命名：驼峰命名（后端返回）和下划线命名（兼容）
                songId: item.songId || item.song_id || '',
                neteaseId: item.neteaseId || item.netease_id || '',
                bilibiliBvid: item.bilibiliBvid || item.bilibili_bvid || item.bvid || '',
                featured: item.featured || false
            }));
            return { data: transformed };
        }
        return result;
    }

    async getRandomSong(): Promise<ApiResult<Song>> {
        const result = await apiClient.get<any>('/random-song/');

        if (result.data) {
            const transformed: Song = {
                id: result.data.id?.toString() || '',
                name: result.data.song_name || '未知歌曲',
                originalArtist: result.data.singer || '未知歌手',
                genres: Array.isArray(result.data.styles) ? result.data.styles : [],
                languages: result.data.language ? [result.data.language] : [],
                firstPerformance: result.data.first_perform || '',
                lastPerformance: result.data.last_performed || '',
                performanceCount: result.data.perform_count || 0,
                tags: Array.isArray(result.data.tags) ? result.data.tags : []
            };
            return { data: transformed };
        }
        return result;
    }

    async getRecommendation(): Promise<ApiResult<Recommendation & { recommendedSongsDetails?: any[] }>> {
        const result = await apiClient.get<any>('/site-settings/');

        if (result.data) {
            // API 返回的是数组，取第一个激活的推荐
            const recommendationData = Array.isArray(result.data) 
                ? result.data.find((r: any) => r.is_active) || result.data[0] 
                : result.data;

            if (recommendationData) {
                const recommendedSongsDetails = recommendationData.recommended_songs_details?.map((song: any) => ({
                    id: song.id?.toString() || '',
                    name: song.song_name || '未知歌曲',
                    singer: song.singer || '未知歌手',
                    language: song.language || '未知语种'
                })) || [];

                const transformed: Recommendation & { recommendedSongsDetails?: any[] } = {
                    content: recommendationData.content || '',
                    recommendedSongs: recommendationData.recommended_songs?.map((song: any) => song.id?.toString() || '') || [],
                    recommendedSongsDetails: recommendedSongsDetails
                };

                return { data: transformed };
            }
        }
        return result as ApiResult<Recommendation & { recommendedSongsDetails?: any[] }>;
    }
}

// 导出单例实例
export const songService = new SongService();
