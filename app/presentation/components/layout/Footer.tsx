'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Heart, Video, Image, Trophy, Calendar, ExternalLink, Mail, Info, Sparkles, Star, Flower2 } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: '歌曲列表', to: '/songs', icon: Music },
        { name: '热歌榜', to: '/songs?tab=hot', icon: Trophy },
        { name: '原唱作品', to: '/songs?tab=originals', icon: Music },
        { name: '二创展厅', to: '/fansDIY', icon: Heart },
        { name: '图集', to: '/gallery', icon: Image },
        { name: '直播日历', to: '/live', icon: Calendar },
    ];

    const relatedLinks = [
        { name: '数据分析', to: '/data', icon: Video },
        { name: '关于满满', to: '/about', icon: Info },
        { name: '联系我们', to: '/contact', icon: Mail },
    ];

    const externalLinks = [
        { name: '咻咻满B站空间', href: 'https://space.bilibili.com/37754047' },
        { name: '咻小满B站空间', href: 'https://space.bilibili.com/480116537' },
    ];

    return (
        <footer className="mt-auto border-t border-white/40 bg-white/10 backdrop-blur-sm relative overflow-hidden">
            {/* 装饰元素 */}
            <div className="absolute top-4 left-10 opacity-20">
                <Sparkles className="w-5 h-5 text-[#f8b195] animate-pulse" />
            </div>
            <div className="absolute top-8 right-20 opacity-20">
                <Star className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute bottom-20 left-1/4 opacity-15">
                <Flower2 className="w-6 h-6 text-[#8eb69b] animate-bounce" style={{ animationDuration: '4s' }} />
            </div>
            <div className="absolute top-16 right-1/3 opacity-15">
                <Heart className="w-5 h-5 text-[#f67280] animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* 主要内容区 */}
            <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* 站点介绍 */}
                    <div className="space-y-4 md:col-span-1">
                        <h3 className="text-lg font-black text-[#8eb69b] flex items-center gap-2">
                            <Music className="w-5 h-5" />
                            小满虫之家
                        </h3>
                        <p className="text-sm text-[#6b9b7a] leading-relaxed">
                            小满虫之家是咻咻满粉丝站，致力于收录咻咻满（XXM）的所有音乐作品、
                            演出记录和粉丝二创。
                        </p>
                    </div>

                    {/* 快速导航 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-[#8eb69b]">快速导航</h3>
                        <nav className="space-y-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.to}
                                    className="text-sm text-[#6b9b7a] hover:text-[#f8b195] transition-colors flex items-center gap-2"
                                >
                                    <link.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{link.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* 更多页面 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-[#8eb69b]">更多</h3>
                        <nav className="space-y-2">
                            {relatedLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.to}
                                    className="text-sm text-[#6b9b7a] hover:text-[#f8b195] transition-colors flex items-center gap-2"
                                >
                                    <link.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{link.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* 相关链接 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-[#8eb69b]">相关链接</h3>
                        <nav className="space-y-2">
                            {externalLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="text-sm text-[#6b9b7a] hover:text-[#f8b195] transition-colors flex items-center gap-1.5"
                                >
                                    {link.name}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            ))}
                        </nav>

                        {/* SEO关键词 - 自然融入的描述 */}
                        <p className="text-xs text-[#8eb69b]/70 pt-2 leading-relaxed">
                            关注咻咻满(XXM)，B站知名唱见、独立音乐人。
                        </p>
                    </div>
                </div>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-white/20" />

            {/* 底部版权区 */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-black text-[#8eb69b]">
                        <a
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#f8b195] transition-colors underline underline-offset-4 decoration-[#f8b195]/30"
                        >
                            鄂ICP备2025100707号-2
                        </a>
                        <span className="hidden md:inline text-[#a5c9b1]">|</span>
                        <span>© {currentYear} 小满虫之家</span>
                    </div>
                </div>

                {/* SEO描述文字 */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#a5c9b1]/50" />
                    <Sparkles className="w-3 h-3 text-[#a5c9b1]" />
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#a5c9b1]/50" />
                </div>
                <p className="text-center text-[10px] text-[#a5c9b1] max-w-2xl mx-auto leading-relaxed">
                    春风拂过青草地，满满歌声暖人心。本站为咻咻满粉丝自建 网站，
                    所有资源版权归原著作权人所有。用音乐记录每一份感动，用热爱传递每一段美好。
                    欢迎关注咻咻满B站直播间，每周固定时间直播，带来精彩歌曲演唱和互动。
                </p>
            </div>
        </footer>
    );
};

export default Footer;
