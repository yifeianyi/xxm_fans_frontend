/**
 * WelcomeBanner - 欢迎横幅组件
 *
 * @module GalleryPage/components
 * @description 显示图集首页的欢迎信息
 *
 * @component
 * @example
 * ```tsx
 * <WelcomeBanner />
 * ```
 *
 * @category Components
 * @subcategory GalleryPage
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { Camera, Sparkles, Star, Heart, Image } from 'lucide-react';

const WelcomeBanner: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-gradient-to-r from-[#f8b195]/10 to-[#8eb69b]/10 rounded-3xl p-8 border-2 border-[#f8b195]/20 relative overflow-hidden">
        {/* 装饰元素 */}
        <div className="absolute top-4 left-6">
          <Sparkles className="w-5 h-5 text-[#f8b195]/40 animate-pulse" />
        </div>
        <div className="absolute top-6 right-8">
          <Star className="w-4 h-4 text-yellow-400/50 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute bottom-4 left-10">
          <Heart className="w-4 h-4 text-[#f67280]/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-6 right-6">
          <Image className="w-5 h-5 text-[#8eb69b]/40 animate-pulse" style={{ animationDelay: '0.8s' }} />
        </div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-[#f8b195] animate-pulse" />
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-sm">
              <Camera size={16} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">满の图册</span>
            </div>
            <Star className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <p className="text-[#4a3728] font-bold text-lg leading-relaxed">
            图集持续整理更新中~~~欢迎各位小满虫投稿和分享图片、表情包等物料~
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-px w-8 bg-[#f8b195]/30" />
            <Heart className="w-4 h-4 text-[#f67280] fill-[#f67280]" />
            <div className="h-px w-8 bg-[#f8b195]/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;