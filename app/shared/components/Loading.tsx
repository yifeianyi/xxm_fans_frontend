'use client';

import React from 'react';

interface LoadingProps {
  /** 加载提示文本 */
  text?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({ 
  text = '正在加载...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-4',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-8'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div 
        className={`${sizeClasses[size]} border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin`}
      />
      {text && (
        <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loading;
