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
 */
interface BackendLivestreamItem {
    id?: number | string;
    date?: string;
    title?: string | null;
    summary?: string | null;
    view_count?: string | number;
    danmaku_count?: string | number;
    start_time?: string;
    end_time?: string;
    duration?: string;
    bvid?: string;
    parts?: number;
    cover_url?: string;
    recordings?: BackendRecordingItem[];
    song_cuts?: BackendSongCutItem[];
    screenshots?: BackendScreenshotItem[];
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
 */
interface BackendSongCutItem {
    performed_at?: string;
    song_name?: string;
    url?: string;
    cover_thumbnail_url?: string;
}

/**
 * 后端截图数据结构
 */
interface BackendScreenshotItem {
    url?: string;
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
     * @param item 后端返回的原始数据
     * @returns 领域模型 Livestream
     */
    static fromBackend(item: BackendLivestreamItem): Livestream {
        return {
            id: item.id?.toString() || '',
            date: item.date || '',
            title: item.title || undefined,
            summary: item.summary || undefined,
            viewCount: item.view_count?.toString(),
            danmakuCount: item.danmaku_count?.toString(),
            startTime: item.start_time,
            endTime: item.end_time,
            duration: item.duration,
            bvid: item.bvid,
            parts: item.parts,
            coverUrl: getFullCoverUrl(item.cover_url),
            recordings: item.recordings ? this.recordingsFromBackend(item.recordings) : undefined,
            songCuts: item.song_cuts ? this.songCutsFromBackend(item.song_cuts) : undefined,
            screenshots: item.screenshots ? this.screenshotsFromBackend(item.screenshots) : undefined,
            danmakuCloudUrl: item.danmaku_cloud_url,
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
     * @param items 后端返回的原始数据数组
     * @returns 歌切数组
     */
    static songCutsFromBackend(items: BackendSongCutItem[]): SongCut[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            performed_at: item.performed_at || '',
            song_name: item.song_name || '',
            url: item.url || '',
            coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url),
        }));
    }

    /**
     * 将后端截图数据转换为领域模型
     * @param items 后端返回的原始数据数组
     * @returns 截图数组
     */
    static screenshotsFromBackend(items: BackendScreenshotItem[]): Screenshot[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => ({
            url: getFullCoverUrl(item.url),
            thumbnailUrl: getFullCoverUrl(item.thumbnail_url || item.url),
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
