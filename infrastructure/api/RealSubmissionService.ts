import {
  MonthlySubmissionStatsResponse,
  MonthlySubmissionRecordsResponse,
  YearsSubmissionOverviewResponse,
  MonthlyStatsParams,
  MonthlyRecordsParams,
  YearsOverviewParams,
  MonthlyStats,
  YearSummary,
  SubmissionRecord,
  PaginationInfo,
  YearStats,
  YearsSummary,
} from '../../domain/types';
import { ISubmissionService } from '../../domain/api/ISubmissionService';
import { config } from '../config/config';
import type {
  ApiResponse,
} from './apiTypes';

// 后端 API 原始类型定义（snake_case）
interface ApiMonthlyStats {
  month: number;
  total: number;
  valid: number;
  invalid: number;
  first_submission: string;
  last_submission: string;
}

interface ApiYearSummary {
  total_submissions: number;
  valid_submissions: number;
  invalid_submissions: number;
  active_months: number;
}

interface ApiMonthlySubmissionStatsResponse {
  year: number;
  platform: string | null;
  monthly_stats: ApiMonthlyStats[];
  year_summary: ApiYearSummary;
}

interface ApiSubmissionRecord {
  id: number;
  platform: string;
  work_id: string;
  title: string;
  author: string;
  publish_time: string;
  cover_url: string;
  cover_thumbnail_url: string | null;
  is_valid: boolean;
  video_url: string;
  video_embed_url: string;
}

interface ApiPaginationInfo {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface ApiMonthlySubmissionRecordsResponse {
  year: number;
  month: number;
  platform: string | null;
  records: ApiSubmissionRecord[];
  pagination: ApiPaginationInfo;
}

interface ApiYearStats {
  year: number;
  total_submissions: number;
  valid_submissions: number;
  invalid_submissions: number;
  active_months: number;
  first_submission: string;
  last_submission: string;
}

interface ApiYearsSummary {
  total_years: number;
  total_submissions: number;
  valid_submissions: number;
  invalid_submissions: number;
}

interface ApiYearsSubmissionOverviewResponse {
  platform: string | null;
  years: ApiYearStats[];
  summary: ApiYearsSummary;
}

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
   * 转换月度统计
   */
  private transformMonthlyStats(stats: ApiMonthlyStats): MonthlyStats {
    return {
      month: stats.month,
      total: stats.total,
      valid: stats.valid,
      invalid: stats.invalid,
      firstSubmission: stats.first_submission,
      lastSubmission: stats.last_submission,
    };
  }

  /**
   * 转换年度汇总
   */
  private transformYearSummary(summary: ApiYearSummary): YearSummary {
    return {
      totalSubmissions: summary.total_submissions,
      validSubmissions: summary.valid_submissions,
      invalidSubmissions: summary.invalid_submissions,
      activeMonths: summary.active_months,
    };
  }

  /**
   * 转换投稿记录
   */
  private transformSubmissionRecord(record: ApiSubmissionRecord): SubmissionRecord {
    return {
      id: record.id,
      platform: record.platform,
      workId: record.work_id,
      title: record.title,
      author: record.author,
      publishTime: record.publish_time,
      coverUrl: record.cover_url,
      coverThumbnailUrl: record.cover_thumbnail_url,
      isValid: record.is_valid,
      videoUrl: record.video_url,
      videoEmbedUrl: record.video_embed_url,
    };
  }

  /**
   * 转换分页信息
   */
  private transformPaginationInfo(pagination: ApiPaginationInfo): PaginationInfo {
    return {
      total: pagination.total,
      page: pagination.page,
      pageSize: pagination.page_size,
      totalPages: pagination.total_pages,
    };
  }

  /**
   * 转换年度统计
   */
  private transformYearStats(stats: ApiYearStats): YearStats {
    return {
      year: stats.year,
      totalSubmissions: stats.total_submissions,
      validSubmissions: stats.valid_submissions,
      invalidSubmissions: stats.invalid_submissions,
      activeMonths: stats.active_months,
      firstSubmission: stats.first_submission,
      lastSubmission: stats.last_submission,
    };
  }

  /**
   * 转换年度汇总
   */
  private transformYearsSummary(summary: ApiYearsSummary): YearsSummary {
    return {
      totalYears: summary.total_years,
      totalSubmissions: summary.total_submissions,
      validSubmissions: summary.valid_submissions,
      invalidSubmissions: summary.invalid_submissions,
    };
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

    const data = await this.request<ApiMonthlySubmissionStatsResponse>(
      `monthly/?${queryParams.toString()}`
    );

    return {
      year: data.year,
      platform: data.platform,
      monthlyStats: data.monthly_stats.map(s => this.transformMonthlyStats(s)),
      yearSummary: this.transformYearSummary(data.year_summary),
    };
  }

  /**
   * 获取月度投稿记录
   */
  async getMonthlySubmissionRecords(
    params: MonthlyRecordsParams
  ): Promise<MonthlySubmissionRecordsResponse> {
    const { year, month, platform, isValid, page = 1, pageSize = 20 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (platform) {
      queryParams.append('platform', platform);
    }

    if (isValid !== undefined) {
      queryParams.append('is_valid', isValid.toString());
    }

    const data = await this.request<ApiMonthlySubmissionRecordsResponse>(
      `monthly/${year}/${month}/?${queryParams.toString()}`
    );

    return {
      year: data.year,
      month: data.month,
      platform: data.platform,
      records: data.records.map(r => this.transformSubmissionRecord(r)),
      pagination: this.transformPaginationInfo(data.pagination),
    };
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

    if (params?.startYear) {
      queryParams.append('start_year', params.startYear.toString());
    }

    if (params?.endYear) {
      queryParams.append('end_year', params.endYear.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `years/?${queryString}` : 'years/';

    const data = await this.request<ApiYearsSubmissionOverviewResponse>(endpoint);

    return {
      platform: data.platform,
      years: data.years.map(y => this.transformYearStats(y)),
      summary: this.transformYearsSummary(data.summary),
    };
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
