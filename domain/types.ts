
export interface SongRecord {
    id: string;
    songId: string;
    songName: string;  // 歌曲名称
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

export type TimeGranularity = 'DAY' | 'WEEK' | 'MONTH';

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
    thumbnailUrl?: string;  // 缩略图 URL
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

export interface Screenshot {
    url: string;           // 原图URL
    thumbnailUrl: string;  // 缩略图URL
}

export interface SongCut {
    performedAt: string;  // 演唱日期
    songName: string;     // 歌曲名称
    url: string;          // 演唱记录链接（B站视频链接）
}

export interface Livestream {
    id: string;
    date: string;
    title: string;
    summary: string;
    viewCount: string;
    danmakuCount: string;
    startTime: string;
    endTime: string;
    duration: string;
    bvid: string;                              // B站视频BV号
    parts: number;                             // 视频分段数
    coverUrl?: string;                         // 封面图URL（基本信息）
    recordings?: LivestreamRecording[];        // 后端生成的完整视频链接列表（详细信息）
    songCuts?: SongCut[];                      // 歌曲剪辑列表（详细信息）
    screenshots?: Screenshot[];                // 包含缩略图的截图数组（详细信息）
    danmakuCloudUrl?: string;                  // 弹幕云图URL（详细信息）
}

// 原唱作品相关
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
    firstSubmission: string;
    lastSubmission: string;
}

/** 年度汇总统计 */
export interface YearSummary {
    totalSubmissions: number;
    validSubmissions: number;
    invalidSubmissions: number;
    activeMonths: number;
}

/** 月度投稿统计响应 */
export interface MonthlySubmissionStatsResponse {
    year: number;
    platform: string | null;
    monthlyStats: MonthlyStats[];
    yearSummary: YearSummary;
}

/** 投稿记录 */
export interface SubmissionRecord {
    id: number;
    platform: string;
    workId: string;
    title: string;
    author: string;
    publishTime: string;
    coverUrl: string;
    coverThumbnailUrl: string | null;
    isValid: boolean;
    videoUrl: string;
    videoEmbedUrl: string;
}

/** 分页信息 */
export interface PaginationInfo {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
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
    totalSubmissions: number;
    validSubmissions: number;
    invalidSubmissions: number;
    activeMonths: number;
    firstSubmission: string;
    lastSubmission: string;
}

/** 年度汇总 */
export interface YearsSummary {
    totalYears: number;
    totalSubmissions: number;
    validSubmissions: number;
    invalidSubmissions: number;
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
    isValid?: boolean;
    page?: number;
    pageSize?: number;
}

/** 年度概览查询参数 */
export interface YearsOverviewParams {
    platform?: string;
    startYear?: number;
    endYear?: number;
}
