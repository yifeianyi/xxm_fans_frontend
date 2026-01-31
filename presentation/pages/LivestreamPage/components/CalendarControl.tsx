/**
 * CalendarControl - 日历控制器组件
 *
 * @module LivestreamPage/components
 * @description 提供月份切换、年月选择、返回今天等功能
 *
 * @component
 * @example
 * ```tsx
 * <CalendarControl
 *   currentDate={currentDate}
 *   onMonthChange={changeMonth}
 *   onDateChange={setDate}
 * />
 * ```
 *
 * @category Components
 * @subcategory LivestreamPage
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarControlProps {
  /** 当前显示的日期 */
  currentDate: Date;
  /** 月份变更回调（offset: 正数前进，负数后退） */
  onMonthChange: (offset: number) => void;
  /** 日期变更回调 */
  onDateChange: (date: Date) => void;
  /** 最小年份 */
  minYear?: number;
}

const CalendarControl: React.FC<CalendarControlProps> = ({
  currentDate,
  onMonthChange,
  onDateChange,
  minYear = 2019
}) => {
  return (
    <div className="flex items-center gap-3 bg-white/60 p-2 rounded-3xl border border-white">
      <button
        onClick={() => onMonthChange(-1)}
        className="p-3 hover:bg-white rounded-2xl text-[#8eb69b] transition-all"
        aria-label="上个月"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="px-4 py-2 hover:bg-white rounded-2xl text-[#4a3728] font-black tabular-nums transition-all">
        {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
      </div>

      <button
        onClick={() => onMonthChange(1)}
        className="p-3 hover:bg-white rounded-2xl text-[#8eb69b] transition-all"
        aria-label="下个月"
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={() => {
          const today = new Date();
          onDateChange(new Date(today.getFullYear(), today.getMonth(), 1));
        }}
        className="px-4 py-2 bg-gray-50 hover:bg-[#d97706] hover:text-white rounded-2xl text-gray-600 font-black transition-all flex items-center gap-2 border border-gray-200"
        aria-label="回到今天"
      >
        今天
      </button>
    </div>
  );
};

export default CalendarControl;