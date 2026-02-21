'use client';

import React, { useState, useEffect } from 'react';
import { analyticsRepository } from '@/app/infrastructure/repositories';
import { AccountData, TimeGranularity } from '@/app/domain/types';
import { ErrorBoundary, Loading } from '@/app/shared/components';
import { OverviewSection, ComingSoonSection, DataAnalysisStyles } from './components';

export default function DataAnalysisPageClient() {
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
        // 获取账号列表
        const accountList = await analyticsRepository.getAccounts();
        
        // 获取每个账号的详细数据
        const accountData = await Promise.all(
          accountList.slice(0, 2).map(async acc => {
            try {
              return await analyticsRepository.getAccountData({
                accountId: acc.id,
                granularity: 'DAY'
              });
            } catch {
              return null;
            }
          })
        );
        setAccounts(accountData.filter(Boolean) as AccountData[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('获取账号数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading text="正在从数据森林提取样本..." size="lg" />;
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

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="text-6xl">📊</div>
        <p className="text-[#4a3728] font-black">暂无数据</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
