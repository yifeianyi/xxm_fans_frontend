import React, { useState, useMemo, useEffect } from 'react';
import { PlayCircle, Shuffle, ListMusic, Disc, ChevronRight, Music2 } from 'lucide-react';
import MusicPlayer from '../common/MusicPlayer';
import { OriginalWork } from '../../../domain/types';
import { mockApi } from '../../../infrastructure/api/mockApi';

const OriginalsList: React.FC = () => {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [showAllOriginals, setShowAllOriginals] = useState(false);
  const [works, setWorks] = useState<OriginalWork[]>([]);

  useEffect(() => {
    const loadWorks = async () => {
      const data = await mockApi.getOriginalWorks();
      setWorks(data);
    };
    loadWorks();
  }, []);

  const featuredOriginals = useMemo(() => works.filter(w => w.featured), [works]);
  const archivedOriginals = useMemo(() => works.filter(w => !w.featured), [works]);

  const handleRandomPlay = () => {
    if (works.length === 0) return;
    const randomIdx = Math.floor(Math.random() * works.length);
    setCurrentSongId(works[randomIdx].songId);
  };

  return (
    <div className="space-y-16 relative py-8">
       {/* Background Decoration */}
      <div className="absolute inset-0 bg-[#8eb69b]/5 rounded-[3rem] -z-10 mx-4 md:mx-0"></div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-end justify-between px-8 gap-6">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-[#f8b195] font-black text-xs uppercase tracking-[0.5em]">
            <Disc size={18} className="animate-spin-slow" />
            Original Archive
          </div>
          <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">个人原创作品集 ({works.length})</h2>
          <p className="text-[#8eb69b] font-bold text-sm">记录在森林中自由生长的每一个音符</p>
        </div>
        <button
          onClick={handleRandomPlay}
          className="flex items-center gap-3 px-8 py-4 bg-[#f8b195] text-white rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Shuffle size={18} />
          随机听一首原唱
        </button>
      </div>

      {/* Featured Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
        {featuredOriginals.map((work, idx) => (
          <div key={idx} className="group flex flex-col items-center gap-6">
            <div className="relative w-full aspect-square cursor-pointer" onClick={() => setCurrentSongId(work.songId)}>
              <div className="absolute inset-0 bg-black rounded-full translate-x-4 scale-95 group-hover:translate-x-8 transition-transform duration-700 shadow-2xl opacity-80"></div>
              <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg group-hover:shadow-2xl transition-all">
                <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle size={64} className="text-white fill-white/20" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-[#f8b195] uppercase tracking-widest">{work.date} Release</span>
              <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">{work.title}</h3>
              <div className="flex items-center justify-center gap-2 text-[#8eb69b] font-bold text-[11px] opacity-70">
                 <Music2 size={12} /> 网易云音乐
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Archive Library - High Density List */}
      {archivedOriginals.length > 0 && (
        <div className="px-8 pb-12">
          <div className="glass-card rounded-[3rem] border-2 border-white overflow-hidden shadow-xl">
            <div className="p-6 md:p-10 bg-[#f2f9f1]/50 border-b border-white flex items-center justify-between">
              <h4 className="flex items-center gap-3 text-[#4a3728] font-black">
                <ListMusic size={20} className="text-[#8eb69b]" />
                作品档案库
              </h4>
              <span className="text-[10px] text-[#8eb69b] font-black uppercase tracking-widest">Sorting by Date Desc</span>
            </div>

            <div className={`divide-y divide-white/50 ${!showAllOriginals ? 'max-h-[500px]' : 'max-h-[1000px]'} overflow-y-auto custom-scrollbar transition-all duration-700`}>
              {archivedOriginals.map((work, i) => (
                <div
                  key={i}
                  className={`group flex items-center gap-6 p-6 hover:bg-white/40 transition-all cursor-pointer ${currentSongId === work.songId ? 'bg-white/60' : ''}`}
                  onClick={() => setCurrentSongId(work.songId)}
                >
                  <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-transform ${currentSongId === work.songId ? 'border-[#f8b195] rotate-6' : 'border-white group-hover:rotate-6'}`}>
                    <img src={work.cover} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h5 className={`text-lg font-black transition-colors truncate ${currentSongId === work.songId ? 'text-[#f8b195]' : 'text-[#4a3728] group-hover:text-[#f8b195]'}`}>{work.title}</h5>
                      <span className="text-[10px] font-bold text-[#8eb69b] tabular-nums">{work.date}</span>
                    </div>
                    <p className="text-[10px] text-[#8eb69b] font-bold truncate opacity-60 italic">{work.desc}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${currentSongId === work.songId ? 'bg-[#f8b195] text-white opacity-100' : 'bg-white text-[#f8b195] opacity-0 group-hover:opacity-100'}`}>
                    {currentSongId === work.songId ? (
                       <div className="flex gap-0.5 items-end h-3">
                         <span className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></span>
                         <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></span>
                         <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-1.5"></span>
                       </div>
                    ) : (
                       <PlayCircle size={20} fill="currentColor" className="text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!showAllOriginals && archivedOriginals.length > 5 && (
              <button
                onClick={() => setShowAllOriginals(true)}
                className="w-full p-6 bg-white/40 text-[#8eb69b] font-black text-sm hover:text-[#f8b195] transition-colors flex items-center justify-center gap-2"
              >
                展开全部 {archivedOriginals.length} 首存档作品 <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      <MusicPlayer songId={currentSongId} onClose={() => setCurrentSongId(null)} />
    </div>
  );
};

export default OriginalsList;