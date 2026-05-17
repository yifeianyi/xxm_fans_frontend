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

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 16, width: 400 });
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
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) {
        return;
      }

      const headerBar = buttonRef.current.closest('[data-livestream-header-bar]') as HTMLElement | null;
      const anchorRect = (headerBar ?? buttonRef.current).getBoundingClientRect();
      const panelWidth = Math.min(400, window.innerWidth - 32);
      const left = Math.min(
        Math.max(16, anchorRect.left + (anchorRect.width - panelWidth) / 2),
        window.innerWidth - panelWidth - 16
      );

      setPanelPosition({
        top: anchorRect.bottom + 16,
        left,
        width: panelWidth
      });
    };

    updatePosition();
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', updatePosition);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 hover:bg-white rounded-2xl text-[#4a3728] font-black tabular-nums transition-all flex items-center gap-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="选择年月"
      >
        {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        <ChevronRight size={14} className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-black/25 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-[9999] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[2rem] border-2 border-[#f2f9f1] bg-white/98 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="选择年月"
            onClick={(event) => event.stopPropagation()}
            style={{
              top: `${panelPosition.top}px`,
              left: `${panelPosition.left}px`,
              width: `${panelPosition.width}px`
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-xl p-2 transition-colors hover:bg-gray-100"
              aria-label="关闭年月选择器"
            >
              <X size={18} className="text-gray-500" />
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-[#8eb69b]">Year</h3>
                <div className="grid grid-cols-4 gap-2">
                  {yearRange.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
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

              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-[#8eb69b]">Month</h3>
                <div className="grid grid-cols-4 gap-2">
                  {months.map(month => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(month - 1)}
                      className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
                        tempMonth === month - 1
                          ? 'bg-[#d97706] text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default YearMonthSelector;
