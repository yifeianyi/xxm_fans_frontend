import React, { useState, useEffect } from 'react';
import { Calendar, Play, ExternalLink, CheckCircle2, X, AlertCircle, Trash2, FileText } from 'lucide-react';
import { realSubmissionService } from '../../../infrastructure/api';
import type {
  MonthlySubmissionStatsResponse,
  MonthlySubmissionRecordsResponse,
  SubmissionRecord,
  MonthlyStats,
  YearStats,
} from '../../../domain/types';
import VideoModal from '../common/VideoModal';

interface SelectedDate {
  year: number;
  month: number;
}

const TimelineChart: React.FC = () => {
  const [years, setYears] = useState<number[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<Record<number, Record<number, MonthlyStats>>>({});
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [hoveredDate, setHoveredDate] = useState<SelectedDate | null>(null);
  const [monthlyRecords, setMonthlyRecords] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // 加载所有年份和月度统计数据
  useEffect(() => {
    const loadAllStats = async () => {
      setLoadingStats(true);
      try {
        // 1. 首先获取所有可用的年份
        const overviewData = await realSubmissionService.getYearsSubmissionOverview();
        const availableYears = overviewData.years.map((y: YearStats) => y.year).sort((a, b) => a - b); // 按升序排列（最旧的年份在最上面）
        setYears(availableYears);

        // 2. 并行加载所有年份的月度统计数据
        const stats: Record<number, Record<number, MonthlyStats>> = {};

        const promises = availableYears.map(async (year: number) => {
          const data = await realSubmissionService.getMonthlySubmissionStats({ year });
          return { year, data };
        });

        const results = await Promise.all(promises);

        // 3. 处理结果
        results.forEach(({ year, data }) => {
          stats[year] = {};
          data.monthlyStats.forEach((stat) => {
            stats[year][stat.month] = {
              month: stat.month,
              total: stat.total,
              valid: stat.valid,
              invalid: stat.invalid,
              firstSubmission: stat.firstSubmission,
              lastSubmission: stat.lastSubmission,
            };
          });
        });

        setMonthlyStats(stats);
      } catch (error) {
        console.error('加载月度统计数据失败:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadAllStats();
  }, []);

  // 加载选中月份的投稿记录
  useEffect(() => {
    if (selectedDate) {
      const fetchMonthlyRecords = async () => {
        setLoading(true);
        try {
          const data = await realSubmissionService.getMonthlySubmissionRecords({
            year: selectedDate.year,
            month: selectedDate.month,
            page: 1,
            pageSize: 100, // 加载该月所有记录
          });

          setMonthlyRecords(data.records);
        } catch (error) {
          console.error('加载月度投稿记录失败:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMonthlyRecords();
    }
  }, [selectedDate]);

  // 获取月份的统计数据
  const getMonthStats = (year: number, month: number): MonthlyStats | null => {
    return monthlyStats[year]?.[month] || null;
  };

  // 判断月份是否有投稿
  const hasSubmissions = (year: number, month: number): boolean => {
    const stats = getMonthStats(year, month);
    return stats !== null && stats.total > 0;
  };

  // 处理月份点击
  const handleMonthClick = (year: number, month: number, isActive: boolean) => {
    console.log('月份点击:', { year, month, isActive, selectedDate });
    if (!isActive) return;

    // 点击打开详情弹窗
    setSelectedDate({ year, month });
    setHoveredDate(null);
  };

  const renderMonth = (year: number, month: number, isActive: boolean) => {
    const isHovered = hoveredDate?.year === year && hoveredDate?.month === month;
    const stats = isActive ? getMonthStats(year, month) : null;

    return (
      <div
        key={`${year}-${month}`}
        className={`flex flex-col items-center group relative z-20 w-16 md:w-24 ${isActive ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => handleMonthClick(year, month, isActive)}
        onMouseEnter={() => isActive && setHoveredDate({ year, month })}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <div
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-500 border-4
            ${isActive
              ? 'bg-[#fef5f0] text-[#f8b195] border-[#f8b195] shadow-xl shadow-[#f8b195]/30 scale-110 group-hover:scale-125'
              : 'bg-white text-[#8eb69b] border-white shadow-md'}`}
        >
          {month}月
        </div>

        {/* Hover Tooltip */}
        {isHovered && !selectedDate && stats && (
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white z-50 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 pointer-events-none">
            <div className="text-center mb-3 pb-2 border-b border-[#f8b195]/10">
              <span className="text-lg font-black text-[#4a3728]">{month}月投稿统计</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#8eb69b]">
                  <FileText size={14} />
                  <span className="text-xs font-bold">投稿总数</span>
                </div>
                <span className="text-sm font-black text-[#4a3728]">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#f8b195]">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-bold">有效投稿</span>
                </div>
                <span className="text-sm font-black text-[#f8b195]">{stats.valid}</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-400">
                  <Trash2 size={14} />
                  <div className="flex flex-col text-left">
                     <span className="text-xs font-bold">无效投稿</span>
                  </div>
                </div>
                <span className="text-sm font-black text-gray-400">{stats.invalid}</span>
              </div>
              {stats.invalid > 0 && (
                 <div className="pt-2 mt-1 border-t border-gray-50 text-[9px] text-gray-400 leading-tight text-center">
                   * 因版权或个人原因已删除
                 </div>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/95"></div>
          </div>
        )}
      </div>
    );
  };

  if (loadingStats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="glass-card rounded-[4rem] border-4 border-white p-20 bg-white/40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#f8b195]/20 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-[#8eb69b] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Loading Timeline...</span>
          </div>
        </div>
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="glass-card rounded-[4rem] border-4 border-white p-20 bg-white/40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="text-6xl grayscale">📭</div>
            <div className="text-center">
              <h3 className="text-xl font-black text-[#4a3728]">暂无投稿数据</h3>
              <p className="text-sm font-bold text-[#8eb69b]">还没有任何投稿记录</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-1000">
      <div className="glass-card rounded-[4rem] border-4 border-white p-10 md:p-20 relative bg-white/40">
        {/* Decorative Background grid points */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-[3.8rem]" style={{ backgroundImage: 'radial-gradient(#4a3728 2px, transparent 2px)', backgroundSize: '60px 60px' }}></div>

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
                  {[1, 2, 3, 4, 5, 6].map(m => renderMonth(year, m, hasSubmissions(year, m)))}
                </div>

                {/* Connection Right (Connects end of Row 1 to start of Row 2) */}
                <div className="flex justify-end pr-8 md:pr-12 -my-2">
                  <div className="w-16 h-24 md:h-32 border-r-8 border-[#8eb69b]/20 rounded-r-[3rem] z-0"></div>
                </div>

                {/* Row 2: Months 12-7 (Right to Left) */}
                <div className="relative flex items-center justify-between flex-row-reverse px-2 h-32 md:h-40">
                  {/* Horizontal Line Row 2 */}
                  <div className="absolute top-1/2 left-8 md:left-12 right-8 md:right-12 h-2 bg-[#8eb69b]/20 -translate-y-1/2 z-0 rounded-full"></div>
                  {[7, 8, 9, 10, 11, 12].map(m => renderMonth(year, m, hasSubmissions(year, m)))}
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
              <span className="text-xs font-black text-[#4a3728]">活跃 (悬停看数据 / 点击看详情)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#8eb69b]/20 shadow-sm"></div>
              <span className="text-xs font-black text-[#8eb69b]/60">暂无活动</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Modal for Monthly Archives (Click triggered) */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#4a3728]/30 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="relative w-full max-w-6xl bg-[#f2f9f1] rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white flex flex-col max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
           {/* Modal Header */}
           <div className="px-8 py-6 bg-white/60 border-b border-white flex items-center justify-between shrink-0 backdrop-blur-sm z-10">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-[#f8b195] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#f8b195]/20">
                   <Calendar size={28} />
                 </div>
                 <div>
                   <h2 className="text-3xl font-black text-[#4a3728] tracking-tight flex items-baseline gap-2">
                     {selectedDate.year} <span className="text-[#f8b195] text-xl">/</span> {selectedDate.month}月
                   </h2>
                   <p className="text-[10px] text-[#8eb69b] font-black uppercase tracking-[0.3em]">Monthly Archive Collection</p>
                 </div>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-3 bg-white hover:bg-[#fef5f0] text-[#8eb69b] hover:text-[#f8b195] rounded-full transition-all shadow-sm border-2 border-transparent hover:border-[#f8b195]/20 hover:rotate-90 duration-500"
              >
                <X size={24} />
              </button>
           </div>

           {/* Modal Content */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-white/30 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a3728 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* 统计信息卡片 */}
              {(() => {
                const stats = getMonthStats(selectedDate.year, selectedDate.month);
                if (!stats) return null;
                return (
                  <div className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FileText size={16} className="text-[#8eb69b]" />
                          <span className="text-xs font-bold text-[#8eb69b]">投稿总数</span>
                        </div>
                        <span className="text-2xl font-black text-[#4a3728]">{stats.total}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle2 size={16} className="text-[#f8b195]" />
                          <span className="text-xs font-bold text-[#f8b195]">有效投稿</span>
                        </div>
                        <span className="text-2xl font-black text-[#f8b195]">{stats.valid}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Trash2 size={16} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-400">无效投稿</span>
                        </div>
                        <span className="text-2xl font-black text-gray-400">{stats.invalid}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {loading ? (
                 <div className="h-full flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-[#f8b195]/20 rounded-full"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-[#8eb69b] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Retrieving Memories...</span>
                 </div>
              ) : monthlyRecords.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {monthlyRecords.map((record, index) => (
                       <div
                         key={record.id}
                         className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-white hover:-translate-y-2 cursor-pointer"
                         style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s backwards` }}
                         onClick={() => setVideoUrl(record.videoUrl)}
                       >
                         <div className="aspect-[4/3] relative overflow-hidden bg-[#fef5f0]">
                           <img
                             src={record.coverThumbnailUrl || record.coverUrl || '/placeholder.jpg'}
                             alt={record.title}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                           <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
                             <CheckCircle2 size={10} className={record.isValid ? "text-[#8eb69b]" : "text-gray-400"} />
                             <span className="text-[9px] font-black text-[#4a3728]">{new Date(record.publishTime).toLocaleDateString('zh-CN')}</span>
                           </div>
                           {!record.isValid && (
                             <div className="absolute top-4 right-4 px-3 py-1 bg-red-50/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm border border-red-100">
                               <AlertCircle size={10} className="text-red-400" />
                               <span className="text-[9px] font-black text-red-400">无效</span>
                             </div>
                           )}
                           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-[#f8b195] shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                               <Play fill="currentColor" size={24} className="ml-1" />
                             </div>
                           </div>
                         </div>
                         <div className="p-6 space-y-3">
                           <h3 className="text-lg font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors line-clamp-2 leading-tight">
                             {record.title}
                           </h3>
                           <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                             <div className="flex items-center gap-1 text-[9px] font-black text-[#8eb69b]/60 uppercase tracking-wider">
                                <ExternalLink size={10} /> Watch Video
                             </div>
                           </div>
                         </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center gap-6 min-h-[400px] opacity-60">
                    <div className="text-6xl grayscale">📭</div>
                    <div className="text-center">
                      <h3 className="text-xl font-black text-[#4a3728]">暂无记录</h3>
                      <p className="text-sm font-bold text-[#8eb69b]">该月份似乎是一段安静的时光</p>
                    </div>
                 </div>
              )}
           </div>
          </div>
        </div>
      )}

      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default TimelineChart;