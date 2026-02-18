/**
 * Gallery 仓储接口
 * 
 * 定义图集领域模型的数据访问契约
 * 
 * @module domain/repositories
 */

import { Gallery, GalleryImage } from '../types';

/** 获取图集列表参数 */
export interface GetGalleriesParams {
    /** 父级图集 ID */
    parentId?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
}

/** 获取图集图片参数 */
export interface GetGalleryImagesParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    page_size?: number;
}

/**
 * 图集仓储接口
 */
export interface IGalleryRepository {
    /**
     * 获取图集列表
     * @param params 查询参数
     * @returns 图集列表（树形结构）
     */
    getGalleries(params?: GetGalleriesParams): Promise<Gallery[]>;

    /**
     * 根据 ID 获取图集详情
     * @param id 图集 ID
     * @returns 图集详情（包含面包屑）
     */
    getGalleryById(id: string): Promise<Gallery>;

    /**
     * 获取图集下的图片列表
     * @param galleryId 图集 ID
     * @param params 分页参数
     * @returns 图片列表
     */
    getGalleryImages(
        galleryId: string,
        params?: GetGalleryImagesParams
    ): Promise<{
        images: GalleryImage[];
        total: number;
    }>;

    /**
     * 获取图集层级路径（面包屑）
     * @param galleryId 图集 ID
     * @returns 面包屑路径
     */
    getGalleryBreadcrumbs(galleryId: string): Promise<Array<{ id: string; title: string }>>;

    /**
     * 同步图集文件夹
     * @param galleryId 图集 ID
     * @returns 同步结果
     */
    syncGallery(galleryId: string): Promise<{ success: boolean; message: string }>;
}

/** 仓储接口标识符 */
export const GALLERY_REPOSITORY_TOKEN = Symbol('IGalleryRepository');
