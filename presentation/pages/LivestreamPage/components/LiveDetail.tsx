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

interface LiveDetailProps {
  /** 直播记录 */
  live: Livestream;
}

const LiveDetail: React.FC<LiveDetailProps> = ({ live }) => {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700" id="live-detail">
      {/* 第一排：核心大标题与关键指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8">
          <div className="bg-white/40 p-6 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-black text-[#4a3728] mb-2">{live.title}</h2>
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
              <p className="text-lg font-black text-[#4a3728]">{live.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 第二排：视频播放器与歌切列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-start">
        <div className="lg:col-span-8">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            {live.videoUrl ? (
              <div className="aspect-video bg-[#4a3728]/10 rounded-[1.5rem] flex items-center justify-center">
                <span className="text-[#4a3728]/40 font-black">视频播放器</span>
              </div>
            ) : (
              <div className="aspect-video bg-[#4a3728]/10 rounded-[1.5rem] flex items-center justify-center">
                <span className="text-[#4a3728]/40 font-black">暂无视频</span>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-black text-[#8eb69b] uppercase tracking-widest mb-4">歌切列表</h3>
            {live.songCuts && live.songCuts.length > 0 ? (
              <div className="space-y-2">
                {live.songCuts.slice(0, 5).map((cut, idx) => (
                  <div key={idx} className="bg-white/60 p-3 rounded-xl">
                    <p className="text-sm font-black text-[#4a3728]">{cut.songName}</p>
                  </div>
                ))}
                {live.songCuts.length > 5 && (
                  <p className="text-xs text-[#4a3728]/60 font-black text-center">
                    还有 {live.songCuts.length - 5} 首歌
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#4a3728]/40 font-black text-center">暂无歌切</p>
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
                  <div key={idx} className="aspect-video bg-[#4a3728]/10 rounded-xl" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#4a3728]/40 font-black text-center">暂无截图</p>
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-black text-[#8eb69b] uppercase tracking-widest mb-4">弹幕云图</h3>
            {live.danmakuCloudUrl ? (
              <div className="aspect-video bg-[#4a3728]/10 rounded-xl flex items-center justify-center">
                <span className="text-[#4a3728]/40 font-black">弹幕云图</span>
              </div>
            ) : (
              <p className="text-xs text-[#4a3728]/40 font-black text-center">暂无弹幕云图</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetail;