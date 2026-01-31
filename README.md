# XXM Fans Home

<div align="center">

**成熟可复用的歌手相关网站解决方案**

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

</div>

## ✨ 项目简介

XXM Fans Home 是一套**成熟可复用的歌手相关网站解决方案**，提供完整的粉丝站前端实现。本方案基于现代化前端技术栈构建，采用 DDD 三层架构设计，开箱即用，可快速搭建任何歌手、艺人、乐队的粉丝网站。 效果示例: [xxm8777.cn](https://www.xxm8777.cn)

### 适用对象

- 🎤 **歌手/艺人官方团队** - 搭建官方粉丝站，展示作品、演出记录
- 🎸 **乐队/音乐团体** - 建立乐队官网，管理歌曲、专辑、演出信息
- 👥 **粉丝运营团队** - 运营粉丝社区，管理粉丝二创作品
- 🎵 **音乐工作室** - 展示签约艺人作品和演出记录
- 📱 **音乐自媒体** - 搭建音乐内容平台，分享音乐资讯
- 🎓 **学习开发者** - 学习现代化前端架构和最佳实践

### 解决的问题

- ✅ **快速建站** - 无需从零开发，直接复用成熟方案
- ✅ **内容管理** - 完善的歌曲、作品、记录管理系统
- ✅ **粉丝互动** - 支持粉丝二创作品展示和互动
- ✅ **数据展示** - 热歌榜、排行榜等数据可视化展示
- ✅ **多端适配** - 响应式设计，完美适配各种设备
- ✅ **易于维护** - 清晰的架构设计，降低维护成本

## 🎯 核心功能

### 1. 歌曲管理系统

**功能描述**：完整的歌曲信息管理和展示系统

**包含功能**：
- 📋 **歌曲列表** - 展示所有歌曲，支持分页加载
- 🔍 **智能搜索** - 支持歌名、歌手关键词搜索
- 🏷️ **多维筛选** - 按曲风、标签、语种等多维度筛选
- 📊 **排序功能** - 支持按演唱次数、最近演唱等排序
- 📈 **热歌榜** - 展示不同时间范围的热门歌曲排行榜
- 🎁 **随机推荐** - 随机推荐歌曲，增加用户探索乐趣

**所需数据结构**：
```typescript
{
  id: string;              // 歌曲ID
  name: string;            // 歌曲名称
  originalArtist: string;  // 原唱歌手
  genres: string[];        // 曲风列表（流行、古风、摇滚等）
  languages: string[];     // 语种列表（国语、日语、英语等）
  tags: string[];          // 标签列表（经典、热门、新歌等）
  performanceCount: number;// 演唱次数
  firstPerformance: string;// 首次演唱日期
  lastPerformance: string; // 最近演唱日期
}
```

### 2. 演唱记录管理

**功能描述**：记录和展示每首歌曲的详细演唱历史

**包含功能**：
- 📅 **历史记录** - 展示每首歌曲的完整演唱历史
- 🖼️ **封面展示** - 展示每次演唱的封面图片
- 📝 **备注信息** - 记录每次演唱的备注和说明
- 🎬 **视频回放** - 支持视频链接，可直接播放
- 📄 **分页加载** - 支持大量记录的分页展示

**部分效果展示**：
![web_show](public/doc_photos//web_show.png)

**所需数据结构**：
```typescript
{
  id: string;        // 记录ID
  songId: string;    // 关联歌曲ID
  date: string;      // 演唱日期
  cover: string;     // 封面图片URL
  note: string;      // 备注信息
  videoUrl: string;  // 视频链接URL
}
```

### 3. 粉丝二创作品管理

**功能描述**：展示和管理粉丝创作的二创作品

**包含功能**：
- 📁 **作品合集** - 按主题分类展示作品合集
- 🎨 **作品展示** - 网格布局展示作品卡片
- 🔖 **分类筛选** - 支持按合集筛选作品
- ▶️ **视频播放** - 支持多平台视频播放
- 👤 **作者信息** - 展示作品作者信息
- 💬 **作品备注** - 展示作品描述和备注

**所需数据结构**：
```typescript
// 作品合集
{
  id: string;          // 合集ID
  name: string;        // 合集名称
  description: string; // 合集描述
  worksCount: number;  // 作品数量
}

// 作品信息
{
  id: string;          // 作品ID
  title: string;       // 作品标题
  author: string;      // 作者名称
  cover: string;       // 封面图片URL
  videoUrl: string;    // 视频链接URL
  note: string;        // 作品备注
  collectionId: string;// 关联合集ID
  position: number;    // 排序位置
}
```

### 4. 内容推荐系统

**功能描述**：智能推荐内容，提升用户浏览体验

**包含功能**：
- 📝 **推荐语展示** - 展示管理员设置的推荐语
- 🎵 **推荐歌曲** - 推荐相关歌曲列表
- 🎲 **随机推荐** - 随机推荐歌曲，增加探索性

**所需数据结构**：
```typescript
{
  content: string;              // 推荐语内容
  recommendedSongs: string[];   // 推荐歌曲ID列表
}
```

### 5. 多媒体播放支持

**功能描述**：支持多平台视频嵌入播放

**支持平台**：
- 📺 **Bilibili** - 自动解析 BV 号，支持分 P
- 🌐 **YouTube** - 自动解析视频 ID
- 🔗 **其他平台** - 支持直接链接播放

**使用场景**：
- 演唱记录视频播放
- 粉丝二创作品播放
- MV 播放

### 6. 数据分析功能

**功能描述**：数据可视化和统计分析功能

**包含功能**：
- 📊 **账号数据展示** - 展示账号粉丝数增长趋势
- 📈 **视频统计分析** - 展示视频播放量、点赞、评论等数据
- 🔄 **相关性分析** - 分析视频播放与粉丝增长的相关性
- ⏱️ **时间线图表** - 按时间维度展示数据变化

**所需数据结构**：
```typescript
{
  id: string;
  name: string;
  totalFollowers: number;
  history: Record<TimeGranularity, DataPoint[]>;
}
```

### 7. 图集功能

**功能描述**：图片合集管理和展示

**包含功能**：
- 🖼️ **图片合集** - 按主题分类的图片合集
- 📋 **图片列表** - 展示合集内的所有图片
- 🏷️ **标签分类** - 支持按标签筛选图片
- 📅 **时间排序** - 按日期展示图片

**所需数据结构**：
```typescript
{
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  imageCount: number;
  tags: string[];
}
```

### 8. 直播功能

**功能描述**：直播记录和回放管理

**包含功能**：
- 📺 **直播记录** - 展示历史直播记录
- 🎵 **歌曲剪辑** - 直播中的精彩片段
- 📸 **截图展示** - 直播截图合集
- 💬 **弹幕云** - 弹幕词云展示

**所需数据结构**：
```typescript
{
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
```

### 9. 原唱作品功能

**功能描述**：展示原唱作品

**包含功能**：
- 🎵 **原创歌曲** - 展示原创歌曲作品
- ⭐ **特色标记** - 突出展示特色作品
- 📅 **发布时间** - 按时间排序展示
- 🎬 **关联视频** - 关联视频链接

**所需数据结构**：
```typescript
{
  title: string;
  date: string;
  desc: string;
  cover: string;
  songId: string;
  featured: boolean;
}
```

## 🗄️ 数据需求

### 必需数据

本方案需要后端提供以下数据接口：

#### 歌曲相关接口

| 接口路径 | 方法 | 功能说明 | 所需参数 |
|---------|------|---------|---------|
| `/api/songs/` | GET | 获取歌曲列表 | q(搜索)、page(页码)、limit(每页数)、ordering(排序)、styles(曲风)、tags(标签)、language(语种) |
| `/api/songs/{id}/records/` | GET | 获取演唱记录 | page(页码)、page_size(每页数) |
| `/api/top_songs/` | GET | 获取热歌榜 | range(时间范围)、limit(数量) |
| `/api/random-song/` | GET | 获取随机歌曲 | 无 |

#### 粉丝二创接口

| 接口路径 | 方法 | 功能说明 | 所需参数 |
|---------|------|---------|---------|
| `/api/fansDIY/collections/` | GET | 获取合集列表 | page(页码)、limit(每页数) |
| `/api/fansDIY/collections/{id}/` | GET | 获取合集详情 | 无 |
| `/api/fansDIY/works/` | GET | 获取作品列表 | page(页码)、limit(每页数)、collection(合集ID) |
| `/api/fansDIY/works/{id}/` | GET | 获取作品详情 | 无 |

#### 数据分析接口

| 接口路径 | 方法 | 功能说明 | 所需参数 |
|---------|------|---------|---------|
| `/api/data-analytics/works/` | GET | 获取作品列表 | platform(平台)、is_valid(是否有效)、limit(数量)、offset(偏移量) |
| `/api/data-analytics/works/{platform}/{work_id}/metrics/summary/` | GET | 获取作品指标汇总 | start_time(开始时间)、end_time(结束时间) |

#### 网站设置接口

| 接口路径 | 方法 | 功能说明 | 所需参数 |
|---------|------|---------|---------|
| `/api/recommendation/` | GET | 获取推荐内容 | all(是否返回所有)、is_active(是否只返回激活的) |
| `/api/site-settings/settings/` | GET | 获取网站设置 | 无 |

#### 静态资源

| 路径 | 说明 |
|------|------|
| `/covers/*` | 封面图片资源 |
| `/media/*` | 媒体文件资源 |

### 数据格式要求

- **响应格式**：JSON
- **分页格式**：`{ total, page, page_size, results }`
- **错误格式**：`{ error: "错误信息" }`
- **CORS**：需要配置允许前端跨域访问

## 🚀 快速部署

### 方案一：使用现有后端 API

如果已有符合接口规范的后端 API：

1. **克隆项目**
```bash
git clone <repository-url>
cd xxm_fans_frontend
```

2. **安装依赖**
```bash
npm install
```

3. **配置后端地址**

编辑 `vite.config.ts`，修改代理配置：
```typescript
proxy: {
  '/api': {
    target: 'YOUR_BACKEND_URL',  // 修改为你的后端地址
    changeOrigin: true,
    secure: false,
  },
  '/covers': {
    target: 'YOUR_BACKEND_URL',
    changeOrigin: true,
    secure: false,
  },
  '/media': {
    target: 'YOUR_BACKEND_URL',
    changeOrigin: true,
    secure: false,
  }
}
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **构建生产版本**
```bash
npm run build
```

### 方案二：对接自定义后端

如果需要对接自定义后端：

1. **实现后端接口**

参考 [API 接口规范](#数据需求) 章节，实现所有必需的接口。

2. **数据格式转换**

如果后端返回的数据格式与前端期望的格式不一致，需要在 `infrastructure/api/RealSongService.ts` 中进行数据转换。

3. **配置环境变量**

创建 `.env` 文件：
```env
VITE_API_BASE_URL=/api
```

4. **启动应用**

```bash
npm install
npm run dev
```

### 方案三：使用 Mock 数据

如果暂时没有后端，可以使用 Mock 数据进行开发：

1. **创建 Mock 服务**

在 `infrastructure/api/` 下创建 `MockSongService.ts`，实现 `ISongService` 接口。

2. **修改服务导出**

编辑 `infrastructure/api/index.ts`：
```typescript
import { songService, fanDIYService } from './MockSongService';
export { songService, fanDIYService };
```

3. **启动应用**

```bash
npm install
npm run dev
```

### 生产环境部署

#### 1. 构建项目

```bash
npm run build
```

#### 2. 部署到服务器

将 `dist/` 目录部署到你的服务器，可以使用以下方式：

- **Nginx**：配置静态文件服务
- **Apache**：配置静态文件服务
- **Vercel**：直接部署
- **Netlify**：直接部署
- **GitHub Pages**：直接部署

#### 3. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /covers {
        proxy_pass http://your-backend-api;
        proxy_set_header Host $host;
    }

    location /media {
        proxy_pass http://your-backend-api;
        proxy_set_header Host $host;
    }
}
```

#### 4. 环境变量配置

生产环境可以通过环境变量配置：

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🎨 自定义配置

### 品牌定制

修改 `index.html` 中的网站信息：

```html
<title>你的网站名称</title>
<meta name="description" content="网站描述">
<meta name="keywords" content="关键词">
```

修改 `infrastructure/config/config.ts` 中的站点信息：

```typescript
site: {
  name: '你的网站名称',
  icp: '你的ICP备案号'
}
```

### 主题定制

修改 `index.html` 中的 CSS 变量：

```css
:root {
  --sage-bg: #f2f9f1;        /* 背景色 */
  --meadow-green: #8eb69b;    /* 主色调 */
  --peach-accent: #f8b195;    /* 强调色 */
  --butter-yellow: #fff4d1;   /* 辅助色 */
  --earthy-brown: #4a3728;    /* 文字色 */
}
```

### 功能定制

根据需要启用或禁用功能：

- **禁用粉丝二创**：在 `App.tsx` 中移除 `/fansDIY` 路由
- **禁用数据分析**：在 `App.tsx` 中移除 `/data` 路由
- **禁用图集**：在 `App.tsx` 中移除 `/gallery` 路由
- **禁用直播**：在 `App.tsx` 中移除 `/live` 路由
- **修改排序选项**：在 `infrastructure/config/constants.ts` 中修改常量
- **添加新筛选条件**：在 `domain/types.ts` 中添加类型，在 `RealSongService.ts` 中实现

## 🏗️ 技术架构

### 架构设计

采用 **DDD 三层架构**，确保代码的可维护性和可扩展性：

```
domain/          # 领域层 - 业务模型和接口定义
infrastructure/  # 基础设施层 - API 实现和配置管理
presentation/    # 表现层 - React 组件和页面
shared/          # 共享层 - 工具函数和共享服务
```

### 技术栈

- **前端框架**: React 19.2.3 + TypeScript 5.8.2
- **构建工具**: Vite 6.2.0
- **路由**: React Router DOM 7.12.0
- **图标**: Lucide React 0.562.0
- **样式**: Tailwind CSS（CDN）

### 核心优势

- ✅ **开箱即用** - 无需从零开发，直接复用
- ✅ **架构清晰** - DDD 三层架构，易于维护
- ✅ **类型安全** - 完整的 TypeScript 类型定义
- ✅ **易于扩展** - 基于接口设计，易于扩展新功能
- ✅ **响应式** - 完美适配各种设备
- ✅ **性能优化** - 使用现代化构建工具，加载速度快

## 📊 适用场景

### 场景一：歌手官方粉丝站

**需求**：为歌手搭建官方粉丝站，展示歌曲、演出记录

**解决方案**：
- 使用歌曲管理系统展示所有歌曲
- 使用演唱记录管理展示演出历史
- 使用热歌榜展示热门歌曲
- 使用推荐系统推荐新歌
- 使用数据分析功能展示账号数据增长
- 使用图集功能展示演唱会照片
- 使用直播功能展示直播回放

### 场景二：乐队官网

**需求**：为乐队建立官网，管理歌曲、专辑、演出信息

**解决方案**：
- 使用歌曲管理系统管理乐队作品
- 使用演唱记录管理记录演出历史
- 使用粉丝二创展示粉丝翻唱作品
- 使用原唱作品功能展示乐队原创
- 使用图集功能展示乐队照片
- 使用直播功能展示直播回放
- 自定义主题色和品牌信息

### 场景三：音乐工作室

**需求**：展示签约艺人作品和演出记录

**解决方案**：
- 使用歌曲管理系统展示所有艺人作品
- 使用演唱记录管理记录演出信息
- 使用热歌榜展示热门作品
- 使用数据分析功能统计作品表现
- 使用原唱作品功能展示工作室原创
- 使用图集功能展示艺人照片
- 自定义筛选条件和排序方式

### 场景四：粉丝运营平台

**需求**：运营粉丝社区，管理粉丝二创作品

**解决方案**：
- 使用粉丝二创管理展示粉丝作品
- 使用作品合集分类管理作品
- 支持视频播放和互动
- 使用图集功能展示粉丝投稿图片
- 使用数据分析功能分析粉丝互动数据
- 自定义主题和品牌信息

### 场景五：音乐自媒体

**需求**：搭建音乐内容平台，分享音乐资讯

**解决方案**：
- 使用歌曲管理系统分享推荐歌曲
- 使用粉丝二创展示粉丝投稿
- 使用图集功能展示音乐相关图片
- 使用直播功能展示音乐直播
- 使用推荐系统推荐优质内容
- 自定义主题和品牌信息

## 🔧 常见问题

### Q: 可以同时支持多个歌手吗？

A: 可以。后端在歌曲数据中添加 `artistId` 字段，前端在搜索和筛选时增加歌手筛选条件即可。

### Q: 如何添加新的视频平台支持？

A: 在 `shared/services/VideoPlayerService.ts` 中添加新的平台解析逻辑。

### Q: 如何修改歌曲的筛选条件？

A: 修改 `infrastructure/config/constants.ts` 中的常量定义，并在 `RealSongService.ts` 中更新 API 调用参数。

### Q: 如何添加新的功能模块？

A: 参考 DDD 架构，在 `domain/` 中定义类型和接口，在 `infrastructure/` 中实现，在 `presentation/` 中开发组件。

### Q: 支持多语言吗？

A: 目前支持中文，如需支持多语言，可以集成 i18n 库，将所有文本提取为语言包。

## 📝 开发指南

### 添加新功能

1. 在 `domain/types.ts` 中定义数据类型
2. 在 `domain/api/ISongService.ts` 中定义接口
3. 在 `infrastructure/api/RealSongService.ts` 中实现服务
4. 在 `presentation/` 中开发组件和页面
5. 在 `App.tsx` 中添加路由

### 自定义样式

所有样式使用 Tailwind CSS，可以在组件中直接使用 Tailwind 类名，或在 `index.html` 中添加自定义 CSS。

### 数据转换

如果后端数据格式与前端期望不一致，在 `RealSongService.ts` 中进行数据转换：

```typescript
const transformed: Song = {
  id: item.id.toString(),
  name: item.song_name,
  // ... 其他字段转换
};
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 [GNU General Public License v3.0](LICENSE) 开源协议。

## 🙏 致谢

感谢以下优秀的开源项目：

- [React](https://react.dev/) - 用于构建用户界面的 JavaScript 库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库

## 📮 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。

---

<div align="center">

**如果这个方案对你有帮助，请给个 ⭐️ Star 支持一下！**

**快速开始你的歌手网站之旅吧！** 🎵

</div>