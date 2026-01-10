import { useState, useCallback } from 'react';
import { songService } from '../../infrastructure/api/MockSongService';
import { GetSongsParams, ApiResult, PaginatedResult } from '../../infrastructure/api/apiTypes';
import { Song } from '../../domain/types';

export const useSongData = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async (params: GetSongsParams) => {
    setLoading(true);
    setError(null);
    const result = await songService.getSongs(params);
    if (result.data) {
      setSongs(result.data.results);
      setTotal(result.data.total);
    }
    if (result.error) {
      setError(result.error.message);
    }
    setLoading(false);
  }, []);

  return { songs, total, loading, error, fetchSongs };
};
