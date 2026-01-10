
import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  // Extraction for Bilibili iframe with autoplay and sound enabled
  const getEmbedUrl = (url: string) => {
    if (url.includes('bilibili.com')) {
      const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
      if (bvMatch) {
        /**
         * Bilibili Player Parameters:
         * - bvid: The video ID
         * - autoplay: 1 to start playing immediately
         * - mute: 0 to ensure sound is on (browsers still require a user gesture, which we have)
         * - high_quality: 1 for HD
         * - danmaku: 0 to hide comments/bullets
         */
        return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&danmaku=0&autoplay=1&mute=0`;
      }
    }
    return url;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
        >
          <X size={24} />
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-full border-0"
            /**
             * allow="autoplay" is crucial here. 
             * Because the user clicked a record/button to open this modal, 
             * the browser treats this as a 'user gesture', allowing autoplay with sound.
             */
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
