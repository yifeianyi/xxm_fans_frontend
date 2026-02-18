'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Music, Image, Calendar, Heart, BarChart3, Info } from 'lucide-react';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);

    const isSongs = pathname?.startsWith('/songs');
    const isFans = pathname?.startsWith('/fansDIY');
    const isGallery = pathname?.startsWith('/gallery');
    const isLive = pathname?.startsWith('/live');
    const isData = pathname?.startsWith('/data');
    const isAbout = pathname?.startsWith('/about');

    // 监听路由变化，自动关闭菜单
    useEffect(() => {
        setIsLeftMenuOpen(false);
        setIsRightMenuOpen(false);
    }, [pathname]);

    // 导航项配置 - 带图标
    const leftNavItems = [
        { path: '/songs', label: '满の歌声', active: isSongs, icon: Music },
        { path: '/gallery', label: '满の图册', active: isGallery, icon: Image },
        { path: '/live', label: '直播日历', active: isLive, icon: Calendar },
    ];

    const rightNavItems = [
        { path: '/fansDIY', label: '精选二创', active: isFans, icon: Heart },
        { path: '/data', label: '满の数据', active: isData, icon: BarChart3 },
        { path: '/about', label: '关于满满', active: isAbout, icon: Info },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/50 px-4 py-2.5">
                <div className="flex items-center justify-center gap-3 md:gap-6">
                    {/* 左侧菜单按钮（仅移动端） */}
                    <button
                        onClick={() => {
                            setIsLeftMenuOpen(!isLeftMenuOpen);
                            setIsRightMenuOpen(false);
                        }}
                        className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors text-[#8eb69b]"
                        aria-label={isLeftMenuOpen ? '关闭左侧菜单' : '打开左侧菜单'}
                    >
                        {isLeftMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* 左侧导航项（桌面端显示） */}
                    <div className="hidden md:flex gap-6">
                        {leftNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative py-1 flex flex-col items-center transition-all ${
                                    item.active ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'
                                }`}
                            >
                                <span className="text-sm font-black whitespace-nowrap px-2 flex items-center gap-1.5">
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </span>
                                {item.active && (
                                    <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* 头像（始终显示） */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 shrink-0 px-2"
                        onClick={() => {
                            setIsLeftMenuOpen(false);
                            setIsRightMenuOpen(false);
                        }}
                        aria-label="返回首页"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-110">
                            <img src="/favicon-32x32.png" alt="咻咻满头像" className="w-full h-full object-cover" />
                        </div>
                    </Link>

                    {/* 右侧导航项（桌面端显示） */}
                    <div className="hidden md:flex gap-6">
                        {rightNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative py-1 flex flex-col items-center transition-all ${
                                    item.active ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'
                                }`}
                            >
                                <span className="text-sm font-black whitespace-nowrap px-2 flex items-center gap-1.5">
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </span>
                                {item.active && (
                                    <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* 右侧菜单按钮（仅移动端） */}
                    <button
                        onClick={() => {
                            setIsRightMenuOpen(!isRightMenuOpen);
                            setIsLeftMenuOpen(false);
                        }}
                        className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors text-[#8eb69b]"
                        aria-label={isRightMenuOpen ? '关闭右侧菜单' : '打开右侧菜单'}
                    >
                        {isRightMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* 左侧下拉菜单（移动端） */}
                {isLeftMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 glass-card border-b border-white/50 px-4 py-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col gap-2">
                            {leftNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsLeftMenuOpen(false)}
                                    className={`relative py-3 px-4 rounded-2xl transition-all flex items-center gap-3 ${
                                        item.active
                                            ? 'bg-[#f8b195]/20 text-[#f8b195]'
                                            : 'text-[#8eb69b] hover:bg-white/20'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-black whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    {item.active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#f8b195] rounded-r-full"></div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 右侧下拉菜单（移动端） */}
                {isRightMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 glass-card border-b border-white/50 px-4 py-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col gap-2">
                            {rightNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsRightMenuOpen(false)}
                                    className={`relative py-3 px-4 rounded-2xl transition-all flex items-center gap-3 ${
                                        item.active
                                            ? 'bg-[#f8b195]/20 text-[#f8b195]'
                                            : 'text-[#8eb69b] hover:bg-white/20'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-black whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    {item.active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#f8b195] rounded-r-full"></div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
