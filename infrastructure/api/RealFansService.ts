import { ApiResult, PaginatedResult } from './apiTypes';
import { config } from '../config/config';
import {
    FanProfile,
    FanRankingItem,
    DanmakuRankingItem,
    FansSearchResult,
    FansStats,
} from '../../domain/types';
import { ApiError } from './apiTypes';

class ApiClient {
    private baseURL = config.api.baseURL;

    private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });
            if (!response.ok) throw new ApiError(response.status, `Request failed: ${response.statusText}`);
            const responseData = await response.json();
            if (responseData && typeof responseData === 'object' && 'code' in responseData) {
                if (responseData.code === 200) return { data: responseData.data as T };
                throw new ApiError(responseData.code, responseData.message || 'Request failed');
            }
            return { data: responseData as T };
        } catch (error) {
            if (error instanceof ApiError) return { error };
            return { error: new ApiError(500, 'Network error') };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResult<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }
}

const apiClient = new ApiClient();

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

    async searchFans(params: GetSearchParams): Promise<ApiResult<PaginatedResult<FansSearchResult>>> {
        const queryParams = new URLSearchParams();
        queryParams.set('q', params.q);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
        return apiClient.get<PaginatedResult<FansSearchResult>>(`/livefans/search/?${queryParams.toString()}`);
    }

    async getFanProfile(uid: string): Promise<ApiResult<FanProfile>> {
        return apiClient.get<FanProfile>(`/livefans/profile/${uid}/`);
    }

    async getStats(): Promise<ApiResult<FansStats>> {
        return apiClient.get<FansStats>('/livefans/stats/');
    }
}

export const fansService = new RealFansService();
