
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { songService } from '../../../infrastructure/api';
import { SongRecord } from '../../../domain/types';
import { Play } from 'lucide-react';
import { Loading } from '../common/Loading';

interface RecordListProps {
  songId: string;
  onPlay: (url: string) => void;
}

const RecordList: React.FC<RecordListProps> = ({ songId, onPlay }) => {
  const [records, setRecords] = useState<SongRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const loadRecords = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    console.log(`📄 加载第 ${pageNum} 页演唱记录...`);

    const result = await songService.getRecords(songId, { page: pageNum, page_size: 20 });

    if (result.data) {
      console.log(`✅ 第 ${pageNum} 页加载成功，获得 ${result.data.results.length} 条记录`);
      if (isLoadMore) {
        setRecords(prev => [...prev, ...result.data!.results]);
      } else {
        setRecords(result.data.results);
      }
      setHasMore(result.data.results.length === 20);
    } else if (result.error) {
      console.error('❌ 获取演唱记录失败:', result.error);
    }

    if (isLoadMore) {
      setLoadingMore(false);
    } else {
      setLoading(false);
    }
    loadingRef.current = false;
  }, [songId]);

  useEffect(() => {
    pageRef.current = 1;
    setRecords([]);
    setHasMore(true);
    loadRecords(1, false);
  }, [songId, loadRecords]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || loadingRef.current || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 100;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    console.log(`📜 滚动位置: 距离底部 ${distanceToBottom}px, 阈值: ${threshold}px, 当前页: ${pageRef.current}`);

    if (distanceToBottom < threshold) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      loadRecords(nextPage, true);
    }
  }, [hasMore, loadRecords]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      console.log('🎯 添加滚动监听器，容器高度:', container.clientHeight, '滚动高度:', container.scrollHeight);
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        console.log('🔧 移除滚动监听器');
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  if (loading) return <div className="p-10"><Loading text="正在搜集音符..." size="sm" /></div>;
  if (records.length === 0) return <div className="p-10 text-center text-[#8eb69b]/40 font-black">暂无记录</div>;

  return (
    <div ref={containerRef} className="h-[500px] overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
        {records.map(rec => (
          <div key={rec.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer" onClick={() => onPlay(rec.videoUrl)}>
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img src={rec.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2.5 bg-white/95 rounded-full text-[#f8b195] shadow-lg transform group-hover:scale-110 transition-all"><Play size={20} fill="currentColor" /></div>
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-[#f8b195] font-black text-[10px] tracking-wider mb-1">{rec.date}</div>
              <p className="text-[10px] font-bold text-[#8eb69b] line-clamp-2 leading-tight">{rec.note}</p>
            </div>
          </div>
        ))}
      </div>
      {loadingMore && (
        <div className="p-4 flex justify-center">
          <Loading text="加载更多..." size="sm" />
        </div>
      )}
      {!hasMore && records.length > 0 && (
        <div className="p-4 text-center text-[#8eb69b]/40 font-black text-xs">
          已加载全部记录 ({records.length} 条)
        </div>
      )}
    </div>
  );
};

export default RecordList;
