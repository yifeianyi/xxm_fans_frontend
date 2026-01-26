import React, { useState, useRef, useEffect } from 'react';

// 默认占位符图片（SVG）
const DEFAULT_PLACEHOLDER = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#f8b195"/>
        <circle cx="50" cy="50" r="20" fill="#8eb69b"/>
        <text x="50" y="55" font-size="12" fill="#4a3728" text-anchor="middle" font-weight="bold">XXM</text>
    </svg>`
)}`;

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
    const [imageSrc, setImageSrc] = useState<string>(placeholder);
    const [imageRef, isIntersecting] = useIntersectionObserver();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isIntersecting && imageSrc === placeholder) {
            setIsLoading(true);
            const img = new Image();
            img.src = src;

            img.onload = () => {
                setImageSrc(src);
                setIsLoading(false);
                onLoad?.();
            };

            img.onerror = () => {
                setImageSrc(placeholder);
                setIsLoading(false);
                onError?.();
            };
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
                loading="lazy"
            />
        </div>
    );
};

// 自定义 Hook：Intersection Observer
function useIntersectionObserver(): [React.RefObject<HTMLDivElement>, boolean] {
    const ref = useRef<HTMLDivElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // 提前 100px 开始加载，提供更流畅的体验
                threshold: 0.01, // 图片进入视口 1% 时触发
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return [ref, isIntersecting];
}

export default LazyImage;