import { Gallery, GalleryImage, Breadcrumb } from '../../domain/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class RealGalleryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/gallery`;
  }

  /**
   * 获取图集树结构
   */
  async getGalleryTree(): Promise<Gallery[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tree/`);
      const result = await response.json();

      if (result.code === 200 && result.data) {
        return this.transformGalleryData(result.data);
      } else {
        console.error('获取图集树失败:', result.message);
        return [];
      }
    } catch (error) {
      console.error('获取图集树失败:', error);
      return [];
    }
  }

  /**
   * 获取图集详情
   */
  async getGalleryDetail(galleryId: string): Promise<Gallery | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${galleryId}/`);
      const result = await response.json();

      if (result.code === 200 && result.data) {
        return this.transformGalleryDetail(result.data);
      } else {
        console.error('获取图集详情失败:', result.message);
        return null;
      }
    } catch (error) {
      console.error('获取图集详情失败:', error);
      return null;
    }
  }

  /**
   * 获取图集图片列表
   */
  async getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${galleryId}/images/`);
      const result = await response.json();

      if (result.code === 200 && result.data) {
        return this.transformImageData(result.data.images);
      } else {
        console.error('获取图片列表失败:', result.message);
        return [];
      }
    } catch (error) {
      console.error('获取图片列表失败:', error);
      return [];
    }
  }

  /**
   * 获取父图集下所有子图集的图片，按子图集分组返回
   */
  async getGalleryChildrenImages(galleryId: string): Promise<{
    gallery: Gallery;
    images: GalleryImage[];
  }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${galleryId}/children-images/`);
      const result = await response.json();

      if (result.code === 200 && result.data) {
        // 如果是叶子节点，返回单个图集的图片
        if (result.data.gallery) {
          return [{
            gallery: this.transformGalleryDetail(result.data.gallery),
            images: this.transformImageData(result.data.images)
          }];
        }
        // 如果是父节点，返回所有子图集的图片
        if (result.data.children) {
          return result.data.children.map((child: any) => ({
            gallery: this.transformGalleryDetail(child.gallery),
            images: this.transformImageData(child.images)
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('获取子图集图片失败:', error);
      return [];
    }
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
      thumbnail_url: img.thumbnail_url,
      title: img.title,
      filename: img.filename,
      isGif: img.filename.toLowerCase().endsWith('.gif'),
      isVideo: img.filename.toLowerCase().endsWith('.mp4')
    }));
  }
}

// 导出单例实例
export const galleryService = new RealGalleryService();