
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
  songId?: string;         // 网易云音乐歌曲 ID（可选，向后兼容）
  neteaseId?: string;      // 网易云音乐歌曲 ID（可选）
  bilibiliBvid?: string;   // B站视频 BV 号（可选）
  featured: boolean;
}

// ==================== 投稿时刻相关类型 ====================

/** 月度投稿统计 */
export interface MonthlyStats {
  month: number;
  total: number;
  valid: number;
  invalid: number;
  first_submission: string;
  last_submission: string;
}

/** 年度汇总统计 */
export interface YearSummary {
  total_submissions: number;
  valid_submissions: number;
  invalid_submissions: number;
  active_months: number;
}

/** 月度投稿统计响应 */
export interface MonthlySubmissionStatsResponse {
  year: number;
  platform: string | null;
  monthly_stats: MonthlyStats[];
  year_summary: YearSummary;
}

/** 投稿记录 */
export interface SubmissionRecord {
  id: number;
  platform: string;
  work_id: string;
  title: string;
  author: string;
  publish_time: string;
  cover_url: string;
  cover_thumbnail_url: string | null;
  is_valid: boolean;
  video_url: string;
  video_embed_url: string;
}

/** 分页信息 */
export interface PaginationInfo {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** 月度投稿记录响应 */
export interface MonthlySubmissionRecordsResponse {
  year: number;
  month: number;
  platform: string | null;
  records: SubmissionRecord[];
  pagination: PaginationInfo;
}

/** 年度统计 */
export interface YearStats {
  year: number;
  total_submissions: number;
  valid_submissions: number;
  invalid_submissions: number;
  active_months: number;
  first_submission: string;
  last_submission: string;
}

/** 年度汇总 */
export interface YearsSummary {
  total_years: number;
  total_submissions: number;
  valid_submissions: number;
  invalid_submissions: number;
}

/** 年度投稿概览响应 */
export interface YearsSubmissionOverviewResponse {
  platform: string | null;
  years: YearStats[];
  summary: YearsSummary;
}

/** 投稿统计查询参数 */
export interface MonthlyStatsParams {
  year: number;
  platform?: string;
}

/** 投稿记录查询参数 */
export interface MonthlyRecordsParams {
  year: number;
  month: number;
  platform?: string;
  is_valid?: boolean;
  page?: number;
  page_size?: number;
}

/** 年度概览查询参数 */
export interface YearsOverviewParams {
  platform?: string;
  start_year?: number;
  end_year?: number;
}
