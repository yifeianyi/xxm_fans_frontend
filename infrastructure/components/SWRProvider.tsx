/**
 * SWR Provider 组件
 * 
 * 为应用提供全局 SWR 配置
 */
import React from 'react';
import { SWRConfig } from 'swr';
import { swrConfig } from '../hooks/useSWRConfig';

interface SWRProviderProps {
    children: React.ReactNode;
}

export const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
    return (
        <SWRConfig value={swrConfig}>
            {children}
        </SWRConfig>
    );
};

export default SWRProvider;
