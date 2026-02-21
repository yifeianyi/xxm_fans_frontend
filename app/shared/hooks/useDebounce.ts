/**
 * useDebounce - 防抖 Hook（值版本）
 *
 * @module shared/hooks
 * @description 延迟更新值，避免频繁触发
 *
 * @example
 * ```tsx
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * 防抖 Hook - 值版本
 *
 * 延迟更新值，避免频繁触发
 *
 * @template T - 值的类型
 * @param {T} value - 要防抖的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {T} 防抖后的值
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * // 使用 debouncedSearchTerm 进行搜索，避免每次输入都触发
 * useEffect(() => {
 *   searchAPI(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 * ```
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
