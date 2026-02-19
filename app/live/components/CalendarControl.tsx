'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  /** 最大年份 */
  maxYear?: number;
}

export const CalendarControl: React.FC<CalendarControlProps> = ({
  currentDate,
  onMonthChange,
  onDateChange,
  minYear = 2019,
  maxYear
}) => {
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [selectorPosition, setSelectorPosition] = useState({ top: 0, left: 0 });

  const actualMaxYear = maxYear || new Date().getFullYear();

  // 计算可用的年份范围
  const yearRange = useMemo(() => {
    return Array.from({ length: actualMaxYear - minYear + 1 }, (_, i) => minYear + i);
  }, [minYear, actualMaxYear]);

  // 当选择器打开时，同步当前日期到临时状态
  useEffect(() => {
    if (showYearSelector) {
      setTempYear(currentDate.getFullYear());
      setTempMonth(currentDate.getMonth());
    }
  }, [showYearSelector, currentDate]);

  // 点击外部关闭选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowYearSelector(false);
      }
    };

    if (showYearSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showYearSelector]);

  // 计算选择器位置，确保不超出屏幕边界
  useEffect(() => {
    if (showYearSelector && buttonRef.current && selectorRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const selectorRect = selectorRef.current.getBoundingClientRect();
      
      // 默认位置在按钮下方
      let top = buttonRect.bottom + 8;
      let left = buttonRect.left;
      
      // 检查右边界
      const rightEdge = left + selectorRect.width;
      const viewportWidth = window.innerWidth;
      if (rightEdge > viewportWidth - 16) {
        left = viewportWidth - selectorRect.width - 16;
      }
      
      // 检查左边界
      if (left < 16) {
        left = 16;
      }
      
      // 检查下边界
      const bottomEdge = top + selectorRect.height;
      const viewportHeight = window.innerHeight;
      if (bottomEdge > viewportHeight - 16) {
        // 如果下方空间不够，显示在按钮上方
        top = buttonRect.top - selectorRect.height - 8;
      }
      
      setSelectorPosition({ top, left });
    }
  }, [showYearSelector]);

  // 选择年份
  const handleYearSelect = (year: number) => {
    setTempYear(year);
  };

  // 选择月份
  const handleMonthSelect = (month: number) => {
    setTempMonth(month);
    // 选择月份后更新日期并关闭选择器
    onDateChange(new Date(tempYear, month, 1));
    setShowYearSelector(false);
  };

  // 点击今天按钮
  const handleTodayClick = () => {
    const today = new Date();
    onDateChange(new Date(today.getFullYear(), today.getMonth(), 1));
    setShowYearSelector(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 bg-white/60 p-2 rounded-3xl border border-white">
        <button
          onClick={() => onMonthChange(-1)}
          className="p-3 hover:bg-white rounded-2xl text-[#8eb69b] transition-all"
          aria-label="上个月"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          ref={buttonRef}
          onClick={() => setShowYearSelector(!showYearSelector)}
          className="px-4 py-2 hover:bg-white rounded-2xl text-[#4a3728] font-black tabular-nums transition-all flex items-center gap-2"
          aria-label="选择年月"
        >
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          <ChevronRight 
            size={14} 
            className={`transform transition-transform ${showYearSelector ? 'rotate-90' : ''}`} 
          />
        </button>

        <button
          onClick={() => onMonthChange(1)}
          className="p-3 hover:bg-white rounded-2xl text-[#8eb69b] transition-all"
          aria-label="下个月"
        >
          <ChevronRight size={20} />
        </button>

        <button
          onClick={handleTodayClick}
          className="px-4 py-2 bg-gray-50 hover:bg-[#d97706] hover:text-white rounded-2xl text-gray-600 font-black transition-all flex items-center gap-2 border border-gray-200"
          aria-label="回到今天"
        >
          今天
        </button>
      </div>

      {/* 年月选择器弹窗 */}
      {showYearSelector && (
        <>
          {/* 背景蒙层 */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" 
            onClick={() => setShowYearSelector(false)} 
          />
          
          {/* 选择器容器 - 使用fixed定位 */}
          <div
            ref={selectorRef}
            className="fixed z-[60] bg-white/98 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-2 border-[#f2f9f1] p-5 min-w-[320px] max-w-[90vw]"
            style={{
              top: `${selectorPosition.top}px`,
              left: `${selectorPosition.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 年份选择 */}
            <div className="mb-4">
              <div className="text-xs font-black text-[#8eb69b] uppercase tracking-[0.2em] mb-2">Year</div>
              <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
                {yearRange.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
                      tempYear === year
                        ? 'bg-[#d97706] text-white shadow-lg shadow-[#d97706]/30'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 月份选择 */}
            <div>
              <div className="text-xs font-black text-[#8eb69b] uppercase tracking-[0.2em] mb-2">Month</div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }, (_, i) => i).map(month => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className={`h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
                      tempMonth === month
                        ? 'bg-[#d97706] text-white shadow-lg shadow-[#d97706]/30'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {month + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CalendarControl;
