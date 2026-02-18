// 数据分析服务 - 适配 Next.js Server Components
import { get, getFullCoverUrl } from './base';
import { AccountData, VideoStats, TimeGranularity, CorrelationData } from '@/app/domain/types';

const CACHE_TIMES = {
    BASIC_STATS: 300,    // 基础统计缓存 5 分钟
    ACCOUNT_DATA: 600,   // 账号数据缓存 10 分钟
    VIDEO_STATS: 300,
};

/**
 * 获取基础统计数据
 */
export async function getBasicStats(): Promise<{
    totalSongs: number;
    totalWorks: number;
    totalLivestreams: number;
    totalGalleries: number;
}> {
    const result = await get<any>('/analytics/basic-stats/', CACHE_TIMES.BASIC_STATS);
    
    if (result.data) {
        return {
            totalSongs: result.data.total_songs || 0,
            totalWorks: result.data.total_works || 0,
            totalLivestreams: result.data.total_livestreams || 0,
            totalGalleries: result.data.total_galleries || 0,
        };
    }
    throw result.error || new Error('Failed to fetch basic stats');
}

/**
 * 获取账号数据（粉丝数等）
 */
export async function getAccountData(
    granularity: TimeGranularity = 'DAY'
): Promise<AccountData> {
    const result = await get<any>(
        `/analytics/account-data/?granularity=${granularity}`,
        CACHE_TIMES.ACCOUNT_DATA
    );
    
    if (result.data) {
        return transformAccountData(result.data);
    }
    throw result.error || new Error('Failed to fetch account data');
}

/**
 * 获取视频统计数据
 */
export async function getVideoStats(): Promise<VideoStats[]> {
    const result = await get<any[]>('/analytics/video-stats/', CACHE_TIMES.VIDEO_STATS);
    
    if (result.data) {
        return result.data.map(transformVideoStats);
    }
    throw result.error || new Error('Failed to fetch video stats');
}

/**
 * 获取相关性数据（播放量与粉丝增长）
 */
export async function getCorrelationData(): Promise<CorrelationData[]> {
    const result = await get<any[]>('/analytics/correlation/', CACHE_TIMES.VIDEO_STATS);
    
    if (result.data) {
        return result.data.map((item: any) => ({
            time: item.time || '',
            videoViewDelta: item.video_view_delta || 0,
            followerDelta: item.follower_delta || 0,
        }));
    }
    throw result.error || new Error('Failed to fetch correlation data');
}

// ========== 数据转换函数 ==========

function transformAccountData(item: any): AccountData {
    return {
        id: item.id?.toString() || '',
        name: item.name || '',
        totalFollowers: item.total_followers || 0,
        history: {
            DAY: item.history?.day || [],
            WEEK: item.history?.week || [],
            MONTH: item.history?.month || [],
        },
    };
}

function transformVideoStats(item: any): VideoStats {
    return {
        id: item.id?.toString() || '',
        title: item.title || '',
        cover: getFullCoverUrl(item.cover),
        publishTime: item.publish_time || '',
        duration: item.duration || '',
        views: item.views || 0,
        guestRatio: item.guest_ratio || 0,
        fanWatchRate: item.fan_watch_rate || 0,
        followerGrowth: item.follower_growth || 0,
        likes: item.likes || 0,
        comments: item.comments || 0,
        danmaku: item.danmaku || 0,
        favs: item.favs || 0,
        metrics: {
            DAY: {
                views: item.metrics?.day?.views || [],
                likes: item.metrics?.day?.likes || [],
                danmaku: item.metrics?.day?.danmaku || [],
            },
            WEEK: {
                views: item.metrics?.week?.views || [],
                likes: item.metrics?.week?.likes || [],
                danmaku: item.metrics?.week?.danmaku || [],
            },
            MONTH: {
                views: item.metrics?.month?.views || [],
                likes: item.metrics?.month?.likes || [],
                danmaku: item.metrics?.month?.danmaku || [],
            },
        },
    };
}
