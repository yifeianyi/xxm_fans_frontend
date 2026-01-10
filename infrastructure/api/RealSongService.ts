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
import { config } from '../../infrastructure/config/config';
import { Song, SongRecord, Recommendation, FanCollection, FanWork } from '../types';

class ApiClient {
  private baseURL = config.api.baseURL;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new ApiError(response.status, `Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error };
      }
      return { error: new ApiError(500, 'Network error') };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
}

const apiClient = new ApiClient();

export class RealSongService implements ISongService {
  async getSongs(params: GetSongsParams): Promise<ApiResult<PaginatedResult<Song>>> {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.ordering) queryParams.set('ordering', params.ordering);
    if (params.styles) queryParams.set('styles', params.styles);
    if (params.tags) queryParams.set('tags', params.tags);
    if (params.language) queryParams.set('language', params.language);

    const result = await apiClient.get<PaginatedResult<Song>>(
      `/api/songs/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<Song> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id.toString(),
          name: item.song_name,
          originalArtist: item.singer,
          genres: item.styles,
          languages: item.language ? [item.language] : [],
          firstPerformance: item.last_performed,
          lastPerformance: item.last_performed,
          performanceCount: item.perform_count,
          tags: item.tags || []
        }))
      };
      return { data: transformed };
    }
    return result;
  }

  async getRecords(songId: string, params?: GetRecordsParams): Promise<ApiResult<PaginatedResult<SongRecord>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const result = await apiClient.get<PaginatedResult<SongRecord>>(
      `/api/songs/${songId}/records/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<SongRecord> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id.toString(),
          songId: songId,
          date: item.performed_at,
          cover: item.cover_url,
          note: '',
          videoUrl: ''
        }))
      };
      return { data: transformed };
    }
    return result;
  }

  async getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>> {
    const queryParams = new URLSearchParams();
    if (params?.range) queryParams.set('range', params.range);
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const result = await apiClient.get<Song[]>(`/api/top_songs/?${queryParams.toString()}`);
    return result;
  }

  async getRandomSong(): Promise<ApiResult<Song>> {
    const result = await apiClient.get<Song>('/api/random-song/');
    return result;
  }

  async getRecommendation(): Promise<ApiResult<Recommendation>> {
    const result = await apiClient.get<Recommendation>('/api/recommendation/');
    return result;
  }
}

export class RealFanDIYService implements IFanDIYService {
  async getCollections(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanCollection>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const result = await apiClient.get<PaginatedResult<FanCollection>>(
      `/api/fansDIY/collections/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<FanCollection> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id.toString(),
          name: item.name,
          description: '',
          worksCount: item.works_count
        }))
      };
      return { data: transformed };
    }
    return result;
  }

  async getCollection(id: number): Promise<ApiResult<FanCollection>> {
    const result = await apiClient.get<FanCollection>(`/api/fansDIY/collections/${id}/`);
    return result;
  }

  async getWorks(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanWork>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.collection) queryParams.set('collection', params.collection.toString());

    const result = await apiClient.get<PaginatedResult<FanWork>>(
      `/api/fansDIY/works/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<FanWork> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id.toString(),
          title: item.title,
          author: item.author,
          cover: item.cover_url,
          videoUrl: item.view_url,
          note: item.notes,
          collectionId: item.collection?.id.toString() || '',
          position: item.position
        }))
      };
      return { data: transformed };
    }
    return result;
  }

  async getWork(id: number): Promise<ApiResult<FanWork>> {
    const result = await apiClient.get<FanWork>(`/api/fansDIY/works/${id}/`);
    return result;
  }
}

export const songService = new RealSongService();
export const fanDIYService = new RealFanDIYService();
