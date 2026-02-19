/**
 * Livestream 仓储接口
 * 
 * 定义直播领域模型的数据访问契约
 * 
 * @module domain/repositories
 */

import { Livestream, SongCut, Screenshot } from '../types';

/** 获取直播列表参数 */
export interface GetLivestreamsParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 年份筛选 */
    year?: number;
    /** 月份筛选 */
    month?: number;
}

/** 日历数据项 */
export interface CalendarItem {
    date: string;
    hasLivestream: boolean;
    livestreamId?: string;
    title?: string;
}

/** 分段视频 */
export interface LivestreamSegment {
    part: number;
    title: string;
    url: string;
    duration?: string;
}

/** 直播配置 */
export interface LivestreamConfig {
    /** 最小年份 */
    minYear: number;
}

/**
 * 直播仓储接口
 */
export interface ILivestreamRepository {
    /**
     * 获取直播配置（最小年份等）
     * @returns 直播配置
     */
    getConfig(): Promise<LivestreamConfig>;

    /**
     * 获取直播列表
     * @param params 查询参数
     * @returns 直播列表和总数
     */
    getLivestreams(params?: GetLivestreamsParams): Promise<{
        livestreams: Livestream[];
        total: number;
    }>;

    /**
     * 根据 ID 获取直播详情
     * @param id 直播 ID
     * @returns 直播详情
     */
    getLivestreamById(id: string): Promise<Livestream>;

    /**
     * 获取日历数据
     * @param year 年份
     * @param month 月份
     * @returns 日历数据
     */
    getCalendar(year: number, month: number): Promise<CalendarItem[]>;

    /**
     * 获取直播的分段视频
     * @param livestreamId 直播 ID
     * @returns 分段视频列表
     */
    getSegments(livestreamId: string): Promise<LivestreamSegment[]>;

    /**
     * 获取直播的当日歌切
     * @param livestreamId 直播 ID
     * @returns 歌切列表
     */
    getSongCuts(livestreamId: string): Promise<SongCut[]>;

    /**
     * 获取直播截图
     * @param livestreamId 直播 ID
     * @returns 截图列表（包含缩略图）
     */
    getScreenshots(livestreamId: string): Promise<Screenshot[]>;

    /**
     * 获取最近的直播
     * @param limit 数量限制
     * @returns 最近的直播列表
     */
    getRecentLivestreams(limit?: number): Promise<Livestream[]>;
}

/** 仓储接口标识符 */
export const LIVESTREAM_REPOSITORY_TOKEN = Symbol('ILivestreamRepository');
