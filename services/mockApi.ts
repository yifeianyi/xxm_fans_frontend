
import { MOCK_SONGS, MOCK_RECORDS, MOCK_RECOMMENDATION, MOCK_COLLECTIONS, MOCK_FAN_WORKS } from '../constants';
import { Song, SongRecord, Recommendation, FanCollection, FanWork, TimeRange, FilterState } from '../types';

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
    
    // 1. 搜索过滤
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.originalArtist.toLowerCase().includes(q)
      );
    }
    
    // 2. 分类过滤 (数组求交集)
    if (params.genres?.length) {
      filtered = filtered.filter(s => s.genres.some(g => params.genres!.includes(g)));
    }
    if (params.tags?.length) {
      filtered = filtered.filter(s => s.tags.some(t => params.tags!.includes(t)));
    }
    if (params.languages?.length) {
      filtered = filtered.filter(s => s.languages.some(l => params.languages!.includes(l)));
    }

    // 3. 排序
    if (params.sortBy) {
      const field = params.sortBy as keyof Song;
      filtered.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        
        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        
        return params.sortDir === 'asc' ? comparison : -comparison;
      });
    }

    // 4. 分页
    const pageSize = 50;
    const start = ((params.page || 1) - 1) * pageSize;
    return {
      songs: filtered.slice(start, start + pageSize),
      total: filtered.length
    };
  },

  getRecords: async (songId: string, page: number = 1): Promise<{ records: SongRecord[]; hasMore: boolean }> => {
    await new Promise(r => setTimeout(r, 300));
    const all = MOCK_RECORDS.filter(r => r.songId === songId);
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    return {
      records: all.slice(start, start + pageSize),
      hasMore: start + pageSize < all.length
    };
  },

  getTopSongs: async (range: TimeRange): Promise<Song[]> => {
    // 实际应根据 range 过滤日期，这里简化逻辑
    return [...MOCK_SONGS].sort((a, b) => b.performanceCount - a.performanceCount).slice(0, 10);
  },

  getRecommendation: async (): Promise<Recommendation> => MOCK_RECOMMENDATION,

  getCollections: async (): Promise<FanCollection[]> => MOCK_COLLECTIONS,

  getFanWorks: async (collectionId?: string): Promise<FanWork[]> => {
    let works = [...MOCK_FAN_WORKS];
    if (collectionId) works = works.filter(w => w.collectionId === collectionId);
    return works.sort((a, b) => b.position - a.position);
  },

  getRandomSong: async (filters: FilterState): Promise<Song | null> => {
    const { songs } = await mockApi.getSongs({ ...filters, page: 1 });
    if (songs.length === 0) return null;
    return songs[Math.floor(Math.random() * songs.length)];
  }
};
