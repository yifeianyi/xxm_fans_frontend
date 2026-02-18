/**
 * Domain 层仓储接口统一导出
 * 
 * @module domain/repositories
 * @description 导出所有仓储接口定义，遵循依赖倒置原则
 */

// Song 模块
export {
    type ISongRepository,
    type GetSongsParams,
    type GetRecordsParams,
    type GetTopSongsParams,
    type PaginatedResult,
    SONG_REPOSITORY_TOKEN,
} from './ISongRepository';

// Gallery 模块
export {
    type IGalleryRepository,
    type GetGalleriesParams,
    type GetGalleryImagesParams,
    GALLERY_REPOSITORY_TOKEN,
} from './IGalleryRepository';

// Livestream 模块
export {
    type ILivestreamRepository,
    type GetLivestreamsParams,
    type CalendarItem,
    type LivestreamSegment,
    LIVESTREAM_REPOSITORY_TOKEN,
} from './ILivestreamRepository';

// FansDIY 模块
export {
    type IFansDIYRepository,
    type GetCollectionsParams,
    type GetWorksParams,
    FANSDIY_REPOSITORY_TOKEN,
} from './IFansDIYRepository';

// Analytics 模块
export {
    type IAnalyticsRepository,
    type GetAccountDataParams,
    type GetVideoStatsParams,
    type FollowerOverview,
    ANALYTICS_REPOSITORY_TOKEN,
} from './IAnalyticsRepository';
