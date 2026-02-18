// 基础设施层配置
// Server Component 使用完整 URL，Client Component 使用相对路径
const isServer = typeof window === 'undefined';
const API_BASE_URL = isServer 
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api')
    : '/api';

export const config = {
    api: {
        baseURL: API_BASE_URL,
    },
} as const;
