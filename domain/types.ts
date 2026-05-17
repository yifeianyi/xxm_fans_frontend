
export interface SongRecord {
    id: string;
    songId: string;
    songName: string;
    date: string;
    cover: string;
    coverThumbnailUrl?: string;
    note: string;
    videoUrl: string;
    like_count?: number;
    user_liked?: boolean;
}

export type RecordSortBy = 'time' | 'likes';

export interface LikeResult {
    success: boolean;
    liked: boolean;
    like_count: number;
    action: string;
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
    history: Partial<Record<TimeGranularity, DataPoint[]>>;
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

export interface CorrelationWork {
    title: string;
    publishTime: string;
    coverUrl: string;
    platform: string;
    workId: string;
}

export interface CorrelationResponse {
    timeline: CorrelationData[];
    works: CorrelationWork[];
}

export interface AnalyticsWork {
    id: number;
    platform: string;
    work_id: string;
    title: string;
    author: string;
    publish_time: string;
    cover_url: string;
    is_valid: boolean;
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
    performed_at: string;  // 演唱日期
    song_name: string;     // 歌曲名称
    url: string;          // 演唱记录链接（B站视频链接）
    coverThumbnailUrl?: string;  // 封面缩略图 URL
}

export interface Livestream {
    id: string;
    date: string;
    title?: string;                            // 直播标题（后端可能返回 null）
    summary?: string;                          // 直播简介
    viewCount?: string;                        // 观看人数
    danmakuCount?: string;                     // 弹幕数
    startTime?: string;                        // 开播时间
    endTime?: string;                          // 下播时间
    duration?: string;                         // 直播时长
    bvid?: string;                             // B站视频BV号
    replayUrl?: string;                        // 直播回放完整地址（优先使用）
    parts?: number;                            // 视频分段数
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

// ==================== 作品深度观测相关类型 ====================

/** 时间线数据点 */
export interface TimelinePoint {
    time: string;
    viewCount: number;
    likeCount: number;
    coinCount: number;
    favoriteCount: number;
    danmakuCount: number;
    commentCount: number;
}

/** 作品时间线原始数据点（后端返回格式） */
export interface TimelineRawPoint {
    time: string;
    view_count: number;
    like_count: number;
    coin_count: number;
    favorite_count: number;
    danmaku_count: number;
    comment_count: number;
}

/** 作品时间线原始响应 */
export interface WorkTimelineRawResponse {
    has_week_data: boolean;
    week_series: TimelineRawPoint[];
    daily_series: TimelineRawPoint[];
}

/** 作品时间线响应（前端格式化后） */
export interface WorkTimelineResponse {
    hasWeekData: boolean;
    weekSeries: TimelinePoint[];
    dailySeries: TimelinePoint[];
}

// ==================== 满の动态相关类型 ====================

export interface MomentImage {
    original_url: string;
    thumbnail_url: string;
}

export interface Moment {
    id: number;
    source: 'weibo' | 'bilibili';
    source_id: string;
    content: string;
    images: MomentImage[];
    publish_time: string;
    like_count: number;
    comment_count: number;
    share_count: number;
    source_url: string;
    video_bvid: string;
    video_url: string;
    created_at: string;
}

// ==================== 满の粉丝相关类型 ====================

export interface FanProfile {
    uid: string;
    username: string;
    avatar_url: string;
    first_seen_at: string | null;
    attended_count: number;
    total_livestreams: number;
    attendance_rate: number;
    total_danmaku: number;
    records: FanAttendanceRecord[];
}

export interface FanAttendanceRecord {
    date: string;
    title: string;
    is_attended: boolean;
    has_danmaku: boolean;
    danmaku_count: number;
    has_gift: boolean;
    has_sc: boolean;
    has_guard: boolean;
    watch_duration_minutes: number;
}

export interface FanRankingItem {
    rank: number;
    uid: string;
    username: string;
    avatar_url: string;
    attendance_rate: number;
    attended_count: number;
    total_livestreams: number;
    total_danmaku: number;
}

export interface DanmakuRankingItem {
    rank: number;
    uid: string;
    username: string;
    avatar_url: string;
    danmaku_count: number;
    percentage: number;
}

export interface FansSearchResult {
    uid: string;
    username: string;
    avatar_url: string;
    fan_badge_level: number;
    year_attendance_rate: number;
    year_attendance_rank: number | null;
    year_danmaku_count: number;
    year_danmaku_rank: number | null;
    overall_attendance_rate: number;
    overall_attendance_rank: number | null;
}

export interface FansStats {
    total_fans: number;
    total_livestreams: number;
    total_attendances: number;
    total_danmaku: number;
    fans_label: string;
}

export interface GuardItem {
    uid: number;
    username: string;
    face: string;
    guard_level: number;
    guard_type: string;
    medal_name: string;
    medal_level: number;
    accompany: number;
}
