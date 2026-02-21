/**
 * Analytics 仓储实现
 * 
 * 实现 IAnalyticsRepository 接口，负责数据分析数据的实际获取
 * 
 * @module infrastructure/repositories
 */

import { AccountData, VideoStats, CorrelationData, TimeGranularity } from '@/app/domain/types';
import {
    IAnalyticsRepository,
    GetAccountDataParams,
    GetVideoStatsParams,
    FollowerOverview,
} from '@/app/domain/repositories';
import { ApiClient } from '../api/base';
import { AnalyticsMapper } from '../mappers/AnalyticsMapper';

/**
 * 数据分析仓储实现类
 */
export class AnalyticsRepository implements IAnalyticsRepository {
    private apiClient: ApiClient;

    constructor(apiClient?: ApiClient) {
        this.apiClient = apiClient || new ApiClient();
    }

    async getAccounts(): Promise<Array<{ id: string; name: string; platform: string }>> {
        const result = await this.apiClient.get<any[]>('/data-analytics/followers/accounts/');

        if (result.error) {
            throw result.error;
        }

        return (result.data || []).map(item => AnalyticsMapper.accountItemFromBackend(item));
    }

    async getAccountData(params: GetAccountDataParams): Promise<AccountData> {
        const queryParams = new URLSearchParams();
        queryParams.set('account_id', params.accountId);
        if (params.granularity) queryParams.set('granularity', params.granularity);
        if (params.startDate) queryParams.set('start_date', params.startDate);
        if (params.endDate) queryParams.set('end_date', params.endDate);

        const result = await this.apiClient.get<any>(`/data-analytics/followers/accounts/${params.accountId}/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        return AnalyticsMapper.accountDataFromBackend(result.data);
    }

    async getFollowerOverview(): Promise<FollowerOverview> {
        const result = await this.apiClient.get<any>('/data-analytics/followers/overview/');

        if (result.error) {
            throw result.error;
        }

        return AnalyticsMapper.followerOverviewFromBackend(result.data);
    }

    async getVideoStats(params: GetVideoStatsParams): Promise<VideoStats> {
        const queryParams = new URLSearchParams();
        if (params.granularity) queryParams.set('granularity', params.granularity);

        const result = await this.apiClient.get<any>(`/data-analytics/works/bilibili/${params.videoId}/metrics/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        return AnalyticsMapper.videoStatsFromBackend(result.data);
    }

    async getVideos(params?: {
        page?: number;
        limit?: number;
        sortBy?: 'views' | 'likes' | 'publishTime';
    }): Promise<{
        videos: VideoStats[];
        total: number;
    }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sortBy) queryParams.set('sort_by', params.sortBy);

        const result = await this.apiClient.get<any>(`/data-analytics/works/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        if (Array.isArray(data)) {
            return {
                videos: AnalyticsMapper.videoStatsListFromBackend(data),
                total: data.length,
            };
        }

        return {
            videos: AnalyticsMapper.videoStatsListFromBackend(data.results || []),
            total: data.total || data.results?.length || 0,
        };
    }

    async getCorrelationData(params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<CorrelationData[]> {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.set('start_date', params.startDate);
        if (params?.endDate) queryParams.set('end_date', params.endDate);

        const result = await this.apiClient.get<any[]>(`/data-analytics/platform/bilibili/correlation/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        return AnalyticsMapper.correlationDataListFromBackend(result.data || []);
    }
}

/**
 * 默认数据分析仓储实例
 */
export const analyticsRepository = new AnalyticsRepository();
