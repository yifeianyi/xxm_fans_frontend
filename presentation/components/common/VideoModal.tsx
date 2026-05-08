
import React from 'react';
import { X } from 'lucide-react';
import { VideoPlayerService } from '../../../shared/services/VideoPlayerService';

type VideoType = 'embed' | 'direct';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoType?: VideoType;
}

const detectVideoType = (url: string): VideoType => {
  if (/\.mp4(\?|$)/i.test(url)) return 'direct';
  if (url.includes('sinaimg.cn/')) return 'direct';
  return 'embed';
};

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, videoType }) => {
  if (!isOpen) return null;

  const useVideoTag = videoType === 'direct' || (!videoType && detectVideoType(videoUrl) === 'direct');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative w-full max-w-5xl bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-3 md:p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
          aria-label="关闭视频"
        >
          <X size={24} />
        </button>
        <div className="aspect-video w-full">
          {useVideoTag ? (
            <video
              src={videoUrl}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <iframe 
              src={VideoPlayerService.getEmbedUrl(videoUrl)} 
              className="w-full h-full border-0" 
              allowFullScreen 
              allow="autoplay; fullscreen"
              title="视频播放"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
