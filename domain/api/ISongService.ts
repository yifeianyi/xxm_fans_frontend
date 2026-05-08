import { ApiResult, PaginatedResult, GetSongsParams, GetRecordsParams, GetTopSongsParams, GetWorksParams } from '../../infrastructure/api/apiTypes';
import { Song, SongRecord, Recommendation, FanCollection, FanWork, OriginalWork, Livestream, AccountData, TimeGranularity, LikeResult } from '../types';

export interface LivestreamConfig {
  minYear: number;
}

export interface ISongService {
  getSongs(params: GetSongsParams): Promise<ApiResult<PaginatedResult<Song>>>;
  getRecords(songId: string, params?: GetRecordsParams): Promise<ApiResult<PaginatedResult<SongRecord>>>;
  toggleLike(songRecordId: string): Promise<ApiResult<LikeResult>>;
  
  getTopSongs(params?: GetTopSongsParams): Promise<ApiResult<Song[]>>;
  getRandomSong(): Promise<ApiResult<Song>>;
  getRecommendation(): Promise<ApiResult<Recommendation>>;
  getOriginalWorks(): Promise<ApiResult<OriginalWork[]>>;
  
  getLivestreams(year: number, month: number): Promise<ApiResult<Livestream[]>>;
  getLivestreamByDate(dateStr: string): Promise<ApiResult<Livestream | null>>;
  getLivestreamConfig(): Promise<ApiResult<LivestreamConfig>>;
  
  getAccounts(): Promise<ApiResult<AccountData[]>>;
  getAccountsWithGranularity(granularity: TimeGranularity, days?: number): Promise<ApiResult<AccountData[]>>;
  getAccountDetail(accountId: string, granularity: TimeGranularity, days?: number): Promise<ApiResult<AccountData>>;
}

export interface IFanDIYService {
  getCollections(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanCollection>>>;
  getCollection(id: number): Promise<ApiResult<FanCollection>>;
  getWorks(params?: GetWorksParams): Promise<ApiResult<PaginatedResult<FanWork>>>;
  getWork(id: number): Promise<ApiResult<FanWork>>;
}
