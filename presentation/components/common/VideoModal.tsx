
import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  const getEmbedUrl = (url: string) => {
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&danmaku=0&autoplay=1&mute=0`;
    return url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><X size={24} /></button>
        <div className="aspect-video w-full">
          <iframe src={getEmbedUrl(videoUrl)} className="w-full h-full border-0" allowFullScreen allow="autoplay"></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
