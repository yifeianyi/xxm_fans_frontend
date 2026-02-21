/**
 * 搜索歌曲用例
 * 
 * 属于 Application 层，负责编排搜索功能的业务逻辑
 * 可以添加搜索建议、搜索历史等业务逻辑
 * 
 * @module application/songs
 */

import { Song } from '@/app/domain/types';
import { ISongRepository, PaginatedResult } from '@/app/domain/repositories';

/** 搜索选项 */
export interface SearchSongsOptions {
    query: string;
    page?: number;
    limit?: number;
    filters?: {
        genres?: string[];
        tags?: string[];
        languages?: string[];
    };
    sortBy?: 'relevance' | 'name' | 'count' | 'date';
    sortDir?: 'asc' | 'desc';
}

/** 用例输出 DTO */
export interface SearchSongsOutput extends PaginatedResult<Song> {
    query: string;
    filters: SearchSongsOptions['filters'];
    suggestions: string[];
}

/**
 * 搜索歌曲用例
 */
export class SearchSongsUseCase {
    // 搜索历史
    private searchHistory: string[] = [];
    private readonly MAX_HISTORY_SIZE = 10;

    constructor(private songRepository: ISongRepository) {}

    /**
     * 执行用例
     * @param options 搜索选项
     * @returns 搜索结果
     */
    async execute(options: SearchSongsOptions): Promise<SearchSongsOutput> {
        const { query, page = 1, limit = 20, filters, sortBy, sortDir } = options;

        // 构建排序参数
        let ordering: string | undefined;
        if (sortBy && sortBy !== 'relevance') {
            const fieldMap: Record<string, string> = {
                'name': 'song_name',
                'count': 'perform_count',
                'date': 'last_performed',
            };
            const field = fieldMap[sortBy] || sortBy;
            ordering = sortDir === 'asc' ? field : `-${field}`;
        }

        // 调用 Repository 搜索
        const result = await this.songRepository.getSongs({
            q: query,
            page,
            limit,
            ordering,
            styles: filters?.genres?.join(','),
            tags: filters?.tags?.join(','),
            language: filters?.languages?.join(','),
        });

        // 记录搜索历史
        this.addToHistory(query);

        // 生成搜索建议（基于标签和曲风）
        const suggestions = await this.generateSuggestions(query);

        return {
            ...result,
            query,
            filters: filters || {},
            suggestions,
        };
    }

    /**
     * 生成搜索建议
     * @param query 当前查询
     * @returns 建议列表
     */
    private async generateSuggestions(query: string): Promise<string[]> {
        if (!query || query.length < 2) {
            return [];
        }

        try {
            // 获取所有标签和曲风作为建议
            const [styles, tags] = await Promise.all([
                this.songRepository.getStyles(),
                this.songRepository.getTags(),
            ]);

            const allKeywords = [...styles, ...tags];
            const lowerQuery = query.toLowerCase();

            return allKeywords
                .filter(keyword => 
                    keyword.toLowerCase().includes(lowerQuery) &&
                    keyword.toLowerCase() !== lowerQuery
                )
                .slice(0, 5);
        } catch {
            return [];
        }
    }

    /**
     * 添加到搜索历史
     */
    private addToHistory(query: string): void {
        if (!query.trim()) return;

        // 移除已存在的相同查询
        this.searchHistory = this.searchHistory.filter(q => q !== query);
        
        // 添加到开头
        this.searchHistory.unshift(query);
        
        // 保持列表大小
        if (this.searchHistory.length > this.MAX_HISTORY_SIZE) {
            this.searchHistory.pop();
        }
    }

    /**
     * 获取搜索历史
     */
    getSearchHistory(): string[] {
        return [...this.searchHistory];
    }

    /**
     * 清除搜索历史
     */
    clearHistory(): void {
        this.searchHistory = [];
    }
}
