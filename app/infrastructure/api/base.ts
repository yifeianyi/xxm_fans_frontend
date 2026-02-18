// 基础 API 客户端 - 适配 Next.js Server/Client Components
import { config } from '../config/config';
import { ApiResult, ApiError } from './apiTypes';

interface FetchOptions extends RequestInit {
    revalidate?: number;
}

/**
 * 获取基础 URL
 * 
 * 注意：Client-side 和 Server-side 都使用完整 URL 直接访问后端
 * 避免 Next.js rewrite 配置的复杂性
 * 
 * Server-side 需要使用宿主机的 IP 或 Docker 网络地址来访问后端
 */
function getBaseURL(): string {
    // Server-side: 使用环境变量，优先使用 INTERNAL_API_BASE_URL（容器内部访问）
    if (typeof window === 'undefined') {
        // 在 Docker/容器环境中，需要使用宿主机 IP 或 docker 网络名来访问后端
        // INTERNAL_API_BASE_URL: http://host.docker.internal:8000/api 或 http://django:8000/api
        return process.env.INTERNAL_API_BASE_URL || 
               process.env.API_BASE_URL || 
               process.env.NEXT_PUBLIC_API_BASE_URL || 
               'http://localhost:8000/api';
    }
    // Client-side: 使用 NEXT_PUBLIC_ 环境变量
    return process.env.NEXT_PUBLIC_API_BASE_URL || 
           'http://localhost:8000/api';
}

/**
 * 通用请求函数 - 适用于 Server 和 Client Components
 */
export async function request<T>(
    endpoint: string,
    options?: FetchOptions
): Promise<ApiResult<T>> {
    const baseURL = getBaseURL();
    const isServerSide = typeof window === 'undefined';
    
    // 确保 URL 正确拼接（处理斜杠）
    const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${normalizedBaseURL}${normalizedEndpoint}`;
    
    try {
        console.log(`[API Request] ${isServerSide ? '[SSR]' : '[CSR]'} ${url}`);
        
        // Next.js fetch 选项
        const fetchOptions: any = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        };

        // 添加 revalidate 选项（ISR 支持）
        if (options?.revalidate !== undefined) {
            fetchOptions.next = { revalidate: options.revalidate };
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            throw new ApiError(response.status, `Request failed: ${response.statusText}`);
        }

        const responseData = await response.json();
        
        console.log(`[API Response] ${endpoint}:`, responseData ? 'OK' : 'Empty');

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
        // 详细错误日志
        if (error instanceof ApiError) {
            console.error(`[API Error] ${endpoint}:`, {
                status: error.status,
                message: error.message,
                url: url,
                isServerSide: isServerSide
            });
            return { error };
        }
        console.error(`[API Network Error] ${endpoint}:`, error);
        return { error: new ApiError(500, 'Network error') };
    }
}

/**
 * GET 请求
 */
export async function get<T>(endpoint: string, revalidate?: number): Promise<ApiResult<T>> {
    return request<T>(endpoint, { method: 'GET', revalidate });
}

/**
 * 获取媒体文件基础 URL
 * Server-side 和 Client-side 使用不同的地址
 */
function getMediaBaseURL(): string {
    const apiUrl = typeof window === 'undefined'
        ? process.env.INTERNAL_API_BASE_URL || process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
        : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    
    return apiUrl.replace(/\/api\/?$/, '');
}

/**
 * 转换封面 URL 为完整路径
 * 将相对路径如 /media/covers/... 转换为完整 URL
 */
export function getFullCoverUrl(coverPath: string | null | undefined): string {
    if (!coverPath) return '';
    // 如果已经是完整 URL，直接返回
    if (coverPath.startsWith('http://') || coverPath.startsWith('https://')) {
        return coverPath;
    }
    // 确保路径以 / 开头
    const normalizedPath = coverPath.startsWith('/') ? coverPath : `/${coverPath}`;
    const mediaBaseURL = getMediaBaseURL();
    const fullUrl = `${mediaBaseURL}${normalizedPath}`;
    
    // 调试日志（开发环境）
    if (typeof window !== 'undefined') {
        console.log('[getFullCoverUrl]', { coverPath, mediaBaseURL, fullUrl });
    }
    
    return fullUrl;
}
