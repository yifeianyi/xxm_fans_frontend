'use client';

import { useState, useRef, useCallback } from 'react';
import { Livestream } from '@/app/domain/types';
import { livestreamRepository } from '@/app/infrastructure/repositories';

interface UseLivestreamDetailReturn {
  /** 选中的直播 */
  selectedLive: Livestream | null;
  /** 选择直播并获取详情 */
  handleSelectLive: (cell: { live?: Livestream }) => Promise<void>;
  /** 清除选择 */
  clearSelection: () => void;
  /** 详情区域引用 */
  liveDetailRef: React.RefObject<HTMLDivElement | null>;
  /** 详情加载状态 */
  detailLoading: boolean;
}

export const useLivestreamDetail = (): UseLivestreamDetailReturn => {
  const [selectedLive, setSelectedLive] = useState<Livestream | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const liveDetailRef = useRef<HTMLDivElement>(null);

  const handleSelectLive = useCallback(async (cell: { live?: Livestream }) => {
    if (!cell.live) return;
    
    setDetailLoading(true);
    
    try {
      // 调用 API 获取完整详情（包含 screenshots, songCuts 等）
      const detail = await livestreamRepository.getLivestreamByDate(cell.live.date);
      
      if (detail) {
        setSelectedLive(detail);
      } else {
        // 如果获取详情失败，使用基本信息
        setSelectedLive(cell.live);
      }
      
      // 滚动到详情区域
      setTimeout(() => {
        liveDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('获取直播详情失败:', error);
      // 失败时使用基本信息
      setSelectedLive(cell.live);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLive(null);
  }, []);

  return {
    selectedLive,
    handleSelectLive,
    clearSelection,
    liveDetailRef,
    detailLoading
  };
};

export default useLivestreamDetail;