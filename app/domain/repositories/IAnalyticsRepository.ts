/**
 * Analytics 仓储接口
 * 
 * 定义数据分析领域模型的数据访问契约
 * 
 * @module domain/repositories
 */

import {
    AccountData,
    VideoStats,
    CorrelationData,
    TimeGranularity,
} from '../types';

/** 获取账号数据参数 */
export interface GetAccountDataParams {
    /** 账号 ID */
    accountId: string;
    /** 时间粒度 */
    granularity?: TimeGranularity;
    /** 开始日期 */
    startDate?: string;
    /** 结束日期 */
    endDate?: string;
}

/** 获取视频数据参数 */
export interface GetVideoStatsParams {
    /** 视频 ID */
    videoId: string;
    /** 时间粒度 */
    granularity?: TimeGranularity;
}

/** 粉丝数概览 */
export interface FollowerOverview {
    totalFollowers: number;
    todayGrowth: number;
    weekGrowth: number;
    monthGrowth: number;
}

/**
 * 数据分析仓储接口
 */
export interface IAnalyticsRepository {
    /**
     * 获取所有监控账号列表
     * @returns 账号列表
     */
    getAccounts(): Promise<Array<{
        id: string;
        name: string;
        platform: string;
    }>>;

    /**
     * 获取账号详细数据
     * @param params 查询参数
     * @returns 账号历史数据
     */
    getAccountData(params: GetAccountDataParams): Promise<AccountData>;

    /**
     * 获取粉丝数概览
     * @returns 粉丝数概览数据
     */
    getFollowerOverview(): Promise<FollowerOverview>;

    /**
     * 获取视频统计数据
     * @param params 查询参数
     * @returns 视频统计数据
     */
    getVideoStats(params: GetVideoStatsParams): Promise<VideoStats>;

    /**
     * 获取视频列表
     * @param params 筛选参数
     * @returns 视频列表
     */
    getVideos(params?: {
        page?: number;
        limit?: number;
        sortBy?: 'views' | 'likes' | 'publishTime';
    }): Promise<{
        videos: VideoStats[];
        total: number;
    }>;

    /**
     * 获取相关性分析数据
     * @param params 查询参数
     * @returns 相关性数据
     */
    getCorrelationData(params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<CorrelationData[]>;
}

/** 仓储接口标识符 */
export const ANALYTICS_REPOSITORY_TOKEN = Symbol('IAnalyticsRepository');
