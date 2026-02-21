/**
 * 获取歌曲详情用例
 * 
 * 属于 Application 层，负责编排获取歌曲详情的业务逻辑
 * 可以同时获取歌曲信息和相关的演唱记录
 * 
 * @module application/songs
 */

import { Song, SongRecord } from '@/app/domain/types';
import {
    ISongRepository,
    GetRecordsParams,
} from '@/app/domain/repositories';

/** 用例输出 DTO */
export interface GetSongDetailOutput {
    song: Song;
    recentRecords: SongRecord[];
    totalRecords: number;
}

/**
 * 获取歌曲详情用例
 */
export class GetSongDetailUseCase {
    constructor(private songRepository: ISongRepository) {}

    /**
     * 执行用例
     * @param songId 歌曲 ID
     * @param recordParams 演唱记录查询参数（可选）
     * @returns 歌曲详情和最近演唱记录
     */
    async execute(
        songId: string,
        recordParams?: GetRecordsParams
    ): Promise<GetSongDetailOutput> {
        // 并行获取歌曲详情和演唱记录
        const [song, recordsResult] = await Promise.all([
            this.songRepository.getSongById(songId),
            this.songRepository.getRecords(songId, {
                page: 1,
                page_size: 5,
                ...recordParams,
            }),
        ]);

        return {
            song,
            recentRecords: recordsResult.results,
            totalRecords: recordsResult.total,
        };
    }
}
