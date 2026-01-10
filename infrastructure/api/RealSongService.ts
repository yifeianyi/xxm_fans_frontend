// 优化后的RealSongService.ts
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

    const result = await apiClient.get<PaginatedResult<any>>(
      `/songs/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<Song> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id?.toString() || '',
          name: item.song_name || '未知歌曲',
          originalArtist: item.singer || '未知歌手',
          genres: Array.isArray(item.styles) ? item.styles : [],
          languages: item.language ? [item.language] : [],
          firstPerformance: '', // 后端无此字段
          lastPerformance: item.last_performed || '',
          performanceCount: item.perform_count || 0,
          tags: Array.isArray(item.tags) ? item.tags : []
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

    const result = await apiClient.get<PaginatedResult<any>>(
      `/songs/${songId}/records/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<SongRecord> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id?.toString() || '',
          songId: songId,
          date: item.performed_at || '',
          cover: item.cover_url || '',
          note: item.notes || '',
          videoUrl: item.url || ''
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

    const result = await apiClient.get<any[]>(

          `/top_songs/?${queryParams.toString()}`

        );
    
    if (result.data) {
      const transformed: Song[] = result.data.map(item => ({
        id: item.id?.toString() || '',
        name: item.song_name || '未知歌曲',
        originalArtist: item.singer || '未知歌手',
        genres: Array.isArray(item.styles) ? item.styles : [],
        languages: item.language ? [item.language] : [],
        firstPerformance: '', // 后端无此字段
        lastPerformance: item.last_performed || '',
        performanceCount: item.perform_count || 0,
        tags: Array.isArray(item.tags) ? item.tags : []
      }));
      return { data: transformed };
    }
    return result;
  }

  async getRandomSong(): Promise<ApiResult<Song>> {
    const result = await apiClient.get<any>(
          '/random-song/'
        );
    
    if (result.data) {
      const transformed: Song = {
        id: result.data.id?.toString() || '',
        name: result.data.song_name || '未知歌曲',
        originalArtist: result.data.singer || '未知歌手',
        genres: Array.isArray(result.data.styles) ? result.data.styles : [],
        languages: result.data.language ? [result.data.language] : [],
        firstPerformance: '', // 后端无此字段
        lastPerformance: result.data.last_performed || '',
        performanceCount: result.data.perform_count || 0,
        tags: Array.isArray(result.data.tags) ? result.data.tags : []
      };
      return { data: transformed };
    }
    return result;
  }

  async getRecommendation(): Promise<ApiResult<Recommendation>> {
    const result = await apiClient.get<any>(
          '/recommendation/'
        );
    
    if (result.data) {
      const transformed: Recommendation = {
        content: result.data.content || '',
        recommendedSongs: result.data.recommended_songs?.map((song: any) => song.id?.toString() || '') || []
      };
      // 将原始推荐歌曲数据附加到结果中，供前端使用
      (result as any).recommendedSongsDetails = result.data.recommended_songs?.map((song: any) => ({
        id: song.id?.toString() || '',
        name: song.song_name || '未知歌曲',
        singer: song.singer || '未知歌手',
        performCount: song.perform_count || 0
      })) || [];
      return result;
    }
    return result;
  }
}

export class RealFanDIYService implements IFanDIYService {
  async getCollections(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanCollection>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const result = await apiClient.get<PaginatedResult<any>>(
      `/fansDIY/collections/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<FanCollection> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id?.toString() || '',
          name: item.name || '未知合集',
          description: '', // 后端无此字段
          worksCount: item.works_count || 0
        }))
      };
      return { data: transformed };
    }
    return result;
  }

  async getCollection(id: number): Promise<ApiResult<FanCollection>> {
    const result = await apiClient.get<any>(
          `/fansDIY/collections/${id}/`
        );
    
    if (result.data) {
      const transformed: FanCollection = {
        id: result.data.id?.toString() || '',
        name: result.data.name || '未知合集',
        description: '', // 后端无此字段
        worksCount: result.data.works_count || 0
      };
      return { data: transformed };
    }
    return result;
  }

  async getWorks(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanWork>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.collection) queryParams.set('collection', params.collection.toString());

    const result = await apiClient.get<PaginatedResult<any>>(
      `/fansDIY/works/?${queryParams.toString()}`
    );

    if (result.data) {
      const transformed: PaginatedResult<FanWork> = {
        ...result.data,
        results: result.data.results.map(item => ({
          id: item.id?.toString() || '',
          title: item.title || '未知作品',
          author: item.author || '未知作者',
          cover: item.cover_url || '',
          videoUrl: item.view_url || '',
          note: item.notes || '',
          collectionId: item.collection?.id?.toString() || '',
          position: item.position || 0
        }))
      };
      return { data: transformed };
    }
    return result;
  }

  async getWork(id: number): Promise<ApiResult<FanWork>> {
    const result = await apiClient.get<any>(
          `/fansDIY/works/${id}/`
        );
    
    if (result.data) {
      const transformed: FanWork = {
        id: result.data.id?.toString() || '',
        title: result.data.title || '未知作品',
        author: result.data.author || '未知作者',
        cover: result.data.cover_url || '',
        videoUrl: result.data.view_url || '',
        note: result.data.notes || '',
        collectionId: result.data.collection?.id?.toString() || '',
        position: result.data.position || 0
      };
      return { data: transformed };
    }
    return result;
  }
}

export const songService = new RealSongService();
export const fanDIYService = new RealFanDIYService();