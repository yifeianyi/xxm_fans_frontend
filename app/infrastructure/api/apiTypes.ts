// API 类型定义 - 基于原项目

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

// 后端实际返回的分页格式
export interface PaginatedResult<T> {
    total: number;
    page: number;
    page_size: number;
    results: T[];
}

// 查询参数类型
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
    page_size?: number;
    collection?: string;
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
