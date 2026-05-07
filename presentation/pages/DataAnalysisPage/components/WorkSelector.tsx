import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, Video } from 'lucide-react';
import { songService } from '../../../../infrastructure/api';

interface WorkItem {
  platform: string;
  workId: string;
  title: string;
  author: string;
  publishTime: string;
  coverUrl: string;
}

interface WorkSelectorProps {
  onSelect: (platform: string, workId: string) => void;
}

/**
 * 作品选择器组件
 * 从 data_analytics 作品列表中选择要观测的作品
 */
export const WorkSelector: React.FC<WorkSelectorProps> = ({ onSelect }) => {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        const result = await songService.getAnalyticsWorks(1000);
        if (result.data) {
          const items: WorkItem[] = result.data.map((w: any) => ({
            platform: w.platform,
            workId: w.work_id,
            title: w.title,
            author: w.author,
            publishTime: w.publish_time,
            coverUrl: w.cover_url,
          }));
          setWorks(items);
        }
      } catch (err) {
        console.error('获取作品列表失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = works.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.workId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback((item: WorkItem) => {
    setSelected(item);
    setOpen(false);
    setSearch('');
    onSelect(item.platform, item.workId);
  }, [onSelect]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-3 bg-white/60 rounded-2xl border-2 border-white shadow-sm hover:bg-white/80 transition-all text-left"
      >
        <Video size={18} className="text-[#f8b195] shrink-0" />
        <span className="flex-1 text-sm font-bold text-[#4a3728] truncate">
          {selected ? selected.title : '选择要观测的作品...'}
        </span>
        <ChevronDown size={16} className={`text-[#8eb69b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-[#8eb69b]/10">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#8eb69b]/10 rounded-xl">
              <Search size={14} className="text-[#8eb69b]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索作品标题或 BV 号..."
                className="flex-1 bg-transparent text-xs font-bold text-[#4a3728] placeholder:text-[#8eb69b]/60 outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-6 text-center text-xs font-bold text-[#8eb69b]">加载中...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-[#8eb69b]/60">未找到匹配作品</div>
            ) : (
              filtered.map(item => (
                <button
                  key={item.workId}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f8b195]/10 transition-colors ${
                    selected?.workId === item.workId ? 'bg-[#f8b195]/20' : ''
                  }`}
                >
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#8eb69b]/20 flex items-center justify-center shrink-0">
                      <Video size={16} className="text-[#8eb69b]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#4a3728] truncate">{item.title}</div>
                    <div className="text-[10px] font-black text-[#8eb69b] uppercase mt-0.5">
                      {item.workId} · {item.publishTime ? item.publishTime.split('T')[0] : ''}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
