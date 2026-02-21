'use client';

import React from 'react';
import { Livestream } from '@/app/domain/types';

/**
 * 日历单元格类型
 */
export interface CalendarCellData {
  /** 日期数字，null表示空白单元格 */
  day: number | null;
  /** 日期字符串（YYYY-MM-DD格式） */
  date: string;
  /** 该日期的直播记录（如果有） */
  live?: Livestream;
}

interface CalendarCellProps {
  /** 单元格数据 */
  cell: CalendarCellData;
  /** 今天的日期字符串（YYYY-MM-DD格式） */
  todayStr: string;
  /** 是否选中 */
  isSelected: boolean;
  /** 点击回调 */
  onClick: () => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({ cell, todayStr, isSelected, onClick }) => {
  const isToday = cell.date === todayStr;
  // 确保 live 对象有效且至少有日期字段
  const hasLive = !!(cell.live?.date);

  const handleClick = () => {
    if (hasLive && cell.live) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (hasLive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`aspect-video flex items-center justify-center relative z-0 rounded-2xl transition-all ${
        cell.day ? 'bg-white/60' : 'bg-transparent'
      } ${hasLive ? 'cursor-pointer hover:bg-[#fef5f0] shadow-sm' : ''} ${
        isSelected ? 'bg-[#fef5f0] ring-4 ring-[#f8b195]/20' : ''
      } ${isToday ? 'ring-2 ring-[#8eb69b]/50' : ''}`}
      role={hasLive ? 'button' : 'gridcell'}
      tabIndex={hasLive ? 0 : undefined}
      aria-label={hasLive ? `${cell.date}有直播记录` : cell.date}
      aria-selected={isSelected}
    >
      <span
        className={`text-sm font-black ${
          hasLive ? 'text-[#f8b195]' : isToday ? 'text-[#8eb69b] font-bold' : 'text-[#4a3728]/40'
        }`}
      >
        {cell.day}
      </span>
      {hasLive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#f8b195]" aria-hidden="true" />}
      {isToday && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#8eb69b]" aria-hidden="true" />}
    </div>
  );
};

export default CalendarCell;
