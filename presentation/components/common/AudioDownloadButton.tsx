import React, { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface AudioDownloadButtonProps {
    bvid: string;
    title: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const AudioDownloadButton: React.FC<AudioDownloadButtonProps> = ({
    bvid,
    title,
    size = 'sm',
    className = ''
}) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // 使用 yewtu.be 提供的音频下载页面
            const downloadUrl = `https://yewtu.be/watch?v=${bvid}&local=1`;

            // 在新窗口打开下载页面
            window.open(downloadUrl, '_blank');

            console.log(`打开下载页面: ${downloadUrl}`);
            console.log(`BV号: ${bvid}`);
            console.log(`标题: ${title}`);

        } catch (error) {
            console.error('打开下载页面失败:', error);
            alert('打开下载页面失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSize = {
        sm: 16,
        md: 20,
        lg: 24
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={`${sizeClasses[size]} rounded-full bg-[#f8b195] text-white flex items-center justify-center hover:bg-[#e09a7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${className}`}
            title="在新窗口打开音频下载页面"
        >
            {loading ? (
                <Loader2 size={iconSize[size]} className="animate-spin" />
            ) : (
                <ExternalLink size={iconSize[size]} />
            )}
        </button>
    );
};

export default AudioDownloadButton;


// Demo 测试代码（可以在浏览器控制台运行）
/*
// 1. 导入组件后，创建测试数据
const testWork = {
    id: '1',
    title: '测试视频',
    bvid: 'BV1xx411c7mD',
    author: '测试作者'
};

// 2. 渲染组件
<AudioDownloadButton bvid={testWork.bvid} title={testWork.title} />

// 3. 点击按钮后，控制台会输出：
// 打开下载页面: https://yewtu.be/watch?v=BV1xx411c7mD&local=1
// BV号: BV1xx411c7mD
// 标题: 测试视频
*/