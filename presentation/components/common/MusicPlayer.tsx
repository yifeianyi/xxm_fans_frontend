import React, { useEffect, useState } from 'react';
import { X, Disc } from 'lucide-react';

interface MusicPlayerProps {
  songId: string | null;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songId, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (songId) {
      setIsVisible(true);
    }
  }, [songId]);

  if (!songId || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 animate-in slide-in-from-bottom-10 duration-500 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg bg-white/85 backdrop-blur-xl border-2 border-white rounded-[2.5rem] shadow-2xl shadow-[#8eb69b]/20 overflow-hidden py-3 pl-4 pr-12 flex items-center gap-4 relative">

        {/* Spinning Record Icon */}
        <div className="w-12 h-12 bg-gradient-to-tr from-[#f8b195] to-[#f67280] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#f8b195]/30">
           <Disc size={24} className="text-white animate-spin-slow" />
        </div>

        {/* Netease Player Iframe */}
        <div className="flex-1 h-[52px] rounded-xl overflow-hidden relative">
            <iframe
                frameBorder="no"
                border="0"
                marginWidth="0"
                marginHeight="0"
                width="100%"
                height="52"
                src={`//music.163.com/outchain/player?type=2&id=${songId}&auto=1&height=32`}
                className="w-full h-full"
            ></iframe>
        </div>

        {/* Close Button */}
        <button
          onClick={() => { setIsVisible(false); onClose(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#8eb69b] hover:text-[#f8b195] hover:bg-[#fef5f0] rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MusicPlayer;