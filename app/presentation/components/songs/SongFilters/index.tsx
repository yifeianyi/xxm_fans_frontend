'use client';

import React from 'react';
import { SlidersHorizontal, Search, Gift } from 'lucide-react';
import { FilterState } from '@/app/domain/types';
import { GENRES, TAGS, LANGUAGES } from '@/app/presentation/constants/songs';

// ============ Types ============

interface SongFiltersProps {
    search: string;
    filters: FilterState;
    showFilters: boolean;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    onToggleFilterPanel: () => void;
    onToggleFilter: (type: keyof FilterState, value: string) => void;
    onMysteryBoxClick?: () => void;
}

// ============ Components ============

export function SongSearchBar({
    search,
    onSearchChange,
    onSearchSubmit,
}: Pick<SongFiltersProps, 'search' | 'onSearchChange' | 'onSearchSubmit'>) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }} className="w-full md:flex-1 relative flex items-center group">
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜一搜信件..."
                className="w-full pl-12 pr-4 h-11 rounded-full bg-white border-2 border-[#8eb69b]/20 focus:border-[#f8b195] transition-all outline-none text-[#4a3728] placeholder:text-[#8eb69b]/40 font-bold text-sm"
            />
            <button type="submit" className="absolute left-4 text-[#f8b195] hover:scale-110 transition-all">
                <SlidersHorizontal size={18} strokeWidth={3} />
            </button>
        </form>
    );
}

export function FilterToggleButton({
    showFilters,
    onClick,
}: { showFilters: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 md:flex-none h-11 flex items-center justify-center gap-2 px-5 rounded-full transition-all font-bold border-2 text-xs ${
                showFilters
                    ? 'bg-[#4a3728] text-white border-[#4a3728]'
                    : 'bg-white text-[#f8b195] border-[#f8b195]/20'
            }`}
        >
            <Search size={16} /> <span>筛选</span>
        </button>
    );
}

interface MysteryBoxButtonProps {
    onClick?: () => void;
}

export function MysteryBoxButton({ onClick }: MysteryBoxButtonProps) {
    return (
        <button 
            onClick={onClick}
            className="flex-1 md:flex-none h-11 flex items-center justify-center gap-2 px-5 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full hover:brightness-105 transition-all font-bold shadow-md shadow-[#f8b195]/10 text-xs"
        >
            <Gift size={16} /> <span>盲盒</span>
        </button>
    );
}

export function FilterPanel({
    filters,
    onToggleFilter,
}: Pick<SongFiltersProps, 'filters' | 'onToggleFilter'>) {
    const filterGroups = [
        { title: '曲风', type: 'genres' as const, data: GENRES },
        { title: '标签', type: 'tags' as const, data: TAGS },
        { title: '语种', type: 'languages' as const, data: LANGUAGES },
    ];

    return (
        <div className="p-6 glass-card rounded-[2rem] border-2 border-white shadow-xl animate-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filterGroups.map(group => (
                    <div key={group.type}>
                        <h4 className="font-bold text-[#4a3728] mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider">
                            <div className="w-1 h-3 bg-[#f8b195] rounded-full"></div>
                            {group.title}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {group.data.map(item => (
                                <button
                                    key={item}
                                    onClick={() => onToggleFilter(group.type, item)}
                                    className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-all ${
                                        filters[group.type].includes(item)
                                            ? 'bg-[#f8b195] text-white border-[#f8b195]'
                                            : 'bg-white/50 text-[#8eb69b] border-[#8eb69b]/20 hover:border-[#f8b195]'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============ Main Export ============

export function SongFilters(props: SongFiltersProps) {
    const {
        search,
        showFilters,
        onSearchChange,
        onSearchSubmit,
        onToggleFilterPanel,
    } = props;

    return (
        <div className="flex flex-col gap-3 items-center w-full">
            <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                <SongSearchBar
                    search={search}
                    onSearchChange={onSearchChange}
                    onSearchSubmit={onSearchSubmit}
                />
                <div className="flex gap-2 w-full md:w-auto">
                    <MysteryBoxButton onClick={props.onMysteryBoxClick} />
                    <FilterToggleButton
                        showFilters={showFilters}
                        onClick={onToggleFilterPanel}
                    />
                </div>
            </div>
            {showFilters && <FilterPanel {...props} />}
        </div>
    );
}

export default SongFilters;
