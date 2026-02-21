/**
 * useScrollPosition - 滚动位置Hook
 *
 * @module shared/hooks
 * @description 监听页面滚动位置
 *
 * @example
 * ```tsx
 * const { x, y } = useScrollPosition();
 * const isScrolled = y > 100;
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
 * 滚动位置Hook
 *
 * 监听页面滚动位置
 *
 * @returns {{ x: number; y: number }} 滚动位置
 *
 * @example
 * ```tsx
 * const { x, y } = useScrollPosition();
 * const isScrolled = y > 100;
 * ```
 */
function useScrollPosition(): { x: number; y: number } {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
}

export default useScrollPosition;