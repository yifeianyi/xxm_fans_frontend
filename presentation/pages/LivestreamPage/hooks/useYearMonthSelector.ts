/**
 * useYearMonthSelector - 年月选择Hook
 *
 * @module LivestreamPage/hooks
 * @description 管理年月选择器的状态和逻辑
 *
 * @example
 * ```tsx
 * const { isOpen, setIsOpen, tempYear, tempMonth, yearRange, handleYearSelect, handleMonthSelect } = useYearMonthSelector(currentDate, 2019, setDate);
 * ```
 *
 * @category Hooks
 * @subcategory LivestreamPage
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseYearMonthSelectorParams {
  /** 当前日期 */
  currentDate: Date;
  /** 最小年份 */
  minYear: number;
  /** 日期变更回调 */
  onDateChange: (date: Date) => void;
}

interface UseYearMonthSelectorReturn {
  /** 选择器是否打开 */
  isOpen: boolean;
  /** 设置选择器打开状态 */
  setIsOpen: (open: boolean) => void;
  /** 临时选中的年份 */
  tempYear: number;
  /** 临时选中的月份 */
  tempMonth: number;
  /** 可用的年份范围 */
  yearRange: number[];
  /** 处理年份选择 */
  handleYearSelect: (year: number) => void;
  /** 处理月份选择 */
  handleMonthSelect: (month: number) => void;
}

export const useYearMonthSelector = ({
  currentDate,
  minYear,
  onDateChange
}: UseYearMonthSelectorParams): UseYearMonthSelectorReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempYear, setTempYear] = useState(() => currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(() => currentDate.getMonth());

  const maxYear = useMemo(() => new Date().getFullYear(), []);

  const yearRange = useMemo(() => {
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  }, [minYear, maxYear]);

  // 当选择器打开时，同步当前日期到临时状态
  useEffect(() => {
    if (isOpen) {
      setTempYear(currentDate.getFullYear());
      setTempMonth(currentDate.getMonth());
    }
  }, [isOpen, currentDate]);

  const handleYearSelect = useCallback((year: number) => {
    setTempYear(year);
    onDateChange(new Date(year, tempMonth, 1));
  }, [tempMonth, onDateChange]);

  const handleMonthSelect = useCallback((month: number) => {
    setTempMonth(month);
    onDateChange(new Date(tempYear, month, 1));
    setIsOpen(false);
  }, [tempYear, onDateChange]);

  return {
    isOpen,
    setIsOpen,
    tempYear,
    tempMonth,
    yearRange,
    handleYearSelect,
    handleMonthSelect
  };
};