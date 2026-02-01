import React, { useState } from 'react';
import { CorrelationData } from '../../../../domain/types';
import { formatExactNumber } from '../utils';

interface CorrelationChartProps {
  data: CorrelationData[];
  height?: number;
}

/**
 * 关联归因图组件
 * 显示视频播放增量和粉丝净增的关联关系
 */
export const CorrelationChart: React.FC<CorrelationChartProps> = ({ data, height = 240 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);

  if (data.length === 0) return null;
  const viewMax = Math.max(...data.map(d => d.videoViewDelta));
  const folMax = Math.max(...data.map(d => d.followerDelta));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 4;
    const chartWidth = rect.width - paddingLeft * 2;
    const relativeX = Math.max(0, Math.min(x - paddingLeft, chartWidth));
    const index = Math.round((relativeX / chartWidth) * (data.length - 1));
    setHoveredIndex(index);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setMousePosition(null);
  };

  const getHoveredData = () => {
    if (hoveredIndex === null || hoveredIndex < 0 || hoveredIndex >= data.length) return null;
    return data[hoveredIndex];
  };

  const hoveredData = getHoveredData();

  return (
    <div className="flex flex-col w-full select-none" style={{ height: `${height}px` }}>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col justify-between text-[9px] font-black text-[#8eb69b] text-right pr-2 w-[40px] shrink-0 leading-none py-1">
          <span>{formatNumber(viewMax)}</span>
          <span>{formatNumber(viewMax / 2)}</span>
          <span>0</span>
        </div>
        <div 
          ref={chartRef}
          className="flex-1 relative border-l border-r border-[#8eb69b]/10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none z-0">
             <div className="w-full h-px border-t border-dashed border-gray-200"></div>
             <div className="w-full h-px border-t border-dashed border-gray-200"></div>
             <div className="w-full h-px border-t border-dashed border-gray-200"></div>
          </div>
          {hoveredIndex !== null && chartRef.current && (
             <div 
               className="absolute top-0 bottom-0 w-px bg-[#8eb69b]/40 pointer-events-none z-20"
               style={{ 
                 left: `${4 + (hoveredIndex / (data.length - 1)) * (chartRef.current.offsetWidth - 8)}px`
               }}
             />
          )}
          <div className="relative z-10 w-full h-full px-0.5 py-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#8eb69b" strokeWidth="1" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.videoViewDelta / viewMax) * 100}`).join(' ')} />
              <polygon fill="#8eb69b" fillOpacity="0.1" points={`0,100 ${data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.videoViewDelta / viewMax) * 100}`).join(' ')} 100,100`} />
              <polyline fill="none" stroke="#f8b195" strokeWidth="2.5" strokeLinecap="round" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.followerDelta / folMax) * 100}`).join(' ')} />
              {hoveredIndex !== null && (
                <>
                  <circle
                    cx={(hoveredIndex / (data.length - 1)) * 100}
                    cy={100 - (data[hoveredIndex].videoViewDelta / viewMax) * 100}
                    r="1.5"
                    fill="#8eb69b"
                    className="animate-pulse"
                  />
                  <circle
                    cx={(hoveredIndex / (data.length - 1)) * 100}
                    cy={100 - (data[hoveredIndex].followerDelta / folMax) * 100}
                    r="1.5"
                    fill="#f8b195"
                    className="animate-pulse"
                  />
                </>
              )}
            </svg>
          </div>
          {hoveredData && mousePosition && (
            <div 
              className="absolute z-30 bg-[#4a3728] text-white px-4 py-3 rounded-xl shadow-2xl pointer-events-none text-[10px] font-black whitespace-nowrap"
              style={{
                left: `${Math.min(Math.max(mousePosition.x, 40), mousePosition.x + 120)}px`,
                top: `${Math.max(mousePosition.y - 80, 0)}px`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="text-[#8eb69b] mb-1">{hoveredData.time}</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#8eb69b]"></div>
                  <span>播放增量: {formatExactNumber(hoveredData.videoViewDelta)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#f8b195]"></div>
                  <span>粉丝净增: {(hoveredData.followerDelta >= 0 ? '+' : '') + formatExactNumber(hoveredData.followerDelta)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between text-[9px] font-black text-[#f8b195] text-left pl-2 w-[40px] shrink-0 leading-none py-1">
          <span>{formatNumber(folMax)}</span>
          <span>{formatNumber(folMax / 2)}</span>
          <span>0</span>
        </div>
      </div>
      <div className="flex h-5 items-end mt-1">
         <div className="w-[40px] shrink-0"></div>
         <div className="flex-1 flex justify-between text-[9px] font-black text-[#8eb69b]/60 px-0.5 leading-none">
            <span>{data[0]?.time}</span>
            <span>{data[Math.floor(data.length / 2)]?.time}</span>
            <span>{data[data.length - 1]?.time}</span>
         </div>
         <div className="w-[40px] shrink-0"></div>
      </div>
    </div>
  );
};

const formatNumber = (num: number) => {
  if (num === 0) return '0';
  if (Math.abs(num) >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};