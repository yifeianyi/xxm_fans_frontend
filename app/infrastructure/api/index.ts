/**
 * Infrastructure API 层统一导出
 * 
 * @module infrastructure/api
 * @description 导出 API 相关的所有内容
 * 
 * 架构说明：
 * - Repository 模式（推荐）：通过 Repository 访问数据，支持依赖注入
 * - Service 模式（兼容）：旧的 Service 方式，内部已重构为调用 Repository
 * 
 * 推荐使用方式：
 * ```typescript
 * import { songRepository } from '@/app/infrastructure/repositories';
 * const songs = await songRepository.getSongs(params);
 * ```
 */

// ==================== Repository 导出（推荐）====================
// 从 repositories 模块重新导出，便于统一访问
export {
    // Repository 类
    SongRepository,
    GalleryRepository,
    LivestreamRepository,
    FansDIYRepository,
    AnalyticsRepository,
    // Repository 实例（默认）
    songRepository,
    galleryRepository,
    livestreamRepository,
    fansDIYRepository,
    analyticsRepository,
} from '@/app/infrastructure/repositories';

// ==================== Service 导出（兼容）====================
// 旧的 Service 方式，内部已重构为调用 Repository
// 标记为 @deprecated，建议迁移到 Repository 模式
export { songService } from './songService';
export { submissionService } from './submissionService';

// ==================== API 类型导出 ====================
export type {
    ApiResult,
    PaginatedResult,
    GetSongsParams,
    GetRecordsParams,
    GetTopSongsParams,
    GetWorksParams,
    ApiResponse,
    ApiErrorResponse,
} from './apiTypes';
// ApiError 作为值和类型一起导出
export { ApiError } from './apiTypes';

// ==================== API 客户端导出 ====================
export { ApiClient, request, get, getFullCoverUrl } from './base';

// ==================== 其他 Service 导出（函数式 API）====================
export * as galleryService from './galleryService';
export * as livestreamService from './livestreamService';
export * as analyticsService from './analyticsService';
export * as fansDIYService from './fansDIYService';
export * as siteSettingsService from './siteSettingsService';
