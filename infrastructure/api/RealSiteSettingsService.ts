import { ApiResult } from './apiTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResult<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-settings/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const result: ApiResponse<T> = await response.json();

      if (result.code === 200 || result.code === 201) {
        return { data: result.data };
      } else {
        return {
          error: {
            status: response.status,
            message: result.message || '请求失败',
          },
        };
      }
    } catch (error) {
      return {
        error: {
          status: 0,
          message: error instanceof Error ? error.message : '网络错误',
        },
      };
    }
  }

  async getSiteSettings(): Promise<ApiResult<SiteSettings | null>> {
    return this.request<SiteSettings>('settings/');
  }

  async getMilestones(): Promise<ApiResult<Milestone[]>> {
    return this.request<Milestone[]>('milestones/');
  }

  async createMilestone(data: {
    date: string;
    title: string;
    description: string;
    display_order?: number;
  }): Promise<ApiResult<Milestone>> {
    return this.request<Milestone>('milestones/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMilestone(
    id: number,
    data: Partial<Milestone>
  ): Promise<ApiResult<Milestone>> {
    return this.request<Milestone>(`milestones/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMilestone(id: number): Promise<ApiResult<void>> {
    return this.request<void>(`milestones/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const siteSettingsService = new SiteSettingsService();