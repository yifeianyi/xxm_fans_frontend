# 图集页面优化方案

## 当前方案问题分析

### 1. 信息架构问题
| 问题 | 影响 |
|------|------|
| 点击后才加载图片 | 用户等待时间长，体验不流畅 |
| 缺少侧边栏导航 | 图集层级多时难以快速切换 |
| 面包屑导航简陋 | 无法快速跳转到任意层级 |
| 没有搜索功能 | 图集多的时候难以查找 |

### 2. 交互体验问题
| 问题 | 影响 |
|------|------|
| 图片查看器无缩略图导航 | 无法快速跳转到指定图片 |
| 图片加载无占位 | 布局跳动，体验差 |
| 缺少图片预加载 | 切换图片时有延迟 |
| 没有加载更多机制 | 图集图片多时一次性加载慢 |

### 3. 展示模式单一
- 父图集（有子图集）只能显示子图集卡片
- 无法显示子图集的图片聚合预览
- 缺少大图/列表切换视图

---

## 优化方案设计

### 方案 A: 侧边栏 + 主内容区（推荐）

参考原项目设计，采用经典的双栏布局：

```
┌──────────────────────────────────────────────────────┐
│  Header (搜索 + 面包屑 + 视图切换)                    │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │              Main Content                 │
│ 图集树    │            (图片网格 / 图集卡片)           │
│          │                                           │
│ - 可折叠  │                                           │
│ - 可搜索  │                                           │
│ - 树形结构│                                           │
│          │                                           │
└──────────┴───────────────────────────────────────────┘
```

**优点**:
- 快速导航，任意图集间切换无需返回
- 清晰的层级结构展示
- 搜索与浏览可并行操作
- 移动端侧边栏可收起

**实现要点**:
1. 创建 `useGalleryData` Hook 统一管理状态
2. 侧边栏使用树形组件展示层级
3. 主内容区根据当前图集类型动态渲染
4. 图片查看器添加底部缩略图栏

### 方案 B: 单页面 + Tab 切换（简化版）

在现有基础上增加 Tab 切换：

```
┌──────────────────────────────────────────────────────┐
│  Header (面包屑 + 返回)                               │
├──────────────────────────────────────────────────────┤
│  [图集列表] [图片列表] [聚合预览]                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│                 内容区域                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**三种视图模式**:
1. **图集列表** - 显示子图集卡片（当前实现）
2. **图片列表** - 显示当前图集图片（仅叶子节点）
3. **聚合预览** - 显示所有子图集图片分组（父节点）

---

## 推荐实现: 方案 A

### 组件结构

```
app/albums/
├── page.tsx                    # 主页面，整合所有组件
├── components/
│   ├── GalleryLayout.tsx       # 双栏布局容器
│   ├── GallerySidebar.tsx      # 左侧图集树
│   ├── GalleryHeader.tsx       # 顶部工具栏
│   ├── GalleryGrid.tsx         # 图集卡片网格
│   ├── ImageGrid.tsx           # 图片网格
│   ├── ChildrenImageDisplay.tsx # 子图集图片分组展示
│   ├── ImageViewer.tsx         # 全屏图片查看器
│   ├── ImageThumbnailBar.tsx   # 底部缩略图栏
│   └── SearchBox.tsx           # 搜索组件
├── hooks/
│   └── useGalleryData.ts       # 数据管理 Hook
└── types.ts                    # 页面专用类型
```

### 核心交互逻辑

```typescript
// 数据流设计
const useGalleryData = () => {
  // 1. 加载完整的图集树（一次加载）
  const galleryTree = useSWR('/gallery/tree', fetcher);
  
  // 2. 当前选中的图集 ID
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  // 3. 根据 currentId 计算当前图集
  const currentGallery = useMemo(() => findGallery(galleryTree, currentId), [...]);
  
  // 4. 加载当前图集的图片（叶子节点）
  const images = useSWR(
    currentGallery?.isLeaf ? `/gallery/${currentId}/images` : null,
    fetcher
  );
  
  // 5. 搜索逻辑
  const [searchTerm, setSearchTerm] = useState('');
  const searchResults = useMemo(() => searchGalleries(galleryTree, searchTerm), [...]);
  
  return {
    galleryTree,
    currentGallery,
    images,
    breadcrumbs,
    searchTerm, setSearchTerm,
    searchResults,
    handleGalleryClick,
    handleSearchResultClick,
    toggleExpand,
  };
};
```

### 图片查看器优化

```typescript
interface ImageViewerProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// 新增功能：
// 1. 底部缩略图栏，可点击跳转
// 2. 左右滑动切换（移动端）
// 3. 预加载前后各 2 张图片
// 4. 图片加载占位（骨架屏）
// 5. 显示图片信息（文件名、尺寸等）
```

### 性能优化点

1. **图片懒加载**: 使用 Intersection Observer
2. **图片预加载**: 查看器预加载前后图片
3. **树形结构虚拟滚动**: 图集多时只渲染可见部分
4. **SWR 缓存**: 图集树缓存，图片按需加载
5. **图片渐进加载**: 先显示模糊缩略图，再加载高清图

---

## 实现优先级

### P0 - 核心功能
- [ ] 侧边栏图集树组件
- [ ] 双栏布局容器
- [ ] 图片查看器 + 缩略图栏

### P1 - 体验优化
- [ ] 搜索功能
- [ ] 树形节点展开/折叠
- [ ] 图片懒加载

### P2 - 高级功能
- [ ] 聚合预览模式
- [ ] 键盘快捷键
- [ ] 批量下载

---

## 与原项目的对比改进

| 功能 | 原项目 | 优化方案 |
|------|--------|----------|
| 侧边栏 | 有，但功能单一 | 增加搜索、快速定位 |
| 图片查看器 | 有缩略图栏 | 增加预加载、手势支持 |
| 搜索 | 有 | 实时搜索、高亮匹配 |
| 移动端 | 侧边栏遮挡 | 优化为抽屉式 |
| 加载体验 | 普通 | 骨架屏 + 渐进加载 |
