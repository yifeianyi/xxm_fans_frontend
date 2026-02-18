// 基础设施层配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const config = {
    api: {
        baseURL: API_BASE_URL,
    },
} as const;
