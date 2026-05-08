import React, { useState, useEffect, useRef, useCallback } from 'react';
import { songService } from '../../../infrastructure/api';
import { SongRecord, RecordSortBy } from '../../../domain/types';
import { Play, Heart, ArrowUpDown } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<RecordSortBy>('time');
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const normalizeCoverPath = (coverPath: string): string => {
    if (!coverPath) return '';
    return coverPath.startsWith('/') ? coverPath : `/${coverPath}`;
  };

  const loadRecords = useCallback(async (pageNum: number, isLoadMore: boolean = false, currentSortBy?: RecordSortBy) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setError(null);

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const sort = currentSortBy || sortBy;
      const result = await songService.getRecords(songId, {
        page: pageNum,
        page_size: 20,
        sort_by: sort
      });

      if (result.data) {
        const { results, total } = result.data;

        if (isLoadMore) {
          setRecords(prev => {
            const newRecords = [...prev, ...results];
            setHasMore(newRecords.length < total);
            return newRecords;
          });
        } else {
          setRecords(results);
          setHasMore(results.length < total);
        }
        setTotalRecords(total);
      } else if (result.error) {
        setError(result.error.message);
      } else {
        setRecords([]);
        setHasMore(false);
      }
    } catch (error) {
      setError('加载失败，请重试');
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, [songId, sortBy]);

  useEffect(() => {
    pageRef.current = 1;
    setRecords([]);
    setHasMore(true);
    setError(null);
    setTotalRecords(0);
    loadRecords(1, false, sortBy);
  }, [songId, sortBy, loadRecords]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || loadingRef.current || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = Math.max(100, clientHeight * 0.2);
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceToBottom < threshold) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      loadRecords(nextPage, true, sortBy);
    }
  }, [hasMore, loadRecords, sortBy]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const scrollHandler = () => handleScroll();
      container.addEventListener('scroll', scrollHandler, { passive: true });
      return () => container.removeEventListener('scroll', scrollHandler);
    }
  }, [handleScroll, records.length]);

  const handleToggleLike = async (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setRecords(prev =>
      prev.map(r => {
        if (r.id !== recordId) return r;
        const wasLiked = r.user_liked;
        return {
          ...r,
          user_liked: !wasLiked,
          like_count: wasLiked ? Math.max(0, (r.like_count || 0) - 1) : (r.like_count || 0) + 1
        };
      })
    );

    try {
      const response = await fetch(
        `${window.location.origin}/api/songs/like/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ song_record_id: parseInt(recordId) })
        }
      );
      const data = await response.json();

      if (data.success) {
        setRecords(prev =>
          prev.map(r =>
            r.id === recordId
              ? { ...r, like_count: data.like_count, user_liked: data.liked }
              : r
          )
        );
      } else {
        setRecords(prev =>
          prev.map(r => {
            if (r.id !== recordId) return r;
            const wasLiked = r.user_liked;
            return {
              ...r,
              user_liked: !wasLiked,
              like_count: wasLiked ? (r.like_count || 0) + 1 : Math.max(0, (r.like_count || 0) - 1)
            };
          })
        );
      }
    } catch {
      setRecords(prev =>
        prev.map(r => {
          if (r.id !== recordId) return r;
          const wasLiked = r.user_liked;
          return {
            ...r,
            user_liked: !wasLiked,
            like_count: wasLiked ? (r.like_count || 0) + 1 : Math.max(0, (r.like_count || 0) - 1)
          };
        })
      );
    }
  };

  const handleSortChange = () => {
    setSortBy(prev => prev === 'time' ? 'likes' : 'time');
  };

  if (loading) return <div className="p-10"><Loading text="正在搜集音符..." size="sm" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <span className="text-sm text-[#8eb69b]/60">
          {totalRecords > 0 ? `共 ${totalRecords} 条记录` : ''}
        </span>
        <button
          onClick={handleSortChange}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#8eb69b]/30 text-[#8eb69b] hover:bg-[#8eb69b]/10 transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortBy === 'time' ? '时间排序' : '热度排序'}
        </button>
      </div>

      {records.length === 0 && !error ? (
        <div className="p-10 text-center text-[#8eb69b]/40 font-black">暂无记录</div>
      ) : (
        <div ref={containerRef} className="h-[500px] overflow-y-auto">
          {error && (
            <div className="px-4 py-2 text-center text-red-400 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
            {records.map(rec => (
              <div key={rec.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer" onClick={() => onPlay(rec.videoUrl)}>
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img src={rec.coverThumbnailUrl || normalizeCoverPath(rec.cover)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" alt="" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="text-xs font-medium text-[#8eb69b] mb-1">{rec.date}</div>
                  <div className="text-xs text-gray-500 line-clamp-2 mb-2 flex-1" title={rec.note}>{rec.note}</div>
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-100">
                    <button
                      onClick={(e) => handleToggleLike(rec.id, e)}
                      className="flex items-center gap-1 group/like"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${rec.user_liked ? 'fill-red-400 text-red-400' : 'text-gray-300 group-hover/like:text-red-300'}`}
                      />
                      <span className={`text-xs ${rec.user_liked ? 'text-red-400' : 'text-gray-400'}`}>
                        {rec.like_count || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {loadingMore && (
            <div className="py-4 flex justify-center">
              <Loading text="加载更多..." size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordList;
