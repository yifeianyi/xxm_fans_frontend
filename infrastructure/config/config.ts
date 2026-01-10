export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000
  },
  ui: {
    modalZIndex: 100,
    modalMaxWidth: 'max-w-5xl'
  },
  site: {
    name: '小满虫之家',
    icp: '鄂ICP备2025100707号-2'
  }
} as const;
