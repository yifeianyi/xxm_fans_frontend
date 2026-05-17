/**
 * LiveDetail - 直播详情容器组件
 *
 * @module LivestreamPage/components
 * @description 包含直播信息、视频播放器、歌切列表、截图、弹幕云图等子组件
 *
 * @component
 * @example
 * ```tsx
 * <LiveDetail live={selectedLive} />
 * ```
 *
 * @category Components
 * @subcategory LivestreamPage
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Livestream } from '../../../../domain/types';
import { Music, ImageOff, MessageSquare, ChevronLeft, ChevronRight, Cloud, PlayCircle, X, Maximize2, Layers } from 'lucide-react';
import VideoModal from '../../../components/common/VideoModal';

interface LiveDetailProps {
  /** 直播记录 */
  live: Livestream;
}

const LiveDetail: React.FC<LiveDetailProps> = ({ live }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [viewingCloud, setViewingCloud] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(() => live.screenshots?.[0] ?? null);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState(0);
  const thumbnailListRef = useRef<HTMLDivElement>(null);

  const screenshots = live.screenshots || [];
  const recordings = useMemo(() => {
    if (live.recordings && live.recordings.length > 0) {
      return live.recordings.map((recording, index) => ({
        ...recording,
        title: recording.title?.trim() || `录像 ${index + 1}`
      }));
    }

    const fallbackUrl = live.replayUrl || (live.bvid ? `https://www.bilibili.com/video/${live.bvid}` : '');
    if (!fallbackUrl) {
      return [];
    }

    return [{
      title: live.title?.trim() || '直播回放',
      url: fallbackUrl
    }];
  }, [live]);

  const currentRecording = recordings[selectedRecordingIndex] ?? recordings[0] ?? null;
  const embedUrl = useMemo(() => {
    const activeVideoUrl = currentRecording?.url || live.replayUrl || (live.bvid ? `https://www.bilibili.com/video/${live.bvid}` : null);
    if (!activeVideoUrl) return null;
    if (activeVideoUrl.includes('player.bilibili.com/player.html')) return activeVideoUrl;

    const fallbackBvid = live.bvid || '';
    const fallback = fallbackBvid ? `https://player.bilibili.com/player.html?bvid=${fallbackBvid}` : null;

    try {
      const parsed = new URL(activeVideoUrl);
      const pathMatch = parsed.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/);
      const bvid = pathMatch?.[1] || fallbackBvid;
      if (!bvid) return null;
      const page = parsed.searchParams.get('p');
      return `https://player.bilibili.com/player.html?bvid=${bvid}${page ? `&page=${page}` : ''}`;
    } catch {
      const match = activeVideoUrl.match(/BV[a-zA-Z0-9]+/);
      const bvid = match?.[0] || fallbackBvid;
      if (!bvid) return null;
      const pageMatch = activeVideoUrl.match(/[?&]p=(\d+)/);
      const page = pageMatch?.[1];
      return `https://player.bilibili.com/player.html?bvid=${bvid}${page ? `&page=${page}` : ''}`;
    }
  }, [currentRecording, live.bvid, live.replayUrl]);

  const currentScreenshotIndex = useMemo(() => {
    if (!activeScreenshot || screenshots.length === 0) return -1;
    return screenshots.findIndex(s => s.thumbnailUrl === activeScreenshot.thumbnailUrl);
  }, [activeScreenshot, screenshots]);

  const handlePrevScreenshot = () => {
    if (screenshots.length <= 1 || currentScreenshotIndex < 0) return;
    const prevIndex = currentScreenshotIndex === 0 ? screenshots.length - 1 : currentScreenshotIndex - 1;
    setActiveScreenshot(screenshots[prevIndex]);
  };

  const handleNextScreenshot = () => {
    if (screenshots.length <= 1 || currentScreenshotIndex < 0) return;
    const nextIndex = currentScreenshotIndex === screenshots.length - 1 ? 0 : currentScreenshotIndex + 1;
    setActiveScreenshot(screenshots[nextIndex]);
  };

  useEffect(() => {
    if (currentScreenshotIndex < 0 || !thumbnailListRef.current) return;
    const buttons = thumbnailListRef.current.querySelectorAll('button');
    const activeButton = buttons[currentScreenshotIndex] as HTMLButtonElement | undefined;
    activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentScreenshotIndex]);

  useEffect(() => {
    setSelectedRecordingIndex(0);
  }, [live.id, live.date]);

  useEffect(() => {
    setPlayerLoaded(false);
  }, [live.id, embedUrl]);

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700" id="live-detail">
      {/* 第一排：核心大标题与关键指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8">
          <div className="bg-white/40 p-6 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-black text-[#4a3728] mb-2">{live.title || '无标题'}</h2>
            <p className="text-sm text-[#8eb69b] font-black uppercase tracking-widest">{live.date}</p>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-[#8eb69b]/10 to-[#f8b195]/10 p-6 rounded-[2rem] border-2 border-white/50 backdrop-blur-md">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f8b195]" />
                <span className="text-xs text-[#4a3728]/60 font-black uppercase">直播时长</span>
              </div>
              <p className="text-lg font-black text-[#4a3728]">{live.duration || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 第二排：视频播放器与歌切列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-start">
        <div className="lg:col-span-8">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            {recordings.length > 1 && (
              <div className="mb-4 flex flex-wrap gap-3 rounded-3xl border-2 border-white bg-white/40 p-3 shadow-sm">
                <div className="mr-1 flex items-center gap-2 border-r border-[#f8b195]/20 px-3 text-[10px] font-black uppercase tracking-widest text-[#f8b195]">
                  <Layers size={14} /> 录像列表
                </div>
                {recordings.map((recording, index) => (
                  <button
                    key={`${recording.url}-${index}`}
                    onClick={() => setSelectedRecordingIndex(index)}
                    className={`rounded-2xl px-4 py-2 text-[11px] font-black transition-all ${
                      selectedRecordingIndex === index
                        ? 'bg-[#f8b195] text-white shadow-md'
                        : 'border border-white bg-white/60 text-[#8eb69b] hover:bg-white'
                    }`}
                  >
                    {recording.title}
                  </button>
                ))}
              </div>
            )}

            {embedUrl ? (
              <div className="aspect-video rounded-[1.5rem] overflow-hidden">
                {!playerLoaded ? (
                  <button
                    onClick={() => setPlayerLoaded(true)}
                    className="w-full h-full relative group bg-black/70"
                  >
                    {live.coverUrl ? (
                      <img src={live.coverUrl} alt="封面" className="absolute inset-0 w-full h-full object-cover" />
                    ) : null}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/85 text-[#f8b195] flex items-center justify-center shadow-lg">
                        <PlayCircle size={32} />
                      </div>
                    </div>
                  </button>
                ) : (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video bg-[#4a3728]/5 rounded-[1.5rem] flex flex-col items-center justify-center gap-3">
                <Music className="w-12 h-12 text-[#4a3728]/20" />
                <span className="text-[#4a3728]/40 font-black">暂无视频</span>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-[#8eb69b] uppercase tracking-widest">歌切列表</h3>
              {currentRecording?.url ? (
                <button
                  onClick={() => setVideoUrl(currentRecording.url)}
                  className="flex items-center gap-2 text-xs font-black text-[#8eb69b] transition-colors hover:text-[#f8b195]"
                >
                  <Maximize2 size={14} /> 全屏播放
                </button>
              ) : null}
            </div>
            {live.songCuts && live.songCuts.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {live.songCuts.map((cut, idx) => (
                  <button
                    key={idx}
                    onClick={() => setVideoUrl(cut.url || null)}
                    className="w-full text-left bg-white/60 p-3 rounded-xl hover:bg-[#fef5f0] transition-colors group flex items-center gap-3"
                  >
                    {cut.coverThumbnailUrl ? (
                      <img src={cut.coverThumbnailUrl} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#fef5f0] text-[#f8b195] flex items-center justify-center shrink-0">
                        <Music size={14} />
                      </div>
                    )}
                    <p className="text-sm font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors truncate">
                      {cut.song_name || '未知歌曲'}
                    </p>
                    <PlayCircle size={16} className="ml-auto text-[#f8b195] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Music className="w-8 h-8 text-[#4a3728]/20" />
                <p className="text-xs text-[#4a3728]/40 font-black">暂无歌切</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 第三排：截图与弹幕云图 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-black text-[#8eb69b] uppercase tracking-widest mb-4">截图</h3>
            {screenshots.length > 0 ? (
              <>
                <div className="flex gap-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#4a3728]/10 relative group flex-1">
                  <img
                    src={activeScreenshot?.thumbnailUrl || screenshots[0].thumbnailUrl}
                    alt="截图"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevScreenshot}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/40 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNextScreenshot}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/40 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                  </div>
                  <div ref={thumbnailListRef} className="w-24 max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {screenshots.map((screenshot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveScreenshot(screenshot)}
                        className={`w-full aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                          activeScreenshot?.thumbnailUrl === screenshot.thumbnailUrl
                            ? 'border-[#f8b195]'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={screenshot.thumbnailUrl} alt={`截图 ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <ImageOff className="w-8 h-8 text-[#4a3728]/20" />
                <p className="text-xs text-[#4a3728]/40 font-black">暂无截图</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-black text-[#8eb69b] uppercase tracking-widest mb-4">弹幕云图</h3>
            {live.danmakuCloudUrl ? (
              <button
                onClick={() => setViewingCloud(true)}
                className="aspect-video rounded-xl overflow-hidden bg-[#4a3728]/5 w-full group relative"
              >
                <img
                  src={live.danmakuCloudUrl}
                  alt="弹幕云图"
                  className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 rounded-full bg-black/40 text-white">
                    <Maximize2 size={18} />
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Cloud className="w-8 h-8 text-[#4a3728]/20" />
                <p className="text-xs text-[#4a3728]/40 font-black">暂无弹幕云图</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />

      {viewingCloud && live.danmakuCloudUrl && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setViewingCloud(false)}
        >
          <button
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50"
            onClick={() => setViewingCloud(false)}
          >
            <X size={24} />
          </button>
          <img
            src={live.danmakuCloudUrl}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            alt="Cloud Detail"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default LiveDetail;
