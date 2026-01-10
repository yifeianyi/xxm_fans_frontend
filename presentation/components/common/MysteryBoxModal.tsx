
import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Song } from '../../../domain/types';
import RecordList from '../features/RecordList';

interface MysteryBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onPlay: (url: string) => void;
  title?: string;
}

const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({ isOpen, onClose, song, onPlay, title = '发现新歌' }) => {
  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3728]/30 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 border-4 border-white" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f8b195] text-white rounded-2xl flex items-center justify-center shadow-lg"><Sparkles size={20} /></div>
            <h2 className="text-xl font-black text-[#4a3728]">{title}</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-[#fef5f0] hover:bg-[#f8b195]/20 rounded-2xl transition-all text-[#f8b195]"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter">{song.name}</h1>
            <p className="text-xl text-[#8eb69b] font-black">{song.originalArtist}</p>
          </div>
          <div className="bg-white/40 rounded-[2.5rem] border border-white/50 overflow-hidden shadow-inner">
            <RecordList songId={song.id} onPlay={onPlay} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysteryBoxModal;
