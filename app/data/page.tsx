import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import DataAnalysisWrapper from './DataAnalysisWrapper';
import { analyticsRepository } from '@/app/infrastructure/repositories';
import { AccountData, TimeGranularity } from '@/app/domain/types';

export const metadata: Metadata = {
    title: '咻咻满数据分析 - 粉丝趋势、作品数据 | 小满虫之家',
    description: '查看咻咻满的粉丝增长趋势、作品播放量分析等数据。基于B站开放接口，每小时同步更新。',
    keywords: ['咻咻满', '数据分析', '粉丝趋势', '作品数据', 'B站数据'],
};

// 服务端数据获取 - 获取所有粒度的数据
async function getAccountsData(): Promise<AccountData[]> {
    try {
        // 分别获取三种粒度的数据
        const [dayData, weekData, monthData] = await Promise.all([
            analyticsRepository.getAllAccountsData('DAY', 30).catch(() => []),
            analyticsRepository.getAllAccountsData('WEEK', 30).catch(() => []),
            analyticsRepository.getAllAccountsData('MONTH', 30).catch(() => []),
        ]);

        // 合并数据 - 以 DAY 数据为基础，合并其他粒度的 history
        const mergedData = dayData.map((dayAccount, index) => {
            const weekAccount = weekData.find(w => w.id === dayAccount.id);
            const monthAccount = monthData.find(m => m.id === dayAccount.id);

            return {
                id: dayAccount.id,
                name: dayAccount.name,
                totalFollowers: dayAccount.totalFollowers,
                history: {
                    DAY: dayAccount.history?.DAY || [],
                    WEEK: weekAccount?.history?.WEEK || [],
                    MONTH: monthAccount?.history?.MONTH || [],
                },
            };
        });

        return mergedData;
    } catch (err) {
        console.error('获取账号数据失败:', err);
        return [];
    }
}

// 主页面组件（Server Component）
export default async function DataAnalysisPage() {
    const accounts = await getAccountsData();
    
    return (
        <>
            {/* 页面装饰 - 数据主题 */}
            <PageDecorations 
                theme="data" 
                glowColors={['#f8b195', '#8eb69b']}
            />
            
            <DataAnalysisWrapper initialAccounts={accounts} />
        </>
    );
}
