import React, { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import { CorrelationData, CorrelationWork } from '../../../../domain/types';
import { songService } from '../../../../infrastructure/api';
import { CorrelationChart } from './CorrelationChart';
import VideoModal from '../../../components/common/VideoModal';

interface GrowthCorrelationPanelProps {
  accountId: string;
}

export const GrowthCorrelationPanel: React.FC<GrowthCorrelationPanelProps> = ({ accountId }) => {
  const [timeline, setTimeline] = useState<CorrelationData[]>([]);
  const [works, setWorks] = useState<CorrelationWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleWorkClick = useCallback((work: CorrelationWork) => {
    if (work.platform === 'bilibili' && work.workId) {
      setVideoUrl(`https://www.bilibili.com/video/${work.workId}`);
    }
  }, []);

  useEffect(() => {
    if (!accountId) {
      setTimeline([]);
      setWorks([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await songService.getCorrelationData(accountId, 90);
        if (result.error) {
          setError(result.error.message);
        } else if (result.data) {
          setTimeline(result.data.timeline || []);
          setWorks(result.data.works || []);
        } else {
          setTimeline([]);
          setWorks([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountId]);

  return (
    <section className="glass-card rounded-[4rem] border-4 border-white shadow-2xl p-12 space-y-6 bg-white/60">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8eb69b] to-[#f8b195] flex items-center justify-center">
            <Zap size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-[#4a3728] tracking-tighter">增长关联性实验室</h2>
        <p className="text-sm font-bold text-[#8eb69b]">归因分析：全站视频热度脉冲对粉丝增长的即时驱动率</p>
        <p className="text-xs text-[#8eb69b]/60">基于近 3 个月发布的作品播放增量与粉丝数变化的关联分析</p>
      </div>

      {!accountId && (
        <div className="text-center py-8">
          <p className="text-sm font-bold text-[#8eb69b]">请先在上方选择一个账号</p>
        </div>
      )}

      {accountId && loading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-10 h-10 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#8eb69b] animate-pulse">正在计算关联数据...</p>
        </div>
      )}

      {accountId && error && (
        <div className="text-center py-8">
          <p className="text-sm font-bold text-[#4a3728]">数据获取失败</p>
          <p className="text-xs text-[#8eb69b] mt-1">{error}</p>
        </div>
      )}

      {accountId && !loading && !error && timeline.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm font-bold text-[#8eb69b]">暂无关联数据</p>
          <p className="text-xs text-[#8eb69b]/60 mt-1">可能还没有足够的数据进行分析</p>
        </div>
      )}

      {accountId && !loading && !error && timeline.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#8eb69b] px-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f8b195]" />
              <span>视频播放增量</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3498db]" />
              <span>粉丝数变化</span>
            </div>
          </div>
          <CorrelationChart timeline={timeline} works={works} height={280} onWorkClick={handleWorkClick} />
        </div>
      )}

      <VideoModal
        isOpen={videoUrl !== null}
        onClose={() => setVideoUrl(null)}
        videoUrl={videoUrl || ''}
      />
    </section>
  );
};
