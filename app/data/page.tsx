import React from 'react';
import type { Metadata } from 'next';
import { PageDecorations } from '@/app/presentation/components/common/PageDecorations';
import DataAnalysisWrapper from './DataAnalysisWrapper';
import { analyticsRepository } from '@/app/infrastructure/repositories';
import { AccountData } from '@/app/domain/types';

export const metadata: Metadata = {
    title: '咻咻满数据分析 - 粉丝趋势、作品数据 | 小满虫之家',
    description: '查看咻咻满的粉丝增长趋势、作品播放量分析等数据。基于B站开放接口，每小时同步更新。',
    keywords: ['咻咻满', '数据分析', '粉丝趋势', '作品数据', 'B站数据'],
};

// 服务端数据获取
async function getAccountsData(): Promise<AccountData[]> {
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
                } catch (err) {
                    console.error(`获取账号 ${acc.id} 数据失败:`, err);
                    return null;
                }
            })
        );
        
        return accountData.filter(Boolean) as AccountData[];
    } catch (err) {
        console.error('获取账号列表失败:', err);
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
