/**
 * 优化图片组件
 * 
 * 特性：
 * - 懒加载（使用 Intersection Observer）
 * - WebP/AVIF 格式支持
 * - 占位图和渐进式加载
 * - 响应式图片
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    containerClassName?: string;
    placeholder?: string;
    lazy?: boolean;
    priority?: 'high' | 'low' | 'auto';
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    onLoad?: () => void;
    onError?: () => void;
    sizes?: string;
}

// 生成响应式图片 srcSet
const generateSrcSet = (baseUrl: string): string | undefined => {
    if (!baseUrl || baseUrl.startsWith('data:') || baseUrl.startsWith('blob:')) {
        return undefined;
    }
    
    // 只对特定路径的图片生成响应式版本
    if (!baseUrl.includes('/gallery/') && !baseUrl.includes('/covers/')) {
        return undefined;
    }
    
    const widths = [320, 640, 960, 1280, 1920];
    return widths
        .map(w => `${baseUrl} ${w}w`)
        .join(', ');
};

// 检测浏览器是否支持 WebP
const checkWebPSupport = (): boolean => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

// 检测浏览器是否支持 AVIF
const checkAVIFSupport = (): boolean => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    }
    return false;
};

// 转换图片格式 URL
const getOptimizedUrl = (url: string, format: 'webp' | 'avif'): string => {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    // 替换扩展名
    return url.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    containerClassName = '',
    placeholder,
    lazy = true,
    priority = 'auto',
    objectFit = 'cover',
    onLoad,
    onError,
    sizes = '100vw',
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const [hasError, setHasError] = useState(false);
    const [supportsWebP, setSupportsWebP] = useState(false);
    const [supportsAVIF, setSupportsAVIF] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 检测浏览器支持
    useEffect(() => {
        setSupportsWebP(checkWebPSupport());
        setSupportsAVIF(checkAVIFSupport());
    }, []);

    // 使用 Intersection Observer 实现懒加载
    useEffect(() => {
        if (!lazy || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [lazy]);

    // 处理图片加载完成
    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        onLoad?.();
    }, [onLoad]);

    // 处理图片加载错误
    const handleError = useCallback(() => {
        setHasError(true);
        onError?.();
    }, [onError]);

    // 生成响应式图片 srcSet
    const srcSet = generateSrcSet(src);

    // 生成优化格式 URL
    const webpSrc = supportsWebP ? getOptimizedUrl(src, 'webp') : null;
    const avifSrc = supportsAVIF ? getOptimizedUrl(src, 'avif') : null;

    // 确定 loading 属性
    const loadingAttr = priority === 'high' ? 'eager' : (lazy ? 'lazy' : 'eager');
    
    // 确定 decoding 属性
    const decodingAttr = priority === 'high' ? 'sync' : 'async';

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${containerClassName}`}
            style={{ width, height }}
        >
            {/* 占位图 / 加载骨架 */}
            {!isLoaded && !hasError && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse"
                    style={{
                        backgroundImage: placeholder ? `url(${placeholder})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: placeholder ? 'blur(10px)' : undefined,
                    }}
                />
            )}

            {/* 错误状态 */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">图片加载失败</span>
                </div>
            )}

            {/* 实际图片 */}
            {isInView && !hasError && (
                <picture>
                    {/* AVIF 格式（最佳压缩率） */}
                    {avifSrc && (
                        <source
                            srcSet={srcSet ? generateSrcSet(avifSrc) || avifSrc : avifSrc}
                            sizes={sizes}
                            type="image/avif"
                        />
                    )}
                    {/* WebP 格式 */}
                    {webpSrc && (
                        <source
                            srcSet={srcSet ? generateSrcSet(webpSrc) || webpSrc : webpSrc}
                            sizes={sizes}
                            type="image/webp"
                        />
                    )}
                    {/* 原始格式回退 */}
                    <img
                        ref={imgRef as React.RefObject<HTMLImageElement>}
                        src={src}
                        srcSet={srcSet}
                        sizes={sizes}
                        alt={alt}
                        width={width}
                        height={height}
                        loading={loadingAttr}
                        decoding={decodingAttr}
                        onLoad={handleLoad}
                        onError={handleError}
                        className={`
                            transition-opacity duration-300
                            ${isLoaded ? 'opacity-100' : 'opacity-0'}
                            ${className}
                        `}
                        style={{ objectFit }}
                    />
                </picture>
            )}
        </div>
    );
};

export default OptimizedImage;
