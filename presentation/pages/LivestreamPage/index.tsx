/**
 * LivestreamPage - 直播页面组件（重构后）
 *
 * @module LivestreamPage
 * @description 显示月度直播日历和直播详情
 *
 * @component
 * @example
 * ```tsx
 * <LivestreamPage />
 * ```
 *
 * @category Pages
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AlertCircle } from 'lucide-react';
import { useLivestreamData } from './hooks/useLivestreamData';
import { useLivestreamDetail } from './hooks/useLivestreamDetail';
import LivestreamHeader from './components/LivestreamHeader';
import CalendarControl from './components/CalendarControl';
import CalendarGrid from './components/CalendarGrid';
import LiveDetail from './components/LiveDetail';
import { Loading } from '../../components/common/Loading';
import { PageDecorations } from '../../components/common/PageDecorations';

const LivestreamPage: React.FC = () => {
  const { currentDate, lives, loading, error, changeMonth, loadLives, calendarCells, todayStr } = useLivestreamData();
  const { selectedLive, handleSelectLive, clearSelection, liveDetailRef } = useLivestreamDetail();

  // 当切换月份时，清除选中的直播
  useEffect(() => {
    clearSelection();
  }, [currentDate, clearSelection]);

  // 检查选中的直播是否在当前月份的数据中
  useEffect(() => {
    if (selectedLive) {
      const stillExists = lives.some(live => live.date === selectedLive.date);
      if (!stillExists) {
        clearSelection();
      }
    }
  }, [lives, selectedLive, clearSelection]);

  return (
    <>
      <Helmet>
        <title>咻咻满直播记录 - 直播回放、歌曲剪辑 | 小满虫之家</title>
        <meta name="description" content="查看咻咻满的直播记录，包括直播回放、歌曲剪辑和精彩截图。" />
      </Helmet>

      {/* 页面装饰 - 直播主题 */}
      <PageDecorations theme="live" glowColors={['#f8b195', '#f67280']} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-1000">
        {/* 顶部控制栏 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 p-6 rounded-[3rem] border-2 border-white shadow-xl backdrop-blur-md">
          <LivestreamHeader />
          <CalendarControl
            currentDate={currentDate}
            onMonthChange={changeMonth}
            onDateChange={loadLives}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* 日历网格 */}
        {loading ? (
          <Loading />
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            cells={calendarCells}
            todayStr={todayStr}
            onCellClick={handleSelectLive}
            selectedDate={selectedLive?.date}
          />
        )}

        {/* 直播详情 */}
        {selectedLive && !loading && <LiveDetail live={selectedLive} />}
      </div>
    </>
  );
};

export default LivestreamPage;