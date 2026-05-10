import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageItem {
  url: string;
}

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageItem[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ isOpen, onClose, images, currentIndex, onPrev, onNext }) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center gap-1 px-1 md:gap-3 md:px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
        aria-label="关闭"
      >
        <X size={24} />
      </button>

      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm font-bold">
        {currentIndex + 1} / {images.length}
      </div>

      <div className="w-8 md:w-12 flex items-center justify-center shrink-0">
        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
            aria-label="上一张"
          >
            <ChevronLeft size={28} />
          </button>
        )}
      </div>

      <div className="flex-1 max-w-[85vw] flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <img
          src={images[currentIndex]?.url}
          alt={`图片 ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
        />
      </div>

      <div className="w-8 md:w-12 flex items-center justify-center shrink-0">
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
            aria-label="下一张"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
