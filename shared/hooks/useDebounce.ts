/**
 * useDebounce - 防抖Hook
 *
 * @module shared/hooks
 * @description 延迟执行函数，避免频繁触发
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(search, 500);
 * ```
 *
 * @category Hooks
 * @subcategory Shared
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import { useState, useEffect } from 'react';

/**
 * 防抖Hook
 *
 * 延迟执行函数，避免频繁触发
 *
 * @template T - 函数类型
 * @param {T} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {T} 防抖后的函数
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(search, 500);
 * ```
 */
function useDebounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  const [debouncedFunc, setDebouncedFunc] = useState<T>(() => func);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFunc(() => func);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [func, delay]);

  return debouncedFunc;
}

export default useDebounce;