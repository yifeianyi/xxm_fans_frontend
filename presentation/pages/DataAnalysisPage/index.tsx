import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Crown, Star, Sparkles, Gem, Flame } from 'lucide-react';
import { songService } from '../../../infrastructure/api';
import { AccountData, TimeGranularity } from '../../../domain/types';
import { OverviewSection, ComingSoonSection, DataAnalysisStyles } from './components';
import { PageDecorations } from '../../components/common/PageDecorations';

/**
 * 数据分析页面
 * 显示账号粉丝增长、作品分析等数据统计
 */
const DataAnalysisPage: React.FC = () => {
  const [granularity, setGranularity] = useState<TimeGranularity>('WEEK');
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [selectedAccIdx, setSelectedAccIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await songService.getAccountsWithGranularity(granularity);
        if (result.error) {
          setError(result.error.message);
          console.error('获取账号数据失败:', result.error);
        } else {
          setAccounts(result.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('获取账号数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [granularity]);

  const activeAcc = accounts[selectedAccIdx];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-16 h-16 border-4 border-[#f8b195] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8eb69b] font-black tracking-widest animate-pulse">正在从数据森林提取样本...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="text-6xl">😿</div>
        <p className="text-[#4a3728] font-black">数据获取失败</p>
        <p className="text-[#8eb69b] text-sm">{error}</p>
      </div>
    );
  }

  if (!activeAcc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="text-6xl">📊</div>
        <p className="text-[#4a3728] font-black">暂无数据</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>咻咻满数据分析 - 账号数据、视频统计 | 小满虫之家</title>
        <meta name="description" content="查看咻咻满的账号数据和视频统计分析，包括粉丝增长、播放量、点赞数等关键指标。了解咻咻满在各平台的数据表现。" />
      </Helmet>
      
      {/* 页面装饰 - 数据主题 */}
      <PageDecorations theme="data" glowColors={['#8eb69b', '#f8b195']} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-1000">
        
        {/* 顶部全站趋势 */}
        <OverviewSection
          accounts={accounts}
          selectedAccIdx={selectedAccIdx}
          granularity={granularity}
          onGranularityChange={setGranularity}
          onAccountChange={setSelectedAccIdx}
        />

        {/* 2. 作品深度观测 - 待展示 */}
        <ComingSoonSection
          title="作品深度观测"
          description="对特定投稿的时序表现进行精细化拆解"
          icon="eye"
        />

        {/* 3. 增长关联性实验室 - 待展示 */}
        <ComingSoonSection
          title="增长关联性实验室"
          description="归因分析：全站视频热度脉冲对粉丝增长的即时驱动率"
          icon="zap"
        />

        {/* 底部说明 */}
        <div className="text-center p-8 bg-white/20 rounded-[2rem] border border-white/40 flex flex-col items-center gap-3">
          <div className="p-2 bg-white rounded-full text-[#f8b195] shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <p className="text-[10px] text-[#8eb69b] font-black uppercase tracking-widest text-center max-w-2xl leading-relaxed">
            数据采样来自 哔哩哔哩 开放接口。时序聚合采用滑动平均算法，旨在反映更真实的增长动力学。<br/>
            * 数据每小时同步一次，可能存在短暂的更新延迟。
          </p>
        </div>

        <DataAnalysisStyles />
      </div>
    </>
  );
};

export default DataAnalysisPage;