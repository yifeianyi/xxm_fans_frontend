
import React, { useState, useEffect } from 'react';
import { Play, Filter } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { FanWork, FanCollection } from '../types';
import VideoModal from '../components/VideoModal';

const FansDIYPage: React.FC = () => {
  const [collections, setCollections] = useState<FanCollection[]>([]);
  const [works, setWorks] = useState<FanWork[]>([]);
  const [selectedCol, setSelectedCol] = useState<string>('all');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [cols, allWorks] = await Promise.all([
        mockApi.getCollections(),
        mockApi.getFanWorks()
      ]);
      setCollections(cols);
      setWorks(allWorks);
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
        <h2 className="text-4xl font-black text-[#4a3728] tracking-tighter">精选二创展厅</h2>
        <p className="text-[#8eb69b] font-bold">每一份热爱，都在这里闪闪发光 ✨</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setSelectedCol('all')}
          className={`px-8 py-3 rounded-full font-black transition-all ${selectedCol === 'all' ? 'bg-[#f8b195] text-white shadow-lg' : 'bg-white text-[#8eb69b] hover:bg-[#fef5f0]'}`}
        >
          全部作品
        </button>
        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => setSelectedCol(col.id)}
            className={`px-8 py-3 rounded-full font-black transition-all ${selectedCol === col.id ? 'bg-[#f8b195] text-white shadow-lg' : 'bg-white text-[#8eb69b] hover:bg-[#fef5f0]'}`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-32 text-center text-[#8eb69b] font-black">正在布置展厅...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredWorks.map(work => (
            <div 
              key={work.id} 
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              onClick={() => setVideoUrl(work.videoUrl)}
            >
              <div className="aspect-video relative overflow-hidden bg-[#fef5f0]">
                <img src={work.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#f8b195] shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                    <Play fill="currentColor" size={24} />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-black text-[#4a3728] group-hover:text-[#f8b195] transition-colors line-clamp-1">{work.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#8eb69b]">@ {work.author}</span>
                </div>
                {work.note && (
                  <p className="text-xs text-[#8eb69b]/70 font-bold leading-relaxed line-clamp-3 bg-[#fef5f0] p-3 rounded-2xl">
                    {work.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
    </div>
  );
};

export default FansDIYPage;
