import { ApiResult, PaginatedResult } from './apiTypes';
import { apiClient } from '../../shared/ApiClient';
import { Moment } from '../../domain/types';

export interface GetMomentsParams {
    source?: string;
    page?: number;
    limit?: number;
}

export class MomentsService {
    async getMoments(params?: GetMomentsParams): Promise<ApiResult<PaginatedResult<Moment>>> {
        const queryParams = new URLSearchParams();
        if (params?.source) queryParams.set('source', params.source);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        return apiClient.get<PaginatedResult<Moment>>(`/moments/?${queryParams.toString()}`);
    }

    async getMoment(id: number): Promise<ApiResult<Moment>> {
        return apiClient.get<Moment>(`/moments/${id}/`);
    }
}

export const momentsService = new MomentsService();
