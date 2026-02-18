// 歌曲服务 - 适配 Next.js Server Components
import { get } from './base';
import { Song, SongRecord, OriginalWork } from '@/app/domain/types';
import { PaginatedResult, GetSongsParams, GetRecordsParams, GetTopSongsParams } from './apiTypes';

// 缓存时间配置（秒）
const CACHE_TIMES = {
    SONGS_LIST: 60,      // 歌曲列表缓存 1 分钟
    SONG_DETAIL: 300,    // 歌曲详情缓存 5 分钟
    STYLES_TAGS: 3600,   // 曲风标签缓存 1 小时
    TOP_SONGS: 3600,     // 排行榜缓存 1 小时
};

/**
 * 获取歌曲列表
 */
export async function getSongs(params: GetSongsParams = {}): Promise<PaginatedResult<Song>> {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.ordering) queryParams.set('ordering', params.ordering);
    if (params.styles) queryParams.set('styles', params.styles);
    if (params.tags) queryParams.set('tags', params.tags);
    if (params.language) queryParams.set('language', params.language);

    const result = await get<PaginatedResult<any>>(
        `/songs/?${queryParams.toString()}`,
        CACHE_TIMES.SONGS_LIST
    );

    if (result.data) {
        return {
            ...result.data,
            results: result.data.results.map(transformSong),
        };
    }
    throw result.error || new Error('Failed to fetch songs');
}

/**
 * 获取歌曲详情
 */
export async function getSongById(id: string): Promise<Song> {
    const result = await get<any>(`/songs/${id}/`, CACHE_TIMES.SONG_DETAIL);
    if (result.data) {
        return transformSong(result.data);
    }
    throw result.error || new Error('Failed to fetch song');
}

/**
 * 获取歌曲演唱记录
 */
export async function getSongRecords(
    songId: string,
    params?: GetRecordsParams
): Promise<PaginatedResult<SongRecord>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const result = await get<PaginatedResult<any>>(
        `/songs/${songId}/records/?${queryParams.toString()}`,
        CACHE_TIMES.SONGS_LIST
    );

    if (result.data) {
        return {
            ...result.data,
            results: result.data.results.map(transformSongRecord),
        };
    }
    throw result.error || new Error('Failed to fetch records');
}

/**
 * 获取曲风列表
 */
export async function getStyles(): Promise<string[]> {
    const result = await get<{ styles: string[] }>('/styles/', CACHE_TIMES.STYLES_TAGS);
    if (result.data) {
        return result.data.styles || [];
    }
    throw result.error || new Error('Failed to fetch styles');
}

/**
 * 获取标签列表
 */
export async function getTags(): Promise<string[]> {
    const result = await get<{ tags: string[] }>('/tags/', CACHE_TIMES.STYLES_TAGS);
    if (result.data) {
        return result.data.tags || [];
    }
    throw result.error || new Error('Failed to fetch tags');
}

/**
 * 获取排行榜
 */
export async function getTopSongs(params?: GetTopSongsParams): Promise<Song[]> {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.set('time_range', params.timeRange);
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const result = await get<any[]>(
        `/top_songs/?${queryParams.toString()}`,
        CACHE_TIMES.TOP_SONGS
    );

    if (result.data) {
        return result.data.map(transformSong);
    }
    throw result.error || new Error('Failed to fetch top songs');
}

/**
 * 获取原唱作品
 */
export async function getOriginals(): Promise<OriginalWork[]> {
    const result = await get<any[]>('/originals/', CACHE_TIMES.SONGS_LIST);
    if (result.data) {
        return result.data.map(transformOriginalWork);
    }
    throw result.error || new Error('Failed to fetch originals');
}

/**
 * 获取推荐歌曲
 */
export async function getFeaturedSongs(limit: number = 6): Promise<Song[]> {
    const result = await get<any[]>(`/featured-songs/?limit=${limit}`, CACHE_TIMES.SONGS_LIST);
    if (result.data) {
        return result.data.map(transformSong);
    }
    throw result.error || new Error('Failed to fetch featured songs');
}

/**
 * 获取随机歌曲
 */
export async function getRandomSong(): Promise<Song> {
    const result = await get<any>('/random-song/', 0); // 不缓存
    if (result.data) {
        return transformSong(result.data);
    }
    throw result.error || new Error('Failed to fetch random song');
}

// ========== 数据转换函数 ==========

function transformSong(item: any): Song {
    return {
        id: item.id?.toString() || '',
        name: item.song_name || '未知歌曲',
        originalArtist: item.singer || '未知歌手',
        genres: Array.isArray(item.styles) ? item.styles : [],
        languages: item.language ? [item.language] : [],
        firstPerformance: item.first_perform || '',
        lastPerformance: item.last_performed || '',
        performanceCount: item.perform_count || 0,
        tags: Array.isArray(item.tags) ? item.tags : [],
    };
}

function transformSongRecord(item: any): SongRecord {
    return {
        id: item.id?.toString() || '',
        songId: item.song?.toString() || '',
        songName: item.song_name || '',
        date: item.performed_at || '',
        cover: item.cover || '',
        coverThumbnailUrl: item.cover_thumbnail_url,
        note: item.note || '',
        videoUrl: item.video_url || '',
    };
}

function transformOriginalWork(item: any): OriginalWork {
    return {
        title: item.title || '',
        date: item.date || '',
        desc: item.desc || '',
        cover: item.cover || '',
        songId: item.song_id,
        neteaseId: item.netease_id,
        bilibiliBvid: item.bilibili_bvid,
        featured: item.featured || false,
    };
}
