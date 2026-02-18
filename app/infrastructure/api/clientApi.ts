// 客户端 API 服务 - 直接使用完整 URL 访问后端
const API_BASE_URL = 'http://localhost:8000/api';

// 处理后端统一响应格式
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    // 处理后端统一格式 { code, message, data }
    if (result && typeof result === 'object' && 'code' in result) {
        if (result.code === 200) {
            return result.data as T;
        } else {
            throw new Error(result.message || 'API error');
        }
    }
    
    return result as T;
}

// 获取歌曲列表
export async function getSongsClient(params: {
    q?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    styles?: string;
    tags?: string;
    language?: string;
} = {}) {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.ordering) queryParams.set('ordering', params.ordering);
    if (params.styles) queryParams.set('styles', params.styles);
    if (params.tags) queryParams.set('tags', params.tags);
    if (params.language) queryParams.set('language', params.language);

    const url = `${API_BASE_URL}/songs/?${queryParams.toString()}`;
    console.log('[ClientAPI] Fetching:', url);
    
    const response = await fetch(url);
    return handleResponse<{ total: number; results: any[] }>(response);
}

// 获取排行榜
export async function getTopSongsClient(timeRange?: string) {
    const queryParams = new URLSearchParams();
    if (timeRange) queryParams.set('time_range', timeRange);
    
    const url = `${API_BASE_URL}/top_songs/?${queryParams.toString()}`;
    console.log('[ClientAPI] Fetching:', url);
    
    const response = await fetch(url);
    return handleResponse<any[]>(response);
}

// 获取原唱作品
export async function getOriginalsClient() {
    const url = `${API_BASE_URL}/originals/`;
    console.log('[ClientAPI] Fetching:', url);
    
    const response = await fetch(url);
    return handleResponse<any[]>(response);
}
