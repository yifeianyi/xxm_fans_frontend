export const routes = [
  { path: '/', redirect: '/songs' },
  { path: '/songs', label: '歌曲列表' },
  { path: '/songs/hot', label: '热歌榜' },
  { path: '/songs/originals', label: '原唱作品' },
  { path: '/songs/submit', label: '投稿时刻' },
  { path: '/fansDIY', label: '二创展厅' },
  { path: '/gallery', label: '图集' },
  { path: '/live', label: '直播日历' },
  { path: '/data', label: '数据分析' },
  { path: '/about', label: '关于' }
] as const;
