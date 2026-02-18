'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Song } from '@/app/domain/types';
import RecordList from '@/app/songs/components/RecordList';

// ============ Types ============

interface SongTableRowProps {
    song: Song;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onQuickFilter: (type: 'artist' | 'genres' | 'tags' | 'languages', value: string) => void;
    onCopy: (text: string) => void;
    copyStatus: string | null;
    onPlay: (videoUrl: string) => void;
}

// ============ Sub-Components ============

function SongNameCell({
    name,
    copyStatus,
    onCopy,
}: {
    name: string;
    copyStatus: string | null;
    onCopy: (name: string) => void;
}) {
    return (
        <td className="px-1 py-4">
            <button
                onClick={() => onCopy(name)}
                className="group flex flex-col items-center hover:text-[#f8b195] font-black transition-all mx-auto max-w-full leading-tight"
            >
                <span className="text-[12px] lg:text-base break-words px-1">{name}</span>
                {copyStatus === name && (
                    <span className="text-[8px] text-green-500 font-normal">已复制</span>
                )}
            </button>
        </td>
    );
}

function ArtistCell({
    artist,
    onQuickFilter,
}: {
    artist: string;
    onQuickFilter: (artist: string) => void;
}) {
    return (
        <td className="px-1 py-4">
            <button
                onClick={() => onQuickFilter(artist)}
                className="text-[#f8b195] hover:text-[#f67280] font-black truncate w-full px-1"
            >
                {artist}
            </button>
        </td>
    );
}

function GenresCell({
    genres,
    onQuickFilter,
}: {
    genres: string[];
    onQuickFilter: (genre: string) => void;
}) {
    return (
        <td className="px-1 py-4">
            <div className="grid grid-cols-2 gap-1 w-fit mx-auto">
                {genres.map((g) => (
                    <button
                        key={g}
                        onClick={() => onQuickFilter(g)}
                        className="text-[8px] lg:text-xs px-1.5 py-0.5 bg-[#f1f8f1] text-[#8eb69b] rounded-md font-bold border border-[#8eb69b]/10 whitespace-nowrap"
                    >
                        {g}
                    </button>
                ))}
            </div>
        </td>
    );
}

function LanguagesCell({
    languages,
    onQuickFilter,
}: {
    languages: string[];
    onQuickFilter: (lang: string) => void;
}) {
    return (
        <td className="px-1 py-4">
            <div className="flex flex-wrap gap-0.5 justify-center font-black">
                {languages.map((l) => (
                    <button
                        key={l}
                        onClick={() => onQuickFilter(l)}
                        className="hover:text-[#f8b195]"
                    >
                        {l}
                    </button>
                ))}
            </div>
        </td>
    );
}

function DateCell({ date }: { date: string }) {
    return (
        <td className="px-1 py-4 text-[10px] lg:text-sm text-[#8eb69b] font-black whitespace-nowrap">
            {date ? date.slice(2) : '-'}
        </td>
    );
}

function PerformanceCountCell({ count }: { count: number }) {
    return (
        <td className="px-1 py-4">
            <div className="flex justify-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-[#fef5f0] text-[#f8b195] rounded-full text-[13px] lg:text-base font-black">
                    {count}
                </span>
            </div>
        </td>
    );
}

function TagsCell({
    tags,
    onQuickFilter,
}: {
    tags: string[];
    onQuickFilter: (tag: string) => void;
}) {
    return (
        <td className="px-1 py-4">
            <div className="flex flex-wrap gap-1 justify-center">
                {tags.map((t) => (
                    <button
                        key={t}
                        onClick={() => onQuickFilter(t)}
                        className="text-[8px] lg:text-xs px-2 py-0.5 bg-[#fffceb] text-[#d4af37] border border-[#d4af37]/20 rounded-md font-black whitespace-nowrap"
                    >
                        {t}
                    </button>
                ))}
            </div>
        </td>
    );
}

function ExpandButton({
    isExpanded,
    onClick,
}: {
    isExpanded: boolean;
    onClick: () => void;
}) {
    return (
        <td className="px-1 py-4">
            <button
                onClick={onClick}
                className={`p-1 rounded-lg transition-all mx-auto block ${
                    isExpanded
                        ? 'bg-[#f8b195] text-white shadow-sm'
                        : 'text-[#f8b195] hover:bg-[#fef5f0]'
                }`}
            >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
        </td>
    );
}

// ============ Main Export ============

export function SongTableRow({
    song,
    isExpanded,
    onToggleExpand,
    onQuickFilter,
    onCopy,
    copyStatus,
    onPlay,
}: SongTableRowProps) {
    return (
        <>
            <tr
                className={`border-b border-white/10 hover:bg-white/40 transition-all ${
                    isExpanded ? 'bg-white/50' : ''
                }`}
            >
                <SongNameCell
                    name={song.name}
                    copyStatus={copyStatus}
                    onCopy={onCopy}
                />
                <ArtistCell
                    artist={song.originalArtist}
                    onQuickFilter={(artist) => onQuickFilter('artist', artist)}
                />
                <GenresCell
                    genres={song.genres}
                    onQuickFilter={(genre) => onQuickFilter('genres', genre)}
                />
                <LanguagesCell
                    languages={song.languages}
                    onQuickFilter={(lang) => onQuickFilter('languages', lang)}
                />
                <DateCell date={song.firstPerformance} />
                <DateCell date={song.lastPerformance} />
                <PerformanceCountCell count={song.performanceCount} />
                <TagsCell
                    tags={song.tags}
                    onQuickFilter={(tag) => onQuickFilter('tags', tag)}
                />
                <ExpandButton isExpanded={isExpanded} onClick={onToggleExpand} />
            </tr>
            {isExpanded && (
                <tr className="bg-white/30">
                    <td colSpan={9} className="p-2">
                        <RecordList songId={song.id} onPlay={onPlay} />
                    </td>
                </tr>
            )}
        </>
    );
}

export default SongTableRow;
