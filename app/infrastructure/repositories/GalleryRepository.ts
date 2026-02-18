/**
 * Gallery 仓储实现
 * 
 * 实现 IGalleryRepository 接口，负责图集数据的实际获取
 * 
 * @module infrastructure/repositories
 */

import { Gallery, GalleryImage } from '@/app/domain/types';
import {
    IGalleryRepository,
    GetGalleriesParams,
    GetGalleryImagesParams,
} from '@/app/domain/repositories';
import { ApiClient } from '../api/base';
import { GalleryMapper } from '../mappers/GalleryMapper';

/**
 * 图集仓储实现类
 */
export class GalleryRepository implements IGalleryRepository {
    private apiClient: ApiClient;

    constructor(apiClient?: ApiClient) {
        this.apiClient = apiClient || new ApiClient();
    }

    async getGalleries(params: GetGalleriesParams = {}): Promise<Gallery[]> {
        const queryParams = new URLSearchParams();
        if (params.parentId) queryParams.set('parent', params.parentId);
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());

        const result = await this.apiClient.get<any[]>(`/gallery/tree/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        return GalleryMapper.fromBackendList(result.data || []);
    }

    async getGalleryById(id: string): Promise<Gallery> {
        const result = await this.apiClient.get<any>(`/gallery/${id}/`);

        if (result.error) {
            throw result.error;
        }

        return GalleryMapper.fromBackend(result.data);
    }

    async getGalleryImages(
        galleryId: string,
        params?: GetGalleryImagesParams
    ): Promise<{ images: GalleryImage[]; total: number }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

        const result = await this.apiClient.get<any>(`/gallery/${galleryId}/images/?${queryParams.toString()}`);

        if (result.error) {
            throw result.error;
        }

        const data = result.data;

        // 处理可能的数组或分页格式
        if (Array.isArray(data)) {
            return {
                images: GalleryMapper.imageListFromBackend(data),
                total: data.length,
            };
        }

        return {
            images: GalleryMapper.imageListFromBackend(data.images || []),
            total: data.total || data.images?.length || 0,
        };
    }

    async getGalleryBreadcrumbs(galleryId: string): Promise<Array<{ id: string; title: string }>> {
        const result = await this.apiClient.get<any>(`/gallery/${galleryId}/`);

        if (result.error) {
            throw result.error;
        }

        const gallery = GalleryMapper.fromBackend(result.data);
        return gallery.breadcrumbs || [];
    }

    async syncGallery(galleryId: string): Promise<{ success: boolean; message: string }> {
        const result = await this.apiClient.post<any>(`/gallery/${galleryId}/sync/`, {});

        if (result.error) {
            return {
                success: false,
                message: result.error.message || '同步失败',
            };
        }

        return {
            success: true,
            message: '同步成功',
        };
    }
}

/**
 * 默认图集仓储实例
 */
export const galleryRepository = new GalleryRepository();
