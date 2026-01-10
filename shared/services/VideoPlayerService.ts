export interface VideoEmbed {
  url: string;
  platform: 'bilibili' | 'youtube' | 'other';
}

export class VideoPlayerService {
  static parseUrl(url: string): VideoEmbed {
    if (url.includes('bilibili.com')) {
      const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
      if (bvMatch) {
        return {
          url: `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&danmaku=0&autoplay=1&mute=0`,
          platform: 'bilibili'
        };
      }
    }

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch) {
        return {
          url: `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1`,
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
