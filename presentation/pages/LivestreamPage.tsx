import React, { useState, useEffect, useMemo } from 'react';
import { mockApi } from '../../infrastructure/api/mockApi';
import { Livestream } from '../../domain/types';
import {
  Calendar as CalendarIcon, Clock, MessageSquare, Image as ImageIcon,
  ChevronLeft, ChevronRight, BarChart3, Cloud, Users, Heart,
  PlayCircle, Music, Monitor, Maximize2, Layers
} from 'lucide-react';
import VideoModal from '../components/common/VideoModal';

const LivestreamPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [lives, setLives] = useState<Livestream[]>([]);
  const [selectedLive, setSelectedLive] = useState<Livestream | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLives = async () => {
      setLoading(true);
      const data = await mockApi.getLivestreams(currentDate.getFullYear(), currentDate.getMonth() + 1);
      setLives(data);
      if (data.length > 0) {
        setSelectedLive(data[0]);
        setActiveScreenshot(data[0].screenshots[0]);
        setSelectedRecordingIndex(0);
      } else {
        setSelectedLive(null);
      }
      setLoading(false);
    };
    fetchLives();
  }, [currentDate]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() || 7;
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  }, [currentDate]);

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 1; i < daysInMonth.firstDay; i++) cells.push({ day: null, date: '' });
    for (let i = 1; i <= daysInMonth.days; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const live = lives.find(l => l.date === dateStr);
      cells.push({ day: i, date: dateStr, live });
    }
    return cells;
  }, [daysInMonth, lives, currentDate]);

  const getBilibiliEmbed = (url: string) => {
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&danmaku=0&autoplay=0`;
    return url;
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleSelectLive = (live: Livestream) => {
    setSelectedLive(live);
    setSelectedRecordingIndex(0);
    setActiveScreenshot(live.screenshots[0]);
  };

  const currentRecording = selectedLive?.recordings[selectedRecordingIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-1000">

      {/* 顶部控制栏 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 p-6 rounded-[3rem] border-2 border-white shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="bg-[#f8b195] text-white p-4 rounded-3xl shadow-lg shadow-[#f8b195]/20 animate-pulse">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#4a3728] tracking-tighter">直播纪事</h1>
            <p className="text-xs text-[#8eb69b] font-black uppercase tracking-[0.2em]">The Forest Archives</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/60 p-2 rounded-3xl border border-white">
          <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white rounded-2xl text-[#8eb69b] transition-all"><ChevronLeft size={20} /></button>
          <span className="px-4 font-black text-[#4a3728] tabular-nums">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</span>
          <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white rounded-2xl text-[#8eb69b] transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1 bg-white/30 p-2 rounded-[2.5rem] border border-white/50 shadow-inner">
        {['一', '二', '三', '四', '五', '六', '日'].map(w => (
          <div key={w} className="py-2 text-center text-[10px] text-[#8eb69b] font-black uppercase tracking-widest">{w}</div>
        ))}
        {calendarCells.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => cell.live && handleSelectLive(cell.live)}
            className={`aspect-video flex items-center justify-center relative rounded-2xl transition-all ${cell.day ? 'bg-white/60' : 'bg-transparent'} ${cell.live ? 'cursor-pointer hover:bg-[#fef5f0] shadow-sm' : ''} ${selectedLive?.date === cell.date ? 'bg-[#fef5f0] ring-4 ring-[#f8b195]/20' : ''}`}
          >
            <span className={`text-sm font-black ${cell.live ? 'text-[#f8b195]' : 'text-[#4a3728]/10'}`}>{cell.day}</span>
            {cell.live && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#f8b195]"></div>}
          </div>
        ))}
      </div>

      {/* 沉浸式档案详情区 */}
      {selectedLive ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">

          {/* 第一排：核心大标题与关键指标 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 glass-card rounded-[3.5rem] border-4 border-white shadow-2xl p-10 flex flex-col justify-center gap-6 relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 text-[180px] font-black text-[#f8b195]/5 pointer-events-none select-none">MEMORY</div>
               <div className="space-y-2">
                 <div className="flex items-center gap-3 text-[#f8b195]">
                   <Monitor size={18} />
                   <span className="text-xs font-black uppercase tracking-[0.3em]">{selectedLive.date} 直播档案</span>
                 </div>
                 <h2 className="text-5xl md:text-6xl font-black text-[#4a3728] tracking-tighter leading-none">{selectedLive.title}</h2>
               </div>
               <p className="text-lg text-[#8eb69b] font-bold max-w-2xl leading-relaxed">{selectedLive.summary}</p>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="glass-card rounded-[2.5rem] border-4 border-white p-6 flex flex-col items-center justify-center text-center space-y-2">
                <Users size={24} className="text-[#f8b195]" />
                <span className="text-[10px] font-black text-[#8eb69b] uppercase tracking-widest">最高人气</span>
                <span className="text-2xl font-black text-[#4a3728]">{selectedLive.viewCount}</span>
              </div>
              <div className="glass-card rounded-[2.5rem] border-4 border-white p-6 flex flex-col items-center justify-center text-center space-y-2">
                <Heart size={24} className="text-[#f67280]" />
                <span className="text-[10px] font-black text-[#8eb69b] uppercase tracking-widest">总弹幕数</span>
                <span className="text-2xl font-black text-[#4a3728]">{selectedLive.danmakuCount}</span>
              </div>
              <div className="glass-card rounded-[2.5rem] border-4 border-white p-6 flex flex-col items-center justify-center text-center space-y-2 col-span-2">
                <div className="flex items-center gap-4 w-full justify-around px-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">开播</span>
                    <span className="text-lg font-black text-[#4a3728] tabular-nums">{selectedLive.startTime}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">直播时长</span>
                    <span className="text-sm font-black text-[#f8b195] bg-[#fef5f0] px-3 py-1 rounded-full">{selectedLive.duration}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">下播</span>
                    <span className="text-lg font-black text-[#4a3728] tabular-nums">{selectedLive.endTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第二排：分段视频播放器与歌切列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* 完整录像看板 */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#f8b195] rounded-full"></div>
                  <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">完整回放档案</h3>
                </div>
                {currentRecording && (
                  <button
                    onClick={() => setVideoUrl(currentRecording.url)}
                    className="text-xs font-black text-[#8eb69b] hover:text-[#f8b195] transition-colors flex items-center gap-2"
                  >
                    <Maximize2 size={14} /> 全屏播放
                  </button>
                )}
              </div>

              {/* 多分段选择器 */}
              {selectedLive.recordings.length > 1 && (
                <div className="flex flex-wrap gap-3 bg-white/40 p-3 rounded-3xl border-2 border-white shadow-sm">
                  <div className="flex items-center gap-2 px-3 text-[#f8b195] text-[10px] font-black uppercase tracking-widest border-r border-[#f8b195]/20 mr-1">
                    <Layers size={14} /> 视频分段
                  </div>
                  {selectedLive.recordings.map((rec, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedRecordingIndex(idx)}
                      className={`px-4 py-2 rounded-2xl text-[11px] font-black transition-all ${selectedRecordingIndex === idx ? 'bg-[#f8b195] text-white shadow-md' : 'bg-white/60 text-[#8eb69b] hover:bg-white border border-white'}`}
                    >
                      {rec.title}
                    </button>
                  ))}
                </div>
              )}

              <div className="aspect-video bg-black rounded-[3.5rem] overflow-hidden border-4 border-white shadow-2xl relative group">
                {currentRecording ? (
                  <iframe
                    key={currentRecording.url}
                    src={getBilibiliEmbed(currentRecording.url)}
                    className="w-full h-full border-0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8eb69b] bg-gray-900 font-black">
                    暂无回放录像
                  </div>
                )}
              </div>
            </div>

            {/* 当日歌切列表 */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
              <div className="flex items-center gap-3 px-4">
                <div className="w-2 h-6 bg-[#8eb69b] rounded-full"></div>
                <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">时光歌切</h3>
              </div>
              <div className="flex-1 glass-card rounded-[3rem] border-4 border-white shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 bg-[#f2f9f1]/40 border-b border-white">
                  <span className="text-[10px] font-black text-[#8eb69b] uppercase tracking-[0.3em]">Tracks from Today</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                  {selectedLive.songCuts.map((cut, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVideoUrl(cut.videoUrl)}
                      className="w-full flex items-center gap-4 p-4 bg-white/60 hover:bg-white rounded-3xl border border-white transition-all group hover:shadow-md text-left"
                    >
                      <div className="w-10 h-10 bg-[#fef5f0] text-[#f8b195] rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                        <Music size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors truncate">{cut.name}</h4>
                        <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest opacity-60">Song Cut #0{idx + 1}</span>
                      </div>
                      <PlayCircle size={20} className="text-[#f8b195] opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                  {selectedLive.songCuts.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                      <Music size={40} className="mb-4 text-[#8eb69b]" />
                      <p className="text-xs font-black text-[#8eb69b] uppercase tracking-widest">暂无歌切数据</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 第三排：直播截图与弹幕云图 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* 直播截图回顾 */}
            <div className="lg:col-span-7 space-y-6">
               <div className="flex items-center gap-3 px-4">
                <div className="w-2 h-6 bg-[#f8b195] rounded-full"></div>
                <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">瞬间定格</h3>
              </div>
              <div className="glass-card rounded-[3.5rem] border-4 border-white shadow-xl p-8 space-y-6">
                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-black/5 border-2 border-white shadow-inner">
                   <img src={activeScreenshot || selectedLive.coverUrl} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" alt="Archive" />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar px-2">
                  {selectedLive.screenshots.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenshot(s)}
                      className={`w-32 aspect-video rounded-2xl overflow-hidden shrink-0 border-4 transition-all ${activeScreenshot === s ? 'border-[#f8b195] shadow-lg scale-105' : 'border-white opacity-60 hover:opacity-100'}`}
                    >
                      <img src={s} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 弹幕词云分析 */}
            <div className="lg:col-span-5 space-y-6">
               <div className="flex items-center gap-3 px-4">
                <div className="w-2 h-6 bg-[#8eb69b] rounded-full"></div>
                <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">弹幕热语</h3>
              </div>
              <div className="glass-card rounded-[3.5rem] border-4 border-white shadow-xl p-10 flex flex-col h-full bg-gradient-to-br from-white to-[#f2f9f1]/50">
                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                  <div className="relative group w-full">
                    <div className="absolute inset-0 bg-[#8eb69b]/20 blur-[60px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
                    <img src={selectedLive.danmakuCloudUrl} className="w-full aspect-[4/3] object-cover rounded-[2.5rem] border-4 border-white shadow-2xl relative z-10" alt="Cloud" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef5f0] rounded-full text-[#f8b195] text-[10px] font-black uppercase tracking-widest border border-[#f8b195]/10">
                      <Cloud size={14} /> Emotion Analysis
                    </div>
                    <p className="text-sm font-bold text-[#4a3728]/70 leading-relaxed max-w-xs mx-auto">每一个跳动的热词，都是满满与粉丝间独一无二的心跳同频。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-card rounded-[4rem] border-4 border-white shadow-xl p-32 text-center space-y-8 animate-in fade-in">
          <div className="text-8xl animate-bounce">🌲</div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-[#4a3728]">森林寂静中</h3>
            <p className="text-[#8eb69b] font-bold text-lg">点击上方日历中的标记日期，唤醒那一天的美好记忆。</p>
          </div>
        </div>
      )}

      {/* 视频弹窗 */}
      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8eb69b33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8eb69b66; }
      `}</style>
    </div>
  );
};

export default LivestreamPage;