
export interface SongRecord {
  id: string;
  songId: string;
  date: string;
  cover: string;
  coverThumbnailUrl?: string;  // 缩略图 URL
  note: string;
  videoUrl: string;
}

export interface Song {
  id: string;
  name: string;
  originalArtist: string;
  genres: string[];
  languages: string[];
  firstPerformance: string;
  lastPerformance: string;
  performanceCount: number;
  tags: string[];
}

export interface Recommendation {
  content: string;
  recommendedSongs: string[]; 
}

// 推荐歌曲的详细信息
export interface RecommendedSong {
  id: string;
  name: string;
  singer: string;
  performCount?: number;
}

export interface FanWork {
  id: string;
  title: string;
  author: string;
  cover: string;
  coverThumbnailUrl?: string;  // 缩略图 URL
  videoUrl: string;
  note: string;
  collectionId: string;
  position: number;
}

export interface FanCollection {
  id: string;
  name: string;
  description: string;
  worksCount: number;
}

export enum TimeRange {
  ALL = 'all',
  MONTH = '1m',
  THREE_MONTHS = '3m',
  YEAR = '1y'
}

export interface FilterState {
  genres: string[];
  tags: string[];
  languages: string[];
}

// ========== 新增类型定义 ==========

// 数据分析相关
export interface DataPoint {
  time: string;
  value: number;
  delta: number;
}

export type TimeGranularity = 'HOUR' | 'DAY' | 'MONTH';

export interface AccountData {
  id: string;
  name: string;
  totalFollowers: number;
  history: Record<TimeGranularity, DataPoint[]>;
}

export interface VideoStats {
  id: string;
  title: string;
  cover: string;
  publishTime: string;
  duration: string;
  views: number;
  guestRatio: number;
  fanWatchRate: number;
  followerGrowth: number;
  likes: number;
  comments: number;
  danmaku: number;
  favs: number;
  metrics: Record<TimeGranularity, {
    views: DataPoint[];
    likes: DataPoint[];
    danmaku: DataPoint[];
  }>;
}

export interface CorrelationData {
  time: string;
  videoViewDelta: number;
  followerDelta: number;
}

// 图集相关
export interface Gallery {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  coverThumbnailUrl?: string;  // 缩略图 URL
  level: number;
  imageCount: number;
  image_count?: number;  // 后端返回的字段名
  folderPath: string;
  tags: string[];
  isLeaf: boolean;
  children?: Gallery[];
  breadcrumbs?: Breadcrumb[];
  createdAt?: string;
}

export interface Breadcrumb {
  id: string;
  title: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail_url?: string;  // 缩略图 URL（后端返回的字段名）
  thumbnailUrl?: string;   // 前端使用的缩略图 URL 字段
  title: string;
  filename: string;
  isGif?: boolean;  // 标记是否为 GIF 动图
  isVideo?: boolean;  // 标记是否为 MP4 视频
}

// 直播相关
export interface LivestreamRecording {
  title: string;
  url: string;
}

export interface SongCut {
  name: string;
  videoUrl: string;
}

export interface Livestream {
  id: string;
  date: string;
  title: string;
  summary: string;
  coverUrl: string;
  viewCount: string;
  danmakuCount: string;
  startTime: string;
  endTime: string;
  duration: string;
  recordings: LivestreamRecording[];
  songCuts: SongCut[];
  screenshots: string[];
  danmakuCloudUrl: string;
}

// 原创作品相关
export interface OriginalWork {
  title: string;
  date: string;
  desc: string;
  cover: string;
  songId: string;
  featured: boolean;
}
