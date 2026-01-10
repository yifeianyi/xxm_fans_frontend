
import React, { useState, useEffect } from 'react';
import { songService } from '../../../infrastructure/api/MockSongService';
import { SongRecord } from '../../../domain/types';
import { Play } from 'lucide-react';
import { Loading } from '../common/Loading';

interface RecordListProps {
  songId: string;
  onPlay: (url: string) => void;
}

const RecordList: React.FC<RecordListProps> = ({ songId, onPlay }) => {
  const [records, setRecords] = useState<SongRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await songService.getRecords(songId, { page_size: 20 });
      if (result.data) setRecords(result.data.results);
      setLoading(false);
    };
    load();
  }, [songId]);

  if (loading) return <div className="p-10"><Loading text="正在搜集音符..." size="sm" /></div>;
  if (records.length === 0) return <div className="p-10 text-center text-[#8eb69b]/40 font-black">暂无记录</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
      {records.map(rec => (
        <div key={rec.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer" onClick={() => onPlay(rec.videoUrl)}>
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            <img src={rec.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2.5 bg-white/95 rounded-full text-[#f8b195] shadow-lg transform group-hover:scale-110 transition-all"><Play size={20} fill="currentColor" /></div>
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[#f8b195] font-black text-[10px] tracking-wider mb-1">{rec.date}</div>
            <p className="text-[10px] font-bold text-[#8eb69b] line-clamp-2 leading-tight">{rec.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordList;
