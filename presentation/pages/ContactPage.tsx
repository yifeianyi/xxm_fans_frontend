import React from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Globe, Heart, Music, Users, MessageCircle, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>联系我们 - 小满虫之家 | 咻咻满粉丝站</title>
                <meta name="description" content="联系小满虫之家，提供反馈建议、合作洽谈或投稿分享。欢迎小满虫们与我们联系交流！" />
                <meta name="keywords" content="联系咻咻满粉丝站, 小满虫之家联系方式, 粉丝站反馈, 投稿联系" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-transparent to-emerald-50/30">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* 页面标题 */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-[#3d405b] mb-4">
                            联系我们
                        </h1>
                        <p className="text-lg text-[#52566e] max-w-2xl mx-auto leading-relaxed">
                            欢迎小满虫们与我们联系交流！无论是反馈建议、合作洽谈，还是投稿分享，我们都非常期待听到您的声音。
                        </p>
                    </div>

                    {/* 主要内容区 */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e3ebe3]/50 p-8">
                        {/* 联系说明 */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-[#3d405b] mb-6 flex items-center gap-3">
                                <Heart className="w-6 h-6 text-[#e07a5f]" />
                                关于联系
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <p className="text-[#52566e] leading-relaxed">
                                        <strong className="text-[#c45a42]">小满虫之家</strong> 是咻咻满粉丝的聚集地，我们致力于收集整理咻咻满的相关资料和作品。
                                    </p>
                                    <p className="text-[#52566e] leading-relaxed">
                                        本站为<strong className="text-[#c45a42]"> 粉丝站</strong>，所有内容仅供粉丝交流学习使用。
                                    </p>
                                </div>
                                <div className="bg-[#fce8e2]/50 rounded-xl p-4 border border-[#e3ebe3]">
                                    <h3 className="font-semibold text-[#3d405b] mb-2 flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-[#e07a5f]" />
                                        联系须知
                                    </h3>
                                    <ul className="text-sm text-[#52566e] space-y-1">
                                        <li>• 我们会在3-5个工作日内回复</li>
                                        <li>• 投稿请注明来源和作者</li>
                                        <li>• 合作请提供详细方案</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 联系方式 */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-[#3d405b] mb-6 flex items-center gap-3">
                                <Send className="w-6 h-6 text-emerald-500" />
                                联系方式
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                        <Mail className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h3 className="font-semibold text-[#3d405b] mb-2">邮箱联系</h3>
                                    <p className="text-sm text-[#52566e] mb-3">通过邮箱与我们联系</p>
                                    <a
                                        href="mailto:910002662@qq.com"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                    >
                                        910002662@qq.com
                                    </a>
                                </div>



                                <div className="bg-sky-50/50 rounded-xl p-6 border border-sky-100">
                                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                                        <Globe className="w-6 h-6 text-sky-600" />
                                    </div>
                                    <h3 className="font-semibold text-[#3d405b] mb-2">社交媒体</h3>
                                    <p className="text-sm text-[#52566e] mb-3">关注我们的动态</p>
                                    <div className="flex gap-2">
                                        <a href="https://space.bilibili.com/1384705804" target="_blank" rel="noopener noreferrer" className="text-sky-600 text-sm hover:text-sky-700">
                                            B站
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 投稿与合作 */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-[#3d405b] mb-6 flex items-center gap-3">
                                <Music className="w-6 h-6 text-amber-500" />
                                投稿与合作
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-100">
                                    <h3 className="font-semibold text-[#3d405b] mb-3">📤 内容投稿</h3>
                                    <p className="text-sm text-[#52566e] mb-3">
                                        欢迎投稿咻咻满的相关内容，包括但不限于：歌曲翻唱、二创作品、活动照片、表情包等。
                                    </p>
                                    <div className="text-xs text-[#6b6f85] space-y-1">
                                        <p>• 投稿请注明来源和作者信息</p>
                                        <p>• 图片/视频请提供高清版本</p>
                                        <p>• 我们会在审核后发布到相应栏目</p>
                                    </div>
                                </div>

                                <div className="bg-violet-50/50 rounded-xl p-6 border border-violet-100">
                                    <h3 className="font-semibold text-[#3d405b] mb-3">🤝 合作洽谈</h3>
                                    <p className="text-sm text-[#52566e] mb-3">
                                        我们欢迎各类合作，包括网站技术合作、内容合作等。
                                    </p>
                                    <div className="text-xs text-[#6b6f85] space-y-1">
                                        <p>• 请提供详细的合作方案</p>
                                        <p>• 说明合作目的和预期效果</p>
                                        <p>• 我们会认真评估每一个合作请求</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 版权说明 */}
                        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                            <h3 className="font-semibold text-[#3d405b] mb-3 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-[#e07a5f]" />
                                版权与声明
                            </h3>
                            <div className="text-sm text-[#52566e] space-y-2">
                                <p>• 本站为粉丝自建 网站，所有内容仅供粉丝交流学习使用</p>
                                <p>• 所有音视频、图片等素材版权归原作者所有</p>
                                <p>• 如有侵权请联系站长删除，我们会在24小时内处理</p>
                                <p>• 本站不以盈利为目的，所有服务均为免费</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
