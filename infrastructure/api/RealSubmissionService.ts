import {
  ISubmissionService,
  MonthlySubmissionStatsResponse,
  MonthlySubmissionRecordsResponse,
  YearsSubmissionOverviewResponse,
  MonthlyStatsParams,
  MonthlyRecordsParams,
  YearsOverviewParams,
} from '../../domain/api/ISubmissionService';
import { config } from '../config/config';
import type {
  ApiResponse,
} from './apiTypes';

/**
 * 真实投稿服务实现
 * 实现投稿时刻相关的 API 调用
 */
class RealSubmissionService implements ISubmissionService {
  private baseURL = config.api.baseURL;
  private apiPath = 'data-analytics/submissions';

  /**
   * 通用 API 请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/${this.apiPath}/${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || data.code !== 200) {
        throw new Error(data.message || '请求失败');
      }

      return data.data;
    } catch (error) {
      console.error('API 请求失败:', error);
      throw error;
    }
  }

  /**
   * 获取月度投稿统计
   */
  async getMonthlySubmissionStats(
    params: MonthlyStatsParams
  ): Promise<MonthlySubmissionStatsResponse> {
    const queryParams = new URLSearchParams({
      year: params.year.toString(),
    });

    if (params.platform) {
      queryParams.append('platform', params.platform);
    }

    return this.request<MonthlySubmissionStatsResponse>(
      `monthly/?${queryParams.toString()}`
    );
  }

  /**
   * 获取月度投稿记录
   */
  async getMonthlySubmissionRecords(
    params: MonthlyRecordsParams
  ): Promise<MonthlySubmissionRecordsResponse> {
    const { year, month, platform, is_valid, page = 1, page_size = 20 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (platform) {
      queryParams.append('platform', platform);
    }

    if (is_valid !== undefined) {
      queryParams.append('is_valid', is_valid.toString());
    }

    return this.request<MonthlySubmissionRecordsResponse>(
      `monthly/${year}/${month}/?${queryParams.toString()}`
    );
  }

  /**
   * 获取年度投稿概览
   */
  async getYearsSubmissionOverview(
    params?: YearsOverviewParams
  ): Promise<YearsSubmissionOverviewResponse> {
    const queryParams = new URLSearchParams();

    if (params?.platform) {
      queryParams.append('platform', params.platform);
    }

    if (params?.start_year) {
      queryParams.append('start_year', params.start_year.toString());
    }

    if (params?.end_year) {
      queryParams.append('end_year', params.end_year.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `years/?${queryString}` : 'years/';

    return this.request<YearsSubmissionOverviewResponse>(endpoint);
  }

  /**
   * 清除月度统计缓存
   */
  async clearMonthlyStatsCache(year: number, platform?: string): Promise<void> {
    // 注意：此功能需要后端提供相应的清除缓存接口
    // 如果后端没有提供，可以实现为空操作或使用其他清除缓存策略
    console.log(`清除月度统计缓存: year=${year}, platform=${platform || 'all'}`);
  }
}

// 导出单例
export const realSubmissionService = new RealSubmissionService();