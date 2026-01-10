
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { SongRecord } from '../types';
import { Play } from 'lucide-react';

interface RecordListProps {
  songId: string;
  onPlay: (url: string) => void;
}

const RecordList: React.FC<RecordListProps> = ({ songId, onPlay }) => {
  const [records, setRecords] = useState<SongRecord[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchRecords = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await mockApi.getRecords(songId, p);
      setRecords(prev => p === 1 ? res.records : [...prev, ...res.records]);
      setHasMore(res.hasMore);
    } finally {
      setLoading(false);
    }
  }, [songId]);

  useEffect(() => {
    setRecords([]);
    setPage(1);
    fetchRecords(1);
  }, [songId, fetchRecords]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchRecords(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchRecords]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-top-6 duration-600">
      {records.map(record => (
        <div 
          key={record.id} 
          className="group relative flex flex-col bg-white rounded-2xl border border-[#f8b195]/10 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
          onClick={() => onPlay(record.videoUrl)}
        >
          <div className="aspect-video overflow-hidden bg-[#fef5f0] relative">
            <img 
              src={record.cover} 
              alt={record.date} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2.5 bg-white/95 rounded-full text-[#f8b195] shadow-lg transform group-hover:scale-110 transition-all duration-500 border border-white">
                <Play size={20} fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="p-3 flex flex-col items-center justify-center text-center bg-white">
            <div className="flex items-center justify-center gap-1 text-[#f8b195] font-black text-[10px] uppercase tracking-wider">
              <Play size={8} fill="currentColor" />
              <span>{record.date}</span>
            </div>
            {record.note && (
              <p className="text-[10px] font-bold leading-tight text-[#8eb69b] line-clamp-1 max-w-[95%] mt-1">
                {record.note}
              </p>
            )}
          </div>
        </div>
      ))}
      <div ref={loaderRef} className="col-span-full h-16 flex items-center justify-center">
        {loading && (
          <div className="flex items-center gap-3 text-[#8eb69b] font-black text-xs tracking-widest">
            <div className="w-5 h-5 border-3 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
            正在搜集音符...
          </div>
        )}
        {!hasMore && records.length > 0 && (
          <div className="flex items-center gap-4 text-[#8eb69b]/20">
            <div className="h-px w-8 bg-current"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">EOF</span>
            <div className="h-px w-8 bg-current"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordList;
