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
import { Camera } from 'lucide-react';

const WelcomeBanner: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-gradient-to-r from-[#f8b195]/10 to-[#8eb69b]/10 rounded-3xl p-8 border-2 border-[#f8b195]/20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-sm">
            <Camera size={16} />
            <span className="text-xs font-black uppercase tracking-[0.4em]">满の图册</span>
          </div>
          <p className="text-[#4a3728] font-bold text-lg leading-relaxed">
            图集持续整理更新中~~~欢迎各位小满虫投稿和分享图片、表情包等物料~
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;