/**
 * Song 仓储实现
 * 
 * 实现 ISongRepository 接口，负责歌曲数据的实际获取
 * 依赖：ApiClient, SongMapper
 * 
 * @module infrastructure/repositories
 */

import { Song, SongRecord, OriginalWork, Recommendation } from '@/app/domain/types';
import {
    ISongRepository,
    GetSongsParams,
    GetRecordsParams,
    GetTopSongsParams,
    PaginatedResult,
} from '@/app/domain/repositories';
import { ApiClient } from '../api/base';
import { SongMapper } from '../mappers/SongMapper';

/**
 * 歌曲仓储实现类
 */
export class SongRepository implements ISongRepository {
    private apiClient: ApiClient;

    constructor(apiClient?: ApiClient) {
        this.apiClient = apiClient || new ApiClient();
    }

    /**
     * 构建查询参数字符串
     */
    private buildQueryParams(params: GetSongsParams): URLSearchParams {
        const queryParams = new URLSearchParams();
        
        if (params.q) queryParams.set('q', params.q);
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.ordering) queryParams.set('ordering', params.ordering);
        if (params.styles) queryParams.set('styles', params.styles);
        if (params.tags) queryParams.set('tags', params.tags);
        if (params.language) queryParams.set('language', params.language);
        
        return queryParams;
    }

    async getSongs(params: GetSongsParams = {}): Promise<PaginatedResult<Song>> {
        const queryParams = this.buildQueryParams(params);
        const result = await this.apiClient.get<any>(`/songs/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;
        
        // 处理后端返回的分页格式
        const results = SongMapper.fromBackendList(data.results || []);
        
        return {
            total: data.total || results.length,
            page: data.page || params.page || 1,
            page_size: data.page_size || params.limit || 20,
            results,
        };
    }

    async getSongById(id: string): Promise<Song> {
        const result = await this.apiClient.get<any>(`/songs/${id}/`);

        if (result.error) {
            throw result.error;
        }

        return SongMapper.fromBackend(result.data);
    }

    async getRecords(songId: string, params?: GetRecordsParams): Promise<PaginatedResult<SongRecord>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

        const result = await this.apiClient.get<any>(`/songs/${songId}/records/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;
        
        // 兼容处理两种数据格式：分页格式 和 数组格式
        let recordsArray: any[];
        let totalCount: number;

        if (Array.isArray(data)) {
            recordsArray = data;
            totalCount = data.length;
        } else if (data.results && Array.isArray(data.results)) {
            recordsArray = data.results;
            totalCount = data.total || data.results.length;
        } else {
            console.warn('SongRepository.getRecords: unexpected data format', data);
            return { results: [], total: 0, page: 1, page_size: 10 };
        }

        return {
            results: SongMapper.recordListFromBackend(recordsArray, songId),
            total: totalCount,
            page: data.page || 1,
            page_size: data.page_size || 10,
        };
    }

    async getStyles(): Promise<string[]> {
        const result = await this.apiClient.get<{ styles: string[] }>('/styles/');

        if (result.error) {
            throw result.error;
        }

        return result.data?.styles || [];
    }

    async getTags(): Promise<string[]> {
        const result = await this.apiClient.get<{ tags: string[] }>('/tags/');

        if (result.error) {
            throw result.error;
        }

        return result.data?.tags || [];
    }

    async getTopSongs(params?: GetTopSongsParams): Promise<Song[]> {
        const queryParams = new URLSearchParams();
        if (params?.range) queryParams.set('range', params.range);
        if (params?.limit) queryParams.set('limit', params.limit.toString());

        const result = await this.apiClient.get<any[]>(`/top_songs/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        return SongMapper.fromBackendList(result.data || []);
    }

    async getOriginalWorks(): Promise<OriginalWork[]> {
        const result = await this.apiClient.get<any[]>('/original-works/');

        if (result.error) {
            throw result.error;
        }

        return SongMapper.originalWorkListFromBackend(result.data || []);
    }

    async getRandomSong(): Promise<Song> {
        const result = await this.apiClient.get<any>('/random-song/');

        if (result.error) {
            throw result.error;
        }

        return SongMapper.fromBackend(result.data);
    }

    async getRecommendation(): Promise<Recommendation & { recommendedSongsDetails?: any[] }> {
        const result = await this.apiClient.get<any>('/site-settings/');

        if (result.error) {
            throw result.error;
        }

        return SongMapper.recommendationFromBackend(result.data);
    }

    async getFilterOptions(): Promise<{ styles: string[]; tags: string[]; languages: string[] }> {
        // 并行获取所有筛选选项
        const [stylesResult, tagsResult] = await Promise.all([
            this.getStyles(),
            this.getTags(),
        ]);

        // 语种列表可以从配置或 API 获取，这里返回常见语种
        const languages = ['国语', '粤语', '英语', '日语', '韩语', '其他'];

        return {
            styles: stylesResult,
            tags: tagsResult,
            languages,
        };
    }
}

/**
 * 默认歌曲仓储实例
 * 可以在应用启动时注入不同的实现（如 Mock、LocalStorage 等）
 */
export const songRepository = new SongRepository();
