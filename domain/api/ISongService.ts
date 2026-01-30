import { ApiResult, PaginatedResult, GetSongsParams, GetRecordsParams, GetTopSongsParams, GetWorksParams } from '../../infrastructure/api/apiTypes';
import { Song, SongRecord, Recommendation, FanCollection, FanWork, OriginalWork } from '../types';

export interface ISongService {
  getSongs(params: GetSongsParams): Promise<ApiResult<PaginatedResult<Song>>>;
  getRecords(songId: string, params?: GetRecordsParams): Promise<ApiResult<PaginatedResult<SongRecord>>>;
  getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>>;
  getRandomSong(): Promise<ApiResult<Song>>;
  getRecommendation(): Promise<ApiResult<Recommendation>>;
  getOriginalWorks(): Promise<ApiResult<OriginalWork[]>>;
}

export interface IFanDIYService {
  getCollections(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanCollection>>>;
  getCollection(id: number): Promise<ApiResult<FanCollection>>;
  getWorks(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanWork>>>;
  getWork(id: number): Promise<ApiResult<FanWork>>;
}
