import React from 'react';

interface RankBadgeProps {
  type: 'high' | 'low';
}

/**
 * 高/低标志组件
 */
export const RankBadge: React.FC<RankBadgeProps> = ({ type }) => (
  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black ml-1 border ${type === 'high' ? 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]' : 'bg-[#eff6ff] text-[#3b82f6] border-[#dbeafe]'}`}>
    {type === 'high' ? '高' : '低'}
  </span>
);