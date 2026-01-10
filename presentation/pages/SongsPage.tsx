
import React, { useState } from 'react';
import SongTable from '../components/features/SongTable';
import RankingChart from '../components/features/RankingChart';

const SongsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hot' | 'all'>('all');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div className="w-full max-w-sm mx-auto">
        <div className="relative flex p-1.5 bg-white/40 rounded-full shadow-inner border-2 border-white overflow-hidden">
          <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full transition-all duration-500 ease-out z-0 ${activeTab === 'hot' ? 'left-[6px]' : 'left-[calc(50%+1.5px)]'}`}></div>
          <button onClick={() => setActiveTab('hot')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'hot' ? 'text-white' : 'text-[#8eb69b]'}`}>热歌榜</button>
          <button onClick={() => setActiveTab('all')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'all' ? 'text-white' : 'text-[#8eb69b]'}`}>全部歌曲</button>
        </div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'hot' ? <RankingChart /> : <SongTable />}
      </div>
    </div>
  );
};

export default SongsPage;
