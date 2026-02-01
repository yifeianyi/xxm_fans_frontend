/**
 * 数据分析页面全局样式
 */
export const DataAnalysisStyles = () => (
  <style>{`
    .animate-draw {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw 2.5s ease-out forwards;
    }
    @keyframes draw { 
      to { 
        stroke-dashoffset: 0; 
      } 
    }
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