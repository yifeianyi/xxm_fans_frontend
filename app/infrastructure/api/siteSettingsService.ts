// 站点设置服务
import { get, getFullCoverUrl } from './base';
import { ApiResult } from './apiTypes';

const CACHE_TIMES = {
    SETTINGS: 600,    // 10分钟缓存
    MILESTONES: 600,
};

export interface SiteSettings {
    id: number;
    favicon?: string;
    favicon_url?: string;
    artist_name?: string;
    artist_avatar?: string;
    artist_avatar_url?: string;
    artist_birthday?: string;
    artist_constellation?: string;
    artist_location?: string;
    artist_profession?: string[];
    artist_voice_features?: string[];
    bilibili_url?: string;
    weibo_url?: string;
    netease_music_url?: string;
    youtube_url?: string;
    qq_music_url?: string;
    xiaohongshu_url?: string;
    douyin_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Milestone {
    id: number;
    date: string;
    title: string;
    description: string;
    display_order: number;
    created_at: string;
}

/**
 * 获取站点设置
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    const result = await get<any>('site-settings/settings/', CACHE_TIMES.SETTINGS);
    
    if (result.error) {
        console.warn('[SiteSettings] Failed to fetch settings:', result.error);
        return null;
    }
    
    if (result.data) {
        return {
            ...result.data,
            artist_avatar_url: getFullCoverUrl(result.data.artist_avatar_url || result.data.artist_avatar),
            favicon_url: getFullCoverUrl(result.data.favicon_url || result.data.favicon),
        };
    }
    return null;
}

/**
 * 获取里程碑列表
 */
export async function getMilestones(): Promise<Milestone[]> {
    const result = await get<any[]>('site-settings/milestones/', CACHE_TIMES.MILESTONES);
    
    if (result.error) {
        console.warn('[SiteSettings] Failed to fetch milestones:', result.error);
        return [];
    }
    
    if (result.data) {
        return result.data.map((item: any) => ({
            id: item.id,
            date: item.date,
            title: item.title,
            description: item.description,
            display_order: item.display_order,
            created_at: item.created_at,
        }));
    }
    return [];
}
