/**
 * useMediaQuery - 媒体查询Hook
 *
 * @module shared/hooks
 * @description 响应式设计，检测屏幕尺寸
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
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
 * 媒体查询Hook
 *
 * 响应式设计，检测屏幕尺寸
 *
 * @param {string} query - CSS媒体查询字符串
 * @returns {boolean} 是否匹配媒体查询
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * ```
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query, matches]);

  return matches;
}

export default useMediaQuery;