/**
 * Infrastructure Repositories 统一导出
 * 
 * @module infrastructure/repositories
 * @description 导出所有仓储实现，这些实现对应 Domain 层的接口定义
 */

// Song 模块
export { SongRepository, songRepository } from './SongRepository';

// Gallery 模块
export { GalleryRepository, galleryRepository } from './GalleryRepository';

// Livestream 模块
export { LivestreamRepository, livestreamRepository } from './LivestreamRepository';

// FansDIY 模块
export { FansDIYRepository, fansDIYRepository } from './FansDIYRepository';

// Analytics 模块
export { AnalyticsRepository, analyticsRepository } from './AnalyticsRepository';
