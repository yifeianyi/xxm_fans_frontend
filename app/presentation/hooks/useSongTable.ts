'use client';

import { useState, useCallback, useMemo } from 'react';
import { FilterState } from '@/app/domain/types';
import { GetSongsParams } from '@/app/infrastructure/api/apiTypes';
import { useSongs } from '@/app/infrastructure/hooks/useSongs';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_DIR,
    SORT_FIELD_MAP,
} from '../constants/songs';

// ============ State Types ============

export interface SongTableState {
    // 搜索
    search: string;
    // 筛选
    filters: FilterState;
    // 分页
    page: number;
    // 排序
    sortBy: string;
    sortDir: 'asc' | 'desc';
}

export interface SongTableActions {
    // 搜索
    setSearch: (search: string) => void;
    submitSearch: () => void;
    // 筛选
    toggleFilter: (type: keyof FilterState, value: string) => void;
    clearFilters: () => void;
    // 分页
    setPage: (page: number) => void;
    goToFirstPage: () => void;
    goToPrevPage: () => void;
    goToNextPage: () => void;
    goToLastPage: () => void;
    // 排序
    handleSort: (field: string) => void;
    // 快速筛选
    handleQuickFilter: (type: keyof FilterState | 'artist', value: string) => void;
}

// ============ Hook ============

export function useSongTable() {
    // 本地状态
    const [search, setSearchInput] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        genres: [],
        tags: [],
        languages: [],
    });
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPageState] = useState(1);
    const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>(DEFAULT_SORT_DIR);

    // 构建 API 参数
    const queryParams: GetSongsParams = useMemo(() => ({
        q: search || undefined,
        page,
        limit: DEFAULT_PAGE_SIZE,
        ordering: sortDir === 'asc' ? sortBy : `-${sortBy}`,
        styles: filters.genres.join(',') || undefined,
        tags: filters.tags.join(',') || undefined,
        language: filters.languages.join(',') || undefined,
    }), [search, page, sortBy, sortDir, filters]);

    // 使用 SWR 获取数据
    const { songs, total, isLoading, error } = useSongs(queryParams);

    // 分页计算
    const totalPages = useMemo(() => 
        Math.ceil(total / DEFAULT_PAGE_SIZE),
        [total]
    );

    // 操作函数
    const setSearch = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    const submitSearch = useCallback(() => {
        setPageState(1);
    }, []);

    const setPage = useCallback((newPage: number) => {
        setPageState(newPage);
    }, []);

    const goToFirstPage = useCallback(() => setPage(1), [setPage]);
    const goToPrevPage = useCallback(() => setPage(Math.max(1, page - 1)), [page, setPage]);
    const goToNextPage = useCallback(() => setPage(Math.min(totalPages, page + 1)), [page, totalPages, setPage]);
    const goToLastPage = useCallback(() => setPage(totalPages), [totalPages, setPage]);

    const toggleFilter = useCallback((type: keyof FilterState, value: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value],
        }));
        setPageState(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ genres: [], tags: [], languages: [] });
        setPageState(1);
    }, []);

    const handleSort = useCallback((field: string) => {
        const mappedField = SORT_FIELD_MAP[field] || field;
        if (sortBy === mappedField) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(mappedField);
            setSortDir('desc');
        }
        setPageState(1);
    }, [sortBy]);

    const handleQuickFilter = useCallback((type: keyof FilterState | 'artist', value: string) => {
        if (type === 'artist') {
            setSearchInput(value);
            setFilters({ genres: [], tags: [], languages: [] });
        } else {
            setSearchInput('');
            setFilters({ genres: [], tags: [], languages: [], [type]: [value] });
        }
        setPageState(1);
    }, []);

    return {
        // 数据
        songs,
        total,
        isLoading,
        error,
        // 状态
        state: {
            search,
            filters,
            showFilters,
            page,
            sortBy,
            sortDir,
            totalPages,
        },
        // UI 状态控制
        setShowFilters,
        // 操作
        actions: {
            setSearch,
            submitSearch,
            toggleFilter,
            clearFilters,
            setPage,
            goToFirstPage,
            goToPrevPage,
            goToNextPage,
            goToLastPage,
            handleSort,
            handleQuickFilter,
        },
    };
}
