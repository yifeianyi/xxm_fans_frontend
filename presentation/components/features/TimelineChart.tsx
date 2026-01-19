import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Play, Info, ExternalLink, CheckCircle2 } from 'lucide-react';
import { mockApi } from '../../../infrastructure/api/mockApi';
import { SongRecord } from '../../../domain/types';
import VideoModal from '../common/VideoModal';

interface SelectedDate {
  year: number;
  month: number;
}

const TimelineChart: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [monthlyRecords, setMonthlyRecords] = useState<SongRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const years = [2024, 2023, 2022, 2021];

  // Simulated data: months with activities
  const activeMonths: Record<number, number[]> = {
    2024: [1, 2, 3, 4],
    2023: [1, 2, 5, 6, 7, 8, 11, 12],
    2022: [3, 4, 8, 9, 10],
    2021: [10, 11, 12]
  };

  useEffect(() => {
    if (selectedDate) {
      const fetchMonthlyData = async () => {
        setLoading(true);
        const records = await mockApi.getRecordsByMonth(selectedDate.year, selectedDate.month);
        setMonthlyRecords(records);
        setLoading(false);
      };
      fetchMonthlyData();
    }
  }, [selectedDate]);

  const handleMonthClick = (year: number, month: number, isActive: boolean) => {
    if (isActive) {
      setSelectedDate({ year, month });
    }
  };

  const renderMonth = (year: number, month: number, isActive: boolean) => (
    <div
      key={`${year}-${month}`}
      className={`flex flex-col items-center group relative z-20 w-16 md:w-24 ${isActive ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={() => handleMonthClick(year, month, isActive)}
    >
      <div
        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-500 border-4
          ${isActive
            ? 'bg-[#fef5f0] text-[#f8b195] border-[#f8b195] shadow-xl shadow-[#f8b195]/30 scale-110 group-hover:scale-125'
            : 'bg-white text-[#8eb69b] border-white shadow-md'}`}
      >
        {month}月
      </div>
      {isActive && (
        <div className="absolute -bottom-3 px-2 py-0.5 bg-[#f8b195] text-white text-[8px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
          查看瞬间
        </div>
      )}
    </div>
  );

  if (selectedDate) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-right-8 duration-700">
        {/* Detail Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <button
            onClick={() => setSelectedDate(null)}
            className="group flex items-center gap-3 px-8 py-4 bg-white rounded-3xl text-[#8eb69b] font-black hover:text-[#f8b195] transition-all border-2 border-white shadow-sm hover:shadow-xl active:scale-95"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg tracking-tight">返回时间长河</span>
          </button>

          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-[#f8b195]/20">
              <Calendar size={12} />
              <span>Archive Collection</span>
            </div>
            <h2 className="text-5xl font-black text-[#4a3728] tracking-tighter">
              {selectedDate.year} <span className="text-[#f8b195]">/</span> {selectedDate.month}月
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-48 flex flex-col items-center gap-6">
            <div className="relative">
               <div className="w-20 h-20 border-8 border-[#f8b195]/20 rounded-full"></div>
               <div className="absolute inset-0 w-20 h-20 border-8 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-[#8eb69b] font-black tracking-[0.3em] uppercase text-sm animate-pulse">时光倒流中...</span>
          </div>
        ) : monthlyRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {monthlyRecords.map((record, index) => (
              <div
                key={record.id}
                className="group relative bg-white rounded-[3rem] overflow-hidden shadow-[0_15px_40px_rgba(74,55,40,0.05)] hover:shadow-[0_25px_60px_rgba(248,177,149,0.15)] transition-all duration-700 border-2 border-transparent hover:border-white hover:-translate-y-3 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setVideoUrl(record.videoUrl)}
              >
                {/* Image Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-[#fef5f0] cursor-pointer">
                  <img
                    src={record.cover}
                    alt={record.date}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-sm border border-white/50">
                      <CheckCircle2 size={12} className="text-[#8eb69b]" />
                      <span className="text-[10px] font-black text-[#4a3728]">在线有效</span>
                    </div>
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#f8b195] shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 border-4 border-white/20">
                      <Play fill="currentColor" size={32} className="ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-[#8eb69b] text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={12} />
                      <span>{record.date}</span>
                    </div>
                    <ExternalLink size={14} className="text-[#8eb69b] opacity-40" />
                  </div>

                  <h3 className="text-xl font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors line-clamp-2 leading-tight min-h-[3rem]">
                    {record.note || "精彩演唱瞬间"}
                  </h3>

                  <div className="pt-4 border-t border-[#f2f9f1] flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-[#fef5f0] overflow-hidden">
                          <img src={`https://picsum.photos/seed/fan${i}/50/50`} alt="viewer" />
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-[#8eb69b] flex items-center justify-center text-[8px] text-white font-bold">
                        +1
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#8eb69b]/60 uppercase tracking-tighter">Click to Play</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-48 text-center glass-card rounded-[4rem] p-16 flex flex-col items-center gap-8 border-4 border-dashed border-[#8eb69b]/20">
            <div className="text-8xl animate-bounce">📭</div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-[#4a3728]">这封信似乎在途中丢失了</h3>
              <p className="text-[#8eb69b] font-bold text-lg">没有找到该月份的投稿记录哦 ~</p>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="px-10 py-4 bg-[#8eb69b] text-white rounded-full font-black shadow-lg hover:bg-[#2d4a3e] transition-all active:scale-95"
            >
              换个日子看看
            </button>
          </div>
        )}

        <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-1000">
      <div className="glass-card rounded-[4rem] border-4 border-white p-10 md:p-20 relative overflow-hidden bg-white/40">
        {/* Decorative Background grid points */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a3728 2px, transparent 2px)', backgroundSize: '60px 60px' }}></div>

        <div className="relative space-y-0">
          {years.map((year, idx) => (
            <div key={year} className="relative">
              {/* Year Label - Floating in background */}
              <div className="absolute left-0 -top-6 text-[#8eb69b]/10 text-7xl md:text-9xl font-black select-none pointer-events-none z-0">
                {year}
              </div>

              {/* Path System */}
              <div className="relative z-10">

                {/* Row 1: Months 1-6 (Left to Right) */}
                <div className="relative flex items-center justify-between px-2 h-32 md:h-40">
                  {/* Horizontal Line Row 1 */}
                  <div className="absolute top-1/2 left-8 md:left-12 right-8 md:right-12 h-2 bg-[#8eb69b]/20 -translate-y-1/2 z-0 rounded-full"></div>
                  {[1, 2, 3, 4, 5, 6].map(m => renderMonth(year, m, activeMonths[year]?.includes(m)))}
                </div>

                {/* Connection Right (Connects end of Row 1 to start of Row 2) */}
                <div className="flex justify-end pr-8 md:pr-12 -my-2">
                  <div className="w-16 h-24 md:h-32 border-r-8 border-[#8eb69b]/20 rounded-r-[3rem] z-0"></div>
                </div>

                {/* Row 2: Months 12-7 (Right to Left) */}
                <div className="relative flex items-center justify-between flex-row-reverse px-2 h-32 md:h-40">
                  {/* Horizontal Line Row 2 */}
                  <div className="absolute top-1/2 left-8 md:left-12 right-8 md:right-12 h-2 bg-[#8eb69b]/20 -translate-y-1/2 z-0 rounded-full"></div>
                  {[7, 8, 9, 10, 11, 12].map(m => renderMonth(year, m, activeMonths[year]?.includes(m)))}
                </div>

                {/* Connection Left (Next year bridge or loop-back) */}
                {idx < years.length - 1 && (
                  <div className="flex justify-start pl-8 md:pl-12 -my-2">
                    <div className="w-16 h-24 md:h-32 border-l-8 border-[#8eb69b]/20 rounded-l-[3rem] z-0"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend/Info Section */}
        <div className="mt-24 pt-12 border-t-2 border-dashed border-[#8eb69b]/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-[#8eb69b] text-sm font-black uppercase tracking-[0.2em]">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <Calendar size={20} className="text-[#f8b195]" />
            </div>
            <span>时光长河 • 记录满老师的投稿足迹</span>
          </div>

          <div className="flex items-center gap-6 p-4 bg-white/40 rounded-3xl border border-white">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#f8b195] border-2 border-white shadow-sm"></div>
              <span className="text-xs font-black text-[#4a3728]">活跃投稿 (点击查看)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#8eb69b]/20 shadow-sm"></div>
              <span className="text-xs font-black text-[#8eb69b]/60">暂无活动</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;