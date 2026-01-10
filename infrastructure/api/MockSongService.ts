import { ISongService, IFanDIYService } from '../api/ISongService';
import {
  ApiResult,
  PaginatedResult,
  GetSongsParams,
  GetRecordsParams,
  GetTopSongsParams,
  GetWorksParams,
  ApiError
} from '../../infrastructure/api/apiTypes';
import { Song, SongRecord, Recommendation, FanCollection, FanWork } from '../types';
import { MOCK_SONGS, MOCK_RECORDS, MOCK_RECOMMENDATION, MOCK_COLLECTIONS, MOCK_FAN_WORKS, GENRES, TAGS, LANGUAGES } from '../../infrastructure/config/constants';

class MockSongService implements ISongService {
  async getSongs(params: GetSongsParams): Promise<ApiResult<PaginatedResult<Song>>> {
    await new Promise(r => setTimeout(r, 400));
    let filtered = [...MOCK_SONGS];

    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.originalArtist.toLowerCase().includes(q));
    }

    if (params.styles) {
      const styles = params.styles.split(',');
      filtered = filtered.filter(s => s.genres.some(g => styles.includes(g)));
    }

    if (params.tags) {
      const tags = params.tags.split(',');
      filtered = filtered.filter(s => s.tags.some(t => tags.includes(t)));
    }

    if (params.language) {
      const languages = params.language.split(',');
      filtered = filtered.filter(s => s.languages.some(l => languages.includes(l)));
    }

    if (params.ordering === 'singer') {
      filtered.sort((a, b) => a.originalArtist.localeCompare(b.originalArtist));
    } else if (params.ordering === 'last_performed') {
      filtered.sort((a, b) => b.lastPerformance.localeCompare(a.lastPerformance));
    } else if (params.ordering === 'perform_count') {
      filtered.sort((a, b) => b.performanceCount - a.performanceCount);
    }

    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 50);
    const start = (page - 1) * limit;

    return {
      data: {
        total: filtered.length,
        page,
        page_size: limit,
        results: filtered.slice(start, start + limit)
      }
    };
  }

  async getRecords(songId: string, params?: GetRecordsParams): Promise<ApiResult<PaginatedResult<SongRecord>>> {
    await new Promise(r => setTimeout(r, 300));
    const all = MOCK_RECORDS.filter(r => r.songId === songId);
    const page = params?.page || 1;
    const pageSize = params?.page_size || 20;
    const start = (page - 1) * pageSize;

    return {
      data: {
        total: all.length,
        page,
        page_size: pageSize,
        results: all.slice(start, start + pageSize)
      }
    };
  }

  async getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>> {
    await new Promise(r => setTimeout(r, 300));
    const sorted = [...MOCK_SONGS].sort((a, b) => b.performanceCount - a.performanceCount);
    const limit = params?.limit || 10;
    return { data: sorted.slice(0, limit) };
  }

  async getRandomSong(): Promise<ApiResult<Song>> {
    await new Promise(r => setTimeout(r, 200));
    const randomIndex = Math.floor(Math.random() * MOCK_SONGS.length);
    return { data: MOCK_SONGS[randomIndex] };
  }

  async getRecommendation(): Promise<ApiResult<Recommendation>> {
    await new Promise(r => setTimeout(r, 200));
    return { data: MOCK_RECOMMENDATION };
  }
}

class MockFanDIYService implements IFanDIYService {
  async getCollections(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanCollection>>> {
    await new Promise(r => setTimeout(r, 300));
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      data: {
        total: MOCK_COLLECTIONS.length,
        page,
        page_size: limit,
        results: MOCK_COLLECTIONS.slice(start, start + limit)
      }
    };
  }

  async getCollection(id: number): Promise<ApiResult<FanCollection>> {
    await new Promise(r => setTimeout(r, 200));
    const collection = MOCK_COLLECTIONS.find(c => c.id === id.toString());
    return collection ? { data: collection } : { error: new ApiError(404, 'Collection not found') };
  }

  async getWorks(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanWork>>> {
    await new Promise(r => setTimeout(r, 300));
    let filtered = [...MOCK_FAN_WORKS];

    if (params?.collection) {
      filtered = filtered.filter(w => w.collectionId === params.collection.toString());
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      data: {
        total: filtered.length,
        page,
        page_size: limit,
        results: filtered.slice(start, start + limit)
      }
    };
  }

  async getWork(id: number): Promise<ApiResult<FanWork>> {
    await new Promise(r => setTimeout(r, 200));
    const work = MOCK_FAN_WORKS.find(w => w.id === id.toString());
    return work ? { data: work } : { error: new ApiError(404, 'Work not found') };
  }
}

export const songService = new MockSongService();
export const fanDIYService = new MockFanDIYService();
