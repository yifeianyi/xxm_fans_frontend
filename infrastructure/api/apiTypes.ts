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
