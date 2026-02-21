'use client';

import React from 'react';

/**
 * 数据分析页面样式组件
 */
export const DataAnalysisStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .glass-card {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(16px);
      }
      
      @keyframes draw {
        from {
          stroke-dashoffset: 1000;
        }
        to {
          stroke-dashoffset: 0;
        }
      }
      
      .animate-draw {
        stroke-dasharray: 1000;
        animation: draw 2s ease-out forwards;
      }
      
      /* 自定义滚动条样式 */
      .custom-scrollbar::-webkit-scrollbar { 
        height: 6px; 
        width: 6px; 
      }
      .custom-scrollbar::-webkit-scrollbar-track { 
        background: transparent; 
      }
      .custom-scrollbar::-webkit-scrollbar-thumb { 
        background: #8eb69b33; 
        border-radius: 10px; 
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
        background: #8eb69b66; 
      }
    `}</style>
  );
};

export default DataAnalysisStyles;
