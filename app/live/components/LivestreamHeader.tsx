'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface LivestreamHeaderProps {
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
}

export const LivestreamHeader: React.FC<LivestreamHeaderProps> = ({
  title = '直播纪事',
  description = 'The Forest Archives'
}) => {
  return (
    <div className="flex items-center gap-6">
      <div className="bg-[#f8b195] text-white p-4 rounded-3xl shadow-lg shadow-[#f8b195]/20 animate-pulse">
        <Calendar size={24} />
      </div>
      <div>
        <h1 className="text-3xl font-black text-[#4a3728] tracking-tighter">{title}</h1>
        <p className="text-xs text-[#8eb69b] font-black uppercase tracking-[0.2em]">{description}</p>
      </div>
    </div>
  );
};

export default LivestreamHeader;
