import { config } from '../config/config';
import type { ApiResponse, ApiResult } from './apiTypes';

/**
 * 访客地理分布数据类型
 */
export interface VisitorGeoData {
  country: string;
  country_code: string;
  region?: string;
  region_code?: string;
  latitude?: number;
  longitude?: number;
  visit_count: number;
  unique_visitor_count: number;
}

export interface GeoDistributionData {
  days: number;
  group_by: string;
  total_visits: number;
  total_unique_visitors: number;
  geo_distribution: VisitorGeoData[];
}

export interface GeoMapData {
  days: number;
  total_locations: number;
  map_data: VisitorGeoData[];
}

/**
 * 数据分析服务
 * 提供访客地理分布等数据分析功能
 */
class RealDataAnalyticsService {
  private baseURL = config.api.baseURL;

  /**
   * 通用 API 请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResult<T>> {
    const url = `${this.baseURL}/${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || data.code !== 200) {
        return {
          error: {
            message: data.message || '请求失败',
            code: data.code || response.status,
          },
        };
      }

      return { data: data.data };
    } catch (error) {
      console.error('API 请求失败:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : '网络错误',
          code: 500,
        },
      };
    }
  }

  /**
   * 获取访客地理分布数据
   * @param days 查询天数
   * @param groupBy 分组方式 ('country' 或 'region')
   * @param country 筛选特定国家（可选）
   */
  async getVisitorGeoDistribution(
    days: number = 30,
    groupBy: 'country' | 'region' = 'country',
    country?: string
  ): Promise<ApiResult<GeoDistributionData>> {
    const params = new URLSearchParams({
      days: days.toString(),
      group_by: groupBy,
    });

    if (country) {
      params.append('country', country);
    }

    return this.request<GeoDistributionData>(
      `data-analytics/visitor-geo/distribution/?${params.toString()}`
    );
  }

  /**
   * 获取地图可视化数据（包含经纬度）
   * @param days 查询天数
   * @param limit 返回的最大记录数
   */
  async getVisitorGeoMapData(
    days: number = 30,
    limit: number = 100
  ): Promise<ApiResult<GeoMapData>> {
    const params = new URLSearchParams({
      days: days.toString(),
      limit: limit.toString(),
    });

    return this.request<GeoMapData>(
      `data-analytics/visitor-geo/map/?${params.toString()}`
    );
  }
}

// 导出单例实例
export const dataAnalyticsService = new RealDataAnalyticsService();
