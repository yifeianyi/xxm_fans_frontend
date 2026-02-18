/**
 * Infrastructure Hooks 统一导出
 * 
 * @module infrastructure/hooks
 * @description 导出所有基础设施层 Hooks
 * 
 * 这些 Hooks 基于 Repository 模式实现，封装了数据获取逻辑
 * 使用 SWR 进行状态管理，支持缓存、重试、乐观更新等特性
 */

// Songs 相关 Hooks
export {
    useSongs,
    useSong,
    useSongRecords,
    useTopSongs,
    useStyles,
    useTags,
    useFilterOptions,
    useRandomSong,
    useOriginalWorks,
} from './useSongs';

// Gallery 相关 Hooks
export {
    useGalleries,
    useGallery,
    useGalleryImages,
} from './useGallery';
