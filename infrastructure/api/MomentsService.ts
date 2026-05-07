import { ApiResult, PaginatedResult } from './apiTypes';
import { config } from '../config/config';
import { Moment } from '../../domain/types';
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
          ...options?.headers
        }
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

export interface GetMomentsParams {
  source?: 'weibo' | 'bilibili';
  page?: number;
  limit?: number;
}

export class MomentsService {
  async getMoments(params?: GetMomentsParams): Promise<ApiResult<PaginatedResult<Moment>>> {
    const queryParams = new URLSearchParams();
    if (params?.source) queryParams.set('source', params.source);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    return apiClient.get<PaginatedResult<Moment>>(
      `/moments/?${queryParams.toString()}`
    );
  }

  async getMoment(id: number): Promise<ApiResult<Moment>> {
    return apiClient.get<Moment>(`/moments/${id}/`);
  }
}

export const momentsService = new MomentsService();
