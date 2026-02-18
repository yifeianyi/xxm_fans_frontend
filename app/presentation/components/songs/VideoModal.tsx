'use client';

import React from 'react';
import { X } from 'lucide-react';
import { VideoPlayerService } from '@/app/shared/services/VideoPlayerService';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    if (!isOpen) return null;

    const embedUrl = VideoPlayerService.getEmbedUrl(videoUrl);

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-5xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* 关闭按钮 */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    aria-label="关闭视频"
                >
                    <X size={24} />
                </button>
                
                {/* 视频容器 */}
                <div className="relative w-full aspect-video">
                    <iframe 
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        allowFullScreen 
                        allow="autoplay; fullscreen"
                        title="视频播放"
                    />
                </div>
            </div>
        </div>
    );
}
