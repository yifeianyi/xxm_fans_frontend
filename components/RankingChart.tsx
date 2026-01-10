
import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { Song, TimeRange, Recommendation } from '../types';
import { Sparkles } from 'lucide-react';
import MysteryBoxModal from './MysteryBoxModal';
import VideoModal from './VideoModal';

const RankingChart: React.FC = () => {
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [range, setRange] = useState<TimeRange>(TimeRange.ALL);
  const [hoverRange, setHoverRange] = useState<TimeRange | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [songs, rec] = await Promise.all([
        mockApi.getTopSongs(range),
        mockApi.getRecommendation()
      ]);
      setTopSongs(songs);
      setRecommendation(rec);
      setLoading(false);
    };
    fetchData();
  }, [range]);

  const maxCount = Math.max(...topSongs.map(s => s.performanceCount), 1);
  const options = [
    { label: '全部', value: TimeRange.ALL },
    { label: '近1月', value: TimeRange.MONTH },
    { label: '近3月', value: TimeRange.THREE_MONTHS },
    { label: '近1年', value: TimeRange.YEAR },
  ];

  const currentDisplayRange = hoverRange || range;
  const currentIdx = options.findIndex(o => o.value === currentDisplayRange);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Banner */}
      {recommendation && (
        <div className="p-12 bg-gradient-to-br from-[#f8b195] via-[#f67280] to-[#c06c84] rounded-[4rem] text-white shadow-2xl shadow-peach-accent/20 overflow-hidden relative group">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-6 max-w-xl">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={24} className="text-yellow-200 fill-yellow-200 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-white/80">Special Selection</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight drop-shadow-md">{recommendation.content}</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {recommendation.recommendedSongs.map(id => {
                const song = topSongs.find(s => s.id === id);
                if (!song) return null;
                return (
                  <button 
                    key={id}
                    onClick={() => setSelectedSong(song)}
                    className="px-8 py-3.5 bg-white/20 hover:bg-white/40 backdrop-blur-xl border border-white/30 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    {song.name}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Whimsical Bubbles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 px-4">
        <div className="flex items-center gap-5">
          <div className="w-3 h-12 bg-[#f8b195] rounded-full"></div>
          <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">热歌榜排行</h2>
        </div>
        <div 
          className="relative flex p-2 bg-white/40 rounded-[2rem] overflow-hidden border-2 border-white self-start backdrop-blur-md"
          onMouseLeave={() => setHoverRange(null)}
        >
          <div 
            className="absolute top-2 bottom-2 bg-white rounded-2xl shadow-sm transition-all duration-500 ease-out z-0 border border-[#f8b195]/10"
            style={{
              width: `${100 / options.length}%`,
              left: `${(currentIdx * 100) / options.length}%`,
            }}
          />
          
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              onMouseEnter={() => setHoverRange(opt.value)}
              className={`relative z-10 px-8 py-3 text-sm font-black transition-colors duration-300 whitespace-nowrap min-w-[100px] ${
                currentDisplayRange === opt.value ? 'text-[#f8b195]' : 'text-[#8eb69b] hover:text-[#f8b195]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-12 rounded-[4rem] border-2 border-white shadow-2xl space-y-12">
        {topSongs.map((song, index) => (
          <div key={song.id} className="group flex items-center gap-10">
            <div className="relative">
              <div className={`w-16 h-16 flex items-center justify-center rounded-[2rem] text-3xl font-black italic transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 ${
                index === 0 ? 'bg-[#f8b195] text-white shadow-xl shadow-[#f8b195]/20' : 
                index === 1 ? 'bg-[#f67280] text-white shadow-lg shadow-[#f67280]/20' :
                index === 2 ? 'bg-[#8eb69b] text-white shadow-md shadow-[#8eb69b]/20' :
                'bg-white/50 text-[#8eb69b] border-2 border-white'
              }`}>
                {index + 1}
              </div>
              {index === 0 && <div className="absolute -top-4 -left-4 text-3xl animate-bounce">💌</div>}
            </div>
            <div className="flex-1 space-y-5">
              <div className="flex justify-between items-end px-2">
                <div className="flex flex-col">
                   <span 
                    className="font-black text-[#4a3728] text-2xl hover:text-[#f8b195] cursor-pointer transition-colors tracking-tight"
                    onClick={() => setSelectedSong(song)}
                  >
                    {song.name}
                  </span>
                  <span className="text-xs text-[#8eb69b] font-black uppercase tracking-[0.2em] mt-1">{song.originalArtist}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-[#f8b195] tabular-nums">{song.performanceCount} <span className="text-sm font-bold opacity-40 ml-1">Times</span></span>
                </div>
              </div>
              <div className="h-6 w-full bg-white/40 rounded-full overflow-hidden p-1.5 border-2 border-white/50 shadow-inner relative">
                <div 
                  className={`h-full rounded-full transition-all duration-[2.5s] ease-out relative ${
                    index === 0 ? 'bg-gradient-to-r from-[#f8b195] to-[#f67280]' : 
                    index === 1 ? 'bg-gradient-to-r from-[#f67280] to-[#c06c84]' :
                    index === 2 ? 'bg-gradient-to-r from-[#8eb69b] to-[#2d4a3e]' :
                    'bg-[#d1e7d0] group-hover:bg-[#8eb69b]'
                  }`}
                  style={{ width: loading ? '0%' : `${(song.performanceCount / maxCount) * 100}%` }}
                >
                    <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {topSongs.length === 0 && !loading && (
          <div className="py-24 text-center text-[#8eb69b] flex flex-col items-center gap-6">
            <span className="text-8xl">🏜️</span>
            <span className="font-black text-xl tracking-widest text-[#4a3728]">这片 meadow 还没有回声哦</span>
          </div>
        )}
      </div>

      <MysteryBoxModal 
        isOpen={!!selectedSong} 
        onClose={() => setSelectedSong(null)} 
        song={selectedSong}
        onPlay={(url) => setVideoUrl(url)}
        title="详细回信 💌"
      />

      <VideoModal 
        isOpen={!!videoUrl} 
        onClose={() => setVideoUrl(null)} 
        videoUrl={videoUrl || ''} 
      />
    </div>
  );
};

export default RankingChart;
