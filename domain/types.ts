
export interface SongRecord {
  id: string;
  songId: string;
  date: string;
  cover: string;
  note: string;
  videoUrl: string;
}

export interface Song {
  id: string;
  name: string;
  originalArtist: string;
  genres: string[];
  languages: string[];
  firstPerformance: string;
  lastPerformance: string;
  performanceCount: number;
  tags: string[];
}

export interface Recommendation {
  content: string;
  recommendedSongs: string[]; 
}

// 推荐歌曲的详细信息
export interface RecommendedSong {
  id: string;
  name: string;
  singer: string;
  performCount?: number;
}

export interface FanWork {
  id: string;
  title: string;
  author: string;
  cover: string;
  videoUrl: string;
  note: string;
  collectionId: string;
  position: number;
}

export interface FanCollection {
  id: string;
  name: string;
  description: string;
  worksCount: number;
}

export enum TimeRange {
  ALL = 'all',
  MONTH = '1m',
  THREE_MONTHS = '3m',
  YEAR = '1y'
}

export interface FilterState {
  genres: string[];
  tags: string[];
  languages: string[];
}
