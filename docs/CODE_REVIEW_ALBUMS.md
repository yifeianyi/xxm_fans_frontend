# 图集模块代码审查报告

**审查日期**: 2026-02-18  
**审查范围**: `app/albums/` 目录下所有文件  
**审查人**: AI Assistant

---

## 1. 总体评价

### 优点 ✅
1. **架构清晰**: 采用 DDD 分层思想，Hook 与组件分离
2. **功能完整**: 支持树形导航、图片聚合、搜索、查看器等功能
3. **TypeScript**: 类型定义完整，接口清晰
4. **用户体验**: 有加载状态、空状态、错误边界处理

### 严重问题 🔴
1. **性能问题**: 递归搜索和查找每次都会重新遍历整棵树
2. **内存泄漏**: useEffect 缺少 cleanup，事件监听未移除
3. **重复渲染**: useMemo 依赖项可能导致不必要的重新计算
4. **错误处理不完善**: API 失败时用户体验差

---

## 2. 逐文件审查

### 2.1 `hooks/useAlbumsData.ts` ⚠️ 高风险

#### 问题 1: 性能瓶颈 - 递归搜索 (第 46-65 行)
```typescript
const searchGalleries = (tree: Gallery[], term: string): Gallery[] => {
    // 问题: 每次搜索都遍历整棵树，O(n) 复杂度
    // 建议: 使用索引或缓存搜索结果
}
```

**影响**: 图集数量多时搜索卡顿  
**建议**: 
- 使用 useMemo 缓存搜索结果
- 考虑使用索引数据结构
- 添加防抖

#### 问题 2: 重复查找 (第 70-96 行)
```typescript
const findGallery = (tree: Gallery[], id: string): Gallery | null => {
    // 问题: 每次点击都遍历整棵树找图集
    // 建议: 使用 Map 存储图集索引
}
```

**建议**: 
```typescript
// 优化方案: 在 Hook 中维护一个图集 Map
const galleryMap = useMemo(() => {
    const map = new Map<string, Gallery>();
    const traverse = (galleries: Gallery[]) => {
        for (const g of galleries) {
            map.set(g.id, g);
            if (g.children) traverse(g.children);
        }
    };
    traverse(galleryTree);
    return map;
}, [galleryTree]);
```

#### 问题 3: 缺少依赖项 (第 185 行)
```typescript
const handleGalleryClick = useCallback(async (gallery: Gallery) => {
    // ...
}, []); // ⚠️ 缺少依赖: 应该依赖 galleryRepository 或使用 ref
```

**风险**: 闭包陷阱，可能使用旧的函数引用

#### 问题 4: 状态管理混乱
```typescript
// 同时维护 images 和 childrenImagesGroups，容易不一致
const [images, setImages] = useState<GalleryImage[]>([]);
const [childrenImagesGroups, setChildrenImagesGroups] = useState<...>([]);

// 建议: 使用一个派生状态
const displayImages = useMemo(() => {
    if (currentGallery?.isLeaf) return images;
    return childrenImagesGroups.flatMap(g => g.images);
}, [images, childrenImagesGroups, currentGallery]);
```

---

### 2.2 `components/Sidebar.tsx` ⚠️ 中风险

#### 问题 1: 递归组件性能 (GalleryTreeItem)
```typescript
// 问题: 每次父组件渲染都递归重建整个树
// 建议: 使用 React.memo 和 useMemo
```

**优化**:
```typescript
const GalleryTreeItem = React.memo(function GalleryTreeItem({...}) {
    // 组件体
});
```

#### 问题 2: 搜索结果显示不完整
```typescript
// 当前只显示标题，缺少上下文
{searchResults.map(gallery => (
    <div key={gallery.id}>
        <span>{gallery.title}</span>
    </div>
))}

// 建议: 显示路径上下文，帮助用户理解图集位置
```

---

### 2.3 `components/ImageGrid.tsx` ✅ 良好

#### 优点
- 使用 Intersection Observer 实现懒加载
- 骨架屏占位，避免布局跳动
- 视频悬停播放交互合理

#### 小问题: 缺少错误处理
```typescript
<img 
    src={image.thumbnailUrl || image.url}
    onError={() => {/* 应该处理加载失败 */}}
/>
```

---

### 2.4 `components/ImageViewer.tsx` ⚠️ 中风险

#### 问题 1: 内存泄漏风险
```typescript
useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
    };
}, [isOpen, onClose, onPrevious, onNext]);
```

**风险**: 依赖项变化时会重复添加/移除事件监听  
**建议**: 使用单一清理函数模式

#### 问题 2: 图片缩放状态未重置
```typescript
const [scale, setScale] = useState(1);

// 切换图片时没有重置缩放
// 建议:
useEffect(() => {
    setScale(1);
}, [currentIndex]);
```

#### 问题 3: 缩略图栏性能
```typescript
// 所有缩略图一次性渲染，图集图片多时卡顿
// 建议: 只渲染可见区域的缩略图
```

---

### 2.5 `components/ChildrenImagesDisplay.tsx` ✅ 良好

#### 小问题: 索引计算效率
```typescript
const getGlobalIndex = (groupIndex: number, imageIndex: number): number => {
    // 每次点击都遍历计算
    let index = 0;
    for (let i = 0; i < groupIndex; i++) {
        index += childrenGroups[i].images.length;
    }
    return index + imageIndex;
}

// 建议: 使用 useMemo 预计算索引映射
const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    let index = 0;
    for (const group of childrenGroups) {
        for (const img of group.images) {
            map.set(img.id, index++);
        }
    }
    return map;
}, [childrenGroups]);
```

---

### 2.6 `page.tsx` ✅ 良好

#### 优点
- 组件拆分合理
- 逻辑清晰

#### 建议: 提取配置
```typescript
// 硬编码的样式配置可以提取
className="text-[#f8b195]" // 主题色应该统一配置

// 建议: 使用 CSS 变量或主题配置
```

---

## 3. 关键 Bug

### Bug 1: 图集切换时状态残留 (useAlbumsData.ts)
```typescript
// 问题: 点击新图集时，旧图集的图片可能短暂显示
const handleGalleryClick = useCallback(async (gallery: Gallery) => {
    setLoadingImages(true);
    // 没有立即清空旧图片，用户会看到上一个图集的图片
    
// 修复:
const handleGalleryClick = useCallback(async (gallery: Gallery) => {
    setImages([]); // 立即清空
    setChildrenImagesGroups([]);
    setLoadingImages(true);
    // ...
```

### Bug 2: 错误时未恢复状态
```typescript
try {
    // ...
} catch (error) {
    console.error('Failed to fetch images:', error);
    setCurrentGallery(gallery); // ⚠️ 使用传入的 gallery，可能已过期
    setImages([]);
}
```

---

## 4. 性能优化建议

### 4.1 使用虚拟滚动
图集图片多时（>100 张），建议使用 `react-window` 或 `@tanstack/react-virtual`

### 4.2 图片加载优化
```typescript
// 当前: 一次性加载所有缩略图
// 优化: 分层加载
// 1. 先加载低质量占位图
// 2. 进入视口后加载缩略图
// 3. 查看器中加载原图
```

### 4.3 数据缓存
```typescript
// 使用 SWR 或 React Query 缓存 API 响应
const { data: galleryTree } = useSWR('/gallery/tree', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 分钟内不重复请求
});
```

---

## 5. 代码风格建议

### 5.1 常量提取
```typescript
// 建议创建 constants.ts
export const GALLERY_CONFIG = {
    GRID_COLUMNS: {
        mobile: 2,
        tablet: 3,
        desktop: 4,
        wide: 5,
    },
    THUMBNAIL_SIZE: 200,
    LAZY_LOAD_OFFSET: '50px',
};
```

### 5.2 类型定义统一
```typescript
// 建议创建 types.ts
export interface GalleryWithImages {
    gallery: Gallery;
    images: GalleryImage[];
}

export interface BreadcrumbItem {
    id: string;
    title: string;
}
```

---

## 6. 推荐重构方案

### 6.1 使用状态机管理图集状态
```typescript
type GalleryState = 
    | { status: 'idle' }
    | { status: 'loading_tree' }
    | { status: 'loading_gallery'; galleryId: string }
    | { status: 'ready'; gallery: Gallery; images: GalleryImage[] }
    | { status: 'error'; error: Error };
```

### 6.2 使用 Context 避免 Props Drilling
Sidebar、ImageGrid、ImageViewer 共享大量状态，可以使用 Context。

---

## 7. 优先级排序

| 优先级 | 问题 | 影响 |
|--------|------|------|
| 🔴 P0 | 递归搜索性能 | 卡顿 |
| 🔴 P0 | Bug: 状态残留 | 错误显示 |
| 🟡 P1 | 图片缩放未重置 | 体验 |
| 🟡 P1 | 缩略图栏性能 | 卡顿 |
| 🟢 P2 | 常量提取 | 维护性 |
| 🟢 P2 | 错误处理完善 | 健壮性 |

---

## 8. 总结

**整体评分**: 7/10

- 架构设计良好，但性能优化不足
- 功能完整，但边界情况处理不够
- 代码可读性好，但缺乏统一规范

**主要改进方向**:
1. 优化递归算法，使用索引结构
2. 完善错误处理和边界情况
3. 添加虚拟滚动支持大图集
4. 使用 SWR/React Query 优化数据获取
