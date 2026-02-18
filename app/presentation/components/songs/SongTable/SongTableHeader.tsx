'use client';

import React from 'react';

// ============ Types ============

interface SongTableHeaderProps {
    sortBy: string;
    sortDir: 'asc' | 'desc';
    onSort: (field: string) => void;
}

// ============ Constants ============

const COLUMNS = [
    { key: 'name', label: '歌名', sortable: false },
    { key: 'originalArtist', label: '原唱', sortable: true, backendField: 'singer' },
    { key: 'genres', label: '风格', sortable: false },
    { key: 'languages', label: '语种', sortable: false },
    { key: 'firstPerformance', label: '首次', sortable: true, backendField: 'first_perform' },
    { key: 'lastPerformance', label: '最近', sortable: true, backendField: 'last_performed' },
    { key: 'performanceCount', label: '演唱次数', sortable: true, backendField: 'perform_count' },
    { key: 'tags', label: '标签', sortable: false },
    { key: 'actions', label: '记录', sortable: false },
];

// ============ Components ============

function HeaderCell({
    column,
    sortBy,
    sortDir,
    onSort,
}: {
    column: typeof COLUMNS[0];
    sortBy: string;
    sortDir: 'asc' | 'desc';
    onSort: (field: string) => void;
}) {
    const isSorted = column.backendField === sortBy;
    const sortIcon = isSorted ? (sortDir === 'asc' ? '↑' : '↓') : '';

    if (!column.sortable) {
        return (
            <th className="px-1 py-4">
                {column.label}
            </th>
        );
    }

    return (
        <th
            className="px-1 py-4 cursor-pointer hover:text-[#f8b195] transition-colors"
            onClick={() => onSort(column.key)}
        >
            {column.label} {sortIcon}
        </th>
    );
}

// ============ Main Export ============

export function SongTableHeader({ sortBy, sortDir, onSort }: SongTableHeaderProps) {
    return (
        <thead>
            <tr className="bg-[#f2f9f1]/90 text-[#8eb69b] text-[11px] lg:text-base font-black border-b border-white/40 uppercase tracking-tighter">
                {COLUMNS.map((column) => (
                    <HeaderCell
                        key={column.key}
                        column={column}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        onSort={onSort}
                    />
                ))}
            </tr>
        </thead>
    );
}

export default SongTableHeader;
