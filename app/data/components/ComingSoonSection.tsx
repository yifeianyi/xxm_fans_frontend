'use client';

import React from 'react';
import { Eye, Zap, BarChart2 } from 'lucide-react';

interface ComingSoonSectionProps {
  title: string;
  description: string;
  icon: 'eye' | 'zap' | 'chart';
}

const iconMap = {
  eye: Eye,
  zap: Zap,
  chart: BarChart2
};

/**
 * 即将推出区块组件
 */
export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({
  title,
  description,
  icon
}) => {
  const IconComponent = iconMap[icon];

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-[3rem] border-2 border-white/50 shadow-lg p-10 flex flex-col md:flex-row items-center gap-8">
      <div className="w-20 h-20 bg-gradient-to-br from-[#f8b195]/20 to-[#f67280]/20 rounded-[2rem] flex items-center justify-center flex-shrink-0">
        <IconComponent size={32} className="text-[#8eb69b]" />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-black text-[#4a3728] mb-2">{title}</h3>
        <p className="text-[#8eb69b] font-bold text-sm">{description}</p>
      </div>
      
      <div className="px-6 py-3 bg-[#f8b195]/10 rounded-full text-[#f8b195] text-xs font-black uppercase tracking-widest">
        Coming Soon
      </div>
    </div>
  );
};

export default ComingSoonSection;
