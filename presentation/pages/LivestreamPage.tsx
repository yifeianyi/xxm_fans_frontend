import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { songService } from '../../infrastructure/api';
import { Livestream, LivestreamRecording, SongRecord, Screenshot } from '../../domain/types';
import { VideoPlayerService } from '../../shared/services/VideoPlayerService';
import {
  Calendar as CalendarIcon, Clock, MessageSquare, Image as ImageIcon,
  ChevronLeft, ChevronRight, BarChart3, Cloud, Users, Heart,
  PlayCircle, Music, Monitor, Maximize2, Layers, X
} from 'lucide-react';
import VideoModal from '../components/common/VideoModal';
import LazyImage from '../components/common/LazyImage';

const LivestreamPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [lives, setLives] = useState<Livestream[]>([]);
  const [selectedLive, setSelectedLive] = useState<Livestream | null>(null);
  const [songRecords, setSongRecords] = useState<SongRecord[]>([]);
  const [activeScreenshot, setActiveScreenshot] = useState<Screenshot | null>(null);
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [viewingCloud, setViewingCloud] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);

  // 获取今天的日期字符串
  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  // 获取月度直播列表（只包含基本信息）
  useEffect(() => {
    const fetchLives = async () => {
      setLoading(true);
      const result = await songService.getLivestreams(currentDate.getFullYear(), currentDate.getMonth() + 1);
      if (result.data) {
        const data = result.data;
        setLives(data);
        if (data.length > 0 && data[0]) {
          // 获取第一条直播的详细信息
          fetchLivestreamDetail(data[0].date);
        } else {
          setSelectedLive(null);
          setSongRecords([]);
        }
      } else {
        setLives([]);
        setSelectedLive(null);
        setSongRecords([]);
      }
      setLoading(false);
    };
    fetchLives();
  }, [currentDate]);

  // 获取指定日期的直播详情（包含截图、歌切等）
  const fetchLivestreamDetail = async (date: string) => {
    setDetailLoading(true);
    try {
      const result = await songService.getLivestreamByDate(date);
      if (result.data) {
        const livestreamData = result.data;
        setSelectedLive(livestreamData);
        // 确保 screenshots 存在且不为空
        const screenshots = livestreamData.screenshots || [];
        setActiveScreenshot(screenshots.length > 0 ? screenshots[0] : null);
        setSelectedRecordingIndex(0);
        setViewingCloud(false);
        setPlayerLoaded(false); // 重置播放器加载状态
        // 获取当天的演唱记录
        fetchSongRecords(date);
      }
    } catch (error) {
      console.error('获取直播详情失败:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  // 获取指定日期的演唱记录
  const fetchSongRecords = async (date: string) => {
    setRecordsLoading(true);
    try {
      const result = await songService.getRecordsByDate(date);
      if (result.data) {
        setSongRecords(result.data);
      } else {
        setSongRecords([]);
      }
    } catch (error) {
      console.error('获取演唱记录失败:', error);
      setSongRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

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

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleSelectLive = (live: Livestream) => {
    // 获取选中日期的详细信息
    fetchLivestreamDetail(live.date);
  };

  const handlePrevScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLive || !activeScreenshot || !selectedLive.screenshots) return;
    const currentIndex = selectedLive.screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot?.thumbnailUrl);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? selectedLive.screenshots.length - 1 : currentIndex - 1;
    setActiveScreenshot(selectedLive.screenshots[prevIndex]);
  };

  const handleNextScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLive || !activeScreenshot || !selectedLive.screenshots) return;
    const currentIndex = selectedLive.screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot?.thumbnailUrl);
    if (currentIndex === -1) return;
    const nextIndex = currentIndex === selectedLive.screenshots.length - 1 ? 0 : currentIndex + 1;
    setActiveScreenshot(selectedLive.screenshots[nextIndex]);
  };

  const currentRecording = selectedLive?.recordings?.[selectedRecordingIndex];

  // 使用后端返回的完整录像列表（包含完整视频链接）
  const recordings = useMemo(() => {
    if (!selectedLive) return [];
    
    // 优先使用后端返回的 recordings
    if (selectedLive.recordings && selectedLive.recordings.length > 0) {
      return selectedLive.recordings;
    }
    
    // Fallback：从 bvid 生成
    if (selectedLive.bvid) {
      const parts = selectedLive.parts || 1;
      const recordings = [];
      for (let i = 1; i <= parts; i++) {
        recordings.push({
          title: selectedLive.title,
          url: `https://www.bilibili.com/video/${selectedLive.bvid}${i > 1 ? `?p=${i}` : ''}`
        });
      }
      return recordings;
    }
    
    return [];
  }, [selectedLive]);

  // 获取当前播放的视频 URL（用于 iframe）
  const currentVideoUrl = useMemo(() => {
    // 优先使用 recordings 数组
    if (selectedLive?.recordings && selectedLive.recordings.length > 0) {
      const recording = selectedLive.recordings[selectedRecordingIndex];
      if (recording?.url) {
        return VideoPlayerService.getEmbedUrl(recording.url);
      }
    }
    // Fallback：使用 bvid 生成
    if (selectedLive?.bvid) {
      return VideoPlayerService.getEmbedUrl(`https://www.bilibili.com/video/${selectedLive.bvid}`);
    }
    return '';
  }, [selectedLive, selectedRecordingIndex]);

  return (
    <>
        <Helmet>
            <title>咻咻满直播记录 - 直播回放、歌曲剪辑 | 小满虫之家</title>
            <meta name="description" content="查看咻咻满的直播记录，包括直播回放、歌曲剪辑和精彩截图。记录每一次直播的精彩瞬间，不错过任何一场精彩演出。" />
        </Helmet>
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
        {calendarCells.map((cell, idx) => {
            const isToday = cell.date === todayStr;
            return (
              <div
                key={idx}
                onClick={() => cell.live && handleSelectLive(cell.live)}
                className={`aspect-video flex items-center justify-center relative rounded-2xl transition-all ${cell.day ? 'bg-white/60' : 'bg-transparent'} ${cell.live ? 'cursor-pointer hover:bg-[#fef5f0] shadow-sm' : ''} ${selectedLive?.date === cell.date ? 'bg-[#fef5f0] ring-4 ring-[#f8b195]/20' : ''} ${isToday ? 'ring-2 ring-[#8eb69b]/50' : ''}`}
              >
                <span className={`text-sm font-black ${cell.live ? 'text-[#f8b195]' : isToday ? 'text-[#8eb69b] font-bold' : 'text-[#4a3728]/40'}`}>{cell.day}</span>
                {cell.live && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#f8b195]"></div>}
                {isToday && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#8eb69b]"></div>}
              </div>
            );
          })}
      </div>

      {/* 沉浸式档案详情区 */}
      {selectedLive ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">

          {/* 第一排：核心大标题与关键指标 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 glass-card rounded-[3.5rem] border-4 border-white shadow-2xl p-10 flex flex-col justify-center gap-6 relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 text-[180px] font-black text-[#f8b195]/5 pointer-events-none select-none">MEMORY</div>
               <div className="space-y-8 relative z-10">
                 {/* 小标签 */}
                 <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#fef5f0] rounded-full text-[#f8b195] w-fit border border-[#f8b195]/20 shadow-sm">
                    <Monitor size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Official Archive</span>
                 </div>

                 {/* 核心大标题：日期 + 直播档案 */}
                 <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#4a3728] tracking-tighter leading-none">
                   {selectedLive.date} <span className="text-[#f8b195] block md:inline mt-2 md:mt-0">直播档案</span>
                 </h2>

                 {/* 描述放大 */}
                 <p className="text-2xl md:text-3xl text-[#8eb69b] font-bold leading-relaxed tracking-tight max-w-4xl">
                   {selectedLive.summary}
                 </p>
               </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="glass-card rounded-[2.5rem] border-4 border-white p-6 flex flex-col items-center justify-center text-center space-y-2 col-span-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-start">
            {/* 完整录像看板 */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#f8b195] rounded-full"></div>
                  <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">完整回放档案</h3>
                </div>
                {recordings.length > 0 && (
                  <button
                    onClick={() => setVideoUrl(currentVideoUrl)}
                    className="text-xs font-black text-[#8eb69b] hover:text-[#f8b195] transition-colors flex items-center gap-2"
                  >
                    <Maximize2 size={14} /> 全屏播放
                  </button>
                )}
              </div>

              {/* 多分段选择器 */}
              {recordings.length > 1 && (
                <div className="flex flex-wrap gap-3 bg-white/40 p-3 rounded-3xl border-2 border-white shadow-sm">
                  <div className="flex items-center gap-2 px-3 text-[#f8b195] text-[10px] font-black uppercase tracking-widest border-r border-[#f8b195]/20 mr-1">
                    <Layers size={14} /> 视频分段
                  </div>
                  {recordings.map((rec, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                    setSelectedRecordingIndex(idx);
                    // 切换分段时保持播放器加载状态，但重新加载 iframe
                    if (playerLoaded) {
                      // 强制重新渲染 iframe
                      setPlayerLoaded(false);
                      setTimeout(() => setPlayerLoaded(true), 0);
                    }
                  }}
                      className={`px-4 py-2 rounded-2xl text-[11px] font-black transition-all ${selectedRecordingIndex === idx ? 'bg-[#f8b195] text-white shadow-md' : 'bg-white/60 text-[#8eb69b] hover:bg-white border border-white'}`}
                    >
                      {rec.title}
                    </button>
                  ))}
                </div>
              )}

              <div className="aspect-video bg-black rounded-[3.5rem] overflow-hidden border-4 border-white shadow-2xl relative group">
                {!playerLoaded && currentVideoUrl ? (
                  // 未加载时显示封面和播放按钮
                  <div
                    className="w-full h-full flex flex-col items-center justify-center bg-gray-900 cursor-pointer"
                    onClick={() => setPlayerLoaded(true)}
                  >
                    {selectedLive?.coverUrl && (
                      <img
                        src={selectedLive.coverUrl}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-[#f8b195] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <PlayCircle size={40} className="text-white" />
                      </div>
                      <span className="text-[#8eb69b] font-black text-sm">点击播放</span>
                    </div>
                  </div>
                ) : currentVideoUrl ? (
                  // 已加载时显示播放器
                  <iframe
                    key={currentVideoUrl}
                    src={currentVideoUrl}
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
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 px-4">
                <div className="w-2 h-6 bg-[#8eb69b] rounded-full"></div>
                <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">时光歌切</h3>
              </div>
              <div className="glass-card rounded-[3rem] border-4 border-white shadow-xl overflow-hidden flex flex-col" style={{ height: '540px' }}>
                <div className="p-6 bg-[#f2f9f1]/40 border-b border-white">
                  <span className="text-[10px] font-black text-[#8eb69b] uppercase tracking-[0.3em]">Tracks from Today</span>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-6 space-y-4 flex-1">
                  {recordsLoading ? (
                    <div className="flex items-center justify-center py-12 text-[#8eb69b] font-black text-sm">
                      加载中...
                    </div>
                  ) : songRecords.length > 0 ? (
                    songRecords.map((record, idx) => (
                      <button
                        key={idx}
                        onClick={() => setVideoUrl(record.videoUrl)}
                        className="w-full flex items-center gap-4 p-4 bg-white/60 hover:bg-white rounded-3xl border border-white transition-all group hover:shadow-md text-left"
                      >
                        {/* 封面缩略图 */}
                        {record.coverThumbnailUrl ? (
                          <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 group-hover:rotate-6 transition-transform">
                            <LazyImage src={record.coverThumbnailUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#fef5f0] text-[#f8b195] rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                            <Music size={18} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors truncate">{record.songName || '未命名歌曲'}</h4>
                          <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest opacity-60">{record.date}</span>
                        </div>
                        <PlayCircle size={20} className="text-[#f8b195] opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                      <Music size={40} className="mb-4 text-[#8eb69b]" />
                      <p className="text-xs font-black text-[#8eb69b] uppercase tracking-widest">暂无演唱记录</p>
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
                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-black/5 border-2 border-white shadow-inner relative group">
                   {selectedLive.screenshots && selectedLive.screenshots.length > 0 ? (
                                         <LazyImage src={activeScreenshot?.thumbnailUrl || selectedLive.coverUrl} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" alt="Archive" />                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-[#8eb69b] bg-gray-900">
                       <ImageIcon size={48} className="mb-4 opacity-50" />
                       <p className="text-sm font-black tracking-wider">暂无图片</p>
                       <p className="text-xs font-black opacity-60 mt-2">欢迎联系投稿</p>
                     </div>
                   )}
                   
                   {/* 左右切换按钮 */}
                   {selectedLive.screenshots && selectedLive.screenshots.length > 1 && (
                     <>
                       <button 
                         onClick={handlePrevScreenshot}
                         className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 hover:bg-white text-white hover:text-[#f8b195] backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/40 transform active:scale-90"
                       >
                         <ChevronLeft size={24} strokeWidth={3} />
                       </button>
                       <button 
                         onClick={handleNextScreenshot}
                         className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 hover:bg-white text-white hover:text-[#f8b195] backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/40 transform active:scale-90"
                       >
                         <ChevronRight size={24} strokeWidth={3} />
                       </button>
                     </>
                   )}

                   {/* 图片索引指示器 */}
                   {selectedLive.screenshots && selectedLive.screenshots.length > 0 && (
                     <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {(selectedLive.screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot?.thumbnailUrl) + 1)} / {selectedLive.screenshots.length}
                     </div>
                   )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar px-2">
                  {selectedLive.screenshots && selectedLive.screenshots.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenshot(s)}
                      className={`w-32 aspect-video rounded-2xl overflow-hidden shrink-0 border-4 transition-all ${activeScreenshot?.thumbnailUrl === s.thumbnailUrl ? 'border-[#f8b195] shadow-lg scale-105' : 'border-white opacity-60 hover:opacity-100'}`}
                    >
                      <LazyImage src={s.thumbnailUrl} className="w-full h-full object-cover" alt="" />
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
                  {selectedLive.danmakuCloudUrl ? (
                    <div 
                      className="relative group w-full cursor-pointer" 
                      onClick={() => setViewingCloud(true)}
                    >
                      <div className="absolute inset-0 bg-[#8eb69b]/20 blur-[60px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
                      <img src={selectedLive.danmakuCloudUrl} className="w-full aspect-[4/3] object-cover rounded-[2.5rem] border-4 border-white shadow-2xl relative z-10 transition-transform group-hover:scale-[1.02]" alt="Cloud" />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                          <Maximize2 size={24} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] flex flex-col items-center justify-center text-[#8eb69b] bg-gray-900 rounded-[2.5rem] border-4 border-white shadow-2xl">
                      <Cloud size={48} className="mb-4 opacity-50" />
                      <p className="text-sm font-black tracking-wider">暂无弹幕云图</p>
                      <p className="text-xs font-black opacity-60 mt-2">欢迎联系投稿</p>
                    </div>
                  )}
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

      {/* 弹幕云图全屏查看模态框 */}
      {viewingCloud && selectedLive && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setViewingCloud(false)}
        >
          <button 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50 hover:rotate-90 duration-300"
            onClick={() => setViewingCloud(false)}
          >
            <X size={28} />
          </button>
          
          <img 
            src={selectedLive.danmakuCloudUrl} 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Cloud Detail" 
            onClick={(e) => e.stopPropagation()} 
          />
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
            <span className="text-xs font-black uppercase tracking-[0.5em]">Danmaku Cloud Analysis</span>
            <span className="text-[10px] font-bold">{selectedLive.date}</span>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8eb69b33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8eb69b66; }
      `}</style>
    </div>
    </>
  );
};

export default LivestreamPage;