/**
 * 获取图集树用例
 * 
 * 属于 Application 层，负责编排获取图集层级结构的业务逻辑
 * 
 * @module application/gallery
 */

import { Gallery } from '@/app/domain/types';
import { IGalleryRepository } from '@/app/domain/repositories';

/** 树节点 */
export interface GalleryTreeNode extends Gallery {
    children: GalleryTreeNode[];
    isExpanded?: boolean;
}

/** 用例输出 DTO */
export interface GetGalleryTreeOutput {
    tree: GalleryTreeNode[];
    totalCount: number;
}

/**
 * 获取图集树用例
 */
export class GetGalleryTreeUseCase {
    constructor(private galleryRepository: IGalleryRepository) {}

    /**
     * 执行用例
     * @param parentId 父级图集 ID（可选，获取根级别）
     * @returns 图集树结构
     */
    async execute(parentId?: string): Promise<GetGalleryTreeOutput> {
        const galleries = await this.galleryRepository.getGalleries({ parentId });

        // 构建树形结构
        const tree = this.buildTree(galleries, parentId);

        return {
            tree,
            totalCount: galleries.length,
        };
    }

    /**
     * 构建树形结构
     */
    private buildTree(galleries: Gallery[], parentId?: string): GalleryTreeNode[] {
        const nodeMap = new Map<string, GalleryTreeNode>();
        const roots: GalleryTreeNode[] = [];

        // 首先创建所有节点
        for (const gallery of galleries) {
            nodeMap.set(gallery.id, {
                ...gallery,
                children: [],
            });
        }

        // 然后建立层级关系
        for (const gallery of galleries) {
            const node = nodeMap.get(gallery.id)!;
            
            // 如果有子节点引用，添加到 children
            if (gallery.children && gallery.children.length > 0) {
                for (const child of gallery.children) {
                    const childNode = nodeMap.get(child.id);
                    if (childNode) {
                        node.children.push(childNode);
                    }
                }
            }

            // 确定根节点
            const isRoot = !parentId || 
                          gallery.level === 0 || 
                          !gallery.breadcrumbs || 
                          gallery.breadcrumbs.length === 0;

            if (isRoot) {
                roots.push(node);
            }
        }

        return roots;
    }

    /**
     * 获取图集路径（面包屑）
     * @param galleryId 图集 ID
     * @returns 面包屑路径
     */
    async getBreadcrumbs(galleryId: string): Promise<Array<{ id: string; title: string }>> {
        return this.galleryRepository.getGalleryBreadcrumbs(galleryId);
    }
}
