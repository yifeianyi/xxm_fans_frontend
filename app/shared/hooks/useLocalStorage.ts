/**
 * useLocalStorage - 本地存储 Hook
 *
 * @module shared/hooks
 * @description 在 localStorage 中持久化状态（SSR 安全）
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 * ```
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * 本地存储 Hook（SSR 安全）
 *
 * 在 localStorage 中持久化状态
 *
 * @template T - 存储的数据类型
 * @param {string} key - 存储键名
 * @param {T} initialValue - 初始值
 * @returns {[T, (value: T) => void, () => void]} [存储的值, 设置值, 删除值]
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void] {
    // 使用 lazy initialization，但 SSR 时返回 initialValue
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // 客户端挂载后从 localStorage 读取
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
        setIsInitialized(true);
    }, [key]);

    const setValue = useCallback((value: T) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key]);

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
