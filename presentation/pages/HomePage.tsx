import React from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Music, Heart, ArrowRight, Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>咻咻满粉丝网站 - 小满虫之家 | 独立音乐人、音乐主播</title>
                <meta name="description" content="欢迎来到咻咻满非官方粉丝站！这里汇集了咻咻满的所有歌曲作品、演出记录、粉丝二创和精彩图集。关注咻咻满，感受治愈系的歌声和戏韵魅力。" />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f8b195]/10 via-transparent to-[#8eb69b]/10"></div>
                    <div className="max-w-6xl mx-auto relative">
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-lg">
                                <Sparkles size={20} className="fill-[#f8b195]" />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Official Fan Site</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-[#4a3728] tracking-tighter">
                                欢迎来到<br />
                                <span className="text-[#f8b195]">咻咻满</span>的粉丝站
                            </h1>

                            <p className="text-xl md:text-2xl text-[#8eb69b] font-bold max-w-3xl mx-auto leading-relaxed">
                                咻咻满，独立音乐人、音乐主播，以其独特的戏韵和治愈声线著称。
                                在这里，你可以探索咻咻满的所有歌曲作品、演出记录和粉丝二创。
                            </p>

                            <div className="flex flex-wrap justify-center gap-4 pt-8">
                                <button
                                    onClick={() => navigate('/songs')}
                                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    <Music size={20} />
                                    <span>浏览歌曲</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => navigate('/about')}
                                    className="group flex items-center gap-3 px-8 py-4 bg-white text-[#8eb69b] rounded-full font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-[#8eb69b]/20"
                                >
                                    <Heart size={20} />
                                    <span>了解咻咻满</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 bg-white/40">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">
                                探索咻咻满的世界
                            </h2>
                            <p className="text-[#8eb69b] font-bold text-lg">
                                发现更多精彩内容，感受音乐的治愈力量
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div
                                onClick={() => navigate('/songs')}
                                className="group cursor-pointer bg-white/60 p-8 rounded-[3rem] border-2 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-[#f8b195] to-[#f67280] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    <Music size={36} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#4a3728] mb-3">歌曲作品</h3>
                                <p className="text-[#8eb69b] font-bold text-sm">
                                    浏览咻咻满的所有翻唱、原唱和演出记录，感受独特的音乐魅力
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div
                                onClick={() => navigate('/gallery')}
                                className="group cursor-pointer bg-white/60 p-8 rounded-[3rem] border-2 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-[#8eb69b] to-[#6a9c77] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    <Star size={36} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#4a3728] mb-3">精彩图集</h3>
                                <p className="text-[#8eb69b] font-bold text-sm">
                                    汇集粉丝二创作品、活动照片和生活瞬间，记录美好时光
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div
                                onClick={() => navigate('/fansDIY')}
                                className="group cursor-pointer bg-white/60 p-8 rounded-[3rem] border-2 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-[#f8b195]/80 to-[#8eb69b] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    <Heart size={36} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#4a3728] mb-3">精选二创</h3>
                                <p className="text-[#8eb69b] font-bold text-sm">
                                    探索粉丝创作的精彩二创作品，每一份热爱都在闪闪发光
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-[#f8b195]/20 to-[#8eb69b]/20 rounded-[5rem] p-12 border-2 border-[#f8b195]/20 text-center space-y-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-lg">
                                <Play size={20} className="fill-[#f8b195]" />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Start Exploring</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">
                                准备好探索了吗？
                            </h2>

                            <p className="text-[#8eb69b] font-bold text-lg max-w-2xl mx-auto">
                                咻咻满的音乐世界等待着你，点击下方按钮开始你的探索之旅
                            </p>

                            <button
                                onClick={() => navigate('/songs')}
                                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <span>立即开始</span>
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;