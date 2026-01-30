import React from 'react';
import { Helmet } from 'react-helmet';
import { Clock, Sparkles } from 'lucide-react';

interface ComingSoonPageProps {
    title?: string;
    description?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
    title = "敬请期待",
    description = "精彩内容正在筹备中，敬请期待..."
}) => {
    return (
        <>
            <Helmet>
                <title>{title} - 小满虫之家</title>
                <meta name="description" content={description} />
            </Helmet>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
                <div className="text-center space-y-8 animate-in fade-in duration-1000">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#f8b195]/20 rounded-[4rem] -rotate-3"></div>
                        <div className="relative p-12 md:p-20 bg-white/40 rounded-[4rem] border-4 border-white shadow-2xl backdrop-blur-xl">
                            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 bg-[#f8b195]/10 rounded-3xl flex items-center justify-center">
                                <Clock className="w-12 h-12 md:w-16 md:h-16 text-[#f8b195] animate-pulse" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#4a3728] tracking-tighter mb-6">
                                {title}
                            </h1>
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <Sparkles size={16} className="text-[#f8b195] fill-[#f8b195]" />
                                <p className="text-lg md:text-xl text-[#8eb69b] font-bold">
                                    {description}
                                </p>
                                <Sparkles size={16} className="text-[#f8b195] fill-[#f8b195]" />
                            </div>
                            <div className="inline-block px-8 py-3 bg-[#8eb69b]/10 rounded-full border-2 border-[#8eb69b]/20">
                                <span className="text-sm text-[#8eb69b] font-black tracking-wider uppercase">
                                    Stay Tuned
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ComingSoonPage;