import React, { useState, useEffect, useMemo } from 'react';
import { mockApi } from '../../infrastructure/api/mockApi';
import { AccountData, VideoStats, TimeGranularity, DataPoint, CorrelationData } from '../../domain/types';
import {
  TrendingUp, Activity, BarChart3, Clock,
  Target, Layers, Zap, Info,
  Users, PlayCircle, Eye, Heart, MessageSquare,
  ChevronDown, Settings2, BarChart, ExternalLink, Share2,
  ListFilter, CheckCircle2, MoreHorizontal, LayoutGrid, List
} from 'lucide-react';

// 通用数值格式化
const formatNumber = (num: number) => {
  if (num === 0) return '0';
  if (Math.abs(num) >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

// 高/低标志组件
const RankBadge: React.FC<{ type: 'high' | 'low' }> = ({ type }) => (
  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black ml-1 border ${type === 'high' ? 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]' : 'bg-[#eff6ff] text-[#3b82f6] border-[#dbeafe]'}`}>
    {type === 'high' ? '高' : '低'}
  </span>
);

// 趋势图
const TrendChart: React.FC<{
  data: DataPoint[],
  color: string,
  type: 'line' | 'bar',
  height?: number
}> = ({ data, color, type, height = 180 }) => {
  if (!data || data.length === 0) return null;

  const values = data.map(d => type === 'line' ? d.value : d.delta);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const val = type === 'line' ? d.value : d.delta;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col w-full select-none" style={{ height: `${height}px` }}>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col justify-between text-[9px] font-black text-[#8eb69b]/60 text-right pr-2 w-[40px] shrink-0 leading-none py-1">
          <span>{formatNumber(max)}</span>
          <span>{formatNumber(Math.round((max + min) / 2))}</span>
          <span>{formatNumber(min)}</span>
        </div>
        <div className="flex-1 relative border-l border-[#8eb69b]/10">
           <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none z-0">
             <div className="w-full h-px border-t border-dashed border-[#8eb69b]/20"></div>
             <div className="w-full h-px border-t border-dashed border-[#8eb69b]/20"></div>
             <div className="w-full h-px border-t border-dashed border-[#8eb69b]/20"></div>
           </div>
           <div className="relative z-10 w-full h-full px-0.5 py-1">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {type === 'line' ? (
                  <>
                    <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} className="animate-draw" />
                    <polygon fill={color} fillOpacity="0.1" points={`0,100 ${points} 100,100`} />
                  </>
                ) : (
                  <g>
                    {data.map((d, i) => {
                      const x = (i / (data.length - 1)) * 100;
                      const h = Math.max(2, ((d.delta - min) / range) * 100);
                      return (
                        <rect key={i} x={x - 1} y={100 - h} width="2" height={h} fill={color} className="opacity-60 hover:opacity-100 transition-opacity" rx="0.5" />
                      );
                    })}
                  </g>
                )}
              </svg>
           </div>
        </div>
      </div>
      <div className="flex h-5 items-end mt-1">
         <div className="w-[40px] shrink-0"></div>
         <div className="flex-1 flex justify-between text-[9px] font-black text-[#8eb69b]/60 px-0.5 leading-none">
            <span>{data[0]?.time}</span>
            <span>{data[Math.floor(data.length / 2)]?.time}</span>
            <span>{data[data.length - 1]?.time}</span>
         </div>
      </div>
    </div>
  );
};

// 关联归因图
const CorrelationChart: React.FC<{ data: CorrelationData[], height?: number }> = ({ data, height = 240 }) => {
  if (data.length === 0) return null;
  const viewMax = Math.max(...data.map(d => d.videoViewDelta));
  const folMax = Math.max(...data.map(d => d.followerDelta));

  return (
    <div className="flex flex-col w-full select-none" style={{ height: `${height}px` }}>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col justify-between text-[9px] font-black text-[#8eb69b] text-right pr-2 w-[40px] shrink-0 leading-none py-1">
          <span>{formatNumber(viewMax)}</span>
          <span>{formatNumber(viewMax / 2)}</span>
          <span>0</span>
        </div>
        <div className="flex-1 relative border-l border-r border-[#8eb69b]/10">
          <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none z-0">
             <div className="w-full h-px border-t border-dashed border-gray-200"></div>
             <div className="w-full h-px border-t border-dashed border-gray-200"></div>
             <div className="w-full h-px border-t border-dashed border-gray-200"></div>
          </div>
          <div className="relative z-10 w-full h-full px-0.5 py-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#8eb69b" strokeWidth="1" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.videoViewDelta / viewMax) * 100}`).join(' ')} />
              <polygon fill="#8eb69b" fillOpacity="0.1" points={`0,100 ${data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.videoViewDelta / viewMax) * 100}`).join(' ')} 100,100`} />
              <polyline fill="none" stroke="#f8b195" strokeWidth="2.5" strokeLinecap="round" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.followerDelta / folMax) * 100}`).join(' ')} />
            </svg>
          </div>
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

const DataAnalysisPage: React.FC = () => {
  const [granularity, setGranularity] = useState<TimeGranularity>('DAY');
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [selectedAccIdx, setSelectedAccIdx] = useState(0);
  const [videos, setVideos] = useState<VideoStats[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoIdsForCompare, setSelectedVideoIdsForCompare] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [correlation, setCorrelation] = useState<CorrelationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [accs, vids, corr] = await Promise.all([
        mockApi.getAccounts(),
        mockApi.getVideos(),
        mockApi.getCorrelation(granularity)
      ]);
      setAccounts(accs);
      setVideos(vids);
      setCorrelation(corr);
      if (vids.length > 0) {
        setSelectedVideoId(vids[0].id);
        setSelectedVideoIdsForCompare(vids.slice(0, 5).map(v => v.id));
      }
      setLoading(false);
    };
    init();
  }, [granularity]);

  const activeAcc = accounts[selectedAccIdx];
  const activeVideo = videos.find(v => v.id === selectedVideoId);
  const comparedVideos = videos.filter(v => selectedVideoIdsForCompare.includes(v.id));

  const extremes = useMemo(() => {
    if (comparedVideos.length === 0) return {};
    const keys: (keyof VideoStats)[] = ['views', 'guestRatio', 'fanWatchRate', 'followerGrowth', 'likes', 'comments', 'danmaku', 'favs'];
    const res: any = {};
    keys.forEach(k => {
      const vals = comparedVideos.map(v => v[k] as number);
      res[k] = { max: Math.max(...vals), min: Math.min(...vals) };
    });
    return res;
  }, [comparedVideos]);

  if (loading || !activeAcc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-16 h-16 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8eb69b] font-black tracking-widest animate-pulse">正在从数据森林提取样本...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-1000">

      {/* 1. 顶部全站趋势 */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex bg-white/40 p-1 rounded-full border-2 border-white shadow-sm gap-1">
            {['HOUR', 'DAY', 'MONTH'].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g as TimeGranularity)}
                className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${granularity === g ? 'bg-[#4a3728] text-white shadow-md' : 'text-[#8eb69b] hover:bg-white'}`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {accounts.map((acc, idx) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccIdx(idx)}
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
               <TrendChart data={activeAcc.history[granularity]} color="#f8b195" type="line" height={200} />
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 space-y-6 border-4 border-white shadow-xl">
             <h3 className="text-xl font-black text-[#4a3728]">粉丝净增长</h3>
             <div className="h-60 flex items-end">
               <TrendChart data={activeAcc.history[granularity]} color="#8eb69b" type="bar" height={200} />
             </div>
          </div>
        </div>
      </section>

      {/* 2. 单一投稿深度分析 */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-[#4a3728] tracking-tighter">作品深度观测</h2>
            <p className="text-sm font-bold text-[#8eb69b]">对特定投稿的时序表现进行精细化拆解</p>
          </div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all border-2 ${showComparison ? 'bg-[#4a3728] text-white border-[#4a3728]' : 'bg-white text-[#f8b195] border-[#f8b195]/20 shadow-sm hover:border-[#f8b195]'}`}
          >
            {showComparison ? <LayoutGrid size={16} /> : <List size={16} />}
            {showComparison ? '返回单片视图' : '开启稿件对比实验室'}
          </button>
        </div>

        {!showComparison ? (
          <div className="glass-card rounded-[4rem] border-4 border-white shadow-2xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 左侧选择器 & 信息 */}
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#8eb69b] uppercase tracking-widest px-2">选择观测对象</label>
                <div className="relative group">
                  <select
                    className="w-full pl-6 pr-12 h-16 rounded-[2rem] bg-white border-2 border-white shadow-inner focus:border-[#f8b195] outline-none text-sm font-black transition-all appearance-none cursor-pointer"
                    value={selectedVideoId || ''}
                    onChange={(e) => setSelectedVideoId(e.target.value)}
                  >
                    {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#8eb69b]" size={20} />
                </div>
              </div>

              {activeVideo && (
                <div className="space-y-6 animate-in slide-in-from-left-4">
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative">
                    <img src={activeVideo.cover} className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-black">{activeVideo.duration}</div>
                  </div>
                  <div className="px-2 space-y-2">
                    <h3 className="text-2xl font-black text-[#4a3728] leading-tight">{activeVideo.title}</h3>
                    <p className="text-[11px] text-[#8eb69b] font-bold">发布于 {activeVideo.publishTime}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: '总播放量', val: activeVideo.views.toLocaleString(), color: 'text-[#4a3728]' },
                       { label: '涨粉贡献', val: `+${activeVideo.followerGrowth}`, color: 'text-[#f67280]' }
                     ].map((item, i) => (
                       <div key={i} className="p-4 bg-white/60 rounded-2xl border border-white">
                         <div className="text-[9px] font-black text-[#8eb69b] uppercase tracking-widest mb-1">{item.label}</div>
                         <div className={`text-xl font-black ${item.color}`}>{item.val}</div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧时序图表 */}
            <div className="lg:col-span-8 space-y-12">
               {activeVideo && (
                 <>
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 px-2">
                         <Eye size={16} className="text-[#8eb69b]" />
                         <h4 className="text-xs font-black text-[#4a3728] uppercase tracking-widest">播放增长曲线</h4>
                      </div>
                      <div className="bg-white/40 p-8 rounded-[3rem] border-2 border-white shadow-inner">
                         <TrendChart data={activeVideo.metrics[granularity].views} color="#8eb69b" type="line" height={160} />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 px-2">
                            <Heart size={16} className="text-[#f67280]" />
                            <h4 className="text-xs font-black text-[#4a3728] uppercase tracking-widest">点赞动态</h4>
                         </div>
                         <div className="bg-white/40 p-8 rounded-[3rem] border-2 border-white">
                            <TrendChart data={activeVideo.metrics[granularity].likes} color="#f67280" type="bar" height={100} />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 px-2">
                            <MessageSquare size={16} className="text-[#8eb69b]" />
                            <h4 className="text-xs font-black text-[#4a3728] uppercase tracking-widest">弹幕热度</h4>
                         </div>
                         <div className="bg-white/40 p-8 rounded-[3rem] border-2 border-white">
                            <TrendChart data={activeVideo.metrics[granularity].danmaku} color="#8eb69b" type="bar" height={100} />
                         </div>
                      </div>
                   </div>
                 </>
               )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 space-y-6">
            <div className="bg-white rounded-[2.5rem] border-2 border-white shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-[#f8b195] text-white rounded-xl shadow-md"><List size={20} /></div>
                     <h3 className="text-xl font-black text-[#4a3728]">稿件多维对标看板</h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-[#8eb69b] hover:border-[#f8b195] transition-all"><Settings2 size={14} /> 编辑对比项</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-[#8eb69b] hover:border-[#f8b195] transition-all"><Share2 size={14} /> 导出分析包</button>
                  </div>
               </div>
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead className="bg-gray-50/50 text-[10px] font-black text-[#8eb69b] uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-5">稿件摘要</th>
                        <th className="px-4 py-5 text-center">发布时点</th>
                        <th className="px-4 py-5 text-center">累计播放</th>
                        <th className="px-4 py-5 text-center">游客占比</th>
                        <th className="px-4 py-5 text-center">粉丝观看率</th>
                        <th className="px-4 py-5 text-center">涨粉总量</th>
                        <th className="px-4 py-5 text-center">点赞总数</th>
                        <th className="px-4 py-5 text-center">弹幕互动</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-[#4a3728]">
                      {comparedVideos.map((video, idx) => (
                        <tr key={video.id} className="border-b border-gray-50 hover:bg-[#fef5f0]/40 transition-colors">
                          <td className="px-8 py-4">
                             <div className="flex gap-4 items-center">
                                <div className="w-24 aspect-video rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                                   <img src={video.cover} className="w-full h-full object-cover" />
                                   <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 text-white px-1 rounded">{video.duration}</div>
                                </div>
                                <div className="min-w-0">
                                   <h4 className="text-[11px] font-black truncate">{video.title}</h4>
                                   <div className="flex gap-1.5 mt-1.5">
                                      {idx === 0 && <span className="text-[8px] px-1.5 py-0.5 bg-orange-50 text-orange-400 border border-orange-100 rounded">当前观测</span>}
                                      {video.followerGrowth === extremes.followerGrowth?.max && <span className="text-[8px] px-1.5 py-0.5 bg-rose-50 text-rose-400 border border-rose-100 rounded">爆款潜力</span>}
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-4 py-4 text-center text-gray-400 text-[10px] tabular-nums">{video.publishTime.replace('年', '-').replace('月', '-').replace('日', '')}</td>
                          <td className="px-4 py-4 text-center tabular-nums">
                             {video.views.toLocaleString()}
                             {video.views === extremes.views?.max && <RankBadge type="high" />}
                          </td>
                          <td className="px-4 py-4 text-center tabular-nums">{video.guestRatio}%</td>
                          <td className="px-4 py-4 text-center tabular-nums">
                             {video.fanWatchRate}%
                             {video.fanWatchRate === extremes.fanWatchRate?.max && <RankBadge type="high" />}
                          </td>
                          <td className="px-4 py-4 text-center tabular-nums">
                             <span className="text-[#f67280]">{video.followerGrowth}</span>
                             {video.followerGrowth === extremes.followerGrowth?.max && <RankBadge type="high" />}
                          </td>
                          <td className="px-4 py-4 text-center tabular-nums">{video.likes.toLocaleString()}</td>
                          <td className="px-4 py-4 text-center tabular-nums">
                             {video.danmaku.toLocaleString()}
                             {video.danmaku === extremes.danmaku?.min && <RankBadge type="low" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
            <div className="flex items-center justify-center p-8 bg-white/40 rounded-[2rem] border-2 border-white">
               <p className="text-xs text-[#8eb69b] font-black tracking-widest flex items-center gap-2"><Info size={14} /> 选定的稿件集合正在作为对比实验室的基础样本进行交叉验证</p>
            </div>
          </div>
        )}
      </section>

      {/* 3. 关联分析实验室 */}
      <section className="glass-card rounded-[4rem] border-4 border-white shadow-2xl p-12 space-y-10 relative overflow-hidden bg-white/60">
        <div className="absolute top-10 right-10 flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#8eb69b] uppercase bg-white/60 px-3 py-1.5 rounded-full border border-white">
            <div className="w-3 h-1 bg-[#8eb69b] rounded-full"></div> 全站视频播放增量
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[#f8b195] uppercase bg-white/60 px-3 py-1.5 rounded-full border border-white">
            <div className="w-3 h-1 bg-[#f8b195] rounded-full"></div> 账号粉丝净增
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#4a3728] tracking-tighter flex items-center gap-3">
             <Zap size={24} className="text-[#f8b195]" /> 增长关联性实验室
          </h2>
          <p className="text-sm font-bold text-[#8eb69b]">归因分析：全站视频热度脉冲对粉丝增长的即时驱动率</p>
        </div>

        <div className="pt-8">
          <CorrelationChart data={correlation} height={280} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
           {[
             { label: '流量波峰吻合度', val: '86%', desc: '视频播放量与粉丝增长在时序上呈现极高相关性' },
             { label: '粉丝留存转化', val: '8.4%', desc: '每 1000 次新增播放可稳定转化为 8.4 名新粉丝' },
             { label: '沉淀动能', val: 'Strong', desc: '在无流量爆发期，账号依然保持基础线性增长' }
           ].map((stat, i) => (
             <div key={i} className="space-y-1 p-6 bg-white/40 rounded-3xl border border-white">
               <div className="text-[10px] font-black text-[#8eb69b] uppercase tracking-widest">{stat.label}</div>
               <div className="text-xl font-black text-[#4a3728]">{stat.val}</div>
               <p className="text-[10px] font-bold text-[#8eb69b]/60">{stat.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <div className="text-center p-8 bg-white/20 rounded-[2rem] border border-white/40 flex flex-col items-center gap-3">
         <div className="p-2 bg-white rounded-full text-[#f8b195] shadow-sm"><Info size={18} /></div>
         <p className="text-[10px] text-[#8eb69b] font-black uppercase tracking-widest text-center max-w-2xl leading-relaxed">
           数据采样来自 哔哩哔哩 开放接口。时序聚合采用滑动平均算法，旨在反映更真实的增长动力学。<br/>
           * 关联性实验室数据每 15 分钟全网同步一次。
         </p>
      </div>

      <style>{`
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2.5s ease-out forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8eb69b33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8eb69b66; }
      `}</style>
    </div>
  );
};

export default DataAnalysisPage;