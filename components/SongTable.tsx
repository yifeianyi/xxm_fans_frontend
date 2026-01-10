
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Gift, SlidersHorizontal, ChevronDown, ChevronRight, Copy, Check, ChevronLeft } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Song, FilterState } from '../types';
import { GENRES, TAGS, LANGUAGES } from '../constants';
import RecordList from './RecordList';
import VideoModal from './VideoModal';
import MysteryBoxModal from './MysteryBoxModal';

const SongTable: React.FC = () => {
  // --- 状态管理 ---
  const [songs, setSongs] = useState<Song[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({ genres: [], tags: [], languages: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [mysterySong, setMysterySong] = useState<Song | null>(null);

  // --- 数据获取逻辑 ---
  const fetchSongs = useCallback(async (targetPage: number = 1) => {
    setLoading(true);
    try {
      const res = await mockApi.getSongs({ 
        search, 
        ...filters,
        page: targetPage,
        sortBy: sortBy || undefined,
        sortDir
      });
      setSongs(res.songs);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [search, filters, sortBy, sortDir]);

  useEffect(() => {
    fetchSongs(page);
  }, [fetchSongs, page]);

  // --- 交互处理 ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSongs(1);
  };

  const handleQuickFilter = (type: keyof FilterState | 'artist', value: string) => {
    if (type === 'artist') {
      setSearch(value);
      setFilters({ genres: [], tags: [], languages: [] });
    } else {
      setSearch('');
      setFilters({ genres: [], tags: [], languages: [], [type]: [value] });
    }
    setPage(1);
    setShowFilters(false); // 点击标签时自动收起面板以查看结果
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(v => v !== value) 
        : [...prev[type], value]
    }));
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(text);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const totalPages = useMemo(() => Math.ceil(total / 50), [total]);

  return (
    <div className="flex flex-col gap-10">
      {/* 搜索与工具栏 */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 relative flex items-center group">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜一搜 满老师 的信件..."
            className="w-full pl-16 pr-6 h-16 rounded-[2.5rem] bg-white border-2 border-[#8eb69b]/20 focus:border-[#f8b195] focus:ring-8 focus:ring-[#f8b195]/10 transition-all outline-none shadow-sm text-[#4a3728] placeholder:text-[#8eb69b]/40 font-black text-lg"
          />
          <button 
            type="submit"
            className="absolute left-3 w-12 h-12 flex items-center justify-center rounded-full text-[#f8b195] hover:bg-[#fef5f0] hover:scale-110 active:scale-95 transition-all duration-300 z-10"
            title="点击搜索"
          >
            <Search size={26} strokeWidth={3} />
          </button>
        </form>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={async () => setMysterySong(await mockApi.getRandomSong(filters))}
            className="flex-1 md:flex-none h-16 flex items-center justify-center gap-3 px-8 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-[2.5rem] hover:brightness-105 transition-all font-black shadow-lg shadow-[#f8b195]/20 active:scale-95 whitespace-nowrap"
          >
            <Gift size={24} />
            <span>盲盒抽信</span>
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 md:flex-none h-16 flex items-center justify-center gap-3 px-8 rounded-[2.5rem] transition-all font-black border-2 whitespace-nowrap ${showFilters ? 'bg-[#4a3728] text-white border-[#4a3728]' : 'bg-white text-[#f8b195] border-[#f8b195]/20 hover:bg-[#fef5f0] shadow-sm'}`}
          >
            <SlidersHorizontal size={24} />
            <span>{showFilters ? '收起筛选' : '更多条件'}</span>
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="p-10 glass-card rounded-[3.5rem] border-2 border-white shadow-xl animate-in slide-in-from-top-6 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: '曲风分类', type: 'genres', data: GENRES },
              { title: '特色标签', type: 'tags', data: TAGS },
              { title: '语言频道', type: 'languages', data: LANGUAGES }
            ].map(group => (
              <div key={group.type}>
                <h4 className="font-black text-[#4a3728] mb-6 flex items-center gap-3 px-2">
                  <div className="w-2 h-6 bg-[#f8b195] rounded-full"></div>
                  {group.title}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {group.data.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleFilter(group.type as keyof FilterState, item)}
                      className={`px-5 py-2.5 rounded-full text-xs font-black border-2 transition-all ${filters[group.type as keyof FilterState].includes(item) ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-md' : 'bg-white/50 text-[#8eb69b] border-[#8eb69b]/20 hover:border-[#f8b195]'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 pt-8 mt-10 border-t border-white/40">
            <button 
              onClick={() => { setSearch(''); setFilters({ genres: [], tags: [], languages: [] }); setPage(1); }}
              className="px-10 py-4 bg-white/50 text-[#8eb69b] rounded-full hover:bg-white transition-all font-black text-sm"
            >
              清空全部
            </button>
            <button 
              onClick={() => setShowFilters(false)}
              className="flex-1 py-4 bg-[#8eb69b] text-white rounded-full hover:bg-[#2d4a3e] transition-all font-black shadow-lg shadow-[#8eb69b]/20"
            >
              收起面板
            </button>
          </div>
        </div>
      )}

      {/* 表格主体 */}
      <div className="overflow-x-auto glass-card rounded-[3.5rem] border-2 border-white/50 shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-[#f2f9f1]/80 text-[#8eb69b] text-sm font-black border-b border-white/40">
              <th className="px-10 py-5">歌曲名</th>
              <th className="px-6 py-5 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('originalArtist')}>原唱</th>
              <th className="px-6 py-5">风格</th>
              <th className="px-6 py-5">语种</th>
              <th className="px-6 py-5 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('firstPerformance')}>第一次演唱</th>
              <th className="px-6 py-5 cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('lastPerformance')}>最近一次</th>
              <th className="px-6 py-5 text-center cursor-pointer hover:text-[#f8b195]" onClick={() => handleSort('performanceCount')}>演唱次数</th>
              <th className="px-6 py-5">标签</th>
              <th className="px-10 py-5 text-center">记录</th>
            </tr>
          </thead>
          <tbody className="text-[#4a3728] font-bold">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-48 text-center text-[#8eb69b]">
                  <div className="inline-block w-14 h-14 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
                  <div className="mt-8 font-black tracking-widest text-lg">正在送信中...</div>
                </td>
              </tr>
            ) : songs.map(song => (
              <React.Fragment key={song.id}>
                <tr className={`border-b border-white/30 hover:bg-white/40 transition-all duration-300 ${expandedId === song.id ? 'bg-white/60' : ''}`}>
                  <td className="px-10 py-4">
                    <button 
                      onClick={() => copyToClipboard(song.name)}
                      className="group flex items-center gap-3 hover:text-[#f8b195] font-black transition-all text-base"
                    >
                      {song.name}
                      {copyStatus === song.name ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="opacity-0 group-hover:opacity-100 text-[#f8b195]/40" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleQuickFilter('artist', song.originalArtist)} className="text-[#f8b195] hover:text-[#f67280] transition-colors text-sm font-black">
                      {song.originalArtist}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {song.genres.map(g => (
                        <button key={g} onClick={() => handleQuickFilter('genres', g)} className="text-[10px] px-3 py-1 bg-[#f1f8f1] text-[#8eb69b] rounded-full hover:bg-[#8eb69b] hover:text-white transition-all font-black border border-[#8eb69b]/10">
                          {g}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {song.languages.map((l, i) => (
                        <button key={l} onClick={() => handleQuickFilter('languages', l)} className="hover:text-[#f8b195] transition-colors font-black">
                          {l}{i < song.languages.length - 1 ? '、' : ''}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8eb69b] font-black">{song.firstPerformance}</td>
                  <td className="px-6 py-4 text-sm text-[#8eb69b] font-black">{song.lastPerformance}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-[#fef5f0] text-[#f8b195] rounded-full text-base font-black tabular-nums border border-[#f8b195]/10">
                      {song.performanceCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {song.tags.map(t => (
                        <button key={t} onClick={() => handleQuickFilter('tags', t)} className="text-[10px] px-3 py-1 bg-[#fffceb] text-[#d4af37] border border-[#d4af37]/20 rounded-full hover:shadow-sm transition-all font-black">
                          {t}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-4 text-center">
                    <button 
                      onClick={() => setExpandedId(expandedId === song.id ? null : song.id)}
                      className={`p-2 rounded-2xl transition-all ${expandedId === song.id ? 'bg-[#f8b195] text-white shadow-lg' : 'hover:bg-[#fef5f0] text-[#f8b195]'}`}
                    >
                      {expandedId === song.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </td>
                </tr>
                {expandedId === song.id && (
                  <tr className="bg-white/20">
                    <td colSpan={9} className="p-4 border-b border-white/40">
                      <div className="bg-white/60 rounded-[3rem] p-4 border border-white/50">
                        <RecordList songId={song.id} onPlay={(url) => setVideoUrl(url)} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="px-12 py-10 bg-white/30 border-t border-white/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-xs text-[#8eb69b] font-black tracking-[0.3em] uppercase">
              Page {page} of {totalPages} • Total {total} Letters
            </span>
            <div className="flex items-center gap-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 rounded-2xl border-2 border-white bg-white/50 text-[#f8b195] disabled:opacity-30 hover:bg-white transition-all"><ChevronLeft size={24} /></button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`min-w-[44px] h-11 rounded-2xl text-sm font-black transition-all ${page === p ? 'bg-[#f8b195] text-white shadow-lg' : 'bg-white/50 text-[#8eb69b] border-2 border-white hover:border-[#f8b195]'}`}>{p}</button>
                ))}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-3 rounded-2xl border-2 border-white bg-white/50 text-[#f8b195] disabled:opacity-30 hover:bg-white transition-all"><ChevronRight size={24} /></button>
            </div>
          </div>
        )}
      </div>

      <MysteryBoxModal isOpen={!!mysterySong} onClose={() => setMysterySong(null)} song={mysterySong} onPlay={setVideoUrl} />
      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
    </div>
  );
};

export default SongTable;
