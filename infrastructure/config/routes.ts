export const routes = [
  { path: '/', redirect: '/songs' },
  { path: '/songs', label: '歌曲列表' },
  { path: '/fansDIY', label: '二创展厅' }
] as const;
