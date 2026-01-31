/**
 * useClickOutside - 点击外部Hook
 *
 * @module shared/hooks
 * @description 检测是否点击了元素外部
 *
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDivElement>(null);
 * useClickOutside(modalRef, () => setIsOpen(false));
 * ```
 *
 * @category Hooks
 * @subcategory Shared
 *
 * @version 1.0.0
 * @since 2024-01-31
 */

import { useEffect, RefObject } from 'react';

/**
 * 点击外部Hook
 *
 * 检测是否点击了元素外部
 *
 * @param {RefObject<HTMLElement>} ref - 元素引用
 * @param {() => void} handler - 点击外部时的回调
 *
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDivElement>(null);
 * useClickOutside(modalRef, () => setIsOpen(false));
 * ```
 */
function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;