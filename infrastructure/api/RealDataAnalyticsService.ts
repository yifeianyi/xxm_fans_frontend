import type { ApiResult } from './apiTypes';
import { apiClient } from '../../shared/ApiClient';

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

class RealDataAnalyticsService {

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

    return apiClient.get<GeoDistributionData>(
      `/data-analytics/visitor-geo/distribution/?${params.toString()}`
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

    return apiClient.get<GeoMapData>(
      `data-analytics/visitor-geo/map/?${params.toString()}`
    );
  }
}

// 导出单例实例
export const dataAnalyticsService = new RealDataAnalyticsService();
