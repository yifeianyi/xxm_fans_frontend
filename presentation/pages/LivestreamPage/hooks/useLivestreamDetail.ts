/**
 * useLivestreamDetail - 直播详情Hook
 *
 * @module LivestreamPage/hooks
 * @description 管理选中直播的详情数据
 *
 * @example
 * ```tsx
 * const { selectedLive, loading, handleSelectLive, reload, clearSelection } = useLivestreamDetail();
 * ```
 *
 * @category Hooks
 * @subcategory LivestreamPage
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import { useState, useCallback, useRef } from 'react';
import { songService } from '../../../../infrastructure/api';
import { Livestream } from '../../domain/types';

interface UseLivestreamDetailReturn {
  /** 选中的直播记录 */
  selectedLive: Livestream | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 选择直播记录的回调 */
  handleSelectLive: (live: Livestream) => void;
  /** 重新加载详情 */
  reload: () => Promise<void>;
  /** 清除选择 */
  clearSelection: () => void;
  /** 直播详情区域的引用 */
  liveDetailRef: React.RefObject<HTMLDivElement | null>;
}

export const useLivestreamDetail = (): UseLivestreamDetailReturn => {
  const [selectedLive, setSelectedLive] = useState<Livestream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const liveDetailRef = useRef<HTMLDivElement>(null);

  const fetchLivestreamDetail = useCallback(async (date: string): Promise<void> => {
    if (!date) {
      setError('日期参数无效');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await songService.getLivestreamByDate(date);

      if (result.error) {
        setError(result.error.message || '获取直播详情失败');
        // 保留之前选中的数据，不设置为 null
      } else if (result.data) {
        setSelectedLive(result.data);

        // 滚动到详情区域
        setTimeout(() => {
          liveDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError('未找到该日期的直播记录');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectLive = useCallback((live: Livestream) => {
    if (!live?.date) {
      setError('直播数据无效');
      return;
    }
    fetchLivestreamDetail(live.date);
  }, [fetchLivestreamDetail]);

  const reload = useCallback(async () => {
    if (selectedLive?.date) {
      await fetchLivestreamDetail(selectedLive.date);
    }
  }, [selectedLive, fetchLivestreamDetail]);

  const clearSelection = useCallback(() => {
    setSelectedLive(null);
    setError(null);
  }, []);

  return {
    selectedLive,
    loading,
    error,
    handleSelectLive,
    reload,
    clearSelection,
    liveDetailRef
  };
};