
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
  ALL = 'ALL',
  MONTH = 'MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  YEAR = 'YEAR'
}

export interface FilterState {
  genres: string[];
  tags: string[];
  languages: string[];
}
