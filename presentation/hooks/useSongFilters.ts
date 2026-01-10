import { useState, useCallback } from 'react';
import { FilterState } from '../../domain/types';

export const useSongFilters = () => {
  const [filters, setFilters] = useState<FilterState>({ genres: [], tags: [], languages: [] });
  const [search, setSearch] = useState('');

  const updateFilter = useCallback((type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ genres: [], tags: [], languages: [] });
    setSearch('');
  }, []);

  return { filters, search, setSearch, updateFilter, clearFilters };
};
