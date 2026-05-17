import { ISongService, IFanDIYService, LivestreamConfig } from '../../domain/api/ISongService';
import {
  ApiResult,
  PaginatedResult,
  GetSongsParams,
  GetRecordsParams,
  GetTopSongsParams,
  GetWorksParams,
  ApiError,
} from '../../infrastructure/api/apiTypes';
import { apiClient } from '../../shared/ApiClient';
import { config } from '../../infrastructure/config/config';
import { Song, SongRecord, Recommendation, FanCollection, FanWork, OriginalWork, Livestream, AccountData, TimeGranularity, WorkTimelineResponse, WorkTimelineRawResponse, CorrelationResponse, CorrelationWork, AnalyticsWork, LikeResult } from '../../domain/types';

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
          firstPerformance: item.first_perform || '',
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
    if (params?.sort_by) queryParams.set('sort_by', params.sort_by);

    const result = await apiClient.get<any>(
      `/songs/${songId}/records/?${queryParams.toString()}`
    );

    if (result.data) {
      let recordsArray: any[];
      let totalCount: number;

      if (Array.isArray(result.data)) {
        recordsArray = result.data;
        totalCount = result.data.length;
      } else if (result.data.results && Array.isArray(result.data.results)) {
        recordsArray = result.data.results;
        totalCount = result.data.total || result.data.results.length;
      } else {
        console.warn('⚠️ getRecords 返回未知数据格式:', result.data);
        return { data: { results: [], total: 0, page: 1, page_size: 10 } };
      }

      const transformed: PaginatedResult<SongRecord> = {
        results: recordsArray.map(item => ({
          id: item.id?.toString() || '',
          songId: songId,
          songName: item.song_name || '',
          date: item.performed_at || '',
          cover: item.cover_url || '',
          coverThumbnailUrl: item.cover_thumbnail_url || item.cover_url || '',
          note: item.notes || '',
          videoUrl: item.url || '',
          like_count: item.like_count || 0,
          user_liked: item.user_liked || false
        })),
        total: totalCount,
        page: result.data.page || 1,
        page_size: result.data.page_size || 10
      };
      return { data: transformed };
    }
    return result;
  }

  async toggleLike(songRecordId: string): Promise<ApiResult<LikeResult>> {
    try {
      const url = `${config.api.baseURL}/songs/like/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_record_id: parseInt(songRecordId) })
      });
      const data = await response.json();
      if (data.success) {
        return { data: data as LikeResult };
      }
      return { data: data as LikeResult };
    } catch {
      return { error: new ApiError(500, 'Network error') };
    }
  }

  

  async getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>> {
    const queryParams = new URLSearchParams();
    if (params?.range) {
      queryParams.set('range', params.range);
      console.log('📊 API request range:', params.range);
    }
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
        firstPerformance: item.first_perform || '',
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
        firstPerformance: result.data.first_perform || '',
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
          '/site-settings/'
        );

    if (result.data) {
      // API 返回的是数组，取第一个激活的推荐
      const recommendationData = Array.isArray(result.data) ? result.data.find((r: any) => r.is_active) || result.data[0] : result.data;

      if (recommendationData) {
        const recommendedSongsDetails = recommendationData.recommended_songs_details?.map((song: any) => ({
          id: song.id?.toString() || '',
          name: song.song_name || '未知歌曲',
          singer: song.singer || '未知歌手',
          language: song.language || '未知语种'
        })) || [];

        const transformed: Recommendation = {
          content: recommendationData.content || '',
          recommendedSongs: recommendationData.recommended_songs?.map((song: any) => song.id?.toString() || '') || []
        };

        // 将推荐歌曲详情附加到返回的数据对象中
        (transformed as any).recommendedSongsDetails = recommendedSongsDetails;

        return { data: transformed };
      }
    }
    return result;
  }

  async getOriginalWorks(): Promise<ApiResult<OriginalWork[]>> {
    const result = await apiClient.get<any>('/original-works/');

    if (result.data && Array.isArray(result.data)) {
      const transformed: OriginalWork[] = result.data.map((item: any) => ({
        title: item.title || '',
        date: item.date || '',
        desc: item.desc || '',
        cover: item.cover || '',
        neteaseId: item.neteaseId || '',
        bilibiliBvid: item.bilibiliBvid || '',
        featured: item.featured || false
      }));
      return { data: transformed };
    }
    return result;
  }

  /**
   * 获取指定月份的直播记录列表
   */
  async getLivestreams(year: number, month: number): Promise<ApiResult<Livestream[]>> {
    const queryParams = new URLSearchParams();
    queryParams.set('year', year.toString());
    queryParams.set('month', month.toString());

    const result = await apiClient.get<Livestream[]>(
      `/livestreams/?${queryParams.toString()}`
    );

    if (result.data) {
      return { data: result.data };
    }
    return result;
  }

  /**
   * 获取指定直播记录详情（ID 主路径，兼容日期）
   */
  async getLivestreamDetail(identifier: string): Promise<ApiResult<Livestream | null>> {
    const result = await apiClient.get<Livestream | null>(
      `/livestreams/${identifier}/`
    );

    if (result.data) {
      return { data: result.data };
    }
    return { data: null };
  }

  async getLivestreamByDate(dateStr: string): Promise<ApiResult<Livestream | null>> {
    return this.getLivestreamDetail(dateStr);
  }

  /**
   * 获取直播配置信息（年份范围等）
   */
  async getLivestreamConfig(): Promise<ApiResult<LivestreamConfig>> {
    const result = await apiClient.get<LivestreamConfig>(
      `/livestreams/config/`
    );

    if (result.data) {
      return { data: result.data };
    }
    return result;
  }

  // ==================== 粉丝数数据分析相关 API ====================

  async getAccounts(): Promise<ApiResult<AccountData[]>> {
    const endpoint = '/data-analytics/followers/accounts/data/';
    const params = new URLSearchParams({
      granularity: 'DAY',
      days: '30'
    });
    return apiClient.get<AccountData[]>(`${endpoint}?${params}`);
  }

  async getAccountsWithGranularity(
    granularity: TimeGranularity,
    days: number = 30
  ): Promise<ApiResult<AccountData[]>> {
    const endpoint = '/data-analytics/followers/accounts/data/';
    const params = new URLSearchParams({
      granularity: granularity,
      days: days.toString()
    });
    return apiClient.get<AccountData[]>(`${endpoint}?${params}`);
  }

  async getAccountDetail(
    accountId: string,
    granularity: TimeGranularity,
    days: number = 30
  ): Promise<ApiResult<AccountData>> {
    const endpoint = `/data-analytics/followers/accounts/${accountId}/`;
    const params = new URLSearchParams({
      granularity: granularity,
      days: days.toString()
    });
    return apiClient.get<AccountData>(`${endpoint}?${params}`);
  }

  // ==================== 作品深度观测相关 API ====================

  async getAnalyticsWorks(limit: number = 100, platform?: string): Promise<ApiResult<AnalyticsWork[]>> {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (platform) params.set('platform', platform);
    return apiClient.get<AnalyticsWork[]>(`/data-analytics/works/?${params.toString()}`);
  }

  async getWorkTimeline(
    platform: string,
    workId: string
  ): Promise<ApiResult<WorkTimelineResponse>> {
    const endpoint = `/data-analytics/works/${platform}/${workId}/timeline/`;
    const raw = await apiClient.get<WorkTimelineRawResponse>(endpoint);
    if (raw.error || !raw.data) return { error: raw.error };
    const transformPoint = (p: { time: string; view_count: number; like_count: number; coin_count: number; favorite_count: number; danmaku_count: number; comment_count: number }) => ({
      time: p.time,
      viewCount: p.view_count,
      likeCount: p.like_count,
      coinCount: p.coin_count,
      favoriteCount: p.favorite_count,
      danmakuCount: p.danmaku_count,
      commentCount: p.comment_count,
    });
    return {
      data: {
        hasWeekData: raw.data.has_week_data,
        weekSeries: (raw.data.week_series || []).map(transformPoint),
        dailySeries: (raw.data.daily_series || []).map(transformPoint),
      },
    };
  }

  async getCorrelationData(
    accountId: string,
    days: number = 90
  ): Promise<ApiResult<CorrelationResponse>> {
    const params = new URLSearchParams();
    params.set('account_id', accountId);
    params.set('days', days.toString());
    return apiClient.get<CorrelationResponse>(
      `/data-analytics/correlation/?${params.toString()}`
    );
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
          coverThumbnailUrl: item.cover_thumbnail_url || item.cover_url || '',
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
        coverThumbnailUrl: result.data.cover_thumbnail_url || result.data.cover_url || '',
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
