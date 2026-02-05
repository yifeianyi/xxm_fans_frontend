/**
 * FanDistributionMap - 小满虫分布地图组件
 *
 * @module DataAnalysisPage/components
 * @description 使用ECharts展示粉丝地理分布的地图可视化
 *
 * @component
 * @example
 * ```tsx
 * <FanDistributionMap />
 * ```
 *
 * @category Components
 * @subcategory DataAnalysisPage
 *
 * @version 1.0.0
 * @since 2024-02-05
 */

import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Users, Globe, Activity } from 'lucide-react';
import { dataAnalyticsService } from '../../../../infrastructure/api';
import Loading from '../../../components/common/Loading';
import { ApiResult } from '../../../../domain/types';

// 地图数据类型
interface MapData {
  country: string;
  country_code: string;
  region?: string;
  region_code?: string;
  latitude?: number;
  longitude?: number;
  visit_count: number;
  unique_visitor_count: number;
}

interface GeoDistributionData {
  days: number;
  group_by: string;
  total_visits: number;
  total_unique_visitors: number;
  geo_distribution: MapData[];
}

const FanDistributionMap: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const echartsRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GeoDistributionData | null>(null);
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [selectedDays, setSelectedDays] = useState(30);
  const [viewMode, setViewMode] = useState<'china' | 'world'>('china');

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result: ApiResult<GeoDistributionData> = await dataAnalyticsService.getVisitorGeoDistribution(
          selectedDays,
          viewMode === 'china' ? 'region' : 'country'
        );

        if (result.data && !result.error) {
          setData(result.data);
          setMapData(result.data.geo_distribution);
        }
      } catch (error) {
        console.error('加载地理分布数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDays, viewMode]);

  // 初始化ECharts
  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      // 动态导入ECharts
      if (!echartsRef.current) {
        const echarts = await import('echarts');
        echartsRef.current = echarts;
      }

      // 初始化或获取图表实例
      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echartsRef.current.init(chartRef.current);
      }

      // 加载地图数据
      await loadMapData();

      // 渲染图表
      renderChart();

      // 响应式调整
      const handleResize = () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
      };
    };

    initChart();
  }, [mapData, viewMode]);

  // 加载地图数据
  const loadMapData = async () => {
    if (!echartsRef.current) return;

    try {
      if (viewMode === 'china') {
        // 加载中国地图数据
        const chinaMapData = await import('echarts-countries-js/china.json');
        echartsRef.current.registerMap('china', chinaMapData.default);
      } else {
        // 加载世界地图数据
        const worldMapData = await import('echarts-countries-js/world-x.json');
        echartsRef.current.registerMap('world', worldMapData.default);
      }
    } catch (error) {
      console.error('加载地图数据失败:', error);
    }
  };

  // 渲染图表
  const renderChart = () => {
    if (!chartInstanceRef.current || !mapData.length) return;

    const option = {
      title: {
        text: viewMode === 'china' ? '小满虫国内分布' : '小满虫全球分布',
        subtext: `最近${selectedDays}天访问数据`,
        left: 'center',
        textStyle: {
          color: '#2d1f1f',
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data;
          return `
            <div style="padding: 10px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${data.name}</div>
              <div>访问次数: ${data.value}</div>
              <div>独立访客: ${data.uniqueVisitors}</div>
              ${data.region ? `<div>地区: ${data.region}</div>` : ''}
            </div>
          `;
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...mapData.map(item => item.visit_count)),
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
        }
      },
      series: [
        {
          name: '小满虫分布',
          type: 'map',
          map: viewMode === 'china' ? 'china' : 'world',
          roam: true,
          emphasis: {
            label: {
              show: true
            }
          },
          data: mapData.map(item => ({
            name: item.region || item.country,
            value: item.visit_count,
            uniqueVisitors: item.unique_visitor_count,
            region: item.region,
            country: item.country,
            latitude: item.latitude,
            longitude: item.longitude
          }))
        }
      ]
    };

    chartInstanceRef.current.setOption(option);
  };

  // 统计卡片数据
  const stats = data ? [
    {
      title: '总访问量',
      value: data.total_visits,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: '独立访客',
      value: data.total_unique_visitors,
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: '覆盖地区',
      value: data.geo_distribution.length,
      icon: <MapPin className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: '统计天数',
      value: `${data.days}天`,
      icon: <Globe className="w-5 h-5" />,
      color: 'text-orange-600'
    }
  ] : [];

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* 标题和控制面板 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🗺️ 小满虫分布图</h2>
          <div className="flex items-center gap-4">
            {/* 视图模式切换 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('china')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'china'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                国内分布
              </button>
              <button
                onClick={() => setViewMode('world')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'world'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                全球分布
              </button>
            </div>

            {/* 时间范围选择 */}
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>最近7天</option>
              <option value={30}>最近30天</option>
              <option value={90}>最近90天</option>
              <option value={365}>最近一年</option>
            </select>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color}`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 地图 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div
          ref={chartRef}
          className="w-full h-96 rounded-lg"
          style={{ minHeight: '500px' }}
        />
      </div>

      {/* 详细数据表格 */}
      {data && data.geo_distribution.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 详细数据
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地区
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    访问次数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    独立访客
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    占比
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.geo_distribution.map((item, index) => {
                  const percentage = (
                    (item.visit_count / data.total_visits) *
                    100
                  ).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.region || item.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.visit_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unique_visitor_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FanDistributionMap;
