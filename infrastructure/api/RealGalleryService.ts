import { Gallery, GalleryImage, Breadcrumb } from '../../domain/types';
import { apiClient } from '../../shared/ApiClient';
import { ApiResult } from './apiTypes';

export class RealGalleryService {

  /**
   * 获取图集树结构
   */
  async getGalleryTree(): Promise<Gallery[]> {
    const result = await apiClient.get<Gallery[]>('/gallery/tree/');
    if (result.error) {
      console.error('获取图集树失败:', result.error.message);
      return [];
    }
    if (!result.data) return [];
    return this.transformGalleryData(result.data);
  }

  /**
   * 获取图集详情
   */
  async getGalleryDetail(galleryId: string): Promise<Gallery | null> {
    const result = await apiClient.get<Gallery>(`/gallery/${galleryId}/`);
    if (result.error) {
      console.error('获取图集详情失败:', result.error.message);
      return null;
    }
    if (!result.data) return null;
    return this.transformGalleryDetail(result.data);
  }

  /**
   * 获取图集图片列表
   */
  async getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
    const result = await apiClient.get<any>(`/gallery/${galleryId}/images/`);
    if (result.error) {
      console.error('获取图片列表失败:', result.error.message);
      return [];
    }
    if (result.data?.images) {
      return this.transformImageData(result.data.images);
    }
    return [];
  }

  /**
   * 获取父图集下所有子图集的图片，按子图集分组返回
   */
  async getGalleryChildrenImages(galleryId: string): Promise<{
    gallery: Gallery;
    images: GalleryImage[];
  }[]> {
    const result = await apiClient.get<any>(`/gallery/${galleryId}/children-images/`);
    if (result.error) {
      console.error('获取子图集图片失败:', result.error.message);
      return [];
    }
    if (result.data) {
      if (result.data.gallery) {
        return [{
          gallery: this.transformGalleryDetail(result.data.gallery),
          images: this.transformImageData(result.data.images)
        }];
      }
      if (result.data.children) {
        return result.data.children.map((child: any) => ({
          gallery: this.transformGalleryDetail(child.gallery),
          images: this.transformImageData(child.images)
        }));
      }
    }
    return [];
  }

  /**
   * 转换图集数据（树结构）
   */
  private transformGalleryData(data: any[]): Gallery[] {
    return data.map(item => this.transformGalleryItem(item));
  }

  /**
   * 转换单个图集项
   */
  private transformGalleryItem(item: any): Gallery {
    const gallery: Gallery = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      coverUrl: item.cover_url || '',
      coverThumbnailUrl: item.cover_thumbnail_url || item.cover_url || '',
      level: item.level || 0,
      imageCount: item.image_count || 0,
      folderPath: item.folder_path || '',
      tags: item.tags || [],
      isLeaf: !item.children || item.children.length === 0,
      createdAt: item.created_at || null
    };

    // 递归转换子图集
    if (item.children && item.children.length > 0) {
      gallery.children = item.children.map((child: any) =>
        this.transformGalleryItem(child)
      );
    }

    return gallery;
  }

  /**
   * 转换图集详情
   */
  private transformGalleryDetail(item: any): Gallery {
    const gallery: Gallery = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      coverUrl: item.cover_url || '',
      coverThumbnailUrl: item.cover_thumbnail_url || item.cover_url || '',
      level: item.level || 0,
      imageCount: item.image_count || 0,
      folderPath: item.folder_path || '',
      tags: item.tags || [],
      isLeaf: item.is_leaf || false,
      createdAt: item.created_at || null
    };

    // 转换面包屑
    if (item.breadcrumbs && item.breadcrumbs.length > 0) {
      gallery.breadcrumbs = item.breadcrumbs.map((crumb: any) => ({
        id: crumb.id,
        title: crumb.title
      }));
    }

    // 转换子图集
    if (item.children && item.children.length > 0) {
      gallery.children = item.children.map((child: any) => ({
        id: child.id,
        title: child.title,
        description: child.description || '',
        coverUrl: child.cover_url || '',
        coverThumbnailUrl: child.cover_thumbnail_url || child.cover_url || '',
        level: child.level || 0,
        imageCount: child.image_count || 0,
        folderPath: child.folder_path || '',
        tags: child.tags || [],
        isLeaf: child.is_leaf || false
      }));
    }

    return gallery;
  }

  /**
   * 转换图片数据
   */
  private transformImageData(images: any[]): GalleryImage[] {
    return images.map((img) => ({
      id: img.url,
      url: img.url,
      thumbnailUrl: img.thumbnail_url || img.thumbnailUrl,
      title: img.title,
      filename: img.filename,
      isGif: img.filename.toLowerCase().endsWith('.gif'),
      isVideo: img.filename.toLowerCase().endsWith('.mp4')
    }));
  }
}

// 导出单例实例
export const galleryService = new RealGalleryService();