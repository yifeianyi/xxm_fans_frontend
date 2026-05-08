import React, { useState, useMemo } from 'react';
import { CorrelationData, CorrelationWork } from '../../../../domain/types';
import { formatExactNumber } from '../utils';

interface CorrelationChartProps {
  timeline: CorrelationData[];
  works: CorrelationWork[];
  height?: number;
  onWorkClick?: (work: CorrelationWork) => void;
}

const GRID_LINES = 4;

const formatShort = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (abs >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

export const CorrelationChart: React.FC<CorrelationChartProps> = ({ timeline, works, height = 280, onWorkClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const workDateIndex: Record<string, CorrelationWork> = useMemo(() => {
    const map: Record<string, CorrelationWork> = {};
    for (const w of works) {
      if (w.publishTime && timeline.some(d => d.time === w.publishTime)) {
        if (!map[w.publishTime]) map[w.publishTime] = w;
      }
    }
    return map;
  }, [works, timeline]);

  const { viewMax, viewMin, folMax, folMin, folRange } = useMemo(() => {
    const vMax = Math.max(...timeline.map(d => d.videoViewDelta));
    const vMin = Math.min(...timeline.map(d => d.videoViewDelta));
    const fMax = Math.max(...timeline.map(d => d.followerDelta));
    const fMin = Math.min(...timeline.map(d => d.followerDelta));
    return { viewMax: vMax, viewMin: vMin, folMax: fMax, folMin: fMin, folRange: Math.max(fMax - fMin, 1) };
  }, [timeline]);

  const viewRange = Math.max(viewMax - viewMin, 1);
  const toX = (i: number) => (i / Math.max(timeline.length - 1, 1)) * 100;
  const toViewY = (v: number) => 100 - ((v - viewMin) / viewRange) * 100;
  const toFolY = (f: number) => 100 - ((f - folMin) / folRange) * 100;

  const viewPoints = timeline.map((d, i) => `${toX(i)},${toViewY(d.videoViewDelta)}`).join(' ');
  const folPoints = timeline.map((d, i) => `${toX(i)},${toFolY(d.followerDelta)}`).join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(x * (timeline.length - 1));
    setHoveredIndex(Math.max(0, Math.min(idx, timeline.length - 1)));
  };

  if (timeline.length === 0) return null;

  return (
    <div className="relative w-full select-none" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8b195" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f8b195" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="folGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3498db" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3498db" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {Array.from({ length: GRID_LINES + 1 }).map((_, i) => {
          const y = (i / GRID_LINES) * 100;
          return (
            <line
              key={`g${i}`}
              x1="0" y1={y} x2="100" y2={y}
              stroke="#e8e4df"
              strokeWidth="0.3"
              strokeDasharray={i === 0 || i === GRID_LINES ? 'none' : '2,2'}
            />
          );
        })}

        <polygon fill="url(#viewGrad)" points={`0,100 ${viewPoints} 100,100`} />
        <polygon fill="url(#folGrad)" points={`0,100 ${folPoints} 100,100`} />

        <polyline fill="none" stroke="#f8b195" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" points={viewPoints} />
        <polyline fill="none" stroke="#3498db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={folPoints} />

        {hoveredIndex !== null && (
          <>
            <line x1={toX(hoveredIndex)} y1="0" x2={toX(hoveredIndex)} y2="100"
              stroke="#4a3728" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.7" />
            <circle cx={toX(hoveredIndex)} cy={toViewY(timeline[hoveredIndex].videoViewDelta)}
              r="2" fill="#f8b195" stroke="#fff" strokeWidth="0.8" />
            <circle cx={toX(hoveredIndex)} cy={toFolY(timeline[hoveredIndex].followerDelta)}
              r="2" fill="#3498db" stroke="#fff" strokeWidth="0.8" />
          </>
        )}
      </svg>

      {timeline.map((d, ti) => {
        const work = workDateIndex[d.time];
        if (!work?.coverUrl) return null;
        return (
          <img
            key={work.workId}
            src={work.coverUrl}
            alt={work.title}
            title={work.title}
            className="absolute bottom-0 w-5 h-5 rounded object-cover border border-white/60 shadow-sm hover:w-12 hover:h-12 hover:z-20 transition-all cursor-pointer"
            style={{ left: `calc(${toX(ti)}% - 10px)` }}
            loading="lazy"
            onClick={() => onWorkClick?.(work)}
          />
        );
      })}

      {/* hover tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-30 bg-[#4a3728] text-white px-4 py-2.5 rounded-xl shadow-xl pointer-events-none text-xs font-medium whitespace-nowrap"
          style={{
            left: `${toX(hoveredIndex)}%`,
            bottom: '100%',
            transform: hoveredIndex / Math.max(timeline.length - 1, 1) < 0.15
              ? 'translateX(0) translateY(-6px)'
              : hoveredIndex / Math.max(timeline.length - 1, 1) > 0.85
                ? 'translateX(-100%) translateY(-6px)'
                : 'translateX(-50%) translateY(-6px)',
          }}
        >
          <div className="text-white/60 mb-1 text-[10px]">{timeline[hoveredIndex].time}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#f8b195]" />
              <span>播放增量: {formatExactNumber(timeline[hoveredIndex].videoViewDelta)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#3498db]" />
              <span>粉丝: {(timeline[hoveredIndex].followerDelta >= 0 ? '+' : '') + formatExactNumber(timeline[hoveredIndex].followerDelta)}</span>
            </div>
          </div>
        </div>
      )}

      {/* x-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] font-bold text-[#8eb69b]/50 px-1 pointer-events-none translate-y-full pt-1">
        <span>{timeline[0]?.time?.slice(5)}</span>
        <span>{timeline[Math.floor(timeline.length / 2)]?.time?.slice(5)}</span>
        <span>{timeline[timeline.length - 1]?.time?.slice(5)}</span>
      </div>
    </div>
  );
};
