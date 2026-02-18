import { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: '联系我们 | 小满虫之家',
    description: '如有问题或建议，欢迎联系小满虫之家。',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black text-[#5d4037] mb-8 text-center">
                联系我们
            </h1>
            
            <div className="glass-card rounded-[2rem] p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#f8b195] to-[#f67280] rounded-2xl flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-[#5d4037]">邮件联系</h2>
                        <p className="text-[#6b9b7a]">
                            如有问题或建议，欢迎发送邮件至：
                            <a 
                                href="mailto:contact@xxm8777.cn" 
                                className="text-[#f8b195] hover:underline block mt-1"
                            >
                                contact@xxm8777.cn
                            </a>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#8eb69b] to-[#6b9b7a] rounded-2xl flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-[#5d4037]">社区交流</h2>
                        <p className="text-[#6b9b7a]">
                            加入咻咻满的官方粉丝群，与其他小满虫一起交流：
                            <a 
                                href="https://space.bilibili.com/37754047" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8eb69b] hover:underline block mt-1"
                            >
                                访问B站空间
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#8eb69b]/20">
                    <p className="text-center text-[#6b9b7a] text-sm">
                        我们重视每一条反馈，会尽快回复您的消息。
                    </p>
                </div>
            </div>
        </div>
    );
}
