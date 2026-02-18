// 基础 API 客户端 - 适配 Next.js Server/Client Components
import { config } from '../config/config';
import { ApiResult, ApiErrorClass } from './apiTypes';

interface FetchOptions extends RequestInit {
    revalidate?: number;
}

/**
 * 获取基础 URL
 */
function getBaseURL(): string {
    // Server-side: 使用完整 URL
    if (typeof window === 'undefined') {
        return process.env.API_BASE_URL || 
               process.env.NEXT_PUBLIC_API_BASE_URL || 
               'http://localhost:8000/api';
    }
    // Client-side: 使用相对路径
    return '/api';
}

/**
 * 通用请求函数 - 适用于 Server 和 Client Components
 */
export async function request<T>(
    endpoint: string,
    options?: FetchOptions
): Promise<ApiResult<T>> {
    try {
        const baseURL = getBaseURL();
        const url = `${baseURL}${endpoint}`;
        
        console.log(`[API Request] ${url}`); // 调试日志
        
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
            throw new ApiErrorClass(response.status, `Request failed: ${response.statusText}`);
        }

        const responseData = await response.json();
        
        console.log(`[API Response] ${endpoint}:`, responseData ? 'OK' : 'Empty'); // 调试日志

        // 处理后端的统一响应格式: { code, message, data }
        if (responseData && typeof responseData === 'object' && 'code' in responseData) {
            if (responseData.code === 200) {
                return { data: responseData.data as T };
            } else {
                throw new ApiErrorClass(responseData.code, responseData.message || 'Request failed');
            }
        }

        // 如果不是统一格式，直接返回数据
        return { data: responseData as T };
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error); // 调试日志
        if (error instanceof ApiErrorClass) {
            return { error };
        }
        return { error: new ApiErrorClass(500, 'Network error') };
    }
}

/**
 * GET 请求
 */
export async function get<T>(endpoint: string, revalidate?: number): Promise<ApiResult<T>> {
    return request<T>(endpoint, { method: 'GET', revalidate });
}
