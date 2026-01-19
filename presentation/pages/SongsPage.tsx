
import React, { useState } from 'react';
import SongTable from '../components/features/SongTable';
import RankingChart from '../components/features/RankingChart';
import TimelineChart from '../components/features/TimelineChart';
import OriginalsList from '../components/features/OriginalsList';

const SongsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hot' | 'all' | 'originals' | 'timeline'>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="w-full max-w-xl mx-auto">
        <div className="relative flex p-1.5 bg-white/40 rounded-full shadow-inner border-2 border-white overflow-hidden">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(25%-6px)] bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full transition-all duration-500 ease-out z-0`}
            style={{
              left: activeTab === 'hot' ? '6px' :
                    activeTab === 'all' ? 'calc(25% + 2px)' :
                    activeTab === 'originals' ? 'calc(50% - 2px)' :
                    'calc(75% - 6px)'
            }}
          ></div>
          <button onClick={() => setActiveTab('hot')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'hot' ? 'text-white' : 'text-[#8eb69b]'}`}>热歌榜</button>
          <button onClick={() => setActiveTab('all')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'all' ? 'text-white' : 'text-[#8eb69b]'}`}>全部歌曲</button>
          <button onClick={() => setActiveTab('originals')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'originals' ? 'text-white' : 'text-[#8eb69b]'}`}>原唱作品</button>
          <button onClick={() => setActiveTab('timeline')} className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'timeline' ? 'text-white' : 'text-[#8eb69b]'}`}>投稿时刻</button>
        </div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'hot' && <RankingChart />}
        {activeTab === 'all' && <SongTable />}
        {activeTab === 'originals' && <OriginalsList />}
        {activeTab === 'timeline' && <TimelineChart />}
      </div>
    </div>
  );
};

export default SongsPage;
