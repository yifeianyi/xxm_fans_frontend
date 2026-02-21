// 基础设施层配置
// 注意：Server Components 需要完整 URL，Client Components 可以使用相对路径

function getBaseURL(): string {
    // Server-side: 使用完整 URL
    if (typeof window === 'undefined') {
        // 优先使用环境变量，否则使用默认值
        return process.env.API_BASE_URL || 
               process.env.NEXT_PUBLIC_API_BASE_URL || 
               'http://localhost:8000/api';
    }
    // Client-side: 使用相对路径（通过 Nginx 代理）
    return '/api';
}

export const config = {
    api: {
        get baseURL() {
            return getBaseURL();
        },
    },
} as const;
