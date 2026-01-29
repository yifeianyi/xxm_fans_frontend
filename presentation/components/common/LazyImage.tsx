import React, { useState, useRef, useEffect } from 'react';

// 默认占位符图片（SVG）
const DEFAULT_PLACEHOLDER = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#f8b195"/>
        <circle cx="50" cy="50" r="20" fill="#8eb69b"/>
        <text x="50" y="55" font-size="12" fill="#4a3728" text-anchor="middle" font-weight="bold">XXM</text>
    </svg>`
)}`;

// 全局缓存已加载的图片 URL，防止重复加载
const globalLoadedUrls = new Map<string, boolean>();
// 全局正在加载的图片集合，防止并发加载
const globalLoadingUrls = new Set<string>();

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    style?: React.CSSProperties;
    onLoad?: () => void;
    onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholder = DEFAULT_PLACEHOLDER,
    style,
    onLoad,
    onError,
}) => {
    // 始终从占位符开始，避免直接渲染导致重复请求
    const [imageSrc, setImageSrc] = useState<string>(placeholder);
    const [imageRef, isIntersecting] = useIntersectionObserver();
    const [isLoading, setIsLoading] = useState(false);
    const isMountedRef = useRef(true);
    const hasCheckedCacheRef = useRef(false);

    // 组件挂载时检查缓存
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        // 如果组件已卸载，不执行任何操作
        if (!isMountedRef.current) {
            return;
        }

        // 如果已经检查过缓存，跳过
        if (hasCheckedCacheRef.current) {
            return;
        }

        // 如果图片在视口中且还未加载
        if (isIntersecting && imageSrc === placeholder) {
            // 标记已检查缓存
            hasCheckedCacheRef.current = true;

            // 检查是否已经在全局缓存中
            if (globalLoadedUrls.has(src)) {
                console.log('[LazyImage] 已缓存，直接设置图片:', src);
                setImageSrc(src);
                setIsLoading(false);
                onLoad?.();
                return;
            }

            // 检查是否正在加载
            if (globalLoadingUrls.has(src)) {
                console.log('[LazyImage] 正在加载中，等待结果:', src);
                // 设置一个定时器，定期检查加载状态
                const checkInterval = setInterval(() => {
                    if (globalLoadedUrls.has(src)) {
                        clearInterval(checkInterval);
                        if (isMountedRef.current) {
                            console.log('[LazyImage] 等待完成，设置图片:', src);
                            setImageSrc(src);
                            setIsLoading(false);
                            onLoad?.();
                        }
                    }
                }, 100);
                return () => clearInterval(checkInterval);
            }

            console.log('[LazyImage] 开始加载图片:', src);
            // 立即标记为正在加载，防止重复
            globalLoadingUrls.add(src);
            setIsLoading(true);

            // 直接设置 imageSrc，让 <img> 标签加载图片
            // 只通过 <img> 标签的 onLoad/onError 事件来处理，避免使用 new Image() 导致重复请求
            setImageSrc(src);
        }
    }, [isIntersecting, imageSrc, placeholder, src, onLoad, onError]);

    return (
        <div
            ref={imageRef}
            className={`relative overflow-hidden ${className}`}
            style={style}
        >
            {/* 加载状态 */}
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8b195]/20 to-[#8eb69b]/20 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-[#f8b195]/30 border-t-[#f8b195] rounded-full animate-spin"></div>
                </div>
            )}
            {/* 图片 */}
            <img
                src={imageSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => {
                    if (!isMountedRef.current) return;
                    console.log('[LazyImage] 图片加载成功:', src);
                    globalLoadedUrls.set(src, true);
                    globalLoadingUrls.delete(src);
                    setIsLoading(false);
                    onLoad?.();
                }}
                onError={() => {
                    if (!isMountedRef.current) return;
                    console.log('[LazyImage] 图片加载失败:', src);
                    globalLoadedUrls.delete(src);
                    globalLoadingUrls.delete(src);
                    setImageSrc(placeholder);
                    setIsLoading(false);
                    onError?.();
                }}
            />
        </div>
    );
};

// 自定义 Hook：Intersection Observer
function useIntersectionObserver(): [React.RefObject<HTMLDivElement>, boolean] {
    const ref = useRef<HTMLDivElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        // 如果已经相交，不需要再次观察
        if (isIntersecting) {
            return;
        }

        const currentRef = ref.current;
        if (!currentRef) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.disconnect();
                    observer.unobserve(currentRef);
                }
            },
            {
                rootMargin: '100px', // 提前 100px 开始加载，提供更流畅的体验
                threshold: 0.01, // 图片进入视口 1% 时触发
            }
        );

        observer.observe(currentRef);

        return () => {
            observer.disconnect();
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [isIntersecting]);

    return [ref, isIntersecting];
}

export default LazyImage;