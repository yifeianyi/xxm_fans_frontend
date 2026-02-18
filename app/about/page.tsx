'use client';

import React, { useEffect, useState } from 'react';
import {
    Heart, Star, Share2, ExternalLink, Sparkles, Mic2,
    Calendar, MapPin, Coffee, Feather, Music, Award, Camera,
    Waves, Flower2, Leaf, Gem
} from 'lucide-react';
import { getSiteSettings, getMilestones, SiteSettings, Milestone } from '@/app/infrastructure/api/siteSettingsService';

export default function AboutPage() {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settings, milestonesData] = await Promise.all([
                    getSiteSettings(),
                    getMilestones(),
                ]);

                setSiteSettings(settings);
                setMilestones(milestonesData);
            } catch (error) {
                console.error('Failed to fetch site settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 基础信息
    const bioInfo = [
        { icon: <Calendar size={18} />, label: '生日', value: siteSettings?.artist_birthday || '03月19日' },
        { icon: <Star size={18} />, label: '星座', value: siteSettings?.artist_constellation || '双鱼座' },
        { icon: <MapPin size={18} />, label: '栖息地', value: siteSettings?.artist_location || '森林深处的树洞' },
        { icon: <Coffee size={18} />, label: '职业', value: siteSettings?.artist_profession?.join('、') || '歌手、音乐主播、唱见' },
    ];

    // 声线特色
    const voiceFeatures = siteSettings?.artist_voice_features || ['戏韵', '治愈', '张力', '灵动'];

    // 颜色配置数组，循环使用
    const colorConfigs = [
        { color: 'bg-red-50 text-red-500', bg: 'bg-red-50', text: 'text-red-500' },
        { color: 'bg-green-50 text-green-600', bg: 'bg-green-50', text: 'text-green-600' },
        { color: 'bg-orange-50 text-orange-500', bg: 'bg-orange-50', text: 'text-orange-500' },
        { color: 'bg-blue-50 text-blue-500', bg: 'bg-blue-50', text: 'text-blue-500' },
        { color: 'bg-purple-50 text-purple-500', bg: 'bg-purple-50', text: 'text-purple-500' },
        { color: 'bg-pink-50 text-pink-500', bg: 'bg-pink-50', text: 'text-pink-500' },
    ];

    // 动态生成声线特色卡片
    const voiceCards = voiceFeatures.map((feature, index) => {
        const colorConfig = colorConfigs[index % colorConfigs.length];
        return {
            name: feature,
            color: colorConfig.color,
        };
    });

    // 里程碑图标映射
    const getMilestoneIcon = (index: number) => {
        const icons = [<Feather size={16} />, <Waves size={16} />, <Heart size={16} />, <Award size={16} />];
        return icons[index % icons.length];
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8b195]"></div>
                    <p className="mt-4 text-[#8eb69b] font-bold">加载中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-24 animate-in fade-in duration-1000">
            {/* 1. Hero Header */}
            <section className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8b195]/20 to-transparent rounded-[4rem] -rotate-1"></div>
                <div className="relative flex flex-col lg:flex-row items-center gap-16 p-10 lg:p-20 bg-white/40 rounded-[4rem] border-4 border-white shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="relative shrink-0">
                        <div className="w-64 h-64 md:w-80 md:h-80 relative z-10">
                            <div className="absolute inset-0 bg-[#f8b195] rounded-[4rem] rotate-3 shadow-lg"></div>
                            <img
                                src={siteSettings?.artist_avatar_url || "https://picsum.photos/seed/xxm_hero/800/800"}
                                alt={siteSettings?.artist_name || "XXM Hero"}
                                className="absolute inset-0 w-full h-full object-cover rounded-[4rem] border-4 border-white -rotate-3 hover:rotate-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-white rounded-full text-[#f8b195] text-[10px] font-black uppercase tracking-[0.4em] border border-[#f8b195]/10">
                                <Sparkles size={14} className="fill-[#f8b195]" />
                                Independent Vocalist
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-[#4a3728] tracking-tighter">
                                {siteSettings?.artist_name || '咻咻满'} <span className="text-[#f8b195] italic font-serif text-4xl md:text-5xl ml-2">ManMan</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-[#8eb69b] font-bold leading-relaxed">&ldquo; 所有的歌声，都是藏在时光信封里的真心。 &rdquo;</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                            {bioInfo.map((item, idx) => (
                                <div key={idx} className="bg-white/60 p-4 rounded-3xl border border-white shadow-sm text-center transition-all hover:bg-white">
                                    <div className="text-[#f8b195] mb-2 flex justify-center">{item.icon}</div>
                                    <div className="text-[10px] text-[#8eb69b] font-black uppercase tracking-widest mb-1">{item.label}</div>
                                    <div className="text-sm font-black text-[#4a3728]">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Voice Spectrum */}
            <section className="space-y-12">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Mic2 className="w-6 h-6 text-[#f8b195] animate-bounce" />
                        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <Music className="w-6 h-6 text-[#8eb69b] animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">满の声线</h2>
                    <p className="text-[#8eb69b] font-bold text-sm tracking-widest uppercase">The Multi-Voice Spectrum</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f8b195]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#f8b195]"></div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f8b195]"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {voiceCards.map((v, i) => (
                        <div key={i} className="group p-8 bg-white/50 rounded-[3rem] border-2 border-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                            <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner group-hover:rotate-12 transition-transform`}><Mic2 size={24} /></div>
                            <h3 className="text-xl font-black text-[#4a3728] mb-3">{v.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Milestones */}
            <section className="space-y-12">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Calendar className="w-6 h-6 text-[#f8b195] animate-bounce" />
                        <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <Heart className="w-6 h-6 text-[#f67280] animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">满の时刻</h2>
                    <p className="text-[#8eb69b] font-bold">一路同行，记录关于梦想的每一个瞬间</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f8b195]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#f8b195]"></div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f8b195]"></div>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#8eb69b]/10 -translate-x-1/2 hidden md:block"></div>
                    <div className="space-y-12 relative">
                        {milestones
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((m, i) => (
                                <div key={m.id} className="flex items-center gap-8">
                                    <div className={`w-1/2 ${i % 2 === 0 ? 'text-right pr-8' : ''}`}>
                                        {i % 2 === 0 && (
                                            <div className="space-y-2 bg-white/40 p-6 rounded-3xl border border-white inline-block">
                                                <span className="text-3xl font-black text-[#f8b195] font-serif">
                                                    {new Date(m.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                                <p className="text-[#4a3728] font-bold text-sm">{m.description}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#f8b195] border-2 border-[#f8b195]/20 z-10 shrink-0 -mx-6">{getMilestoneIcon(i)}</div>
                                    <div className={`w-1/2 ${i % 2 !== 0 ? 'text-left pl-8' : ''}`}>
                                        {i % 2 !== 0 && (
                                            <div className="space-y-2 bg-white/40 p-6 rounded-3xl border border-white inline-block">
                                                <span className="text-3xl font-black text-[#f8b195] font-serif">
                                                    {new Date(m.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                                <p className="text-[#4a3728] font-bold text-sm">{m.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* 4. Social Links */}
            <section className="p-10 md:p-20 bg-white/40 rounded-[5rem] border-4 border-white shadow-2xl text-center space-y-12 relative overflow-hidden">
                {/* 角落装饰 */}
                <div className="absolute top-8 left-8">
                    <Flower2 className="w-8 h-8 text-[#8eb69b]/30 animate-pulse" />
                </div>
                <div className="absolute top-8 right-8">
                    <Leaf className="w-8 h-8 text-[#f8b195]/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute bottom-8 left-8">
                    <Gem className="w-6 h-6 text-pink-300/30 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <div className="absolute bottom-8 right-8">
                    <Sparkles className="w-8 h-8 text-yellow-400/30 animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Share2 className="w-6 h-6 text-[#f8b195] animate-bounce" />
                        <h2 className="text-4xl font-black text-[#4a3728]">满の账号</h2>
                        <ExternalLink className="w-6 h-6 text-[#8eb69b] animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <p className="text-[#8eb69b] font-bold text-lg max-w-xl mx-auto">关注满老师，在音乐的森林里，与每一份热爱重逢。</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {[
                        { name: 'Bilibili', color: 'bg-[#00aeec]', icon: <Waves size={20} />, url: siteSettings?.bilibili_url || 'https://space.bilibili.com/343272' },
                        { name: '新浪微博', color: 'bg-[#e6162d]', icon: <Camera size={20} />, url: siteSettings?.weibo_url || '#' },
                        { name: '网易云音乐', color: 'bg-[#ff1d12]', icon: <Music size={20} />, url: siteSettings?.netease_music_url || '#' },
                        { name: 'YouTube', color: 'bg-[#ff0000]', icon: <ExternalLink size={20} />, url: siteSettings?.youtube_url || '#' },
                        { name: 'QQ音乐', color: 'bg-[#31c27c]', icon: <Music size={20} />, url: siteSettings?.qq_music_url || '#' },
                        { name: '小红书', color: 'bg-[#ff2442]', icon: <Heart size={20} />, url: siteSettings?.xiaohongshu_url || '#' },
                        { name: '抖音', color: 'bg-[#000000]', icon: <Sparkles size={20} />, url: siteSettings?.douyin_url || '#' },
                    ].map((s, i) => (
                        <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`group flex items-center gap-4 px-10 py-5 ${s.color} text-white rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all duration-300`}
                        >
                            <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">{s.icon}</div>
                            <div className="text-left">
                                <div className="text-[10px] opacity-70 uppercase tracking-widest font-black">Official</div>
                                <div className="text-lg">{s.name}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
