import React from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Music, Heart, Star, Calendar, MapPin, Mic2, Users, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const XXMPage: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Mic2 size={32} />,
            title: '音乐作品',
            description: '咻咻满拥有丰富的音乐作品，涵盖翻唱、原唱等多种类型，展现独特的声线魅力',
            action: () => navigate('/songs'),
            actionText: '浏览作品'
        },
        {
            icon: <Star size={32} />,
            title: '粉丝二创',
            description: '粉丝们为咻咻满创作了精彩的二创作品，包括绘画、视频、剪辑等多种形式',
            action: () => navigate('/fansDIY'),
            actionText: '查看二创'
        },
        {
            icon: <Heart size={32} />,
            title: '精彩图集',
            description: '汇集咻咻满的活动照片、生活瞬间和粉丝创作，记录每一个精彩时刻',
            action: () => navigate('/gallery'),
            actionText: '浏览图集'
        },
        {
            icon: <Play size={32} />,
            title: '直播记录',
            description: '咻咻满的直播回放和精彩剪辑，不错过任何一场精彩演出',
            action: () => navigate('/live'),
            actionText: '查看直播'
        },
    ];

    const stats = [
        { icon: <Music size={24} />, label: '歌曲作品', value: '100+' },
        { icon: <Users size={24} />, label: '粉丝数量', value: '10万+' },
        { icon: <Play size={24} />, label: '演出记录', value: '1000+' },
        { icon: <Heart size={24} />, label: '二创作品', value: '500+' },
    ];

    return (
        <>
            <Helmet>
                <title>咻咻满专题 - 独立音乐人、音乐主播 | 小满虫之家</title>
                <meta name="description" content="咻咻满专题页面，全面介绍咻咻满的音乐作品、演出记录、粉丝二创和精彩图集。了解咻咻满的个人故事、艺术理念和成长历程。" />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f8b195]/10 via-transparent to-[#8eb69b]/10"></div>
                    <div className="max-w-6xl mx-auto relative">
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-lg">
                                <Sparkles size={20} className="fill-[#f8b195]" />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Special Feature</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-[#4a3728] tracking-tighter">
                                咻咻满
                            </h1>

                            <p className="text-xl md:text-2xl text-[#8eb69b] font-bold max-w-3xl mx-auto leading-relaxed">
                                独立音乐人、音乐主播，以其独特的戏韵和治愈声线著称。<br />
                                在这里，全面了解咻咻满的音乐世界和精彩人生。
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/60 p-6 rounded-3xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                                    >
                                        <div className="text-[#f8b195] mb-3 flex justify-center">{stat.icon}</div>
                                        <div className="text-3xl font-black text-[#4a3728] mb-2">{stat.value}</div>
                                        <div className="text-xs text-[#8eb69b] font-black uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="py-20 px-4 bg-white/40">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">
                                        关于咻咻满
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-[#f8b195] to-[#8eb69b] rounded-full"></div>
                                </div>

                                <div className="space-y-6 text-[#4a3728] font-bold text-lg leading-relaxed">
                                    <p>
                                        咻咻满，独立音乐人、音乐主播，以其独特的戏韵和治愈声线著称。
                                        生日是3月19日，双鱼座，栖息在森林深处的树洞。
                                    </p>
                                    <p>
                                        咻咻满的职业包括歌手、音乐主播、唱见，声线特色包括戏韵、治愈、张力、灵动。
                                        每一首歌都是咻咻满用心灵演绎的作品，每一次演唱都充满了情感和力量。
                                    </p>
                                    <p>
                                        作为一名独立音乐人，咻咻满始终坚持原创，用音乐表达内心的世界。
                                        作为音乐主播，咻咻满的声音多变而富有表现力，能够驾驭各种角色的声音。
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#8eb69b] font-black text-sm border border-[#8eb69b]/20">
                                        <Calendar size={16} />
                                        <span>生日：3月19日</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#8eb69b] font-black text-sm border border-[#8eb69b]/20">
                                        <MapPin size={16} />
                                        <span>栖息地：森林深处的树洞</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#8eb69b] font-black text-sm border border-[#8eb69b]/20">
                                        <Star size={16} />
                                        <span>星座：双鱼座</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-[#f8b195]/20 to-[#8eb69b]/20 rounded-[4rem] border-4 border-white shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="w-32 h-32 bg-gradient-to-br from-[#f8b195] to-[#8eb69b] rounded-full mx-auto flex items-center justify-center shadow-xl">
                                                <Music size={48} className="text-white" />
                                            </div>
                                            <p className="text-2xl font-black text-[#4a3728]">咻咻满</p>
                                            <p className="text-[#8eb69b] font-bold">独立音乐人、音乐主播</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">
                                咻咻满的世界
                            </h2>
                            <p className="text-[#8eb69b] font-bold text-lg">
                                探索咻咻满的精彩内容，感受音乐的魅力
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white/60 p-8 rounded-[3rem] border-2 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#f8b195] to-[#8eb69b] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                                            {feature.icon}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <h3 className="text-2xl font-black text-[#4a3728]">{feature.title}</h3>
                                            <p className="text-[#8eb69b] font-bold text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                            <button
                                                onClick={feature.action}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                                            >
                                                <span>{feature.actionText}</span>
                                                <Play size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 bg-white/40">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-[#f8b195]/20 to-[#8eb69b]/20 rounded-[5rem] p-12 border-2 border-[#f8b195]/20 text-center space-y-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-lg">
                                <Heart size={20} className="fill-[#f8b195]" />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Join Us</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">
                                成为小满虫的一员
                            </h2>

                            <p className="text-[#8eb69b] font-bold text-lg max-w-2xl mx-auto">
                                关注咻咻满，一起在音乐的森林里，与每一份热爱重逢。
                                在这里，你将发现更多精彩内容，结识志同道合的朋友。
                            </p>

                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                <button
                                    onClick={() => navigate('/songs')}
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    <Music size={24} />
                                    <span>浏览歌曲</span>
                                </button>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#8eb69b] rounded-full font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-[#8eb69b]/20"
                                >
                                    <Star size={24} />
                                    <span>了解更多</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default XXMPage;