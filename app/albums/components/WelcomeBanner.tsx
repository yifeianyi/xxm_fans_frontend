'use client';

/**
 * WelcomeBanner - 欢迎横幅组件
 * 
 * @module app/albums/components
 * @description 图集首页欢迎横幅
 */

import React from 'react';
import { Sparkles, ImageIcon, Heart, Camera } from 'lucide-react';

export default function WelcomeBanner() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fef5f0] via-white to-[#f8b195]/10
                        border border-[#8eb69b]/20 p-8 md:p-12 mb-8">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f8b195]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8eb69b]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                {/* 标题 */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#f8b195]/20 rounded-2xl">
                        <ImageIcon className="w-8 h-8 text-[#f8b195]" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#4a3728]">
                            欢迎来到咻咻满图集
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Sparkles className="w-4 h-4 text-[#f8b195]" />
                            <span className="text-sm text-[#4a3728]/60">记录美好瞬间</span>
                        </div>
                    </div>
                </div>

                {/* 描述 */}
                <p className="text-[#4a3728]/70 leading-relaxed max-w-2xl mb-6">
                    这里汇集了粉丝二创作品、活动照片和生活瞬间。图集持续整理更新中，
                    欢迎各位小满虫投稿和分享。点击左侧导航或下方图集开始浏览吧！
                </p>

                {/* 特色标签 */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-[#8eb69b]/20">
                        <Heart className="w-4 h-4 text-[#f67280]" />
                        <span className="text-sm text-[#4a3728]">粉丝二创</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-[#8eb69b]/20">
                        <Camera className="w-4 h-4 text-[#8eb69b]" />
                        <span className="text-sm text-[#4a3728]">活动照片</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-[#8eb69b]/20">
                        <Sparkles className="w-4 h-4 text-[#f8b195]" />
                        <span className="text-sm text-[#4a3728]">生活瞬间</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
