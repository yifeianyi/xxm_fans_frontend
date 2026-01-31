/**
 * useLivestreamData - 直播数据Hook
 *
 * @module LivestreamPage/hooks
 * @description 管理直播页面的核心数据和操作
 *
 * @example
 * ```tsx
 * const { currentDate, lives, loading, changeMonth, loadLives, calendarCells, todayStr } = useLivestreamData();
 * ```
 *
 * @category Hooks
 * @subcategory LivestreamPage
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { songService } from '../../../infrastructure/api';
import { Livestream } from '../../../domain/types';
import { CalendarCellData } from '../components/CalendarCell';

interface UseLivestreamDataReturn {
  /** 当前日期（月份的第一天） */
  currentDate: Date;
  /** 直播记录列表 */
  lives: Livestream[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 日历单元格数据 */
  calendarCells: CalendarCellData[];
  /** 今天的日期字符串（YYYY-MM-DD格式） */
  todayStr: string;
  /** 月份变更（offset: 正数前进，负数后退） */
  changeMonth: (offset: number) => void;
  /** 加载指定年月的直播数据 */
  loadLives: (year: number, month: number) => Promise<void>;
  /** 刷新当前月份数据 */
  refresh: () => Promise<void>;
}

export const useLivestreamData = (): UseLivestreamDataReturn => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [lives, setLives] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() || 7;
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  }, [currentDate]);

  const calendarCells = useMemo(() => {
    const cells: CalendarCellData[] = [];

    // 空白单元格
    for (let i = 1; i < daysInMonth.firstDay; i++) {
      cells.push({ day: null, date: '' });
    }

    // 日期单元格
    for (let i = 1; i <= daysInMonth.days; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const live = lives.find(l => l.date === dateStr);
      cells.push({ day: i, date: dateStr, live });
    }

    return cells;
  }, [daysInMonth, lives, currentDate]);

  const loadLives = useCallback(async (year: number, month: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await songService.getLivestreams(year, month);

      if (result.error) {
        setError(result.error.message);
        setLives([]);
      } else {
        setLives(result.data || []);
      }
    } catch (err) {
      setError('加载失败，请稍后重试');
      setLives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeMonth = useCallback((offset: number) => {
    setCurrentDate(prev => new Date(
      prev.getFullYear(),
      prev.getMonth() + offset,
      1
    ));
  }, []);

  const refresh = useCallback(async () => {
    await loadLives(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, loadLives]);

  useEffect(() => {
    loadLives(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, loadLives]);

  return {
    currentDate,
    lives,
    loading,
    error,
    calendarCells,
    todayStr,
    changeMonth,
    loadLives,
    refresh
  };
};