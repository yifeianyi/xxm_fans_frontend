/**
 * 歌曲模块常量定义
 */

// 默认曲风选项
export const GENRES = [
    '流行', '古风', '摇滚', '民谣', '电子', '爵士', 'R&B', '说唱', '戏腔'
];

// 默认标签选项
export const TAGS = [
    '小甜歌', '高难度', '经典', '新歌', '合唱', '现场'
];

// 默认语言选项
export const LANGUAGES = [
    '国语', '粤语', '英语', '日语', '韩语'
];

// 默认分页大小
export const DEFAULT_PAGE_SIZE = 50;

// 默认排序字段
export const DEFAULT_SORT_BY = 'last_performed';

// 默认排序方向
export const DEFAULT_SORT_DIR = 'desc' as const;

// 排序字段映射（前端字段 -> 后端字段）
export const SORT_FIELD_MAP: Record<string, string> = {
    'originalArtist': 'singer',
    'lastPerformance': 'last_performed',
    'firstPerformance': 'first_perform',
    'performanceCount': 'perform_count',
};
