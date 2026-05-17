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
import { songService } from '../../../../infrastructure/api';
import { Livestream } from '../../../../domain/types';
import { CalendarCellData } from '../components/CalendarCell';

interface UseLivestreamDataReturn {
  /** 当前日期（月份的第一天） */
  currentDate: Date;
  /** 最小年份 */
  minYear: number;
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
  /** 设置当前显示月份 */
  setMonthDate: (date: Date) => void;
}

export const useLivestreamData = (): UseLivestreamDataReturn => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [minYear, setMinYear] = useState(2019);
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

    try {
      // 空白单元格
      for (let i = 1; i < daysInMonth.firstDay; i++) {
        cells.push({ day: null, date: '' });
      }

      // 日期单元格
      for (let i = 1; i <= daysInMonth.days; i++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        // 确保 lives 是数组
        const live = Array.isArray(lives) ? lives.find(l => l?.date === dateStr) : undefined;
        cells.push({ day: i, date: dateStr, live });
      }
    } catch (err) {
      console.error('生成日历单元格失败:', err);
    }

    return cells;
  }, [daysInMonth, lives, currentDate]);

  const loadLives = useCallback(async (year: number, month: number): Promise<void> => {
    // 验证参数
    if (!year || !month || month < 1 || month > 12) {
      setError('日期参数无效');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await songService.getLivestreams(year, month);

      if (result.error) {
        setError(result.error.message || '获取直播列表失败');
        setLives([]);
      } else {
        // 确保数据是数组
        const data = Array.isArray(result.data) ? result.data : [];
        setLives(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败，请稍后重试');
      setLives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const result = await songService.getLivestreamConfig();
        if (result.data?.minYear) {
          setMinYear(result.data.minYear);
        }
      } catch (err) {
        console.error('获取直播配置失败:', err);
      }
    };

    loadConfig();
  }, []);

  const changeMonth = useCallback((offset: number) => {
    // 限制 offset 范围，防止跳转到无效日期
    if (offset === 0) return;

    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      const year = newDate.getFullYear();
      const maxYear = new Date().getFullYear();

      if (year < minYear) {
        return new Date(minYear, 0, 1);
      }

      if (year > maxYear) {
        return new Date(maxYear, 11, 1);
      }

      return newDate;
    });
  }, [minYear]);

  const setMonthDate = useCallback((date: Date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      setError('日期参数无效');
      return;
    }

    const year = date.getFullYear();
    const maxYear = new Date().getFullYear();

    if (year < minYear) {
      setCurrentDate(new Date(minYear, 0, 1));
      return;
    }

    if (year > maxYear) {
      setCurrentDate(new Date(maxYear, 11, 1));
      return;
    }

    setCurrentDate(new Date(year, date.getMonth(), 1));
  }, [minYear]);

  const refresh = useCallback(async () => {
    await loadLives(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, loadLives]);

  useEffect(() => {
    loadLives(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, loadLives]);

  return {
    currentDate,
    minYear,
    lives,
    loading,
    error,
    calendarCells,
    todayStr,
    changeMonth,
    loadLives,
    refresh,
    setMonthDate
  };
};
