/**
 * 面包屑导航组件
 * 
 * 提升用户体验和SEO内部链接结构
 */
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = '' 
}) => {
  // 结构化数据 - Schema.org BreadcrumbList
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://www.xxm8777.cn/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://www.xxm8777.cn${item.href}` : undefined
      }))
    ]
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 面包屑导航 UI */}
      <nav 
        aria-label="面包屑导航" 
        className={`py-4 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm text-[#8d6e63]">
          {/* 首页 */}
          <li className="flex items-center">
            <a 
              href="/" 
              className="flex items-center gap-1 hover:text-[#e07a5f] transition-colors px-2 py-1 rounded-md hover:bg-white/50"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页</span>
            </a>
          </li>

          {/* 分隔符和后续项 */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-[#c1d9c0] mx-1 flex-shrink-0" />
              {item.href ? (
                <a 
                  href={item.href}
                  className="hover:text-[#e07a5f] transition-colors px-2 py-1 rounded-md hover:bg-white/50"
                >
                  {item.label}
                </a>
              ) : (
                <span 
                  className="text-[#5d4037] font-medium px-2 py-1"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

// 预定义的面包屑配置
export const breadcrumbs = {
  songs: [
    { label: '咻咻满歌曲', href: '/songs' }
  ],
  fansDIY: [
    { label: '满满来信', href: '/fansDIY' }
  ],
  livestream: [
    { label: '咻咻满直播', href: '/live' }
  ],
  gallery: [
    { label: '咻咻满图集', href: '/gallery' }
  ],
  about: [
    { label: '关于咻咻满', href: '/about' }
  ],
  originals: [
    { label: '咻咻满原创作品', href: '/originals' }
  ],
  data: [
    { label: '数据分析', href: '/data' }
  ],
};

export default Breadcrumb;
