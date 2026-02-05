/**
 * SEO 组件 - 统一的搜索引擎优化配置
 * 
 * 针对"咻咻满"关键词优化
 */
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishDate?: string;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = '小满虫之家 - 咻咻满粉丝站',
  description = '咻咻满粉丝站，收录咻咻满所有歌曲作品、演出记录、粉丝二创。关注独立音乐人咻咻满，在这里发现更多精彩内容。',
  keywords = [],
  image = 'https://www.xxm8777.cn/og-image.jpg',
  url = 'https://www.xxm8777.cn',
  type = 'website',
  author = '咻咻满粉丝',
  publishDate,
  noindex = false,
}) => {
  // 确保标题包含"咻咻满"
  const fullTitle = title.includes('咻咻满') 
    ? title 
    : `${title} | 咻咻满粉丝站`;
  
  // 默认关键词 + 传入关键词，去重
  const defaultKeywords = ['咻咻满', '小满虫之家', 'XXM', '满满来信'];
  const allKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(',')} />
      <meta name="author" content={author} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noindex 
          ? 'noindex, nofollow' 
          : 'index, follow, max-image-preview:large, max-snippet:-1'
        } 
      />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="小满虫之家 - 咻咻满粉丝站" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 文章特定 */}
      {type === 'article' && publishDate && (
        <>
          <meta property="article:published_time" content={publishDate} />
          <meta property="article:author" content={author} />
        </>
      )}
      
      {/* Canonical URL - 防止重复内容 */}
      <link rel="canonical" href={url} />
      
      {/* 移动端优化 */}
      <meta name="theme-color" content="#8eb69b" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="咻咻满粉丝站" />
    </Helmet>
  );
};

// ========== 页面特定的 SEO 配置 ==========

export const HomePageSEO = () => (
  <SEO
    title="小满虫之家 - 咻咻满粉丝站 | 咻咻满歌曲合集、二创作品"
    description="欢迎来到咻咻满非官方粉丝站！这里汇集了咻咻满的所有歌曲作品、演出记录、粉丝二创和精彩图集。关注咻咻满，感受治愈系的歌声和戏韵魅力。"
    keywords={['咻咻满', '咻咻满歌曲', '满满来信', '咻咻满二创', '咻咻满粉丝站', '咻咻满直播']}
    url="https://www.xxm8777.cn/"
  />
);

export const SongsPageSEO = ({ query = '' }: { query?: string }) => (
  <SEO
    title={query 
      ? `"${query}"相关咻咻满歌曲 | 搜索结果 - 小满虫之家`
      : '咻咻满歌曲列表 | 翻唱合集 - 小满虫之家'
    }
    description="咻咻满歌曲完整列表，包含翻唱作品、原唱歌曲、表演记录。按曲风、语言筛选，快速找到你想听的咻咻满歌曲。"
    keywords={['咻咻满歌曲', '咻咻满翻唱', '满满来信歌曲', '咻咻满歌单', '咻咻满演唱']}
    url="https://www.xxm8777.cn/songs"
  />
);

export const FansDIYPageSEO = ({ collectionName = '' }: { collectionName?: string }) => (
  <SEO
    title={collectionName 
      ? `${collectionName} | 满满来信 - 咻咻满粉丝二创`
      : '满满来信 | 咻咻满粉丝二创作品合集'
    }
    description="满满来信 - 咻咻满粉丝二创作品展示平台。收录粉丝制作的咻咻满相关视频、图文、音乐等精彩二创内容。"
    keywords={['满满来信', '咻咻满二创', '咻咻满粉丝作品', '咻咻满剪辑', '咻咻满同人']}
    url="https://www.xxm8777.cn/fansDIY"
  />
);

export const LivestreamPageSEO = ({ date = '' }: { date?: string }) => (
  <SEO
    title={date
      ? `咻咻满${date}直播回放 | 直播日历 - 小满虫之家`
      : '咻咻满直播回放 | 直播日历 - 小满虫之家'
    }
    description="咻咻满直播回放日历，查看历史直播记录、当日歌切、精彩瞬间。B站直播间343272。"
    keywords={['咻咻满直播', '咻咻满回放', '满满直播', '343272', '咻咻满歌切']}
    url="https://www.xxm8777.cn/live"
  />
);

export const GalleryPageSEO = ({ galleryName = '' }: { galleryName?: string }) => (
  <SEO
    title={galleryName
      ? `${galleryName} | 咻咻满图集 - 小满虫之家`
      : '咻咻满图集 | 精彩瞬间 - 小满虫之家'
    }
    description="咻咻满精彩图集，收录直播截图、活动照片、粉丝创作等高清图片。记录咻咻满的美好瞬间。"
    keywords={['咻咻满图集', '咻咻满照片', '满满图片', '咻咻满壁纸', '咻咻满头像']}
    url="https://www.xxm8777.cn/gallery"
  />
);

export const AboutPageSEO = () => (
  <SEO
    title="关于咻咻满 | 歌手资料、简介 - 小满虫之家"
    description="了解咻咻满，独立音乐人、B站主播。个人简介、音乐风格、代表作品、粉丝互动等信息。"
    keywords={['咻咻满资料', '咻咻满简介', '咻咻满是谁', '满满个人信息', '咻咻满介绍']}
    url="https://www.xxm8777.cn/about"
  />
);

export const OriginalsPageSEO = () => (
  <SEO
    title="咻咻满原创作品 | 满满来信原唱 - 小满虫之家"
    description="咻咻满原创歌曲合集，收录满满来信、狐狸霞、破天长歌等咻咻满原唱作品。"
    keywords={['咻咻满原创', '满满来信', '咻咻满原唱', '咻咻满作品', 'XXM音乐']}
    url="https://www.xxm8777.cn/originals"
  />
);

export const DataAnalysisPageSEO = () => (
  <SEO
    title="咻咻满数据分析 | 粉丝增长、作品统计 - 小满虫之家"
    description="咻咻满数据分析，查看粉丝增长趋势、作品播放量统计、B站直播间数据等。"
    keywords={['咻咻满数据', '咻咻满粉丝', '满满统计', '咻咻满分析']}
    url="https://www.xxm8777.cn/data"
  />
);

export default SEO;
