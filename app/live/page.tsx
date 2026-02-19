'use client';

import React, { useEffect } from 'react';
import { AlertCircle, Sparkles, Star, Heart, Radio } from 'lucide-react';
import { ErrorBoundary, Loading } from '@/app/shared/components';
import { useLivestreamData, useLivestreamDetail } from './hooks';
import { 
  LivestreamHeader, 
  CalendarControl, 
  CalendarGrid, 
  LiveDetail 
} from './components';

// 页面装饰组件
function PageDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      <div className="absolute top-20 left-10 animate-bounce" style={{ animationDuration: '3s' }}>
        <Star className="w-6 h-6 text-yellow-400/40" />
      </div>
      <div className="absolute top-32 left-24 animate-pulse" style={{ animationDelay: '0.4s' }}>
        <Sparkles className="w-5 h-5 text-[#f8b195]/40" />
      </div>
      <div className="absolute top-24 right-16 animate-spin" style={{ animationDuration: '4s' }}>
        <Radio className="w-8 h-8 text-[#f67280]/30" />
      </div>
      <div className="absolute top-40 right-8 animate-pulse" style={{ animationDelay: '0.6s' }}>
        <Heart className="w-5 h-5 text-[#f67280]/30 fill-[#f67280]/30" />
      </div>
      <div className="absolute bottom-32 left-20 animate-pulse" style={{ animationDelay: '0.8s' }}>
        <Sparkles className="w-5 h-5 text-pink-300/30" />
      </div>
    </div>
  );
}

// 加载状态组件
function LoadingState() {
  return (
    <div className="py-48 flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-8 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin"></div>
      <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs">正在加载...</span>
    </div>
  );
}

export default function LivestreamPage() {
  const { 
    currentDate, 
    lives, 
    loading, 
    error, 
    changeMonth, 
    setCurrentDate,
    loadLives, 
    calendarCells, 
    todayStr,
    minYear,
    maxYear
  } = useLivestreamData();
  
  const { 
    selectedLive, 
    handleSelectLive, 
    clearSelection, 
    liveDetailRef 
  } = useLivestreamDetail();

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
    <ErrorBoundary>
      {/* 页面装饰 - 直播主题 */}
      <PageDecorations />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-1000">
        {/* 顶部控制栏 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 p-6 rounded-[3rem] border-2 border-white shadow-xl backdrop-blur-md">
          <LivestreamHeader />
          <CalendarControl
            currentDate={currentDate}
            onMonthChange={changeMonth}
            onDateChange={setCurrentDate}
            minYear={minYear}
            maxYear={maxYear}
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
          <LoadingState />
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
    </ErrorBoundary>
  );
}