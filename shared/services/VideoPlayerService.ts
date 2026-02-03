export interface VideoEmbed {
  url: string;
  platform: 'bilibili' | 'youtube' | 'other';
}

export class VideoPlayerService {
  static parseUrl(url: string): VideoEmbed {
    if (url.includes('bilibili.com')) {
      const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
      if (bvMatch) {
        // 解析分P参数（后端使用 &p= 参数）
        const pageMatch = url.match(/[?&]p=(\d+)/);
        const pageNumber = pageMatch ? pageMatch[1] : '1';
        
        // 生成播放器 URL，使用 &p= 参数（与后端保持一致）
        return {
          url: `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&p=${pageNumber}&high_quality=1&danmaku=0&autoplay=0&mute=0`,
          platform: 'bilibili'
        };
      }
    }

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch) {
        return {
          url: `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0`,
          platform: 'youtube'
        };
      }
    }

    return { url, platform: 'other' };
  }

  static getEmbedUrl(url: string): string {
    return this.parseUrl(url).url;
  }
}
