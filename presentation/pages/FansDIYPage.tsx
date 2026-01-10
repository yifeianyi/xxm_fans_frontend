
import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { fanDIYService } from '../../infrastructure/api/MockSongService';
import { FanWork, FanCollection } from '../../domain/types';
import { Loading } from '../components/common/Loading';
import VideoModal from '../components/common/VideoModal';

const FansDIYPage: React.FC = () => {
  const [collections, setCollections] = useState<FanCollection[]>([]);
  const [works, setWorks] = useState<FanWork[]>([]);
  const [selectedCol, setSelectedCol] = useState<string>('all');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [colsResult, worksResult] = await Promise.all([
        fanDIYService.getCollections({ limit: 20 }),
        fanDIYService.getWorks({ limit: 100 })
      ]);
      if (colsResult.data) setCollections(colsResult.data.results);
      if (worksResult.data) setWorks(worksResult.data.results);
      setLoading(false);
    };
    init();
  }, []);

  const filteredWorks = selectedCol === 'all' 
    ? works 
    : works.filter(w => w.collectionId === selectedCol);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1 bg-[#fef5f0] text-[#f8b195] text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-[#f8b195]/10 mb-2">
          Community Creations
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">精选二创展厅</h2>
        <p className="text-[#8eb69b] font-bold max-w-lg mx-auto">每一份热爱，都在这里闪闪发光 ✨ 记录属于小满虫们的精彩时刻。</p>
      </div>

      {/* 筛选分类 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCol('all')}
          className={`px-8 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 border-2 ${selectedCol === 'all' ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-lg shadow-[#f8b195]/20 scale-105' : 'bg-white text-[#8eb69b] border-white hover:border-[#f8b195]/20'}`}
        >
          全部作品
        </button>
        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => setSelectedCol(col.id)}
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
              <div className="aspect-video relative overflow-hidden bg-[#fef5f0]">
                <img src={work.cover} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
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
  );
};

export default FansDIYPage;
