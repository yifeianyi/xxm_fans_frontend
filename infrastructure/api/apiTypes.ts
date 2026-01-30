export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
}

export interface PaginatedResult<T> {
  total: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface GetSongsParams {
  q?: string;
  page?: number;
  limit?: number;
  ordering?: string;
  styles?: string;
  tags?: string;
  language?: string;
}

export interface GetRecordsParams {
  page?: number;
  page_size?: number;
}

export interface GetTopSongsParams {
  range?: string;
  limit?: number;
}

export interface GetWorksParams {
  page?: number;
  limit?: number;
  collection?: number;
}

// ==================== API 响应类型 ====================

/** API 统一响应格式 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** API 错误响应 */
export interface ApiErrorResponse {
  code: number;
  message: string;
  data: null;
}

/** 投稿时刻 API 响应类型 */
export type SubmissionStatsApiResponse = ApiResponse<import('../../domain/types').MonthlySubmissionStatsResponse>;
export type SubmissionRecordsApiResponse = ApiResponse<import('../../domain/types').MonthlySubmissionRecordsResponse>;
export type YearsOverviewApiResponse = ApiResponse<import('../../domain/types').YearsSubmissionOverviewResponse>;
