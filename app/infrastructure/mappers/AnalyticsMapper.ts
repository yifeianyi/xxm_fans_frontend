/**
 * Analytics 数据映射器
 * 
 * 负责将后端 API 返回的原始数据转换为领域模型 (AccountData, VideoStats, CorrelationData)
 * 
 * @module infrastructure/mappers
 */

import { AccountData, VideoStats, CorrelationData, DataPoint, TimeGranularity } from '@/app/domain/types';
import { FollowerOverview } from '@/app/domain/repositories/IAnalyticsRepository';
import { getFullCoverUrl } from '../api/base';

/**
 * 后端数据点结构
 */
interface BackendDataPoint {
    time?: string;
    value?: number;
    delta?: number;
}

/**
 * 后端账号数据结构
 */
interface BackendAccountData {
    id?: number | string;
    name?: string;
    total_followers?: number;
    history?: Record<string, BackendDataPoint[]>;
}

/**
 * 后端视频数据结构
 */
interface BackendVideoStats {
    id?: number | string;
    title?: string;
    cover?: string;
    publish_time?: string;
    duration?: string;
    views?: number;
    guest_ratio?: number;
    fan_watch_rate?: number;
    follower_growth?: number;
    likes?: number;
    comments?: number;
    danmaku?: number;
    favs?: number;
    metrics?: Record<string, {
        views?: BackendDataPoint[];
        likes?: BackendDataPoint[];
        danmaku?: BackendDataPoint[];
    }>;
}

/**
 * 后端相关性数据结构
 */
interface BackendCorrelationData {
    time?: string;
    video_view_delta?: number;
    follower_delta?: number;
}

/**
 * 后端账号列表项
 */
interface BackendAccountItem {
    id?: number | string;
    name?: string;
    platform?: string;
}

/**
 * 后端粉丝数概览
 */
interface BackendFollowerOverview {
    total_followers?: number;
    today_growth?: number;
    week_growth?: number;
    month_growth?: number;
}

/**
 * Analytics 数据映射器类
 */
export class AnalyticsMapper {
    /**
     * 将后端数据点转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 DataPoint
     */
    static dataPointFromBackend(item: BackendDataPoint): DataPoint {
        return {
            time: item.time || '',
            value: item.value || 0,
            delta: item.delta || 0,
        };
    }

    /**
     * 批量转换后端数据点
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static dataPointListFromBackend(items: BackendDataPoint[]): DataPoint[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => this.dataPointFromBackend(item));
    }

    /**
     * 转换时间粒度历史数据
     * @param history 后端返回的历史数据
     * @returns 转换后的历史数据
     */
    static historyFromBackend(history?: Record<string, BackendDataPoint[]>): Record<TimeGranularity, DataPoint[]> {
        if (!history || typeof history !== 'object') {
            return { DAY: [], WEEK: [], MONTH: [] };
        }

        const result: Record<TimeGranularity, DataPoint[]> = { DAY: [], WEEK: [], MONTH: [] };
        
        for (const [key, value] of Object.entries(history)) {
            const granularity = key.toUpperCase() as TimeGranularity;
            if (granularity in result) {
                result[granularity] = this.dataPointListFromBackend(value);
            }
        }
        
        return result;
    }

    /**
     * 将后端账号数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 AccountData
     */
    static accountDataFromBackend(item: BackendAccountData): AccountData {
        return {
            id: item.id?.toString() || '',
            name: item.name || '',
            totalFollowers: item.total_followers || item.totalFollowers || 0,
            history: this.historyFromBackend(item.history),
        };
    }

    /**
     * 将后端视频数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 VideoStats
     */
    static videoStatsFromBackend(item: BackendVideoStats): VideoStats {
        // 转换指标数据
        const metrics: VideoStats['metrics'] = { 
            DAY: { views: [], likes: [], danmaku: [] },
            WEEK: { views: [], likes: [], danmaku: [] },
            MONTH: { views: [], likes: [], danmaku: [] },
        };
        
        if (item.metrics) {
            for (const [key, value] of Object.entries(item.metrics)) {
                const granularity = key.toUpperCase() as TimeGranularity;
                metrics[granularity] = {
                    views: this.dataPointListFromBackend(value.views || []),
                    likes: this.dataPointListFromBackend(value.likes || []),
                    danmaku: this.dataPointListFromBackend(value.danmaku || []),
                };
            }
        }

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
            metrics,
        };
    }

    /**
     * 批量转换后端视频数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static videoStatsListFromBackend(items: BackendVideoStats[]): VideoStats[] {
        if (!Array.isArray(items)) {
            console.warn('AnalyticsMapper.videoStatsListFromBackend: expected array, got', typeof items);
            return [];
        }
        return items.map(item => this.videoStatsFromBackend(item));
    }

    /**
     * 将后端相关性数据转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 CorrelationData
     */
    static correlationDataFromBackend(item: BackendCorrelationData): CorrelationData {
        return {
            time: item.time || '',
            videoViewDelta: item.video_view_delta || 0,
            followerDelta: item.follower_delta || 0,
        };
    }

    /**
     * 批量转换后端相关性数据
     * @param items 后端返回的原始数据数组
     * @returns 领域模型数组
     */
    static correlationDataListFromBackend(items: BackendCorrelationData[]): CorrelationData[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map(item => this.correlationDataFromBackend(item));
    }

    /**
     * 将后端账号列表项转换为标准格式
     * @param item 后端返回的原始数据
     * @returns 标准化账号信息
     */
    static accountItemFromBackend(item: BackendAccountItem): { id: string; name: string; platform: string } {
        return {
            id: item.id?.toString() || '',
            name: item.name || '',
            platform: item.platform || '',
        };
    }

    /**
     * 将后端粉丝数概览转换为领域模型
     * @param item 后端返回的原始数据
     * @returns 领域模型 FollowerOverview
     */
    static followerOverviewFromBackend(item?: BackendFollowerOverview): FollowerOverview {
        if (!item) {
            return {
                totalFollowers: 0,
                todayGrowth: 0,
                weekGrowth: 0,
                monthGrowth: 0,
            };
        }

        return {
            totalFollowers: item.total_followers || 0,
            todayGrowth: item.today_growth || 0,
            weekGrowth: item.week_growth || 0,
            monthGrowth: item.month_growth || 0,
        };
    }

    /**
     * 格式化数字（如 1.2k, 3.4M）
     * @param num 数字
     * @returns 格式化后的字符串
     */
    static formatNumber(num: number): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
}
