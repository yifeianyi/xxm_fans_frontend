/**
 * Song 数据映射器
 * 
 * 负责将后端 API 返回的原始数据转换为领域模型 (Song)
 * 集中管理所有数据转换逻辑，便于维护和测试
 * 
 * @module infrastructure/mappers
 */

import { Song, SongRecord, OriginalWork, Recommendation } from '@/app/domain/types';
import { getFullCoverUrl } from '../api/base';

/**
 * 后端歌曲数据结构（原始）
 */
interface BackendSongItem {
    id?: number | string;
    song_name?: string;
    singer?: string;
    styles?: string[];
    language?: string;
    first_perform?: string;
    last_performed?: string;
    last_perform?: string;
    perform_count?: number;
    tags?: string[];
}

/**
 * 后端演唱记录数据结构（原始）
 */
interface BackendRecordItem {
    id?: number | string;
    song_name?: string;
    performed_at?: string;
    cover_url?: string;
    cover?: string;
    cover_thumbnail_url?: string;
    notes?: string;
    note?: string;
    url?: string;
    video_url?: string;
}

/**
 * 后端原唱作品数据结构（原始）
 */
interface BackendOriginalWorkItem {
    title?: string;
    date?: string;
    desc?: string;
    cover?: string;
    songId?: string;
    song_id?: string;
    neteaseId?: string;
    netease_id?: string;
    bilibiliBvid?: string;
    bilibili_bvid?: string;
    bvid?: string;
    featured?: boolean;
}

/**
 * 推荐数据后端结构
 */
interface BackendRecommendationItem {
    content?: string;
    recommended_songs?: Array<{ id?: number | string; song_name?: string; singer?: string; language?: string }>;
    recommended_songs_details?: Array<{ id?: number | string; song_name?: string; singer?: string; language?: string }>;
    is_active?: boolean;
}

/**
 * Song 数据映射器类
 */
export class SongMapper {
    /**
     * 将后端歌曲数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 Song
     */
    static fromBackend(item: BackendSongItem): Song {
        return {
            id: item.id?.toString() || '',
            name: item.song_name || '未知歌曲',
            originalArtist: item.singer || '未知歌手',
            genres: Array.isArray(item.styles) ? item.styles : [],
            languages: item.language ? [item.language] : [],
            firstPerformance: item.first_perform || '',
            lastPerformance: item.last_performed || item.last_perform || '',
            performanceCount: item.perform_count || 0,
            tags: Array.isArray(item.tags) ? item.tags : [],
        };
    }

    /**
     * 批量转换后端歌曲数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static fromBackendList(items: BackendSongItem[]): Song[] {
        if (!Array.isArray(items)) {
            console.warn('SongMapper.fromBackendList: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.fromBackend(item));
    }

    /**
     * 将后端演唱记录数据转换为领域模型
     * @param item 后端返回的原始数据
     * @param songId 关联的歌曲 ID
     * @returns 领域模型 SongRecord
     */
    static recordFromBackend(item: BackendRecordItem, songId: string): SongRecord {
        const coverUrl = item.cover_url || item.cover || '';
        
        return {
            id: item.id?.toString() || '',
            songId: songId,
            songName: item.song_name || '',
            date: item.performed_at || '',
            cover: getFullCoverUrl(coverUrl),
            coverThumbnailUrl: getFullCoverUrl(item.cover_thumbnail_url || coverUrl),
            note: item.notes || item.note || '',
            videoUrl: item.url || item.video_url || '',
        };
    }

    /**
     * 批量转换后端演唱记录数据
     * @param items 后端返回的原始数据数组
     * @param songId 关联的歌曲 ID
     * @returns 领域模型数组
     */
    static recordListFromBackend(items: BackendRecordItem[], songId: string): SongRecord[] {
        if (!Array.isArray(items)) {
            console.warn('SongMapper.recordListFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.recordFromBackend(item, songId));
    }

    /**
     * 将后端原唱作品数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 OriginalWork
     */
    static originalWorkFromBackend(item: BackendOriginalWorkItem): OriginalWork {
        return {
            title: item.title || '',
            date: item.date || '',
            desc: item.desc || '',
            cover: getFullCoverUrl(item.cover),
            songId: item.songId || item.song_id || '',
            neteaseId: item.neteaseId || item.netease_id || '',
            bilibiliBvid: item.bilibiliBvid || item.bilibili_bvid || item.bvid || '',
            featured: item.featured || false,
        };
    }

    /**
     * 批量转换后端原唱作品数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static originalWorkListFromBackend(items: BackendOriginalWorkItem[]): OriginalWork[] {
        if (!Array.isArray(items)) {
            console.warn('SongMapper.originalWorkListFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.originalWorkFromBackend(item));
    }

    /**
     * 将后端推荐数据转换为领域模型
     * @param data 后端返回的原始数据（可能是数组或对象）
     * @returns 领域模型 Recommendation
     */
    static recommendationFromBackend(data: BackendRecommendationItem | BackendRecommendationItem[]): Recommendation & { recommendedSongsDetails?: any[] } {
        // API 返回的是数组，取第一个激活的推荐
        const recommendationData = Array.isArray(data)
            ? data.find((r: BackendRecommendationItem) => r.is_active) || data[0]
            : data;

        if (!recommendationData) {
            return {
                content: '',
                recommendedSongs: [],
                recommendedSongsDetails: [],
            };
        }

        const recommendedSongsDetails = recommendationData.recommended_songs_details?.map((song: any) => ({
            id: song.id?.toString() || '',
            name: song.song_name || '未知歌曲',
            singer: song.singer || '未知歌手',
            language: song.language || '未知语种',
        })) || [];

        return {
            content: recommendationData.content || '',
            recommendedSongs: recommendationData.recommended_songs?.map((song: any) => song.id?.toString() || '') || [],
            recommendedSongsDetails: recommendedSongsDetails,
        };
    }

    /**
     * 转换排序字段（前端显示名称 -> 后端字段名）
     * @param field 前端排序字段
     * @returns 后端字段名
     */
    static mapSortField(field: string): string {
        const fieldMap: Record<string, string> = {
            'count': 'perform_count',
            'first': 'first_perform',
            'last': 'last_performed',
            'name': 'song_name',
            'artist': 'singer',
        };
        return fieldMap[field] || field;
    }

    /**
     * 构建排序字符串
     * @param field 排序字段
     * @param direction 排序方向
     * @returns 后端排序参数
     */
    static buildOrderingParam(field: string, direction: 'asc' | 'desc'): string {
        const mappedField = this.mapSortField(field);
        return direction === 'asc' ? mappedField : `-${mappedField}`;
    }
}
