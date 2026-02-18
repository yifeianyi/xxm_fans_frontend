// 投稿时刻服务 - 基于原项目 RealSubmissionService
import {
    MonthlySubmissionStatsResponse,
    MonthlySubmissionRecordsResponse,
    YearsSubmissionOverviewResponse,
    MonthlyStatsParams,
    MonthlyRecordsParams,
    YearsOverviewParams
} from '@/app/domain/types';
import { ApiResult, ApiError } from './apiTypes';
import { getFullCoverUrl } from './base';

// API 基础 URL
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
            console.log(`[Submission API] ${url}`);

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
            console.error(`[Submission API Error] ${endpoint}:`, error);
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
 * 投稿服务类
 */
class SubmissionService {
    private apiPath = 'data-analytics/submissions';

    /**
     * 获取月度投稿统计
     */
    async getMonthlyStats(params: MonthlyStatsParams): Promise<ApiResult<MonthlySubmissionStatsResponse>> {
        const queryParams = new URLSearchParams();
        queryParams.set('year', params.year.toString());
        if (params.platform) queryParams.set('platform', params.platform);

        const result = await apiClient.get<any>(
            `/${this.apiPath}/monthly/?${queryParams.toString()}`
        );

        if (result.data) {
            // 转换 snake_case 到 camelCase
            const transformed: MonthlySubmissionStatsResponse = {
                year: result.data.year,
                platform: result.data.platform,
                monthlyStats: (result.data.monthly_stats || []).map((item: any) => ({
                    month: item.month,
                    total: item.total,
                    valid: item.valid,
                    invalid: item.invalid,
                    firstSubmission: item.first_submission,
                    lastSubmission: item.last_submission
                })),
                yearSummary: {
                    totalSubmissions: result.data.year_summary?.total_submissions || 0,
                    validSubmissions: result.data.year_summary?.valid_submissions || 0,
                    invalidSubmissions: result.data.year_summary?.invalid_submissions || 0,
                    activeMonths: result.data.year_summary?.active_months || 0
                }
            };
            return { data: transformed };
        }
        return result as ApiResult<MonthlySubmissionStatsResponse>;
    }

    /**
     * 获取月度投稿记录
     */
    async getMonthlyRecords(params: MonthlyRecordsParams): Promise<ApiResult<MonthlySubmissionRecordsResponse>> {
        const { year, month, platform, isValid, page = 1, pageSize = 20 } = params;

        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        queryParams.set('page_size', pageSize.toString());
        if (platform) queryParams.set('platform', platform);
        if (isValid !== undefined) queryParams.set('is_valid', isValid.toString());

        const result = await apiClient.get<any>(
            `/${this.apiPath}/monthly/${year}/${month}/?${queryParams.toString()}`
        );

        if (result.data) {
            const transformed: MonthlySubmissionRecordsResponse = {
                year: result.data.year,
                month: result.data.month,
                platform: result.data.platform,
                records: (result.data.records || []).map((item: any) => ({
                    id: item.id,
                    platform: item.platform,
                    workId: item.work_id,
                    title: item.title,
                    author: item.author,
                    publishTime: item.publish_time,
                    coverUrl: getFullCoverUrl(item.cover_url),
                    coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url),
                    isValid: item.is_valid,
                    videoUrl: item.video_url,
                    videoEmbedUrl: item.video_embed_url
                })),
                pagination: {
                    total: result.data.pagination?.total || 0,
                    page: result.data.pagination?.page || 1,
                    pageSize: result.data.pagination?.page_size || 20,
                    totalPages: result.data.pagination?.total_pages || 1
                }
            };
            return { data: transformed };
        }
        return result as ApiResult<MonthlySubmissionRecordsResponse>;
    }

    /**
     * 获取年度投稿概览
     */
    async getYearsOverview(params?: YearsOverviewParams): Promise<ApiResult<YearsSubmissionOverviewResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.platform) queryParams.set('platform', params.platform);
        if (params?.startYear) queryParams.set('start_year', params.startYear.toString());
        if (params?.endYear) queryParams.set('end_year', params.endYear.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `years/?${queryString}` : 'years/';

        const result = await apiClient.get<any>(`/${this.apiPath}/${endpoint}`);

        if (result.data) {
            const transformed: YearsSubmissionOverviewResponse = {
                platform: result.data.platform,
                years: (result.data.years || []).map((item: any) => ({
                    year: item.year,
                    totalSubmissions: item.total_submissions,
                    validSubmissions: item.valid_submissions,
                    invalidSubmissions: item.invalid_submissions,
                    activeMonths: item.active_months,
                    firstSubmission: item.first_submission,
                    lastSubmission: item.last_submission
                })),
                summary: {
                    totalYears: result.data.summary?.total_years || 0,
                    totalSubmissions: result.data.summary?.total_submissions || 0,
                    validSubmissions: result.data.summary?.valid_submissions || 0,
                    invalidSubmissions: result.data.summary?.invalid_submissions || 0
                }
            };
            return { data: transformed };
        }
        return result as ApiResult<YearsSubmissionOverviewResponse>;
    }
}

// 导出单例实例
export const submissionService = new SubmissionService();
