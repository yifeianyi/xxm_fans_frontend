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
import { Livestream } from '../../../domain/types';

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
  liveDetailRef: React.RefObject<HTMLDivElement>;
}

export const useLivestreamDetail = (): UseLivestreamDetailReturn => {
  const [selectedLive, setSelectedLive] = useState<Livestream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const liveDetailRef = useRef<HTMLDivElement>(null);

  const fetchLivestreamDetail = useCallback(async (date: string): Promise<void> => {
    if (!date) return;

    setLoading(true);
    setError(null);

    try {
      const result = await songService.getLivestreamByDate(date);

      if (result.error) {
        setError(result.error.message);
        setSelectedLive(null);
      } else {
        setSelectedLive(result.data || null);

        // 滚动到详情区域
        setTimeout(() => {
          liveDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } catch (err) {
      setError('加载详情失败');
      setSelectedLive(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectLive = useCallback((live: Livestream) => {
    fetchLivestreamDetail(live.date);
  }, [fetchLivestreamDetail]);

  const reload = useCallback(async () => {
    if (selectedLive) {
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