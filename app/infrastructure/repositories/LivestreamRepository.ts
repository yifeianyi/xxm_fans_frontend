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

        // 使用正确的后端 API 端点：/livestreams/ (复数)
        const result = await this.apiClient.get<any>(`/livestreams/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        // 处理后端统一响应格式: { code, message, data }
        // data 可能是数组或 { results: [...], total: N }
        let actualData = data;
        if (data && typeof data === 'object' && 'code' in data) {
            actualData = data.data;
        }

        // 处理可能的数组或分页格式
        if (Array.isArray(actualData)) {
            return {
                livestreams: LivestreamMapper.fromBackendList(actualData),
                total: actualData.length,
            };
        }

        return {
            livestreams: LivestreamMapper.fromBackendList(actualData?.results || []),
            total: actualData?.total || actualData?.results?.length || 0,
        };
    }

    async getLivestreamById(id: string): Promise<Livestream> {
        const result = await this.apiClient.get<any>(`/livestreams/${id}/`);

        if (result.error) {
            throw result.error;
        }

        // 处理后端统一响应格式
        const data = result.data?.data || result.data;
        return LivestreamMapper.fromBackend(data);
    }

    /**
     * 根据日期获取直播详情（包含截图、歌切等）
     * 后端 API: GET /livestreams/{date}/ 返回完整详情
     */
    async getLivestreamByDate(dateStr: string): Promise<Livestream | null> {
        const result = await this.apiClient.get<any>(`/livestreams/${dateStr}/`);

        if (result.error) {
            if (result.error.message?.includes('404')) {
                return null;
            }
            throw result.error;
        }

        // 处理后端统一响应格式: { code, message, data }
        const data = result.data?.data !== undefined ? result.data.data : result.data;
        
        // 后端返回 null 表示该日期无直播记录
        if (!data) {
            return null;
        }

        return LivestreamMapper.fromBackend(data);
    }

    async getCalendar(year: number, month: number): Promise<CalendarItem[]> {
        // 后端暂无专门的 calendar 端点，使用 getLivestreams 获取
        const result = await this.getLivestreams({ year, month });
        return result.livestreams.map(live => ({
            date: live.date,
            hasLivestream: true,
            livestreamId: live.id,
            title: live.title,
        }));
    }

    async getSegments(livestreamId: string): Promise<LivestreamSegment[]> {
        // 后端暂无独立的 segments 端点，segments 包含在详情中
        // 这个方法可以保留用于未来扩展
        const result = await this.apiClient.get<any[]>(`/livestreams/${livestreamId}/segments/`);

        if (result.error) {
            // 如果端点不存在，返回空数组
            return [];
        }

        return LivestreamMapper.segmentsFromBackend(result.data || []);
    }

    async getSongCuts(livestreamId: string): Promise<SongCut[]> {
        // 后端暂无独立的 song-cuts 端点，songCuts 包含在详情中
        // 这个方法可以保留用于未来扩展
        const result = await this.apiClient.get<any[]>(`/livestreams/${livestreamId}/song-cuts/`);

        if (result.error) {
            return [];
        }

        return LivestreamMapper.songCutsFromBackend(result.data || []);
    }

    async getScreenshots(livestreamId: string): Promise<Screenshot[]> {
        // 后端暂无独立的 screenshots 端点，screenshots 包含在详情中
        // 这个方法可以保留用于未来扩展
        const result = await this.apiClient.get<any[]>(`/livestreams/${livestreamId}/screenshots/`);

        if (result.error) {
            return [];
        }

        return LivestreamMapper.screenshotsFromBackend(result.data || []);
    }

    async getRecentLivestreams(limit: number = 5): Promise<Livestream[]> {
        const result = await this.apiClient.get<any>(`/livestreams/?limit=${limit}&ordering=-date`);

        if (result.error) {
            throw result.error;
        }

        // 处理后端统一响应格式
        const data = result.data?.data !== undefined ? result.data.data : result.data;

        if (Array.isArray(data)) {
            return LivestreamMapper.fromBackendList(data);
        }

        return LivestreamMapper.fromBackendList(data?.results || []);
    }

    async getConfig(): Promise<{ minYear: number }> {
        const result = await this.apiClient.get<any>('/livestreams/config/');

        if (result.error) {
            // 如果获取失败，返回默认值
            return { minYear: 2019 };
        }

        // 处理后端统一响应格式
        const data = result.data?.data !== undefined ? result.data.data : result.data;
        
        return {
            minYear: data?.minYear || 2019
        };
    }
}

/**
 * 默认直播仓储实例
 */
export const livestreamRepository = new LivestreamRepository();
