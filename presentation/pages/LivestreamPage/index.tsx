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

import React from 'react';
import { Helmet } from 'react-helmet';
import { useLivestreamData } from './hooks/useLivestreamData';
import { useLivestreamDetail } from './hooks/useLivestreamDetail';
import LivestreamHeader from './components/LivestreamHeader';
import CalendarControl from './components/CalendarControl';
import CalendarGrid from './components/CalendarGrid';
import LiveDetail from './components/LiveDetail';
import { Loading } from '../../components/common/Loading';

const LivestreamPage: React.FC = () => {
  const { currentDate, lives, loading, changeMonth, loadLives, calendarCells, todayStr } = useLivestreamData();
  const { selectedLive, handleSelectLive, liveDetailRef } = useLivestreamDetail();

  return (
    <>
      <Helmet>
        <title>咻咻满直播记录 - 直播回放、歌曲剪辑 | 小满虫之家</title>
        <meta name="description" content="查看咻咻满的直播记录，包括直播回放、歌曲剪辑和精彩截图。" />
      </Helmet>

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
        {selectedLive && <LiveDetail live={selectedLive} />}
      </div>
    </>
  );
};

export default LivestreamPage;