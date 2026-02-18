import { Livestream, LivestreamRecording } from '../../domain/types';

/**
 * 生成 B站视频播放链接
 * @param bvid B站视频BV号
 * @param page 分段号（从1开始）
 * @returns 视频播放链接
 */
export function generateBilibiliUrl(bvid: string, page: number = 1): string {
  if (!bvid) return '';

  if (page === 1) {
    return `https://www.bilibili.com/video/${bvid}`;
  }

  return `https://www.bilibili.com/video/${bvid}?p=${page}`;
}

/**
 * 生成 B站播放器嵌入链接
 * @param bvid B站视频BV号
 * @param page 分段号（从1开始）
 * @returns 播放器嵌入链接
 */
export function generateBilibiliEmbedUrl(bvid: string, page: number = 1): string {
  if (!bvid) return '';

  return `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmaku=0&autoplay=0&page=${page}`;
}