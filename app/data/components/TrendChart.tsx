'use client';

import React, { useState, useRef } from 'react';
import { DataPoint, TimeGranularity } from '@/app/domain/types';

interface TrendChartProps {
  data: DataPoint[];
  color: string;
  type: 'line' | 'bar';
  height?: number;
  granularity?: TimeGranularity;
}

// 格式化精确数字
const formatExactNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 格式化数字（带单位）
const formatNumber = (num: number, maxValue: number, minValue: number): string => {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const dataRange = maxValue - minValue;
  
  if (dataRange < 1000) {
    return num.toString();
  }
  
  if (dataRange < 10000) {
    if (absNum >= 1000) {
      return (num / 1000).toFixed(2) + 'k';
    }
    return num.toFixed(0);
  }
  
  if (dataRange < 100000) {
    if (absNum >= 10000) {
      return (num / 10000).toFixed(2) + 'w';
    } else if (absNum >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toFixed(0);
  }
  
  if (absNum >= 100000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (absNum >= 10000) {
    return (num / 10000).toFixed(2) + 'w';
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  
  return num.toString();
};

/**
 * 趋势图组件
 * 支持折线图和柱状图，带悬停交互
 */
export const TrendChart: React.FC<TrendChartProps> = ({ data, color, type, height = 180, granularity = 'WEEK' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return null;

  // 根据粒度格式化横坐标标签
  const formatXAxisLabel = (time: string) => {
    if (granularity === 'DAY') {
      return time;
    } else if (granularity === 'WEEK' || granularity === 'MONTH') {
      const parts = time.split('-');
      if (parts.length >= 3) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
      return time;
    }
    return time;
  };

  const values = data.map(d => type === 'line' ? d.value : d.delta);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // 生成Y轴刻度
  const generateYAxisTicks = () => {
    const tickCount = 5;
    const ticks = [];
    
    for (let i = 0; i < tickCount; i++) {
      const value = max - (i / (tickCount - 1)) * range;
      ticks.push({
        value,
        label: formatNumber(value, max, min),
        position: (i / (tickCount - 1)) * 100
      });
    }
    
    return ticks;
  };

  const yAxisTicks = generateYAxisTicks();

  // 生成X轴刻度
  const xAxisTickCount = (() => {
    if (granularity === 'DAY') {
      return Math.min(6, data.length);
    } else if (granularity === 'WEEK') {
      return Math.min(7, data.length);
    } else if (granularity === 'MONTH') {
      return Math.min(5, data.length);
    }
    return Math.min(5, data.length);
  })();

  const xAxisTicks = Array.from({ length: xAxisTickCount }, (_, i) => {
    const index = Math.min(Math.floor((i / Math.max(1, xAxisTickCount - 1)) * (data.length - 1)), data.length - 1);
    return {
      label: formatXAxisLabel(data[index]?.time || ''),
      position: (index / (data.length - 1)) * 100
    };
  });

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const val = type === 'line' ? d.value : d.delta;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

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
        <div className="flex flex-col justify-between text-[8px] font-black text-[#8eb69b]/60 text-right pr-2 w-[45px] shrink-0 leading-none py-1">
          {yAxisTicks.map((tick, i) => (
            <span key={i}>{tick.label}</span>
          ))}
        </div>
        <div 
          ref={chartRef}
          className="flex-1 relative border-l border-[#8eb69b]/10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none z-0">
            {yAxisTicks.map((_, i) => (
              <div key={i} className="w-full h-px border-t border-dashed border-[#8eb69b]/20"></div>
            ))}
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
              {type === 'line' ? (
                <>
                  <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} className="animate-draw" />
                  <polygon fill={color} fillOpacity="0.1" points={`0,100 ${points} 100,100`} />
                  {hoveredIndex !== null && (
                    <circle
                      cx={(hoveredIndex / (data.length - 1)) * 100}
                      cy={100 - ((type === 'line' ? data[hoveredIndex].value : data[hoveredIndex].delta - min) / range) * 100}
                      r="1.5"
                      fill={color}
                      className="animate-pulse"
                    />
                  )}
                </>
              ) : (
                <g>
                  {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const h = Math.max(2, ((d.delta - min) / range) * 100);
                    return (
                      <rect 
                        key={i} 
                        x={x - 1} 
                        y={100 - h} 
                        width="2" 
                        height={h} 
                        fill={color} 
                        className={`transition-opacity ${hoveredIndex === i ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
                        rx="0.5" 
                      />
                    );
                  })}
                </g>
              )}
            </svg>
          </div>
          {hoveredData && mousePosition && (
            <div 
              className="absolute z-30 bg-[#4a3728] text-white px-3 py-2 rounded-xl shadow-2xl pointer-events-none text-[10px] font-black whitespace-nowrap"
              style={{
                left: `${Math.min(Math.max(mousePosition.x, 40), mousePosition.x + 120)}px`,
                top: `${Math.max(mousePosition.y - 60, 0)}px`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="text-[#8eb69b] mb-0.5">{hoveredData.time}</div>
              <div className="text-lg">
                {type === 'line' ? formatExactNumber(hoveredData.value) : (hoveredData.delta >= 0 ? '+' : '') + formatExactNumber(hoveredData.delta)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex h-6 items-end mt-1">
        <div className="w-[45px] shrink-0"></div>
        <div className="flex-1 flex justify-between text-[8px] font-black text-[#8eb69b]/60 px-0.5 leading-none">
          {xAxisTicks.map((tick, i) => (
            <span key={i}>{tick.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
