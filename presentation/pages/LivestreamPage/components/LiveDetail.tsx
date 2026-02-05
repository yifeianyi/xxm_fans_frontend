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

import React from 'react';
import { Livestream } from '../../domain/types';
import { Music, ImageOff, MessageSquare } from 'lucide-react';

interface LiveDetailProps {
  /** 直播记录 */
  live: Livestream;
}

const LiveDetail: React.FC<LiveDetailProps> = ({ live }) => {
  // 获取第一个视频链接（如果存在）
  const firstVideoUrl = live.recordings && live.recordings.length > 0 ? live.recordings[0].url : null;

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
            {firstVideoUrl ? (
              <div className="aspect-video rounded-[1.5rem] overflow-hidden">
                <iframe
                  src={firstVideoUrl.replace('bilibili.com/video/', 'player.bilibili.com/player.html?bvid=').replace('?p=', '&page=')}
                  className="w-full h-full"
                  allowFullScreen
                  scrolling="no"
                  frameBorder="0"
                />
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
            <h3 className="text-sm font-black text-[#8eb69b] uppercase tracking-widest mb-4">歌切列表</h3>
            {live.songCuts && live.songCuts.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {live.songCuts.slice(0, 10).map((cut, idx) => (
                  <a
                    key={idx}
                    href={cut.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/60 p-3 rounded-xl hover:bg-[#fef5f0] transition-colors group"
                  >
                    <p className="text-sm font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors truncate">
                      {cut.song_name || '未知歌曲'}
                    </p>
                  </a>
                ))}
                {live.songCuts.length > 10 && (
                  <p className="text-xs text-[#4a3728]/60 font-black text-center py-2">
                    还有 {live.songCuts.length - 10} 首歌
                  </p>
                )}
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
            {live.screenshots && live.screenshots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {live.screenshots.slice(0, 6).map((screenshot, idx) => (
                  <a
                    key={idx}
                    href={screenshot.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video rounded-xl overflow-hidden bg-[#4a3728]/10 hover:ring-2 hover:ring-[#f8b195]/50 transition-all"
                  >
                    <img
                      src={screenshot.thumbnailUrl}
                      alt={`截图 ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // 缩略图加载失败时显示占位符
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                        const icon = document.createElement('div');
                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#4a3728]/20"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                        target.parentElement!.appendChild(icon);
                      }}
                    />
                  </a>
                ))}
              </div>
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
              <div className="aspect-video rounded-xl overflow-hidden bg-[#4a3728]/5">
                <img
                  src={live.danmakuCloudUrl}
                  alt="弹幕云图"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <MessageSquare className="w-8 h-8 text-[#4a3728]/20" />
                <p className="text-xs text-[#4a3728]/40 font-black">暂无弹幕云图</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetail;