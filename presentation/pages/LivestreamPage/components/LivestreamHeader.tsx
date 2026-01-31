/**
 * LivestreamHeader - 直播页面头部组件
 *
 * @module LivestreamPage/components
 * @description 显示页面标题、描述和主题色图标
 *
 * @component
 * @example
 * ```tsx
 * <LivestreamHeader />
 * ```
 *
 * @example 自定义标题和描述
 * ```tsx
 * <LivestreamHeader title="自定义标题" description="自定义描述" />
 * ```
 *
 * @category Components
 * @subcategory LivestreamPage
 *
 * @version 2.0.0
 * @since 2024-01-31
 */

import React from 'react';
import { Calendar } from 'lucide-react';

interface LivestreamHeaderProps {
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
}

const LivestreamHeader: React.FC<LivestreamHeaderProps> = ({
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