/**
 * Songs 模块 Application 层统一导出
 * 
 * @module application/songs
 * @description 导出所有歌曲相关的 UseCase
 */

export { GetSongListUseCase, type GetSongListOutput } from './GetSongListUseCase';
export { GetSongDetailUseCase, type GetSongDetailOutput } from './GetSongDetailUseCase';
export { GetHotSongsUseCase, type GetHotSongsOutput, type HotSongsTimeRange } from './GetHotSongsUseCase';
export { GetRandomSongUseCase, type GetRandomSongOutput } from './GetRandomSongUseCase';
export { SearchSongsUseCase, type SearchSongsOptions, type SearchSongsOutput } from './SearchSongsUseCase';
