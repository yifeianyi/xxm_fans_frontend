'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Livestream, Screenshot } from '@/app/domain/types';
import {
  Calendar as CalendarIcon, Clock, MessageSquare, Image as ImageIcon,
  ChevronLeft, ChevronRight, BarChart3, Cloud, Users, Heart,
  PlayCircle, Music, Monitor, Maximize2, Layers, X
} from 'lucide-react';
import { LazyImage } from '@/app/shared/components/LazyImage';

interface LiveDetailProps {
  /** 直播记录 */
  live: Livestream;
}

/**
 * 获取 B站视频的嵌入播放 URL
 */
function getBilibiliEmbedUrl(url: string): string {
  if (!url) return '';
  // 解析 BV 号
  const bvidMatch = url.match(/BV[\w]+/);
  if (!bvidMatch) return url;
  
  const bvid = bvidMatch[0];
  // 解析分P参数
  const pageMatch = url.match(/[?&]p=(\d+)/);
  const page = pageMatch ? pageMatch[1] : '1';
  
  return `https://player.bilibili.com/player.html?bvid=${bvid}&page=${page}`;
}

export const LiveDetail: React.FC<LiveDetailProps> = ({ live }) => {
  // 分段视频索引
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState(0);
  // 当前激活的截图
  const [activeScreenshot, setActiveScreenshot] = useState<Screenshot | null>(
    live.screenshots && live.screenshots.length > 0 ? live.screenshots[0] : null
  );
  // 播放器是否已加载（懒加载）
  const [playerLoaded, setPlayerLoaded] = useState(false);
  // 是否正在查看弹幕云图全屏
  const [viewingCloud, setViewingCloud] = useState(false);
  // 视频弹窗 URL
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  
  // 缩略图列表引用
  const thumbnailListRef = useRef<HTMLDivElement>(null);

  // 录制列表（分段视频）
  const recordings = useMemo(() => {
    if (!live) return [];
    
    // 优先使用后端返回的 recordings
    if (live.recordings && live.recordings.length > 0) {
      return live.recordings;
    }
    
    // Fallback：从 bvid 生成
    if (live.bvid) {
      const parts = live.parts || 1;
      const recs = [];
      for (let i = 1; i <= parts; i++) {
        recs.push({
          title: i === 1 ? live.title || '直播回放' : `${live.title || '直播回放'} - P${i}`,
          url: `https://www.bilibili.com/video/${live.bvid}${i > 1 ? `?p=${i}` : ''}`
        });
      }
      return recs;
    }
    
    return [];
  }, [live]);

  // 当前播放的视频 URL
  const currentVideoUrl = useMemo(() => {
    if (recordings.length > 0) {
      const recording = recordings[selectedRecordingIndex];
      if (recording?.url) {
        return getBilibiliEmbedUrl(recording.url);
      }
    }
    return '';
  }, [recordings, selectedRecordingIndex]);

  // 截图切换 - 上一张
  const handlePrevScreenshot = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!live.screenshots || !activeScreenshot) return;
    const currentIndex = live.screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot.thumbnailUrl);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? live.screenshots.length - 1 : currentIndex - 1;
    setActiveScreenshot(live.screenshots[prevIndex]);
    
    // 滚动到可视范围
    setTimeout(() => {
      const buttons = thumbnailListRef.current?.querySelectorAll('button');
      if (buttons && buttons[prevIndex]) {
        buttons[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 50);
  }, [live.screenshots, activeScreenshot]);

  // 截图切换 - 下一张
  const handleNextScreenshot = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!live.screenshots || !activeScreenshot) return;
    const currentIndex = live.screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot.thumbnailUrl);
    if (currentIndex === -1) return;
    const nextIndex = currentIndex === live.screenshots.length - 1 ? 0 : currentIndex + 1;
    setActiveScreenshot(live.screenshots[nextIndex]);
    
    // 滚动到可视范围
    setTimeout(() => {
      const buttons = thumbnailListRef.current?.querySelectorAll('button');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 50);
  }, [live.screenshots, activeScreenshot]);

  // 切换分段视频
  const handleRecordingChange = useCallback((index: number) => {
    setSelectedRecordingIndex(index);
    // 切换分段时重置播放器
    if (playerLoaded) {
      setPlayerLoaded(false);
      setTimeout(() => setPlayerLoaded(true), 0);
    }
  }, [playerLoaded]);

  // 歌切列表
  const songCuts = live.songCuts || [];

  return (
    <>
      <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700" id="live-detail">

        {/* 第一排：核心大标题与关键指标 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 bg-white/40 p-8 md:p-10 rounded-[3.5rem] border-4 border-white shadow-2xl backdrop-blur-md flex flex-col justify-center gap-6 relative overflow-hidden">
            {/* 背景装饰文字 */}
            <div className="absolute -right-10 -bottom-10 text-[180px] font-black text-[#f8b195]/5 pointer-events-none select-none">MEMORY</div>
            
            <div className="space-y-8 relative z-10">
              {/* 小标签 */}
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#fef5f0] rounded-full text-[#f8b195] w-fit border border-[#f8b195]/20 shadow-sm">
                <Monitor size={20} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Official Archive</span>
              </div>

              {/* 核心大标题：日期 + 直播档案 */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#4a3728] tracking-tighter leading-none">
                {live.date} <span className="text-[#f8b195] block md:inline mt-2 md:mt-0">直播档案</span>
              </h2>

              {/* 描述 */}
              <p className="text-xl md:text-2xl text-[#8eb69b] font-bold leading-relaxed tracking-tight max-w-4xl">
                {live.summary || `${live.date} 的精彩直播时刻`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {/* 弹幕数 */}
            <div className="bg-white/40 p-6 rounded-[2.5rem] border-4 border-white shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center space-y-2 col-span-2">
              <Heart size={24} className="text-[#f67280]" />
              <span className="text-[10px] font-black text-[#8eb69b] uppercase tracking-widest">总弹幕数</span>
              <span className="text-2xl font-black text-[#4a3728]">{live.danmakuCount || 'N/A'}</span>
            </div>
            
            {/* 时间信息 */}
            <div className="bg-white/40 p-6 rounded-[2.5rem] border-4 border-white shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center space-y-2 col-span-2">
              <div className="flex items-center gap-4 w-full justify-around px-4">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">开播</span>
                  <span className="text-lg font-black text-[#4a3728] tabular-nums">{live.startTime || 'N/A'}</span>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">直播时长</span>
                  <span className="text-sm font-black text-[#f8b195] bg-[#fef5f0] px-3 py-1 rounded-full">{live.duration || 'N/A'}</span>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">下播</span>
                  <span className="text-lg font-black text-[#4a3728] tabular-nums">{live.endTime || 'N/A'}</span>
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
              {recordings.length > 0 && currentVideoUrl && (
                <button
                  onClick={() => setVideoModalUrl(currentVideoUrl)}
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
                    onClick={() => handleRecordingChange(idx)}
                    className={`px-4 py-2 rounded-2xl text-[11px] font-black transition-all ${
                      selectedRecordingIndex === idx 
                        ? 'bg-[#f8b195] text-white shadow-md' 
                        : 'bg-white/60 text-[#8eb69b] hover:bg-white border border-white'
                    }`}
                  >
                    {rec.title}
                  </button>
                ))}
              </div>
            )}

            {/* 视频播放器 */}
            <div className="aspect-video bg-black rounded-[3.5rem] overflow-hidden border-4 border-white shadow-2xl relative group">
              {!playerLoaded && currentVideoUrl ? (
                // 未加载时显示封面和播放按钮
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-gray-900 cursor-pointer"
                  onClick={() => setPlayerLoaded(true)}
                >
                  {live.coverUrl && (
                    <img
                      src={live.coverUrl}
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
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8eb69b] bg-gray-900">
                  <PlayCircle size={48} className="mb-4 opacity-50" />
                  <p className="text-sm font-black tracking-wider">暂无回放录像</p>
                  <p className="text-xs font-black opacity-60 mt-2">欢迎联系投稿</p>
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
            <div className="bg-white/40 rounded-[3rem] border-4 border-white shadow-xl overflow-hidden flex flex-col" style={{ height: '540px' }}>
              <div className="p-6 bg-[#f2f9f1]/40 border-b border-white">
                <span className="text-[10px] font-black text-[#8eb69b] uppercase tracking-[0.3em]">Tracks from Today</span>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-6 space-y-4 flex-1">
                {songCuts.length > 0 ? (
                  songCuts.map((cut, idx) => (
                    <button
                      key={idx}
                      onClick={() => cut.url && setVideoModalUrl(getBilibiliEmbedUrl(cut.url))}
                      className="w-full flex items-center gap-4 p-4 bg-white/60 hover:bg-white rounded-3xl border border-white transition-all group hover:shadow-md text-left"
                      disabled={!cut.url}
                    >
                      {/* 封面缩略图 */}
                      {cut.coverThumbnailUrl ? (
                        <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 group-hover:rotate-6 transition-transform">
                          <LazyImage src={cut.coverThumbnailUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-[#fef5f0] text-[#f8b195] rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                          <Music size={18} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors truncate">
                          {cut.song_name || '未命名歌曲'}
                        </h4>
                        <span className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest opacity-60">
                          {cut.performed_at}
                        </span>
                      </div>
                      {cut.url && <PlayCircle size={20} className="text-[#f8b195] opacity-0 group-hover:opacity-100 transition-all" />}
                    </button>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <Music size={40} className="mb-4 text-[#8eb69b] opacity-50" />
                    <p className="text-sm font-black text-[#8eb69b] tracking-wider">暂无演唱记录</p>
                    <p className="text-xs font-black text-[#8eb69b] opacity-60 mt-2">欢迎联系投稿</p>
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
            <div className="bg-white/40 rounded-[3.5rem] border-4 border-white shadow-xl p-8 space-y-6">
              <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-black/5 border-2 border-white shadow-inner relative group">
                {live.screenshots && live.screenshots.length > 0 ? (
                  <LazyImage 
                    src={activeScreenshot?.thumbnailUrl || live.coverUrl || ''} 
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" 
                    alt="Archive" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8eb69b] bg-gray-900">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p className="text-sm font-black tracking-wider">暂无图片</p>
                    <p className="text-xs font-black opacity-60 mt-2">欢迎联系投稿</p>
                  </div>
                )}
                
                {/* 左右切换按钮 */}
                {live.screenshots && live.screenshots.length > 1 && (
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
                {live.screenshots && live.screenshots.length > 0 && activeScreenshot && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {(live.screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot.thumbnailUrl) + 1)} / {live.screenshots.length}
                  </div>
                )}
              </div>
              
              {/* 缩略图列表 */}
              {live.screenshots && live.screenshots.length > 1 && (
                <div ref={thumbnailListRef} className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar px-2">
                  {live.screenshots.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        setActiveScreenshot(s);
                        setTimeout(() => {
                          e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }, 50);
                      }}
                      className={`w-32 aspect-video rounded-2xl overflow-hidden shrink-0 border-4 transition-all ${
                        activeScreenshot?.thumbnailUrl === s.thumbnailUrl 
                          ? 'border-[#f8b195] shadow-lg scale-105' 
                          : 'border-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      <LazyImage src={s.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 弹幕词云分析 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 px-4">
              <div className="w-2 h-6 bg-[#8eb69b] rounded-full"></div>
              <h3 className="text-2xl font-black text-[#4a3728] tracking-tight">弹幕热语</h3>
            </div>
            <div className="bg-white/40 rounded-[3.5rem] border-4 border-white shadow-xl p-10 flex flex-col h-full bg-gradient-to-br from-white to-[#f2f9f1]/50 backdrop-blur-md">
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="w-full">
                  {live.danmakuCloudUrl ? (
                    <div 
                      className="relative group w-full cursor-pointer" 
                      onClick={() => setViewingCloud(true)}
                    >
                      <div className="absolute inset-0 bg-[#8eb69b]/20 blur-[60px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
                      <img 
                        src={live.danmakuCloudUrl} 
                        className="w-full aspect-[4/3] object-cover rounded-[2.5rem] border-4 border-white shadow-2xl relative z-10 transition-transform group-hover:scale-[1.02]" 
                        alt="Cloud" 
                      />
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
                </div>
                {/* 提示语始终显示 */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef5f0] rounded-full text-[#f8b195] text-[10px] font-black uppercase tracking-widest border border-[#f8b195]/10">
                    <Cloud size={14} /> Emotion Analysis
                  </div>
                  <p className="text-sm font-bold text-[#4a3728]/70 leading-relaxed max-w-xs mx-auto">
                    每一个跳动的热词，都是满满与粉丝间独一无二的心跳同频。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 视频弹窗 */}
      {videoModalUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setVideoModalUrl(null)}
        >
          <button 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50 hover:rotate-90 duration-300"
            onClick={() => setVideoModalUrl(null)}
          >
            <X size={28} />
          </button>
          
          <div className="w-full max-w-5xl aspect-video">
            <iframe
              src={videoModalUrl}
              className="w-full h-full rounded-2xl"
              allowFullScreen
              onClick={(e) => e.stopPropagation()}
            ></iframe>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
            <span className="text-xs font-black uppercase tracking-[0.5em]">Video Player</span>
            <span className="text-[10px] font-bold">{live.date}</span>
          </div>
        </div>
      )}

      {/* 弹幕云图全屏查看模态框 */}
      {viewingCloud && live.danmakuCloudUrl && (
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
            src={live.danmakuCloudUrl} 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Cloud Detail" 
            onClick={(e) => e.stopPropagation()} 
          />
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
            <span className="text-xs font-black uppercase tracking-[0.5em]">Danmaku Cloud Analysis</span>
            <span className="text-[10px] font-bold">{live.date}</span>
          </div>
        </div>
      )}

      {/* 自定义滚动条样式 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8eb69b33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8eb69b66; }
      `}</style>
    </>
  );
};

export default LiveDetail;