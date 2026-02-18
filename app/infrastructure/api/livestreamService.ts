// 直播服务 - 适配 Next.js Server Components
import { get, getFullCoverUrl } from './base';
import { Livestream, SongCut, Screenshot } from '@/app/domain/types';
import { PaginatedResult } from './apiTypes';

const CACHE_TIMES = {
    LIVESTREAMS: 60,     // 直播列表缓存 1 分钟
    LIVESTREAM_DETAIL: 300,
    CALENDAR: 3600,      // 日历数据缓存 1 小时
};

/**
 * 获取直播列表
 */
export async function getLivestreams(
    year?: number,
    month?: number
): Promise<Livestream[]> {
    let endpoint = '/livestream/';
    if (year && month) {
        endpoint += `?year=${year}&month=${month}`;
    }
    
    const result = await get<any[]>(endpoint, CACHE_TIMES.LIVESTREAMS);
    
    if (result.data) {
        return result.data.map(transformLivestream);
    }
    throw result.error || new Error('Failed to fetch livestreams');
}

/**
 * 获取直播详情
 */
export async function getLivestreamById(id: string): Promise<Livestream> {
    const result = await get<any>(`/livestream/${id}/`, CACHE_TIMES.LIVESTREAM_DETAIL);
    
    if (result.data) {
        return transformLivestream(result.data);
    }
    throw result.error || new Error('Failed to fetch livestream');
}

/**
 * 获取日历数据
 */
export async function getCalendarData(year: number, month: number): Promise<Livestream[]> {
    const result = await get<any[]>(
        `/livestream/calendar/?year=${year}&month=${month}`,
        CACHE_TIMES.CALENDAR
    );
    
    if (result.data) {
        return result.data.map(transformLivestream);
    }
    throw result.error || new Error('Failed to fetch calendar data');
}

/**
 * 获取直播分段视频
 */
export async function getLivestreamSegments(livestreamId: string): Promise<any[]> {
    const result = await get<any[]>(
        `/livestream/${livestreamId}/segments/`,
        CACHE_TIMES.LIVESTREAM_DETAIL
    );
    
    if (result.data) {
        return result.data;
    }
    throw result.error || new Error('Failed to fetch segments');
}

/**
 * 获取当日歌切
 */
export async function getLivestreamSongCuts(livestreamId: string): Promise<SongCut[]> {
    const result = await get<any[]>(
        `/livestream/${livestreamId}/song-cuts/`,
        CACHE_TIMES.LIVESTREAM_DETAIL
    );
    
    if (result.data) {
        return result.data.map(transformSongCut);
    }
    throw result.error || new Error('Failed to fetch song cuts');
}

/**
 * 获取直播截图
 */
export async function getLivestreamScreenshots(livestreamId: string): Promise<Screenshot[]> {
    const result = await get<any[]>(
        `/livestream/${livestreamId}/screenshots/`,
        CACHE_TIMES.LIVESTREAM_DETAIL
    );
    
    if (result.data) {
        return result.data.map(transformScreenshot);
    }
    throw result.error || new Error('Failed to fetch screenshots');
}

// ========== 数据转换函数 ==========

function transformLivestream(item: any): Livestream {
    return {
        id: item.id?.toString() || '',
        date: item.date || '',
        title: item.title,
        summary: item.summary,
        viewCount: item.view_count,
        danmakuCount: item.danmaku_count,
        startTime: item.start_time,
        endTime: item.end_time,
        duration: item.duration,
        bvid: item.bvid,
        parts: item.parts,
        coverUrl: getFullCoverUrl(item.cover_url),
        recordings: item.recordings,
        songCuts: item.song_cuts?.map(transformSongCut),
        screenshots: item.screenshots?.map(transformScreenshot),
        danmakuCloudUrl: item.danmaku_cloud_url,
    };
}

function transformSongCut(item: any): SongCut {
    return {
        performed_at: item.performed_at || '',
        song_name: item.song_name || '',
        url: item.url || '',
        coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url),
    };
}

function transformScreenshot(item: any): Screenshot {
    return {
        url: getFullCoverUrl(item.url),
        thumbnailUrl: getFullCoverUrl(item.thumbnail_url),
    };
}
