import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Play, Heart, Sparkles, Palette, Star, Wand2, Paintbrush } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fanDIYService } from '../../infrastructure/api';
import { FanWork, FanCollection } from '../../domain/types';
import { Loading } from '../components/common/Loading';
import VideoModal from '../components/common/VideoModal';

// 标题装饰组件
const TitleDecoration: React.FC = () => {
    return (
        <div className="flex items-center gap-3">
            <Palette className="w-7 h-7 text-pink-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <Heart className="w-6 h-6 text-red-400 animate-pulse fill-red-400" />
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            <Wand2 className="w-6 h-6 text-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Paintbrush className="w-7 h-7 text-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
    );
};

const FansDIYPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [collections, setCollections] = useState<FanCollection[]>([]);
  const [works, setWorks] = useState<FanWork[]>([]);
  const [selectedCol, setSelectedCol] = useState<string>(collectionId || 'all');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 根据URL参数设置初始分类
  useEffect(() => {
    if (collectionId) {
      setSelectedCol(collectionId);
    } else {
      setSelectedCol('all');
    }
  }, [collectionId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [colsResult, worksResult] = await Promise.all([
          fanDIYService.getCollections({ limit: 20 }),
          fanDIYService.getWorks({ limit: 100 })
        ]);
        if (colsResult.data) setCollections(colsResult.data.results);
        if (worksResult.data) setWorks(worksResult.data.results);
        
        if (colsResult.error) console.error('获取合集失败:', colsResult.error);
        if (worksResult.error) console.error('获取作品失败:', worksResult.error);
      } catch (error) {
        console.error('数据加载失败:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 分类切换时更新URL
  const handleCollectionChange = (newCol: string) => {
    setSelectedCol(newCol);
    if (newCol !== 'all') {
      navigate(`/fansDIY/${newCol}`, { replace: true });
    } else {
      navigate('/fansDIY', { replace: true });
    }
  };

  const filteredWorks = selectedCol === 'all' 
    ? works 
    : works.filter(w => w.collectionId === selectedCol);

  // 获取当前选中的合集名称用于SEO
  const currentCollection = collections.find(c => c.id === selectedCol);
  const getPageTitle = () => {
    if (currentCollection) {
      return `${currentCollection.name} - 咻咻满二创作品 | 小满虫之家`;
    }
    return '咻咻满精选二创 - 粉丝二创作品展示 | 小满虫之家';
  };

  const getPageDescription = () => {
    if (currentCollection) {
      return `浏览咻咻满${currentCollection.name}相关的二创作品。${currentCollection.description || '每一份热爱都在这里闪闪发光，记录属于小满虫们的精彩时刻。'}`;
    }
    return '浏览咻咻满粉丝创作的二创作品，包括绘画、视频、剪辑等。每一份热爱都在这里闪闪发光，记录属于小满虫们的精彩时刻。';
  };

  // 生成结构化数据
  const getStructuredData = () => {
    const baseUrl = 'https://www.xxm8777.cn';
    
    if (currentCollection) {
      // CollectionPage 结构化数据
      return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': `${currentCollection.name} - 咻咻满二创作品`,
        'description': getPageDescription(),
        'url': `${baseUrl}/fansDIY/${currentCollection.id}`,
        'isPartOf': {
          '@type': 'WebSite',
          'name': '小满虫之家',
          'url': baseUrl
        },
        'about': {
          '@type': 'Person',
          'name': '咻咻满',
          'alternateName': 'XXM'
        },
        'mainEntity': {
          '@type': 'ItemList',
          'itemListElement': filteredWorks.map((work, index) => ({
            '@type': 'VideoObject',
            'position': index + 1,
            'name': work.title,
            'description': work.note || '',
            'thumbnailUrl': work.coverThumbnailUrl || work.cover,
            'uploadDate': work.createdAt || new Date().toISOString(),
            'author': {
              '@type': 'Person',
              'name': work.author
            }
          }))
        }
      };
    } else {
      // 普通页面结构化数据
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': '咻咻满精选二创 - 粉丝二创作品展示',
        'description': getPageDescription(),
        'url': `${baseUrl}/fansDIY`,
        'isPartOf': {
          '@type': 'WebSite',
          'name': '小满虫之家',
          'url': baseUrl
        },
        'about': {
          '@type': 'Person',
          'name': '咻咻满',
          'alternateName': 'XXM'
        },
        'mainEntity': {
          '@type': 'ItemList',
          'itemListElement': filteredWorks.slice(0, 10).map((work, index) => ({
            '@type': 'VideoObject',
            'position': index + 1,
            'name': work.title,
            'description': work.note || '',
            'thumbnailUrl': work.coverThumbnailUrl || work.cover,
            'uploadDate': work.createdAt || new Date().toISOString(),
            'author': {
              '@type': 'Person',
              'name': work.author
            }
          }))
        }
      };
    }
  };

  return (
    <>
        <Helmet>
            <title>{getPageTitle()}</title>
            <meta name="description" content={getPageDescription()} />
            <script type="application/ld+json">
                {JSON.stringify(getStructuredData())}
            </script>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
        {/* 标题区域 - 带装饰 */}
        <div className="relative">
            {/* 背景装饰 */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/3 w-40 h-40 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-15 blur-3xl rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 opacity-15 blur-3xl rounded-full" />
            </div>
            
            <div className="text-center space-y-4 py-6">
                {/* 装饰图标行 */}
                <div className="flex items-center justify-center gap-4 mb-2">
                    <TitleDecoration />
                </div>
                
                {/* 标签 */}
                <div className="inline-block px-4 py-1 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-pink-200/50 mb-2">
                    ✨ Community Creations ✨
                </div>
                
                {/* 主标题 */}
                <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                    精选二创展厅
                </h2>
                
                {/* 副标题带装饰线 */}
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    <p className="text-[#8eb69b] font-bold max-w-lg">
                        每一份热爱，都在这里闪闪发光
                    </p>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />
                </div>
            </div>
        </div>

      {/* 筛选分类 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => handleCollectionChange('all')}
          className={`px-8 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 border-2 ${selectedCol === 'all' ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-lg shadow-[#f8b195]/20 scale-105' : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]/20'}`}
        >
          全部作品
        </button>
        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => handleCollectionChange(col.id)}
            className={`px-8 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 border-2 ${selectedCol === col.id ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-lg shadow-[#f8b195]/20 scale-105' : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]/20'}`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-32"><Loading text="正在布置展厅..." size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredWorks.map(work => (
            <div 
              key={work.id} 
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(248,177,149,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-white"
              onClick={() => setVideoUrl(work.videoUrl)}
            >
              <div className="aspect-video relative overflow-hidden bg-[[fef5f0]">
                <img src={work.coverThumbnailUrl || work.cover} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#f8b195] shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play fill="currentColor" size={24} />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors line-clamp-1 text-lg">{work.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#fef5f0] flex items-center justify-center text-[8px] font-black text-[#f8b195]">@</div>
                    <span className="text-xs font-black text-[#8eb69b]">{work.author}</span>
                  </div>
                </div>
                {work.note && (
                  <p className="text-[11px] text-[#8eb69b]/80 font-bold leading-relaxed line-clamp-2 bg-[#fef5f0]/50 p-4 rounded-2xl border border-white">
                    {work.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部装饰 */}
      {!loading && filteredWorks.length > 0 && (
        <div className="pt-12 text-center opacity-20">
          <div className="flex items-center justify-center gap-4 text-[#8eb69b]">
            <div className="h-px w-16 bg-current"></div>
            <span className="text-xs font-black uppercase tracking-[0.5em]">End of Gallery</span>
            <div className="h-px w-16 bg-current"></div>
          </div>
        </div>
      )}

      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
    </div>
    </>
  );
};

export default FansDIYPage;
