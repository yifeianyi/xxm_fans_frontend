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
    `}</style>
  );
};

export default DataAnalysisStyles;
