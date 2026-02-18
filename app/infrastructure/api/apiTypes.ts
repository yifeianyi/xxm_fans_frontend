// API 类型定义

export interface ApiError {
    code: number;
    message: string;
}

export interface ApiResult<T> {
    data?: T;
    error?: ApiError;
}

export interface PaginatedResult<T> {
    count: number;
    next: string | null;
    previous: string | null;
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
    timeRange?: string;
    limit?: number;
}

export interface GetWorksParams {
    collectionId?: string;
    page?: number;
    page_size?: number;
}

export class ApiErrorClass extends Error {
    constructor(
        public code: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}
