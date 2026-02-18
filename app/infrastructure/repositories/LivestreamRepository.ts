/**
 * Livestream 仓储实现
 * 
 * 实现 ILivestreamRepository 接口，负责直播数据的实际获取
 * 
 * @module infrastructure/repositories
 */

import { Livestream, SongCut, Screenshot } from '@/app/domain/types';
import {
    ILivestreamRepository,
    GetLivestreamsParams,
    CalendarItem,
    LivestreamSegment,
} from '@/app/domain/repositories';
import { ApiClient } from '../api/base';
import { LivestreamMapper } from '../mappers/LivestreamMapper';

/**
 * 直播仓储实现类
 */
export class LivestreamRepository implements ILivestreamRepository {
    private apiClient: ApiClient;

    constructor(apiClient?: ApiClient) {
        this.apiClient = apiClient || new ApiClient();
    }

    async getLivestreams(params: GetLivestreamsParams = {}): Promise<{
        livestreams: Livestream[];
        total: number;
    }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.year) queryParams.set('year', params.year.toString());
        if (params.month) queryParams.set('month', params.month.toString());

        const result = await this.apiClient.get<any>(`/livestream/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        // 处理可能的数组或分页格式
        if (Array.isArray(data)) {
            return {
                livestreams: LivestreamMapper.fromBackendList(data),
                total: data.length,
            };
        }

        return {
            livestreams: LivestreamMapper.fromBackendList(data.results || []),
            total: data.total || data.results?.length || 0,
        };
    }

    async getLivestreamById(id: string): Promise<Livestream> {
        const result = await this.apiClient.get<any>(`/livestream/${id}/`);

        if (result.error) {
            throw result.error;
        }

        return LivestreamMapper.fromBackend(result.data);
    }

    async getCalendar(year: number, month: number): Promise<CalendarItem[]> {
        const result = await this.apiClient.get<any[]>(
            `/livestream/calendar/?year=${year}&month=${month}`
        );

        if (result.error) {
            throw result.error;
        }

        return LivestreamMapper.calendarFromBackend(result.data || []);
    }

    async getSegments(livestreamId: string): Promise<LivestreamSegment[]> {
        const result = await this.apiClient.get<any[]>(`/livestream/${livestreamId}/segments/`);

        if (result.error) {
            throw result.error;
        }

        return LivestreamMapper.segmentsFromBackend(result.data || []);
    }

    async getSongCuts(livestreamId: string): Promise<SongCut[]> {
        const result = await this.apiClient.get<any[]>(`/livestream/${livestreamId}/song-cuts/`);

        if (result.error) {
            throw result.error;
        }

        return LivestreamMapper.songCutsFromBackend(result.data || []);
    }

    async getScreenshots(livestreamId: string): Promise<Screenshot[]> {
        const result = await this.apiClient.get<any[]>(`/livestream/${livestreamId}/screenshots/`);

        if (result.error) {
            throw result.error;
        }

        return LivestreamMapper.screenshotsFromBackend(result.data || []);
    }

    async getRecentLivestreams(limit: number = 5): Promise<Livestream[]> {
        const result = await this.apiClient.get<any>(`/livestream/?limit=${limit}&ordering=-date`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        if (Array.isArray(data)) {
            return LivestreamMapper.fromBackendList(data);
        }

        return LivestreamMapper.fromBackendList(data.results || []);
    }
}

/**
 * 默认直播仓储实例
 */
export const livestreamRepository = new LivestreamRepository();
