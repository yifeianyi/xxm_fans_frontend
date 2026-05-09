import React from 'react';

interface BarProgressProps {
    value: number;
    max: number;
}

export const BarProgress: React.FC<BarProgressProps> = ({ value, max }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const hue = Math.min(120, (pct / 100) * 120);
    const color = `hsl(${hue}, 70%, 55%)`;
    return (
        <div className="w-full h-1.5 rounded-full bg-[#8eb69b]/15 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: color }}
            />
        </div>
    );
};
