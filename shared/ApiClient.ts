import { ApiResult } from '../infrastructure/api/apiTypes';
import { config } from '../infrastructure/config/config';
import { ApiError } from '../infrastructure/api/apiTypes';

const API_TIMEOUT_MS = 30000;

class ApiClient {
    private baseURL = config.api.baseURL;

    private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

        const externalSignal = options?.signal;
        if (externalSignal) {
            if (externalSignal.aborted) controller.abort();
            else externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
        }

        try {
            const url = `${this.baseURL}${endpoint}`;
            const { signal: _, ...restOptions } = (options || {}) as RequestInit & { signal?: AbortSignal };
            const response = await fetch(url, {
                ...restOptions,
                signal: controller.signal,
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    ...restOptions.headers,
                },
            });
            if (!response.ok) throw new ApiError(response.status, `Request failed: ${response.statusText}`);
            const responseData = await response.json();
            if (responseData && typeof responseData === 'object' && 'code' in responseData) {
                if (responseData.code === 200) return { data: responseData.data as T };
                throw new ApiError(responseData.code, responseData.message || 'Request failed');
            }
            return { data: responseData as T };
        } catch (error) {
            if (error instanceof ApiError) return { error };
            if ((error as Error).name === 'AbortError') {
                return { error: new ApiError(408, 'Request timeout') };
            }
            return { error: new ApiError(500, 'Network error') };
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async get<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResult<T>> {
        return this.request<T>(endpoint, { method: 'GET', signal });
    }
}

export const apiClient = new ApiClient();
