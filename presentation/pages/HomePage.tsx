import React from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Music, Heart, ArrowRight, Star, Calendar, Mic2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>咻咻满粉丝网站 - 小满虫之家 | 独立音乐人、音乐主播</title>
                <meta name="description" content="欢迎来到咻咻满非官方粉丝站！这里汇集了咻咻满的所有歌曲作品、演出记录、粉丝二创和精彩图集。关注咻咻满，感受治愈系的歌声和戏韵魅力。" />
            </Helmet>

            <div className="min-h-screen pb-20 overflow-x-hidden">
                {/* Decorative Blobs - 调整为暖色光晕 */}
                <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#f8b195]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10"></div>
                <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#f6d365]/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none -z-10"></div>

                {/* New Hero Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 pt-8 md:pt-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left: Text Content (SEO + Welcome) */}
                        <div className="flex-1 space-y-8 text-center lg:text-left relative z-10">
                            {/* Title Block */}
                            <div className="relative inline-block animate-in slide-in-from-bottom-8 duration-700">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-[#fff4d1] blur-3xl -z-10 rounded-full opacity-60"></div>
                                <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                                    <span className="px-3 py-1 bg-[#fef5f0] text-[#f8b195] text-xs font-black uppercase tracking-[0.2em] rounded-full border border-[#f8b195]/20 shadow-sm transform -rotate-2">
                                        Non-Official Fans Site
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-[#5d4037] tracking-tighter leading-tight drop-shadow-sm">
                                    小满虫之家
                                    <span className="block text-2xl md:text-3xl text-[#f67280] font-serif italic mt-2 tracking-normal">The fans home of Xiuxiuman</span>
                                </h1>
                                {/* Decoration Underline - 改为暖色 */}
                                <div className="hidden lg:block h-3 w-32 bg-[#f8b195]/20 rounded-full mt-4">
                                    <svg viewBox="0 0 100 10" className="w-full h-full opacity-50 text-[#f8b195] fill-current">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </div>
                            </div>

                            {/* SEO Description - 字体颜色由绿变暖褐灰 */}
                            <p className="text-lg md:text-xl text-[#8d6e63] font-bold leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                                这里是独立音乐人、B站主播 <strong className="text-[#5d4037]">咻咻满 (Xiuxiuman)</strong> 的非官方粉丝资料站。
                                <br className="hidden md:block" />
                                收录了满老师的原创单曲、翻唱合集、直播回放录像以及精选粉丝二创作品。
                                记录与分享关于她的每一个治愈瞬间。
                            </p>

                            {/* Tags - 边框和文字改为暖色 */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                                {['音乐人', '古风戏腔', '治愈系', '直播回放', '百大UP主'].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-white/60 rounded-xl text-xs font-black text-[#a1887f] border-2 border-white shadow-sm hover:scale-105 hover:bg-[#fff3e0] hover:text-[#ff7043] transition-all cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Buttons - 暖色渐变按钮 */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                                <button
                                    onClick={() => navigate('/originals')}
                                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-[2rem] font-black shadow-xl hover:shadow-[#f67280]/30 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                                >
                                    <Music size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span>聆听作品</span>
                                </button>
                                <button
                                    onClick={() => navigate('/live')}
                                    className="w-full sm:w-auto px-10 py-5 bg-white text-[#8d6e63] rounded-[2rem] font-black border-2 border-[#8d6e63]/10 hover:border-[#f8b195] hover:text-[#f8b195] transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-100"
                                >
                                    <Calendar size={20} />
                                    <span>直播补档</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: Image (The "Beautiful Picture") */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl mx-auto animate-in zoom-in-95 duration-1000 delay-100">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-8 right-8 w-full h-full bg-[#f8b195] rounded-[4rem] rotate-6 opacity-20 blur-sm"></div>
                            <div className="absolute -top-8 -left-8 w-full h-full bg-[#f6d365] rounded-[4rem] -rotate-6 opacity-20 blur-sm"></div>

                            {/* Main Image Container */}
                            <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden border-8 border-white shadow-[0_40px_80px_-20px_rgba(74,55,40,0.15)] group bg-[#fef5f0]">
                                {/*
                                    替换提示: 请将下方的 src 替换为您想要的咻咻满美图链接
                                    (例如: assets/images/xxm_hero.jpg 或图床链接)
                                */}
                                <img
                                    src="/homepage.webp"
                                    alt="咻咻满"
                                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-[#5d4037] tracking-tighter">
                                探索 <span className="text-[#f67280] italic">Forest</span>
                            </h2>
                            <p className="text-[#8d6e63] font-bold text-lg max-w-md">
                                发现更多精彩内容，在音乐的森林里，与每一份热爱重逢。
                            </p>
                        </div>
                        <div className="h-1 w-full md:w-32 bg-[#f8b195]/20 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                        {/* Card 1 - Music (Coral/Peach) */}
                        <div
                            onClick={() => navigate('/songs')}
                            className="group cursor-pointer relative bg-white/60 p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#f8b195]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#f8b195]/20 transition-colors"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#f8b195] to-[#f67280] rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-[#f8b195]/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    <Music size={32} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-[#5d4037] mb-4">歌曲作品</h3>
                                <p className="text-[#8d6e63] font-bold text-sm leading-relaxed mb-8 flex-1">
                                    这里有满老师的全部翻唱、原唱作品库。支持按风格、语种筛选，还能抽取"盲盒"歌曲。
                                </p>
                                <div className="flex items-center gap-2 text-[#f8b195] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                    View Library <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Gallery (Changed to Warm Yellow/Orange theme) */}
                        <div
                            onClick={() => navigate('/gallery')}
                            className="group cursor-pointer relative bg-white/60 p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#f6d365]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#f6d365]/20 transition-colors"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#f6d365] to-[#fda085] rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-[#f6d365]/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    <Star size={32} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-[#5d4037] mb-4">满の图册</h3>
                                <p className="text-[#8d6e63] font-bold text-sm leading-relaxed mb-8 flex-1">
                                    汇集活动照片、生活瞬间和高清壁纸。每一帧定格，都是藏在时光信封里的绝色。
                                </p>
                                <div className="flex items-center gap-2 text-[#fda085] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all group-hover:text-[#f6d365]">
                                    View Gallery <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Fans (Rose/Pink) */}
                        <div
                            onClick={() => navigate('/fansDIY')}
                            className="group cursor-pointer relative bg-white/60 p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#f67280]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#f67280]/20 transition-colors"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#f67280] to-[#c06c84] rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-[#f67280]/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    <Heart size={32} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-[#5d4037] mb-4">精选二创</h3>
                                <p className="text-[#8d6e63] font-bold text-sm leading-relaxed mb-8 flex-1">
                                    小满虫们的才华展示区。混剪、手书、翻唱，每一份热爱都在这里闪闪发光。
                                </p>
                                <div className="flex items-center gap-2 text-[#f67280] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                    Community <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Teaser / CTA Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="relative rounded-[4rem] overflow-hidden shadow-2xl">
                        {/* Background Art */}
                        <div className="absolute inset-0 bg-[#5d4037]">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#f8b195] to-[#f67280] opacity-90 mix-blend-overlay"></div>
                            <img src="https://picsum.photos/seed/bg_music/1600/600" className="w-full h-full object-cover opacity-20 grayscale mix-blend-luminosity" alt="bg" />
                        </div>

                        <div className="relative z-10 p-12 md:p-24 text-center space-y-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/40 shadow-inner mb-4">
                                <Mic2 size={32} className="text-white" />
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-tight">
                                " 所有的歌声，都是藏在时光信封里的真心。 "
                            </h2>

                            <p className="text-white/80 font-bold text-lg md:text-xl max-w-2xl mx-auto">
                                了解更多关于咻咻满的故事，她的声线特色，以及成长历程。
                            </p>

                            <button
                                onClick={() => navigate('/about')}
                                className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#d84315] rounded-full font-black shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300"
                            >
                                <span>关于她</span>
                                <div className="w-1 h-1 bg-[#d84315] rounded-full"></div>
                                <span className="uppercase text-xs tracking-widest opacity-60">Read Profile</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;