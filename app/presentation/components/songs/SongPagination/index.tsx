'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// ============ Types ============

interface SongPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
}

// ============ Helper Functions ============

/**
 * 生成分页页码数组
 * 使用省略号优化显示
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
    }
    return pages;
}

// ============ Components ============

function PageButton({
    page,
    isActive,
    onClick,
}: {
    page: number;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`min-w-[28px] h-7 rounded-lg text-[10px] lg:text-xs font-black transition-all border ${
                isActive
                    ? 'bg-[#f8b195] text-white border-[#f8b195] shadow-sm'
                    : 'bg-white/40 text-[#8eb69b] border-white/60 hover:border-[#f8b195]/40'
            }`}
        >
            {page}
        </button>
    );
}

function Ellipsis() {
    return (
        <span className="min-w-[28px] h-7 flex items-center justify-center text-[#8eb69b] text-xs">
            <MoreHorizontal size={14} />
        </span>
    );
}

function NavButton({
    direction,
    disabled,
    onClick,
}: {
    direction: 'prev' | 'next';
    disabled: boolean;
    onClick: () => void;
}) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="p-1.5 rounded-lg bg-white/60 text-[#f8b195] disabled:opacity-20 hover:bg-white transition-all border border-white/40"
        >
            <Icon size={14} />
        </button>
    );
}

// ============ Main Export ============

export function SongPagination({
    page,
    totalPages,
    total,
    onPageChange,
}: SongPaginationProps) {
    const pageNumbers = useMemo(
        () => generatePageNumbers(page, totalPages),
        [page, totalPages]
    );

    if (totalPages <= 1) return null;

    return (
        <div className="px-4 py-4 flex items-center justify-between bg-white/10 border-t border-white/20">
            <span className="text-[10px] lg:text-xs text-[#8eb69b] font-black tracking-widest hidden sm:inline">
                {total} SONGS • PAGE {page}/{totalPages}
            </span>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <NavButton
                    direction="prev"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                />
                <div className="flex items-center gap-1">
                    {pageNumbers.map((p, i) =>
                        p === '...' ? (
                            <Ellipsis key={`ellipsis-${i}`} />
                        ) : (
                            <PageButton
                                key={p}
                                page={p as number}
                                isActive={page === p}
                                onClick={() => onPageChange(p as number)}
                            />
                        )
                    )}
                </div>
                <NavButton
                    direction="next"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                />
            </div>
        </div>
    );
}

export default SongPagination;
