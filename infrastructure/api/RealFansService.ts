import { ApiResult, PaginatedResult } from './apiTypes';
import { apiClient } from '../../shared/ApiClient';
import {
    FanProfile,
    FanRankingItem,
    DanmakuRankingItem,
    FansSearchResult,
    FansStats,
} from '../../domain/types';

export interface GetRankingParams {
    year?: number;
    page?: number;
    page_size?: number;
}

export interface GetSearchParams {
    q: string;
    page?: number;
    page_size?: number;
}

export class RealFansService {
    async getAttendanceRanking(params?: GetRankingParams): Promise<ApiResult<PaginatedResult<FanRankingItem>>> {
        const queryParams = new URLSearchParams();
        if (params?.year) queryParams.set('year', params.year.toString());
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
        return apiClient.get<PaginatedResult<FanRankingItem>>(`/livefans/ranking/attendance/?${queryParams.toString()}`);
    }

    async getDanmakuRanking(params?: GetRankingParams): Promise<ApiResult<PaginatedResult<DanmakuRankingItem>>> {
        const queryParams = new URLSearchParams();
        if (params?.year) queryParams.set('year', params.year.toString());
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
        return apiClient.get<PaginatedResult<DanmakuRankingItem>>(`/livefans/ranking/danmaku/?${queryParams.toString()}`);
    }

    async searchFans(params: GetSearchParams, signal?: AbortSignal): Promise<ApiResult<PaginatedResult<FansSearchResult>>> {
        const queryParams = new URLSearchParams();
        queryParams.set('q', params.q);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
        return apiClient.get<PaginatedResult<FansSearchResult>>(`/livefans/search/?${queryParams.toString()}`, signal);
    }

    async getFanProfile(uid: string): Promise<ApiResult<FanProfile>> {
        return apiClient.get<FanProfile>(`/livefans/profile/${uid}/`);
    }

    async getStats(): Promise<ApiResult<FansStats>> {
        return apiClient.get<FansStats>('/livefans/stats/');
    }
}

export const fansService = new RealFansService();
