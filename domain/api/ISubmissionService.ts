import {
  MonthlySubmissionStatsResponse,
  MonthlySubmissionRecordsResponse,
  YearsSubmissionOverviewResponse,
  MonthlyStatsParams,
  MonthlyRecordsParams,
  YearsOverviewParams,
} from '../types';

/**
 * 投稿服务接口
 * 定义投稿时刻相关的业务逻辑接口
 */
export interface ISubmissionService {
  /**
   * 获取月度投稿统计
   * @param params 查询参数
   * @returns 月度投稿统计数据
   */
  getMonthlySubmissionStats(
    params: MonthlyStatsParams
  ): Promise<MonthlySubmissionStatsResponse>;

  /**
   * 获取月度投稿记录
   * @param params 查询参数
   * @returns 月度投稿记录数据
   */
  getMonthlySubmissionRecords(
    params: MonthlyRecordsParams
  ): Promise<MonthlySubmissionRecordsResponse>;

  /**
   * 获取年度投稿概览
   * @param params 查询参数
   * @returns 年度投稿概览数据
   */
  getYearsSubmissionOverview(
    params?: YearsOverviewParams
  ): Promise<YearsSubmissionOverviewResponse>;

  /**
   * 清除月度统计缓存
   * @param year 年份
   * @param platform 平台（可选）
   */
  clearMonthlyStatsCache(year: number, platform?: string): Promise<void>;
}