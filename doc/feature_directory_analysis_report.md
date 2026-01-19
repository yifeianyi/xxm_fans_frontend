# Feature 目录新功能分析报告

## 概述

`feature/` 目录包含了一套完整的增强功能模块，相比当前主项目，新增了 4 个页面、3 个功能组件和多个数据类型定义。这些功能主要围绕**内容展示**、**数据可视化**和**用户体验优化**展开。

---

## 一、新增页面（4个）

### 1. AboutPage（关于页面）
**路径**: `feature/presentation/pages/AboutPage.tsx`

**功能描述**:
- 展示艺人个人信息和简介
- 声线特色展示（戏韵、治愈、张力、灵动）
- 成长里程碑时间线
- 社交媒体链接（Bilibili、微博、网易云音乐）

**核心特性**:
- 响应式设计，支持移动端和桌面端
- 使用 Lucide 图标库
- 玻璃态卡片设计风格
- 动画效果（浮动、旋转等）

**数据需求**:
- 艺人基础信息（生日、星座、栖息地、爱好）
- 声线特色描述
- 里程碑事件（年份、事件描述）
- 社交媒体链接

---

### 2. GalleryPage（图集页面）
**路径**: `feature/presentation/pages/GalleryPage.tsx`

**功能描述**:
- 图集列表展示（支持多图集分类）
- 单个图集内的照片流展示
- 照片灯箱预览（Lightbox）
- 照片标签和日期展示

**核心特性**:
- 瀑布流网格布局
- 图片懒加载
- 悬停放大效果
- 灯箱全屏预览
- 标签筛选

**数据需求**:
```typescript
interface Gallery {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  imageCount: number;
  tags: string[];
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  date: string;
  galleryIds: string[];
}
```

**API 需求**:
- `GET /api/galleries/` - 获取图集列表
- `GET /api/galleries/{id}/images/` - 获取图集内图片列表

---

### 3. LivestreamPage（直播纪事页面）
**路径**: `feature/presentation/pages/LivestreamPage.tsx`

**功能描述**:
- 直播日历视图（按月展示）
- 直播档案详情展示
- 完整回放视频播放
- 歌切列表（当日演唱歌曲）
- 直播截图回顾
- 弹幕词云分析

**核心特性**:
- 日历网格布局（蛇形排列）
- 多分段视频选择器
- Bilibili 视频嵌入播放
- 截图轮播预览
- 弹幕词云可视化

**数据需求**:
```typescript
interface Livestream {
  id: string;
  date: string;
  title: string;
  summary: string;
  coverUrl: string;
  viewCount: string;
  danmakuCount: string;
  startTime: string;
  endTime: string;
  duration: string;
  recordings: LivestreamRecording[];
  songCuts: SongCut[];
  screenshots: string[];
  danmakuCloudUrl: string;
}

interface LivestreamRecording {
  title: string;
  url: string;
}

interface SongCut {
  name: string;
  videoUrl: string;
}
```

**API 需求**:
- `GET /api/livestreams/?year={year}&month={month}` - 获取月度直播列表
- `GET /api/livestreams/{id}/` - 获取直播详情

---

### 4. DataAnalysisPage（数据分析页面）
**路径**: `feature/presentation/pages/DataAnalysisPage.tsx`

**功能描述**:
- 全站粉丝增长趋势（总量、净增）
- 单一投稿深度分析（播放、点赞、弹幕时序数据）
- 稿件对比实验室（多维度对比表格）
- 增长关联性实验室（视频播放与粉丝增长相关性）

**核心特性**:
- 自定义 SVG 图表组件（线图、柱图、双轴图）
- 时间粒度切换（小时、天、月）
- 多账号数据切换
- 极值标注（高/低标志）
- 数据格式化（w、k 单位）

**数据需求**:
```typescript
interface AccountData {
  id: string;
  name: string;
  totalFollowers: number;
  history: Record<TimeGranularity, DataPoint[]>;
}

interface VideoStats {
  id: string;
  title: string;
  cover: string;
  publishTime: string;
  duration: string;
  views: number;
  guestRatio: number;
  fanWatchRate: number;
  followerGrowth: number;
  likes: number;
  comments: number;
  danmaku: number;
  favs: number;
  metrics: Record<TimeGranularity, {
    views: DataPoint[];
    likes: DataPoint[];
    danmaku: DataPoint[];
  }>;
}

interface CorrelationData {
  time: string;
  videoViewDelta: number;
  followerDelta: number;
}

interface DataPoint {
  time: string;
  value: number;
  delta: number;
}

type TimeGranularity = 'HOUR' | 'DAY' | 'MONTH';
```

**API 需求**:
- `GET /api/analytics/accounts/` - 获取账号列表
- `GET /api/analytics/videos/` - 获取视频列表
- `GET /api/analytics/correlation/?granularity={granularity}` - 获取关联数据

---

## 二、新增功能组件（3个）

### 1. MusicPlayer（音乐播放器）
**路径**: `feature/presentation/components/common/MusicPlayer.tsx`

**功能描述**:
- 网易云音乐外链播放器嵌入
- 旋转唱片动画
- 底部固定悬浮
- 关闭按钮

**核心特性**:
- 使用网易云音乐外链播放器
- 自动播放
- 旋转动画效果
- 玻璃态设计

**数据需求**:
- 网易云音乐歌曲 ID

---

### 2. OriginalsList（原创作品列表）
**路径**: `feature/presentation/components/features/OriginalsList.tsx`

**功能描述**:
- 精选原创作品展示（3首）
- 作品档案库列表（29首）
- 随机播放功能
- 网易云音乐播放器集成

**核心特性**:
- 网格布局展示精选作品
- 列表布局展示档案库
- 播放状态指示
- 随机播放按钮
- 展开/收起功能

**数据需求**:
```typescript
interface OriginalWork {
  title: string;
  date: string;
  desc: string;
  cover: string;
  songId: string; // 网易云音乐 ID
  featured: boolean;
}
```

---

### 3. TimelineChart（时间线图表）
**路径**: `feature/presentation/components/features/TimelineChart.tsx`

**功能描述**:
- 年度投稿时间线可视化
- 蛇形月度布局（1-6月左到右，7-12月右到左）
- 月度详情视图
- 投稿记录卡片展示

**核心特性**:
- 蛇形时间线布局
- 活跃月份高亮
- 点击月份查看详情
- 视频播放集成
- 动画过渡效果

**数据需求**:
- 年份列表
- 活跃月份映射
- 月度投稿记录

**API 需求**:
- `GET /api/records/monthly/?year={year}&month={month}` - 获取月度投稿记录

---

## 三、新增数据类型定义

**路径**: `feature/domain/types.ts`

新增类型：
- `DataPoint` - 数据点（时间、值、增量）
- `TimeGranularity` - 时间粒度枚举
- `AccountData` - 账号数据
- `VideoStats` - 视频统计数据
- `CorrelationData` - 关联数据
- `Gallery` - 图集
- `GalleryImage` - 图集图片
- `Livestream` - 直播数据
- `LivestreamRecording` - 直播录像
- `SongCut` - 歌切
- `VideoMetric` - 视频指标
- `GlobalGrowth` - 全站增长
- `VideoDetailTrend` - 视频详情趋势

---

## 四、Navbar 导航更新

**路径**: `feature/presentation/components/layout/Navbar.tsx`

**新增导航项**:
- 森林图册 (`/gallery`)
- 直播日历 (`/live`)
- 数据洞察 (`/data`)
- 关于她 (`/about`)

**布局变化**:
- 导航项中心对称分布
- 头像居中显示
- 活动状态高亮

---

## 五、Mock API 更新

**路径**: `feature/infrastructure/api/mockApi.ts`

**新增 API 方法**:
- `getAccounts()` - 获取账号列表
- `getVideos()` - 获取视频列表
- `getCorrelation()` - 获取关联数据
- `getGalleries()` - 获取图集列表
- `getImagesByGallery()` - 获取图集图片
- `getLivestreams()` - 获取直播列表
- `getRecordsByMonth()` - 获取月度记录

---

## 六、App.tsx 路由更新

**路径**: `feature/App.tsx`

**新增路由**:
- `/gallery` - GalleryPage
- `/live` - LivestreamPage
- `/data` - DataAnalysisPage
- `/about` - AboutPage

**路由器变更**:
- 使用 `HashRouter` 替代 `BrowserRouter`（便于静态部署）
- 内联 Footer 组件

---

## 七、技术亮点

### 1. 自定义 SVG 图表
- 线图（TrendChart - type: 'line'）
- 柱图（TrendChart - type: 'bar'）
- 双轴图（CorrelationChart）
- 支持悬停交互和数据提示

### 2. 蛇形时间线布局
- 1-6月左到右排列
- 7-12月右到左排列
- 年份间连接线
- 活跃月份高亮

### 3. 玻璃态设计
- `backdrop-blur` 背景模糊
- 半透明白色背景
- 柔和阴影

### 4. 动画效果
- 悬停缩放
- 旋转动画
- 淡入淡出
- 滑动过渡

---

## 八、与当前项目的差异

| 项目 | 当前主项目 | Feature 目录 |
|------|-----------|-------------|
| 页面数量 | 2 | 6 |
| 导航项 | 2 | 6 |
| 数据类型 | 6 | 18 |
| Mock API | 基础 CRUD | 增强版 |
| 图表组件 | 无 | 自定义 SVG |
| 图集功能 | 无 | 有 |
| 直播功能 | 无 | 有 |
| 数据分析 | 无 | 有 |
| 音乐播放器 | 无 | 有 |
| 时间线 | 无 | 有 |

---

## 九、集成建议

### 优先级排序

**高优先级**（核心内容展示）:
1. **GalleryPage** - 图集功能，增强内容展示
2. **AboutPage** - 关于页面，完善站点信息
3. **Navbar 更新** - 导航栏更新，支持新页面

**中优先级**（增强功能）:
4. **LivestreamPage** - 直播纪事，记录直播历史
5. **OriginalsList** - 原创作品列表，展示原唱作品
6. **MusicPlayer** - 音乐播放器，增强音频播放体验

**低优先级**（高级功能）:
7. **DataAnalysisPage** - 数据分析，需要后端支持
8. **TimelineChart** - 时间线图表，需要后端支持

### 集成步骤

1. **数据类型迁移**
   - 将 `feature/domain/types.ts` 中的新类型合并到 `domain/types.ts`

2. **Mock API 迁移**
   - 将 `feature/infrastructure/api/mockApi.ts` 中的新方法合并到现有 Mock API

3. **组件迁移**
   - 将 `feature/presentation/components/` 下的组件迁移到对应位置
   - 注意路径和导入更新

4. **页面迁移**
   - 将 `feature/presentation/pages/` 下的页面迁移到 `presentation/pages/`
   - 更新 `App.tsx` 路由配置

5. **Navbar 更新**
   - 更新 `Navbar.tsx` 添加新导航项

6. **样式调整**
   - 确保玻璃态样式在 `index.html` 中定义
   - 检查动画效果

7. **API 对接**
   - 为新功能开发对应的后端 API
   - 更新 `RealSongService.ts` 实现真实 API 调用

---

## 十、注意事项

### 1. 路由器选择
- Feature 使用 `HashRouter`，主项目使用 `BrowserRouter`
- 建议统一使用 `BrowserRouter`（需要服务器配置支持）
- 或保留 `HashRouter`（便于静态部署）

### 2. 数据格式
- Feature 中的数据类型可能与主项目不一致
- 需要进行数据格式转换
- 注意字段命名规范

### 3. 样式冲突
- 玻璃态样式需要全局 CSS 变量支持
- 动画效果可能与其他组件冲突
- 需要测试响应式布局

### 4. 性能优化
- 图表组件可能影响性能
- 图片懒加载需要实现
- 大数据量需要分页

### 5. 后端依赖
- 数据分析页面需要大量后端支持
- 直播数据需要实时同步
- 图集需要图片存储服务

---

## 十一、总结

`feature/` 目录提供了一套完整的增强功能模块，主要包括：

1. **4 个新页面** - AboutPage、GalleryPage、LivestreamPage、DataAnalysisPage
2. **3 个新组件** - MusicPlayer、OriginalsList、TimelineChart
3. **12 个新数据类型** - 支持图集、直播、数据分析等功能
4. **7 个新 API 方法** - 支持数据获取

这些功能可以显著提升用户体验和内容展示能力，特别是图集、直播纪事和数据分析功能，可以为粉丝站提供更丰富的内容和更深入的数据洞察。

建议按照优先级逐步集成，先集成核心内容展示功能，再集成增强功能，最后集成需要后端支持的高级功能。