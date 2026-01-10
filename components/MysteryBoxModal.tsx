
import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Song } from '../types';
import RecordList from './RecordList';

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
      <div 
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(74,55,40,0.1)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-600 border-4 border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fef5f0] to-transparent pointer-events-none"></div>
        <div className="absolute top-6 right-8 text-3xl opacity-10 pointer-events-none">💌</div>
        
        {/* Compact Header */}
        <div className="px-8 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f8b195] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#f8b195]/20 rotate-3 transition-transform">
              <Sparkles size={20} className="fill-white" />
            </div>
            <h2 className="text-xl font-black text-[#4a3728] tracking-tight">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-[#fef5f0] hover:bg-[#f8b195]/20 rounded-2xl transition-all text-[#f8b195] hover:rotate-90 duration-500 shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {/* Discovery Hero - Visual Section */}
          <div className="py-12 px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef5f0] rounded-full text-[#f8b195] text-[9px] font-black uppercase tracking-[0.3em] border border-[#f8b195]/10">
              <span className="w-1.5 h-1.5 bg-[#f8b195] rounded-full animate-pulse"></span>
              New Letter Arrived
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter leading-tight max-w-xl mx-auto">
              {song.name}
            </h1>
            <p className="text-xl md:text-2xl text-[#8eb69b] font-black tracking-tight">
              {song.originalArtist}
            </p>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#f8b195]">{song.performanceCount}</span>
                <span className="text-[8px] text-[#8eb69b] font-black uppercase tracking-widest">Perf.</span>
              </div>
              <div className="h-8 w-px bg-[#8eb69b]/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-[#8eb69b]">{song.languages[0]}</span>
                <span className="text-[8px] text-[#8eb69b] font-black uppercase tracking-widest">Lang.</span>
              </div>
            </div>
          </div>

          {/* Records Section - Detail Section */}
          <div className="px-4 pb-12">
            <div className="flex items-center gap-6 mb-6 px-8 opacity-50">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#8eb69b] rounded-full"></div>
              <h3 className="text-[#8eb69b] font-black text-[9px] uppercase tracking-[0.4em]">History</h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#8eb69b] rounded-full"></div>
            </div>
            
            <div className="bg-white/40 rounded-[2.5rem] border border-white/50 overflow-hidden shadow-inner mx-4">
              <RecordList songId={song.id} onPlay={onPlay} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysteryBoxModal;
