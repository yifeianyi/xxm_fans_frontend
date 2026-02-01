import React from 'react';
import { Activity, Eye, Zap } from 'lucide-react';

interface ComingSoonSectionProps {
  title: string;
  description: string;
  icon: 'eye' | 'zap';
}

/**
 * 待展示区域组件
 * 用于显示功能开发中的占位卡片
 */
export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({
  title,
  description,
  icon
}) => {
  const IconComponent = icon === 'eye' ? Eye : Zap;

  return (
    <section className="glass-card rounded-[4rem] border-4 border-white shadow-2xl p-12 space-y-6 bg-white/60">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8eb69b] to-[#f8b195] flex items-center justify-center animate-pulse">
            <IconComponent size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-[#4a3728] tracking-tighter">{title}</h2>
        <p className="text-lg font-bold text-[#8eb69b]">{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#4a3728]/10 rounded-full border-2 border-[#4a3728]/20">
          <Activity size={18} className="text-[#4a3728]" />
          <span className="text-sm font-black text-[#4a3728]">更多数据展示，敬请期待~</span>
        </div>
      </div>
    </section>
  );
};