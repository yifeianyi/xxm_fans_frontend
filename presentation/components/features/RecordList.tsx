
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
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  // 修正封面路径，确保以/开头
  const normalizeCoverPath = (coverPath: string): string => {
    if (!coverPath) return '';
    return coverPath.startsWith('/') ? coverPath : `/${coverPath}`;
  };

  const loadRecords = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    // 提前返回，避免竞态条件
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setError(null); // 清除之前的错误

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const result = await songService.getRecords(songId, { page: pageNum, page_size: 20 });

    if (result.data) {
      const { results, total } = result.data;

      if (isLoadMore) {
        setRecords(prev => {
          const newRecords = [...prev, ...results];
          // 使用 total 准确判断是否还有更多数据
          setHasMore(newRecords.length < total);
          return newRecords;
        });
      } else {
        setRecords(results);
        // 使用 total 准确判断是否还有更多数据
        setHasMore(results.length < total);
      }
      setTotalRecords(total); // 保存总数用于显示进度
    } else if (result.error) {
      console.error('❌ 获取演唱记录失败:', result.error);
      setError(result.error.message);
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
    setError(null);
    setTotalRecords(0);
    loadRecords(1, false);
  }, [songId, loadRecords]);

  // 使用 ref 保存 hasMore 和 loadRecords，避免 handleScroll 依赖它们
  const hasMoreRef = useRef(hasMore);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadRecordsRef = useRef(loadRecords);
  useEffect(() => {
    loadRecordsRef.current = loadRecords;
  }, [loadRecords]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || loadingRef.current || !hasMoreRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    // 根据容器高度动态计算阈值（容器高度的 20%，最小 100px）
    const threshold = Math.max(100, clientHeight * 0.2);
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceToBottom < threshold) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      loadRecordsRef.current(nextPage, true);
    }
  }, []); // 空依赖数组，所有状态通过 ref 访问

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const scrollHandler = () => {
        handleScroll();
      };

      container.addEventListener('scroll', scrollHandler, { passive: true });
      return () => {
        container.removeEventListener('scroll', scrollHandler);
      };
    }
  }, [handleScroll, records.length]); // 添加 records.length 依赖，数据加载后重新添加监听器

  if (loading) return <div className="p-10"><Loading text="正在搜集音符..." size="sm" /></div>;
  if (records.length === 0 && !error) return <div className="p-10 text-center text-[#8eb69b]/40 font-black">暂无记录</div>;

  return (
    <div ref={containerRef} className="h-[500px] overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
        {records.map(rec => (
          <div key={rec.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer" onClick={() => onPlay(rec.videoUrl)}>
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img src={normalizeCoverPath(rec.cover)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />
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
      {error && (
        <div className="p-4 text-center">
          <div className="text-red-500 mb-2 text-xs font-bold">{error}</div>
          <button
            onClick={() => loadRecords(pageRef.current, false)}
            className="px-4 py-2 bg-[#8eb69b] text-white rounded-lg hover:bg-[#7da58a] transition-colors text-xs font-bold"
          >
            重试
          </button>
        </div>
      )}
      {!hasMore && records.length > 0 && (
        <div className="p-4 text-center text-[#8eb69b]/40 font-black text-xs">
          已加载全部记录 ({records.length}/{totalRecords} 条)
        </div>
      )}
    </div>
  );
};

export default RecordList;
