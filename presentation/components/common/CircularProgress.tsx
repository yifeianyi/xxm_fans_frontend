import React from 'react';

interface CircularProgressProps {
    pct: number;
    size?: number;
    strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    pct, size = 48, strokeWidth = 4
}) => {
    const r = (size - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (Math.min(pct, 100) / 100) * c;
    const hue = Math.min(120, (pct / 100) * 120);
    const color = `hsl(${hue}, 70%, 55%)`;
    return (
        <svg width={size} height={size} className="shrink-0">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="currentColor" strokeWidth={strokeWidth}
                className="text-[#8eb69b]/15" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-all duration-500" />
            <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
                className="fill-[#8eb69b] text-[11px] font-black"
                style={{ fontSize: size < 40 ? 9 : 11 }}>
                {pct.toFixed(0)}%
            </text>
        </svg>
    );
};
