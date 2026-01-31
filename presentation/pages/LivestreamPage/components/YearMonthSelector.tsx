/**
 * YearMonthSelector - 年月选择器组件
 *
 * @module LivestreamPage/components
 * @description 提供年份和月份的下拉选择功能
 *
 * @component
 * @example
 * ```tsx
 * <YearMonthSelector
 *   currentDate={currentDate}
 *   minYear={2019}
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

import React, { useMemo } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useYearMonthSelector } from '../hooks/useYearMonthSelector';

interface YearMonthSelectorProps {
  /** 当前显示的日期 */
  currentDate: Date;
  /** 最小年份 */
  minYear?: number;
  /** 日期变更回调 */
  onDateChange: (date: Date) => void;
}

const YearMonthSelector: React.FC<YearMonthSelectorProps> = ({
  currentDate,
  minYear = 2019,
  onDateChange
}) => {
  const {
    isOpen,
    setIsOpen,
    tempYear,
    tempMonth,
    yearRange,
    handleYearSelect,
    handleMonthSelect
  } = useYearMonthSelector({ currentDate, minYear, onDateChange });

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 hover:bg-white rounded-2xl text-[#4a3728] font-black tabular-nums transition-all flex items-center gap-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="选择年月"
      >
        {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        <ChevronRight size={14} className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-[calc(100vw-2rem)] bg-white/98 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-2 border-[#f2f9f1] p-6 animate-in zoom-in-95 duration-200"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="关闭"
            >
              <X size={18} className="text-gray-500" />
            </button>

            <div className="space-y-6">
              {/* 年份选择 */}
              <div>
                <h3 className="text-sm font-black text-[#8eb69b] mb-3 tracking-widest uppercase">Year</h3>
                <div className="grid grid-cols-4 gap-2">
                  {yearRange.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`py-2 px-3 rounded-xl text-sm font-black transition-all ${
                        tempYear === year
                          ? 'bg-[#d97706] text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* 月份选择 */}
              <div>
                <h3 className="text-sm font-black text-[#8eb69b] mb-3 tracking-widest uppercase">Month</h3>
                <div className="grid grid-cols-4 gap-2">
                  {months.map(month => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(month)}
                      className={`py-2 px-3 rounded-xl text-sm font-black transition-all ${
                        tempMonth === month && tempYear === currentDate.getFullYear()
                          ? 'bg-[#d97706] text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {month + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearMonthSelector;