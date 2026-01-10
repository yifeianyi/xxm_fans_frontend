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
    name: '满满来信',
    icp: '蜀ICP备00000000号-1'
  }
} as const;
