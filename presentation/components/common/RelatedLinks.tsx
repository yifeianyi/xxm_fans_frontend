/**
 * 相关推荐链接组件
 * 
 * 增强内部链接结构，提升SEO和用户体验
 */
import React from 'react';
import { ArrowRight, Music, Video, Image, Users } from 'lucide-react';

interface LinkItem {
  title: string;
  href: string;
  desc: string;
  icon: React.ReactNode;
}

interface RelatedLinksProps {
  currentPage?: 'home' | 'songs' | 'fansDIY' | 'live' | 'gallery' | 'about' | 'originals' | 'data';
  className?: string;
}

export const RelatedLinks: React.FC<RelatedLinksProps> = ({ 
  currentPage = 'home',
  className = '' 
}) => {
  // 根据当前页面排除自身，推荐其他页面
  const allLinks: Record<string, LinkItem> = {
    songs: {
      title: '咻咻满歌曲列表',
      href: '/songs',
      desc: '查看咻咻满所有翻唱和原唱歌曲',
      icon: <Music className="w-5 h-5" />
    },
    fansDIY: {
      title: '满满来信 - 粉丝二创',
      href: '/fansDIY',
      desc: '浏览粉丝创作的咻咻满相关作品',
      icon: <Users className="w-5 h-5" />
    },
    live: {
      title: '咻咻满直播日历',
      href: '/live',
      desc: '查看历史直播记录和当日歌切',
      icon: <Video className="w-5 h-5" />
    },
    gallery: {
      title: '咻咻满精彩图集',
      href: '/gallery',
      desc: '浏览咻咻满高清图片和壁纸',
      icon: <Image className="w-5 h-5" />
    },
    about: {
      title: '关于咻咻满',
      href: '/about',
      desc: '了解咻咻满的个人资料和音乐风格',
      icon: <Users className="w-5 h-5" />
    },
    originals: {
      title: '咻咻满原创作品',
      href: '/originals',
      desc: '收听满满来信等原唱歌曲',
      icon: <Music className="w-5 h-5" />
    },
  };

  // 排除当前页面，获取推荐链接
  const recommendedLinks = Object.entries(allLinks)
    .filter(([key]) => {
      // 根据当前页面智能排除
      if (currentPage === 'songs' && key === 'songs') return false;
      if (currentPage === 'fansDIY' && key === 'fansDIY') return false;
      if (currentPage === 'live' && key === 'live') return false;
      if (currentPage === 'gallery' && key === 'gallery') return false;
      if (currentPage === 'about' && key === 'about') return false;
      if (currentPage === 'originals' && key === 'originals') return false;
      return true;
    })
    .slice(0, 3) // 只显示3个
    .map(([, value]) => value);

  if (recommendedLinks.length === 0) return null;

  return (
    <section className={`mt-12 p-6 bg-white/50 rounded-2xl border border-[#c1d9c0]/30 ${className}`}>
      <h3 className="text-lg font-bold text-[#5d4037] mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#e07a5f] rounded-full"></span>
        探索更多咻咻满相关内容
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group p-4 bg-white rounded-xl border border-[#c1d9c0]/30 
                       hover:border-[#e07a5f]/50 hover:shadow-md transition-all
                       flex items-start gap-3"
          >
            <div className="p-2 bg-[#f2f9f1] rounded-lg text-[#81b29a] group-hover:bg-[#e07a5f]/10 group-hover:text-[#e07a5f] transition-colors">
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[#5d4037] group-hover:text-[#e07a5f] transition-colors flex items-center gap-1">
                {link.title}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h4>
              <p className="text-sm text-[#8d6e63] mt-1">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedLinks;
