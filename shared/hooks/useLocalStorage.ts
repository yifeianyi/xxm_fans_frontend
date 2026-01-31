/**
 * useLocalStorage - 本地存储Hook
 *
 * @module shared/hooks
 * @description 在localStorage中持久化状态
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 * ```
 *
 * @category Hooks
 * @subcategory Shared
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import { useState, useCallback } from 'react';

/**
 * 本地存储Hook
 *
 * 在localStorage中持久化状态
 *
 * @template T - 存储的数据类型
 * @param {string} key - 存储键名
 * @param {T} initialValue - 初始值
 * @returns {[T, (value: T) => void, () => void]} [存储的值, 设置值, 删除值]
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 * ```
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;