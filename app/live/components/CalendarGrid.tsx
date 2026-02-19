'use client';

import React from 'react';
import { CalendarCell, CalendarCellData } from './CalendarCell';

interface CalendarGridProps {
  /** 当前显示的月份 */
  currentDate: Date;
  /** 日历单元格数组 */
  cells: CalendarCellData[];
  /** 今天的日期字符串（YYYY-MM-DD格式） */
  todayStr: string;
  /** 点击单元格的回调 */
  onCellClick: (cell: CalendarCellData) => void;
  /** 选中的日期字符串（可选） */
  selectedDate?: string;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  cells,
  todayStr,
  onCellClick,
  selectedDate
}) => {
  return (
    <div className="grid grid-cols-7 gap-1 bg-white/30 p-2 rounded-[2.5rem] border border-white/50 shadow-inner">
      {/* 星期标题 */}
      {WEEKDAYS.map((day, idx) => (
        <div
          key={day}
          className={`py-2 text-center text-[10px] font-black uppercase tracking-widest ${
            idx >= 5 ? 'text-[#f67280]' : 'text-[#8eb69b]'
          }`}
          aria-label={`星期${day}`}
        >
          {day}
        </div>
      ))}

      {/* 日期单元格 */}
      {cells.map((cell, idx) => (
        <CalendarCell
          key={idx}
          cell={cell}
          todayStr={todayStr}
          isSelected={selectedDate === cell.date}
          onClick={() => onCellClick(cell)}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;
