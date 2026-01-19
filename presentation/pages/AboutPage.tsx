import React from 'react';
import {
    Heart, Star, Share2, ExternalLink, Sparkles, Mic2, Users,
    Calendar, MapPin, Coffee, Feather, Music, Award, Camera,
    Waves
} from 'lucide-react';
import VideoModal from '../components/common/VideoModal';

const AboutPage: React.FC = () => {
    const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

    // 基础信息
    const bioInfo = [
        { icon: <Calendar size={18} />, label: '生日', value: '03月19日' },
        { icon: <Star size={18} />, label: '星座', value: '双鱼座' },
        { icon: <MapPin size={18} />, label: '栖息地', value: '森林深处的树洞' },
        { icon: <Coffee size={18} />, label: '爱好', value: '唱歌、集星、发呆' },
    ];

    // 声线特色
    const voiceColors = [
        { name: '戏韵', desc: '惊艳全场的戏腔，丝滑转换', color: 'bg-red-50 text-red-500' },
        { name: '治愈', desc: '温柔如水的低语，抚平焦虑', color: 'bg-green-50 text-green-600' },
        { name: '张力', desc: '爆发力十足的摇滚与情感', color: 'bg-orange-50 text-orange-500' },
        { name: '灵动', desc: '俏皮可爱的萝莉与少年感', color: 'bg-blue-50 text-blue-500' },
    ];

    const milestones = [
        { year: '2021', event: '初入森林，第一封信件寄出。', icon: <Feather size={16} /> },
        { year: '2022', event: '声线被更多人听见，开始探索多变曲风。', icon: <Waves size={16} /> },
        { year: '2023', event: '个人原创单曲突破10首，开启创作高峰期。', icon: <Heart size={16} /> },
        { year: '2024', event: '森林社群日益壮大，成为全能型独立音乐人。', icon: <Award size={16} /> },
    ];

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
                                src="https://picsum.photos/seed/xxm_hero/800/800"
                                alt="XXM Hero"
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
                                咻咻满 <span className="text-[#f8b195] italic font-serif text-4xl md:text-5xl ml-2">ManMan</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-[#8eb69b] font-bold leading-relaxed">" 所有的歌声，都是藏在时光信封里的真心。 "</p>
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
                    <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">声线实验室</h2>
                    <p className="text-[#8eb69b] font-bold text-sm tracking-widest uppercase">The Multi-Voice Spectrum</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {voiceColors.map((v, i) => (
                        <div key={i} className="group p-8 bg-white/50 rounded-[3rem] border-2 border-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                            <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner group-hover:rotate-12 transition-transform`}><Mic2 size={24} /></div>
                            <h3 className="text-xl font-black text-[#4a3728] mb-3">{v.name}</h3>
                            <p className="text-[#8eb69b] font-bold text-xs leading-relaxed opacity-80">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Milestones */}
            <section className="space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">森林成长纪</h2>
                    <p className="text-[#8eb69b] font-bold">一路同行，记录关于梦想的每一个瞬间</p>
                </div>
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#8eb69b]/10 -translate-x-1/2 hidden md:block"></div>
                    <div className="space-y-12 relative">
                        {milestones.map((m, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="flex-1 text-center md:text-right w-full">
                                    {i % 2 === 0 && (
                                        <div className="space-y-2 bg-white/40 p-6 rounded-3xl border border-white">
                                            <span className="text-3xl font-black text-[#f8b195] font-serif">{m.year}</span>
                                            <p className="text-[#4a3728] font-bold text-sm">{m.event}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#f8b195] border-2 border-[#f8b195]/20 z-10 shrink-0">{m.icon}</div>
                                <div className="flex-1 text-center md:text-left w-full">
                                    {i % 2 !== 0 && (
                                        <div className="space-y-2 bg-white/40 p-6 rounded-3xl border border-white">
                                            <span className="text-3xl font-black text-[#f8b195] font-serif">{m.year}</span>
                                            <p className="text-[#4a3728] font-bold text-sm">{m.event}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Social Links */}
            <section className="p-10 md:p-20 bg-white/40 rounded-[5rem] border-4 border-white shadow-2xl text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-[#4a3728]">森林的邀请</h2>
                    <p className="text-[#8eb69b] font-bold text-lg max-w-xl mx-auto">关注满老师，在音乐的森林里，与每一份热爱重逢。</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {[
                        { name: 'Bilibili', color: 'bg-[#00aeec]', icon: <Waves size={20} />, url: 'https://space.bilibili.com/343272' },
                        { name: '新浪微博', color: 'bg-[#e6162d]', icon: <Camera size={20} />, url: '#' },
                        { name: '网易云音乐', color: 'bg-[#ff1d12]', icon: <Music size={20} />, url: '#' },
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

            <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
        </div>
    );
};

export default AboutPage;