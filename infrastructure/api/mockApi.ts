
import { MOCK_SONGS, MOCK_RECORDS, MOCK_RECOMMENDATION, MOCK_COLLECTIONS, MOCK_FAN_WORKS } from '../config/constants';
import { Song, SongRecord, Recommendation, FanCollection, FanWork, FilterState } from '../../domain/types';

export const mockApi = {
  getSongs: async (params: { 
    search?: string; 
    genres?: string[]; 
    tags?: string[]; 
    languages?: string[]; 
    page?: number; 
    sortBy?: string; 
    sortDir?: 'asc' | 'desc' 
  }): Promise<{ songs: Song[]; total: number }> => {
    await new Promise(r => setTimeout(r, 400));
    let filtered = [...MOCK_SONGS];
    
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.originalArtist.toLowerCase().includes(q));
    }
    
    if (params.genres?.length) filtered = filtered.filter(s => s.genres.some(g => params.genres!.includes(g)));
    if (params.tags?.length) filtered = filtered.filter(s => s.tags.some(t => params.tags!.includes(t)));
    if (params.languages?.length) filtered = filtered.filter(s => s.languages.some(l => params.languages!.includes(l)));

    if (params.sortBy) {
      const field = params.sortBy as keyof Song;
      filtered.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        let res = 0;
        if (typeof valA === 'string' && typeof valB === 'string') res = valA.localeCompare(valB);
        else if (typeof valA === 'number' && typeof valB === 'number') res = valA - valB;
        return params.sortDir === 'asc' ? res : -res;
      });
    }

    const pageSize = 50;
    const start = ((params.page || 1) - 1) * pageSize;
    return { songs: filtered.slice(start, start + pageSize), total: filtered.length };
  },

  getRecords: async (songId: string): Promise<SongRecord[]> => {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_RECORDS.filter(r => r.songId === songId);
  },

  getRecommendation: async (): Promise<Recommendation> => MOCK_RECOMMENDATION,
  getCollections: async (): Promise<FanCollection[]> => MOCK_COLLECTIONS,
  getFanWorks: async (): Promise<FanWork[]> => MOCK_FAN_WORKS,
  getRandomSong: async (filters: FilterState): Promise<Song | null> => {
    const { songs } = await mockApi.getSongs({ ...filters, page: 1 });
    return songs.length > 0 ? songs[Math.floor(Math.random() * songs.length)] : null;
  }
};
