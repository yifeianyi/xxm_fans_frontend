import React from 'react';
import { Users } from 'lucide-react';
import { AccountData, TimeGranularity } from '../../../../domain/types';
import { TrendChart } from './TrendChart';

interface OverviewSectionProps {
  accounts: AccountData[];
  selectedAccIdx: number;
  granularity: TimeGranularity;
  onGranularityChange: (g: TimeGranularity) => void;
  onAccountChange: (idx: number) => void;
}

/**
 * 全站趋势概览组件
 * 显示粉丝总量积累和粉丝净增长趋势
 */
export const OverviewSection: React.FC<OverviewSectionProps> = ({
  accounts,
  selectedAccIdx,
  granularity,
  onGranularityChange,
  onAccountChange
}) => {
  const activeAcc = accounts[selectedAccIdx];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex bg-white/40 p-1 rounded-full border-2 border-white shadow-sm gap-1">
          {([
            { value: 'DAY', label: '过去24小时' },
            { value: 'WEEK', label: '过去7天' },
            { value: 'MONTH', label: '过去30天' }
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onGranularityChange(value)}
              className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${granularity === value ? 'bg-[#4a3728] text-white shadow-md' : 'text-[#8eb69b] hover:bg-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          {accounts.map((acc, idx) => (
            <button
              key={acc.id}
              onClick={() => onAccountChange(idx)}
              className={`px-6 py-2 rounded-2xl text-xs font-black transition-all border-2 flex items-center gap-3 ${selectedAccIdx === idx ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-md scale-105' : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]'}`}
            >
              <Users size={16} /> {acc.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] p-10 space-y-6 border-4 border-white shadow-xl relative overflow-hidden">
          <div className="absolute top-8 right-8 text-right">
            <div className="text-3xl font-black text-[#f8b195]">{activeAcc.totalFollowers.toLocaleString()}</div>
            <div className="text-[10px] font-black text-[#8eb69b] uppercase">Current Total</div>
          </div>
          <h3 className="text-xl font-black text-[#4a3728]">粉丝总量积累</h3>
          <div className="h-60 flex items-end">
             <TrendChart data={activeAcc.history[granularity]} color="#f8b195" type="line" height={200} granularity={granularity} />
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 space-y-6 border-4 border-white shadow-xl">
           <h3 className="text-xl font-black text-[#4a3728]">粉丝净增长</h3>
           <div className="h-60 flex items-end">
             <TrendChart data={activeAcc.history[granularity]} color="#8eb69b" type="bar" height={200} granularity={granularity} />
           </div>
        </div>
      </div>
    </section>
  );
};