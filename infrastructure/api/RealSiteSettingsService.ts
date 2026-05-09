import { ApiResult, ApiError } from './apiTypes';
import { apiClient } from '../../shared/ApiClient';
import { config } from '../config/config';

export interface SiteSettings {
  id: number;
  favicon?: string;
  favicon_url?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_avatar_url?: string;
  artist_birthday?: string;
  artist_constellation?: string;
  artist_location?: string;
  artist_profession?: string[];
  artist_voice_features?: string[];
  bilibili_url?: string;
  weibo_url?: string;
  netease_music_url?: string;
  youtube_url?: string;
  qq_music_url?: string;
  xiaohongshu_url?: string;
  douyin_url?: string;
  background_image?: string;
  background_image_url?: string;
  background_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: number;
  date: string;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

class SiteSettingsService {
  async getSiteSettings(): Promise<ApiResult<SiteSettings | null>> {
    return apiClient.get<SiteSettings>('/site-settings/settings/');
  }

  async getMilestones(): Promise<ApiResult<Milestone[]>> {
    return apiClient.get<Milestone[]>('/site-settings/milestones/');
  }

  async createMilestone(data: {
    date: string;
    title: string;
    description: string;
    display_order?: number;
  }): Promise<ApiResult<Milestone>> {
    const response = await fetch(`${config.api.baseURL}/site-settings/milestones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.code === 200 || result.code === 201) {
      return { data: result.data };
    }
    return { error: new ApiError(result.code, result.message || '请求失败') };
  }

  async updateMilestone(
    id: number,
    data: Partial<Milestone>
  ): Promise<ApiResult<Milestone>> {
    const response = await fetch(`${config.api.baseURL}/site-settings/milestones/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.code === 200 || result.code === 201) {
      return { data: result.data };
    }
    return { error: new ApiError(result.code, result.message || '请求失败') };
  }

  async deleteMilestone(id: number): Promise<ApiResult<void>> {
    const response = await fetch(`${config.api.baseURL}/site-settings/milestones/${id}/`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return { data: undefined };
    }
    const result = await response.json();
    return { error: new ApiError(result.code || response.status, result.message || '删除失败') };
  }
}

export const siteSettingsService = new SiteSettingsService();