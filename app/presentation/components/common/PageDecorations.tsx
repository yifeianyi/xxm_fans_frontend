'use client';

import React from 'react';
import { Sparkles, Star, Heart, Cloud, Moon, Sun, Flower2, Zap, Gem, Music, Flame, Crown, Leaf, Feather } from 'lucide-react';

// 预定义的装饰品配置
export const decorationConfigs = {
    // 默认装饰
    default: [
        { icon: Sparkles, position: 'top-20 left-10', size: 'w-6 h-6', color: 'text-[#f8b195]/40', animation: 'animate-bounce', duration: '3s', delay: '0s' },
        { icon: Star, position: 'top-32 left-20', size: 'w-4 h-4', color: 'text-yellow-400/50', animation: 'animate-pulse', duration: '2s', delay: '0.5s' },
        { icon: Cloud, position: 'top-24 right-16', size: 'w-8 h-8', color: 'text-[#f6d365]/30', animation: 'animate-bounce', duration: '4s', delay: '1s' },
        { icon: Moon, position: 'top-40 right-10', size: 'w-5 h-5', color: 'text-purple-300/40', animation: 'animate-pulse', duration: '2s', delay: '0.3s' },
        { icon: Heart, position: 'top-1/3 left-1/4', size: 'w-4 h-4', color: 'text-[#f67280]/30', animation: 'animate-bounce', duration: '5s', delay: '0s', fill: true },
        { icon: Gem, position: 'top-1/2 right-1/4', size: 'w-5 h-5', color: 'text-pink-300/40', animation: 'animate-pulse', duration: '2s', delay: '0.8s' },
        { icon: Flower2, position: 'bottom-40 left-12', size: 'w-6 h-6', color: 'text-[#8eb69b]/40', animation: 'animate-bounce', duration: '3.5s', delay: '0.5s' },
        { icon: Sun, position: 'bottom-32 right-20', size: 'w-6 h-6', color: 'text-orange-300/40', animation: 'animate-pulse', duration: '2s', delay: '1.2s' },
        { icon: Zap, position: 'bottom-48 right-32', size: 'w-4 h-4', color: 'text-yellow-400/40', animation: 'animate-bounce', duration: '4.5s', delay: '0s' },
        { icon: Leaf, position: 'top-1/2 left-8', size: 'w-5 h-5', color: 'text-[#8eb69b]/35', animation: 'animate-pulse', duration: '3s', delay: '0.6s' },
        { icon: Feather, position: 'bottom-1/4 right-12', size: 'w-5 h-5', color: 'text-purple-400/30', animation: 'animate-bounce', duration: '4s', delay: '1s' },
    ],
    // 音乐主题装饰
    music: [
        { icon: Music, position: 'top-16 left-16', size: 'w-8 h-8', color: 'text-[#f8b195]/50', animation: 'animate-bounce', duration: '3s', delay: '0s' },
        { icon: Sparkles, position: 'top-28 left-8', size: 'w-5 h-5', color: 'text-yellow-400/40', animation: 'animate-pulse', duration: '2s', delay: '0.3s' },
        { icon: Crown, position: 'top-20 right-20', size: 'w-6 h-6', color: 'text-yellow-500/40', animation: 'animate-bounce', duration: '4s', delay: '0.5s' },
        { icon: Star, position: 'top-36 right-12', size: 'w-4 h-4', color: 'text-[#f8b195]/50', animation: 'animate-spin', duration: '3s', delay: '0s' },
        { icon: Flame, position: 'top-1/3 left-12', size: 'w-5 h-5', color: 'text-orange-400/35', animation: 'animate-pulse', duration: '2s', delay: '0.7s' },
        { icon: Heart, position: 'top-1/2 right-16', size: 'w-6 h-6', color: 'text-[#f67280]/30', animation: 'animate-bounce', duration: '5s', delay: '1s', fill: true },
        { icon: Gem, position: 'bottom-36 left-20', size: 'w-5 h-5', color: 'text-pink-300/40', animation: 'animate-pulse', duration: '2s', delay: '0.4s' },
        { icon: Moon, position: 'bottom-28 right-24', size: 'w-6 h-6', color: 'text-purple-300/35', animation: 'animate-bounce', duration: '4s', delay: '0.8s' },
        { icon: Cloud, position: 'bottom-1/3 left-1/4', size: 'w-7 h-7', color: 'text-[#8eb69b]/30', animation: 'animate-pulse', duration: '3s', delay: '0.2s' },
    ],
    // 画廊主题装饰
    gallery: [
        { icon: Star, position: 'top-20 left-12', size: 'w-6 h-6', color: 'text-yellow-400/50', animation: 'animate-pulse', duration: '2s', delay: '0s' },
        { icon: Sparkles, position: 'top-32 left-24', size: 'w-5 h-5', color: 'text-[#f8b195]/40', animation: 'animate-bounce', duration: '3s', delay: '0.4s' },
        { icon: Sun, position: 'top-24 right-16', size: 'w-8 h-8', color: 'text-orange-300/35', animation: 'animate-spin', duration: '4s', delay: '0s' },
        { icon: Heart, position: 'top-40 right-8', size: 'w-5 h-5', color: 'text-[#f67280]/30', animation: 'animate-pulse', duration: '2s', delay: '0.6s', fill: true },
        { icon: Gem, position: 'top-1/3 left-16', size: 'w-4 h-4', color: 'text-pink-300/40', animation: 'animate-bounce', duration: '3.5s', delay: '0.8s' },
        { icon: Flower2, position: 'bottom-40 right-16', size: 'w-6 h-6', color: 'text-[#8eb69b]/40', animation: 'animate-pulse', duration: '2s', delay: '0.3s' },
        { icon: Moon, position: 'bottom-32 left-20', size: 'w-5 h-5', color: 'text-purple-300/35', animation: 'animate-bounce', duration: '4s', delay: '1s' },
        { icon: Cloud, position: 'bottom-1/4 right-1/4', size: 'w-6 h-6', color: 'text-[#f6d365]/30', animation: 'animate-pulse', duration: '3s', delay: '0.5s' },
    ],
    // 直播主题装饰
    live: [
        { icon: Flame, position: 'top-16 left-14', size: 'w-6 h-6', color: 'text-red-400/40', animation: 'animate-pulse', duration: '1.5s', delay: '0s' },
        { icon: Crown, position: 'top-24 left-8', size: 'w-5 h-5', color: 'text-yellow-400/50', animation: 'animate-bounce', duration: '3s', delay: '0.3s' },
        { icon: Star, position: 'top-20 right-20', size: 'w-6 h-6', color: 'text-yellow-400/40', animation: 'animate-spin', duration: '3s', delay: '0s' },
        { icon: Sparkles, position: 'top-36 right-12', size: 'w-4 h-4', color: 'text-[#f8b195]/50', animation: 'animate-pulse', duration: '2s', delay: '0.5s' },
        { icon: Heart, position: 'top-1/3 left-10', size: 'w-5 h-5', color: 'text-[#f67280]/40', animation: 'animate-bounce', duration: '4s', delay: '0.7s', fill: true },
        { icon: Zap, position: 'top-1/2 right-14', size: 'w-5 h-5', color: 'text-yellow-400/40', animation: 'animate-pulse', duration: '1s', delay: '0.2s' },
        { icon: Gem, position: 'bottom-36 left-16', size: 'w-6 h-6', color: 'text-pink-400/35', animation: 'animate-bounce', duration: '3s', delay: '0.4s' },
        { icon: Moon, position: 'bottom-28 right-20', size: 'w-5 h-5', color: 'text-purple-300/40', animation: 'animate-pulse', duration: '2s', delay: '0.8s' },
        { icon: Sun, position: 'bottom-1/3 left-1/4', size: 'w-7 h-7', color: 'text-orange-300/30', animation: 'animate-bounce', duration: '4s', delay: '1s' },
    ],
    // 数据主题装饰
    data: [
        { icon: Crown, position: 'top-20 left-16', size: 'w-6 h-6', color: 'text-yellow-400/45', animation: 'animate-bounce', duration: '3s', delay: '0s' },
        { icon: Star, position: 'top-28 left-8', size: 'w-4 h-4', color: 'text-[#f8b195]/50', animation: 'animate-pulse', duration: '2s', delay: '0.3s' },
        { icon: Gem, position: 'top-24 right-20', size: 'w-5 h-5', color: 'text-blue-400/40', animation: 'animate-bounce', duration: '4s', delay: '0.5s' },
        { icon: Sparkles, position: 'top-40 right-8', size: 'w-5 h-5', color: 'text-purple-400/40', animation: 'animate-pulse', duration: '2s', delay: '0.7s' },
        { icon: Flame, position: 'top-1/3 left-12', size: 'w-5 h-5', color: 'text-orange-400/35', animation: 'animate-pulse', duration: '1.5s', delay: '0.4s' },
        { icon: Zap, position: 'top-1/2 right-16', size: 'w-4 h-4', color: 'text-yellow-400/40', animation: 'animate-bounce', duration: '2s', delay: '0.6s' },
        { icon: Cloud, position: 'bottom-40 left-20', size: 'w-6 h-6', color: 'text-[#8eb69b]/35', animation: 'animate-pulse', duration: '3s', delay: '0.2s' },
        { icon: Moon, position: 'bottom-32 right-24', size: 'w-5 h-5', color: 'text-purple-300/35', animation: 'animate-bounce', duration: '4s', delay: '0.8s' },
    ],
    // 粉丝二创主题装饰
    fans: [
        { icon: Heart, position: 'top-16 left-12', size: 'w-7 h-7', color: 'text-[#f67280]/45', animation: 'animate-pulse', duration: '2s', delay: '0s', fill: true },
        { icon: Star, position: 'top-28 left-20', size: 'w-5 h-5', color: 'text-yellow-400/50', animation: 'animate-bounce', duration: '3s', delay: '0.3s' },
        { icon: Sparkles, position: 'top-20 right-16', size: 'w-6 h-6', color: 'text-[#f8b195]/40', animation: 'animate-pulse', duration: '2s', delay: '0.5s' },
        { icon: Gem, position: 'top-36 right-10', size: 'w-5 h-5', color: 'text-pink-400/40', animation: 'animate-bounce', duration: '4s', delay: '0.7s' },
        { icon: Crown, position: 'top-1/3 left-8', size: 'w-5 h-5', color: 'text-yellow-500/40', animation: 'animate-bounce', duration: '3s', delay: '1s' },
        { icon: Flower2, position: 'bottom-36 right-16', size: 'w-6 h-6', color: 'text-[#8eb69b]/40', animation: 'animate-pulse', duration: '2s', delay: '0.4s' },
        { icon: Moon, position: 'bottom-28 left-20', size: 'w-5 h-5', color: 'text-purple-300/35', animation: 'animate-bounce', duration: '4s', delay: '0.6s' },
        { icon: Sun, position: 'bottom-1/4 right-1/4', size: 'w-6 h-6', color: 'text-orange-300/30', animation: 'animate-pulse', duration: '3s', delay: '0.2s' },
    ],
};

export type DecorationTheme = keyof typeof decorationConfigs;

interface PageDecorationsProps {
    theme?: DecorationTheme;
    className?: string;
    showGlow?: boolean;
    glowColors?: [string, string];
}

export const PageDecorations: React.FC<PageDecorationsProps> = ({
    theme = 'default',
    className = '',
    showGlow = true,
    glowColors = ['#f8b195', '#f6d365']
}) => {
    const decorations = decorationConfigs[theme] || decorationConfigs.default;

    return (
        <>
            {/* 浮动装饰 */}
            <div className={`fixed inset-0 pointer-events-none overflow-hidden -z-5 ${className}`}>
                {decorations.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className={`absolute ${item.position} ${item.animation} ${item.size} ${item.color}`}
                            style={{
                                animationDuration: item.duration,
                                animationDelay: item.delay
                            }}
                        >
                            {'fill' in item && item.fill ? <Icon className="w-full h-full fill-current" /> : <Icon className="w-full h-full" />}
                        </div>
                    );
                })}
            </div>

            {/* 渐变光晕背景 */}
            {showGlow && (
                <>
                    <div 
                        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-10"
                        style={{ backgroundColor: glowColors[0] }}
                    />
                    <div 
                        className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none -z-10 opacity-10"
                        style={{ backgroundColor: glowColors[1] }}
                    />
                </>
            )}
        </>
    );
};

// 装饰性分隔线组件
export const DecorativeDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`flex items-center justify-center gap-3 py-8 ${className}`}>
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#f8b195]/50" />
        <Sparkles className="w-4 h-4 text-[#f8b195] animate-pulse" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#f8b195]/50" />
    </div>
);

// 标题装饰组件
export const TitleDecoration: React.FC<{ 
    icon?: React.ReactNode;
    className?: string;
}> = ({ icon, className = '' }) => (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#f8b195]" />
        {icon || <Sparkles className="w-4 h-4 text-[#f8b195]" />}
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#f8b195]" />
    </div>
);

// 角落装饰组件
export const CornerDecoration: React.FC<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    className?: string;
}> = ({ position, className = '' }) => {
    const positionClasses = {
        'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
        'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
        'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
        'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    };

    return (
        <div className={`absolute ${positionClasses[position]} ${className}`}>
            <div className="w-24 h-24 bg-gradient-to-br from-[#f8b195]/20 to-transparent rounded-full blur-xl" />
        </div>
    );
};

// 浮动音符装饰（用于音乐相关页面）
export const FloatingNotes: React.FC<{ count?: number }> = ({ count = 5 }) => {
    const notes = [
        { icon: '♪', left: '10%', delay: '0s', duration: '6s' },
        { icon: '♫', left: '25%', delay: '1s', duration: '7s' },
        { icon: '♬', left: '50%', delay: '2s', duration: '5s' },
        { icon: '♭', left: '75%', delay: '1.5s', duration: '6.5s' },
        { icon: '♮', left: '90%', delay: '0.5s', duration: '5.5s' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
            {notes.slice(0, count).map((note, index) => (
                <div
                    key={index}
                    className="absolute text-[#f8b195]/20 text-2xl animate-float-note"
                    style={{
                        left: note.left,
                        bottom: '-50px',
                        animationDelay: note.delay,
                        animationDuration: note.duration,
                    }}
                >
                    {note.icon}
                </div>
            ))}
        </div>
    );
};

export default PageDecorations;
