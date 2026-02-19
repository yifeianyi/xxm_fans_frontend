/**
 * Livestream 数据映射器
 * 
 * 负责将后端 API 返回的原始数据转换为领域模型 (Livestream)
 * 
 * @module infrastructure/mappers
 */

import { Livestream, SongCut, Screenshot, LivestreamRecording } from '@/app/domain/types';
import { getFullCoverUrl } from '../api/base';
import { CalendarItem, LivestreamSegment } from '@/app/domain/repositories/ILivestreamRepository';

/**
 * 后端直播数据结构（原始）
 * 注意：后端可能返回 camelCase 或 snake_case 字段，需要兼容处理
 */
interface BackendLivestreamItem {
    id?: number | string;
    date?: string;
    title?: string | null;
    summary?: string | null;
    // 支持两种命名格式
    viewCount?: string | number;
    view_count?: string | number;
    danmakuCount?: string | number;
    danmaku_count?: string | number;
    startTime?: string;
    start_time?: string;
    endTime?: string;
    end_time?: string;
    duration?: string;
    bvid?: string;
    parts?: number;
    // 支持两种命名格式
    coverUrl?: string;
    cover_url?: string;
    recordings?: BackendRecordingItem[];
    // 支持两种命名格式
    songCuts?: BackendSongCutItem[];
    song_cuts?: BackendSongCutItem[];
    // 支持两种命名格式
    screenshots?: BackendScreenshotItem[];
    // 支持两种命名格式
    danmakuCloudUrl?: string;
    danmaku_cloud_url?: string;
}

/**
 * 后端录制数据结构
 */
interface BackendRecordingItem {
    title?: string;
    url?: string;
}

/**
 * 后端歌切数据结构
 * 支持两种命名格式
 */
interface BackendSongCutItem {
    performed_at?: string;
    song_name?: string;
    url?: string;
    cover_thumbnail_url?: string;
    coverThumbnailUrl?: string;
}

/**
 * 后端截图数据结构
 * 后端返回的是 camelCase 格式
 */
interface BackendScreenshotItem {
    url?: string;
    thumbnailUrl?: string;
    thumbnail_url?: string;
}

/**
 * 后端日历数据结构
 */
interface BackendCalendarItem {
    date?: string;
    has_livestream?: boolean;
    livestream_id?: number | string;
    title?: string;
}

/**
 * 后端分段视频数据结构
 */
interface BackendSegmentItem {
    part?: number;
    title?: string;
    url?: string;
    duration?: string;
}

/**
 * Livestream 数据映射器类
 */
export class LivestreamMapper {
    /**
     * 将后端直播数据转换为领域模型
     * @param item 后端返回的原始数据（支持 camelCase 和 snake_case）
     * @returns 领域模型 Livestream
     */
    static fromBackend(item: BackendLivestreamItem): Livestream {
        return {
            id: item.id?.toString() || '',
            date: item.date || '',
            title: item.title || undefined,
            summary: item.summary || undefined,
            // 兼容 camelCase 和 snake_case
            viewCount: (item.viewCount ?? item.view_count)?.toString(),
            danmakuCount: (item.danmakuCount ?? item.danmaku_count)?.toString(),
            startTime: item.startTime ?? item.start_time,
            endTime: item.endTime ?? item.end_time,
            duration: item.duration,
            bvid: item.bvid,
            parts: item.parts,
            // 兼容 camelCase 和 snake_case
            coverUrl: getFullCoverUrl(item.coverUrl ?? item.cover_url),
            recordings: item.recordings ? this.recordingsFromBackend(item.recordings) : undefined,
            // 兼容 camelCase 和 snake_case
            songCuts: this.songCutsFromBackend(item.songCuts ?? item.song_cuts),
            // screenshots 字段已经是 camelCase，直接使用
            screenshots: item.screenshots ? this.screenshotsFromBackend(item.screenshots) : undefined,
            // 兼容 camelCase 和 snake_case
            danmakuCloudUrl: item.danmakuCloudUrl ?? item.danmaku_cloud_url,
        };
    }

    /**
     * 批量转换后端直播数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static fromBackendList(items: BackendLivestreamItem[]): Livestream[] {
        if (!Array.isArray(items)) {
            console.warn('LivestreamMapper.fromBackendList: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.fromBackend(item));
    }

    /**
     * 将后端录制数据转换为领域模型
     * @param items 后端返回的原始数据数组
     * @returns 录制记录数组
     */
    static recordingsFromBackend(items: BackendRecordingItem[]): LivestreamRecording[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            title: item.title || '',
            url: item.url || '',
        }));
    }

    /**
     * 将后端歌切数据转换为领域模型
     * @param items 后端返回的原始数据数组（支持 camelCase 和 snake_case）
     * @returns 歌切数组
     */
    static songCutsFromBackend(items?: BackendSongCutItem[] | null): SongCut[] {
        if (!items || !Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            performed_at: item.performed_at || '',
            song_name: item.song_name || '',
            url: item.url || '',
            // 兼容 camelCase 和 snake_case
            coverThumbnailUrl: getFullCoverUrl(item.coverThumbnailUrl ?? item.cover_thumbnail_url),
        }));
    }

    /**
     * 将后端截图数据转换为领域模型
     * @param items 后端返回的原始数据数组（已是 camelCase 格式）
     * @returns 截图数组
     */
    static screenshotsFromBackend(items?: BackendScreenshotItem[] | null): Screenshot[] {
        if (!items || !Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            url: getFullCoverUrl(item.url),
            thumbnailUrl: getFullCoverUrl(item.thumbnailUrl ?? item.thumbnail_url ?? item.url),
        }));
    }

    /**
     * 将后端日历数据转换为领域模型
     * @param items 后端返回的原始数据数组
     * @returns 日历项数组
     */
    static calendarFromBackend(items: BackendCalendarItem[]): CalendarItem[] {
        if (!Array.isArray(items)) {
            console.warn('LivestreamMapper.calendarFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => ({
            date: item.date || '',
            hasLivestream: item.has_livestream || false,
            livestreamId: item.livestream_id?.toString(),
            title: item.title,
        }));
    }

    /**
     * 将后端分段视频数据转换为领域模型
     * @param items 后端返回的原始数据数组
     * @returns 分段视频数组
     */
    static segmentsFromBackend(items: BackendSegmentItem[]): LivestreamSegment[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            part: item.part || 1,
            title: item.title || '',
            url: item.url || '',
            duration: item.duration,
        }));
    }

    /**
     * 格式化直播时长
     * @param duration ISO 8601 格式的时长字符串
     * @returns 格式化后的时长字符串 (如 "2小时30分钟")
     */
    static formatDuration(duration?: string): string {
        if (!duration) return '';
        
        // 简单的时长解析，实际可能需要更复杂的逻辑
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return duration;
        
        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const seconds = parseInt(match[3] || '0');
        
        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours}小时`);
        if (minutes > 0) parts.push(`${minutes}分钟`);
        if (seconds > 0 && hours === 0) parts.push(`${seconds}秒`);
        
        return parts.join('') || duration;
    }
}
