/**
 * 获取随机歌曲用例
 * 
 * 属于 Application 层，负责编排盲盒功能的业务逻辑
 * 可以添加权重、去重等业务逻辑
 * 
 * @module application/songs
 */

import { Song } from '@/app/domain/types';
import { ISongRepository } from '@/app/domain/repositories';

/** 用例输出 DTO */
export interface GetRandomSongOutput {
    song: Song;
    seed?: number;
}

/**
 * 获取随机歌曲用例
 */
export class GetRandomSongUseCase {
    // 记录最近抽取的歌曲 ID，避免重复
    private recentSongIds: string[] = [];
    private readonly MAX_RECENT_SIZE = 10;

    constructor(private songRepository: ISongRepository) {}

    /**
     * 执行用例
     * @param avoidRecent 是否避免最近抽取过的歌曲
     * @param maxRetries 最大重试次数
     * @returns 随机歌曲
     */
    async execute(
        avoidRecent: boolean = true,
        maxRetries: number = 3
    ): Promise<GetRandomSongOutput> {
        let retries = 0;
        let song: Song;

        do {
            const result = await this.songRepository.getRandomSong();
            song = result;

            // 如果不需要避免重复，直接返回
            if (!avoidRecent) {
                break;
            }

            // 检查是否是最近抽取过的
            if (!this.recentSongIds.includes(song.id)) {
                break;
            }

            retries++;
        } while (retries < maxRetries);

        // 更新最近列表
        this.addToRecent(song.id);

        return {
            song,
            seed: Date.now(),
        };
    }

    /**
     * 执行用例（带备选方案）
     * 如果 API 失败，从现有列表中随机选择
     * @param fallbackSongs 备选歌曲列表
     * @returns 随机歌曲
     */
    async executeWithFallback(fallbackSongs: Song[] = []): Promise<GetRandomSongOutput> {
        try {
            return await this.execute();
        } catch (error) {
            // 如果 API 失败且有备选列表，从备选列表随机选择
            if (fallbackSongs.length > 0) {
                const randomIndex = Math.floor(Math.random() * fallbackSongs.length);
                const song = fallbackSongs[randomIndex];
                
                return {
                    song,
                    seed: Date.now(),
                };
            }
            
            throw error;
        }
    }

    /**
     * 添加到最近列表
     */
    private addToRecent(songId: string): void {
        this.recentSongIds.push(songId);
        
        // 保持列表大小
        if (this.recentSongIds.length > this.MAX_RECENT_SIZE) {
            this.recentSongIds.shift();
        }
    }

    /**
     * 清除最近记录
     */
    clearRecent(): void {
        this.recentSongIds = [];
    }

    /**
     * 获取最近记录
     */
    getRecentIds(): string[] {
        return [...this.recentSongIds];
    }
}
