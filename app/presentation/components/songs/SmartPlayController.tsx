'use client';

import React, { useEffect, useState } from 'react';
import MusicPlayer from './MusicPlayer';
import VideoModal from './VideoModal';
import { OriginalWork } from '@/app/domain/types';

interface SmartPlayControllerProps {
    work: OriginalWork | null;
    onClose: () => void;
}

/**
 * 智能播放控制器 - 根据歌曲数据自动选择播放方式
 * 优先级：网易云音乐 > B站视频 > 暂无链接
 */
export default function SmartPlayController({ work, onClose }: SmartPlayControllerProps) {
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [neteaseId, setNeteaseId] = useState<string | null>(null);

    useEffect(() => {
        if (!work) {
            setVideoModalOpen(false);
            setNeteaseId(null);
            return;
        }

        // 优先使用网易云音乐（支持多种字段名以向后兼容）
        const musicId = work.neteaseId || work.songId;

        if (musicId) {
            setNeteaseId(musicId);
            setVideoModalOpen(false);
        } else if (work.bilibiliBvid) {
            setVideoModalOpen(true);
            setNeteaseId(null);
        } else {
            setVideoModalOpen(false);
            setNeteaseId(null);
        }
    }, [work]);

    if (!work) return null;

    // 优先使用网易云音乐
    if (neteaseId) {
        return <MusicPlayer songId={neteaseId} onClose={onClose} />;
    }

    // 其次使用 B站视频
    if (work.bilibiliBvid && videoModalOpen) {
        const videoUrl = `https://www.bilibili.com/video/${work.bilibiliBvid}`;
        return (
            <VideoModal
                isOpen={videoModalOpen}
                onClose={onClose}
                videoUrl={videoUrl}
            />
        );
    }

    // 暂无播放链接（组件返回 null，由调用方处理提示）
    return null;
}
