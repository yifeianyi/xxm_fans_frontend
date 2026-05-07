import React, { useState, useCallback, useMemo } from 'react';
import { Activity, Play, ThumbsUp, Coins, Bookmark, MessageSquare, Subtitles } from 'lucide-react';
import { TimelinePoint, DataPoint } from '../../../../domain/types';
import { songService } from '../../../../infrastructure/api';
import { WorkSelector } from './WorkSelector';
import { TrendChart } from './TrendChart';

type MetricKey = 'viewCount' | 'likeCount' | 'coinCount' | 'favoriteCount' | 'danmakuCount' | 'commentCount';
type TabKey = 'week' | 'daily';

interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const METRICS: MetricConfig[] = [
  { key: 'viewCount', label: '播放', color: '#f8b195', icon: <Play size={14} /> },
  { key: 'likeCount', label: '点赞', color: '#e74c3c', icon: <ThumbsUp size={14} /> },
  { key: 'coinCount', label: '投币', color: '#f39c12', icon: <Coins size={14} /> },
  { key: 'favoriteCount', label: '收藏', color: '#3498db', icon: <Bookmark size={14} /> },
  { key: 'danmakuCount', label: '弹幕', color: '#9b59b6', icon: <Subtitles size={14} /> },
  { key: 'commentCount', label: '评论', color: '#1abc9c', icon: <MessageSquare size={14} /> },
];

const toDataPoints = (series: TimelinePoint[], metricKey: MetricKey): DataPoint[] => {
  return series.map(p => ({
    time: p.time,
    value: p[metricKey],
    delta: p[metricKey],
  }));
};

/**
 * 作品深度观测主组件
 * tag1: 发布后一周内的数据变化趋势
 * tag2: 按天显示作品数据点折线
 */
export const WorkDeepObservation: React.FC = () => {
  const [selectedWork, setSelectedWork] = useState<{ platform: string; workId: string } | null>(null);
  const [timeline, setTimeline] = useState<{ hasWeekData: boolean; weekSeries: TimelinePoint[]; dailySeries: TimelinePoint[] } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('daily');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('viewCount');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectWork = useCallback(async (platform: string, workId: string) => {
    setSelectedWork({ platform, workId });
    setLoading(true);
    setError(null);
    setTimeline(null);
    try {
      const result = await songService.getWorkTimeline(platform, workId);
      if (result.error) {
        setError(result.error.message);
      } else if (result.data) {
        setTimeline(result.data);
        setActiveTab(result.data.hasWeekData ? 'week' : 'daily');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const currentSeries = useMemo(() => {
    if (!timeline) return [];
    return activeTab === 'week' ? timeline.weekSeries : timeline.dailySeries;
  }, [timeline, activeTab]);

  const chartData = useMemo(() => {
    return toDataPoints(currentSeries, activeMetric);
  }, [currentSeries, activeMetric]);

  const currentMetric = METRICS.find(m => m.key === activeMetric)!;

  const xAxisFormatter = useCallback((time: string) => {
    if (activeTab === 'week') {
      // 2026-05-01 12:00 -> 05/01 12:00
      const parts = time.split(' ');
      if (parts.length === 2) {
        const dateParts = parts[0].split('-');
        return `${dateParts[1]}/${dateParts[2]} ${parts[1]}`;
      }
      return time;
    }
    // daily: 2026-05-01 -> 05/01
    const parts = time.split('-');
    if (parts.length >= 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    return time;
  }, [activeTab]);

  return (
    <section className="space-y-6">
      {/* 标题 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div>
          <h2 className="text-2xl font-black text-[#4a3728] tracking-tighter">作品深度观测</h2>
          <p className="text-xs font-bold text-[#8eb69b] mt-1">对单个投稿的时序表现进行精细化拆解</p>
        </div>
        <WorkSelector onSelect={handleSelectWork} />
      </div>

      {/* 未选择作品时的占位 */}
      {!selectedWork && (
        <div className="glass-card rounded-[3rem] border-4 border-white shadow-xl p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8eb69b] to-[#f8b195] flex items-center justify-center mx-auto">
            <Activity size={28} className="text-white" />
          </div>
          <p className="text-sm font-bold text-[#8eb69b]">选择上方作品，开始深度观测</p>
        </div>
      )}

      {/* 加载中 */}
      {selectedWork && loading && (
        <div className="glass-card rounded-[3rem] border-4 border-white shadow-xl p-16 text-center">
          <div className="w-12 h-12 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-black text-[#8eb69b] mt-4 animate-pulse">正在提取作品时序数据...</p>
        </div>
      )}

      {/* 错误 */}
      {selectedWork && error && (
        <div className="glass-card rounded-[3rem] border-4 border-white shadow-xl p-16 text-center">
          <div className="text-4xl mb-2">😿</div>
          <p className="text-sm font-bold text-[#4a3728]">数据获取失败</p>
          <p className="text-xs text-[#8eb69b] mt-1">{error}</p>
        </div>
      )}

      {/* 数据展示 */}
      {timeline && !loading && !error && (
        <div className="space-y-6">
          {/* 标签页切换 */}
          <div className="flex items-center gap-3 px-4">
            <button
              onClick={() => setActiveTab('week')}
              disabled={!timeline.hasWeekData}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider transition-all border-2 ${
                activeTab === 'week'
                  ? 'bg-[#4a3728] text-white border-[#4a3728] shadow-md'
                  : timeline.hasWeekData
                  ? 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]'
                  : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
              }`}
            >
              发布后一周
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider transition-all border-2 ${
                activeTab === 'daily'
                  ? 'bg-[#4a3728] text-white border-[#4a3728] shadow-md'
                  : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]'
              }`}
            >
              累计日线
            </button>
            {!timeline.hasWeekData && (
              <span className="text-[10px] font-bold text-gray-400">该作品无发布后一周内的观测数据</span>
            )}
          </div>

          {/* 图表卡片 */}
          <div className="glass-card rounded-[3rem] p-8 md:p-10 space-y-6 border-4 border-white shadow-xl relative overflow-hidden">
            {/* 指标切换 */}
            <div className="flex flex-wrap gap-2">
              {METRICS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all border ${
                    activeMetric === m.key
                      ? 'bg-[#4a3728] text-white border-[#4a3728] shadow-sm'
                      : 'bg-white/60 text-[#8eb69b] border-white hover:border-[#f8b195]'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>

            {/* 图表 */}
            <div className="h-72 flex items-center justify-center">
              {chartData.length > 0 ? (
                <TrendChart
                  data={chartData}
                  color={currentMetric.color}
                  type="line"
                  height={260}
                  xAxisFormatter={xAxisFormatter}
                />
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-3xl">📊</div>
                  <p className="text-xs font-bold text-[#8eb69b]/60">暂无{activeTab === 'week' ? '发布后一周' : '累计'}观测数据</p>
                </div>
              )}
            </div>

            {/* 数据摘要 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-4 border-t border-[#8eb69b]/10">
              {METRICS.map(m => {
                const latest = currentSeries[currentSeries.length - 1];
                const first = currentSeries[0];
                const total = latest ? latest[m.key] : 0;
                const growth = latest && first ? latest[m.key] - first[m.key] : 0;
                return (
                  <div key={m.key} className="text-center p-3 bg-white/40 rounded-2xl">
                    <div className="text-[10px] font-black text-[#8eb69b] uppercase">{m.label}</div>
                    <div className="text-lg font-black text-[#4a3728] mt-1">{total.toLocaleString('zh-CN')}</div>
                    <div className="text-[10px] font-black mt-0.5" style={{ color: growth >= 0 ? '#8eb69b' : '#e74c3c' }}>
                      {growth >= 0 ? '+' : ''}{growth.toLocaleString('zh-CN')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
