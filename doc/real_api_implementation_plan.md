# 切换到真实后端API实现方案

## 项目概述

本文档详细描述了如何将XXM Fans Home项目从使用Mock API切换到使用真实后端API的实现方案。项目已经具备了完整的API架构支持，包括Mock服务和真实服务的实现。

## 当前API架构分析

### 1. API服务架构

项目采用了分层架构设计，API相关代码组织如下：

```
infrastructure/api/
├── index.ts           # API服务入口，根据配置选择Mock或Real服务
├── apiTypes.ts        # API类型定义
├── mockApi.ts         # Mock API实现
├── MockSongService.ts # Mock服务实现
└── RealSongService.ts # 真实API服务实现

domain/
├── types.ts           # 数据模型定义
└── api/
    └── ISongService.ts # 服务接口定义
```

### 2. 服务切换机制

项目通过环境变量 `VITE_USE_MOCK` 控制使用Mock服务还是真实服务：

- `VITE_USE_MOCK=true`：使用Mock服务
- `VITE_USE_MOCK=false`：使用真实API服务

切换逻辑在 `infrastructure/api/index.ts` 中实现。

### 3. 数据转换层

由于前端数据模型与后端API响应结构不完全一致，`RealSongService` 中实现了数据转换逻辑，确保前端组件可以无缝使用后端数据。

## 切换到真实API实施步骤

### 步骤1：配置环境变量

1. 确保 `.env.local` 文件中正确配置了以下变量：

```env
# 后端API地址
VITE_API_BASE_URL=http://your-backend-server/api

# 使用真实API
VITE_USE_MOCK=false
```

2. 如果 `.env.local` 文件不存在，从 `.env.example` 复制一份并修改：

```bash
cp .env.example .env.local
```

### 步骤2：验证配置文件

确保 `infrastructure/config/config.ts` 中包含 `useMock` 配置项：

```typescript
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 30000,
    useMock: import.meta.env.VITE_USE_MOCK === 'true'
  },
  // ...其他配置
};
```

### 步骤3：检查API数据映射

根据API文档，验证 `RealSongService.ts` 中的数据映射是否正确：

| 前端字段 | 后端字段 | 状态 |
|---------|---------|------|
| `name` | `song_name` | ✅ 已实现 |
| `originalArtist` | `singer` | ✅ 已实现 |
| `genres` | `styles` | ✅ 已实现 |
| `languages` | `language` | ✅ 已实现 |
| `lastPerformance` | `last_performed` | ✅ 已实现 |
| `performanceCount` | `perform_count` | ✅ 已实现 |
| `tags` | `tags` | ✅ 已实现 |

### 步骤4：处理缺失字段

对于后端API中缺失的字段，确认处理方式：

1. `firstPerformance`：设为空字符串
2. `videoUrl`：演唱记录中不返回，设为空字符串
3. `description`：粉丝DIY合集不返回描述，设为空字符串

### 步骤5：API接口对应关系验证

验证所有API接口的对应关系：

| 前端方法 | 后端接口 | 状态 |
|---------|---------|------|
| `getSongs` | `GET /api/songs/` | ✅ 已实现 |
| `getRecords` | `GET /api/songs/<id>/records/` | ✅ 已实现 |
| `getTopSongs` | `GET /api/top_songs/` | ✅ 已实现 |
| `getRandomSong` | `GET /api/random-song/` | ✅ 已实现 |
| `getRecommendation` | `GET /api/recommendation/` | ✅ 已实现 |
| `getCollections` | `GET /api/fansDIY/collections/` | ✅ 已实现 |
| `getWorks` | `GET /api/fansDIY/works/` | ✅ 已实现 |

## 可能遇到的问题及解决方案

### 1. CORS跨域问题

**问题描述**：前端调用后端API时可能遇到跨域限制。

**解决方案**：
- 确保后端服务器已配置CORS允许前端域名访问
- 如果是开发环境，可以在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  // ...其他配置
  server: {
    proxy: {
      '/api': {
        target: 'http://your-backend-server',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```

### 2. 数据类型不匹配

**问题描述**：后端返回的数据类型与前端期望不一致。

**解决方案**：
- 在 `RealSongService.ts` 中添加类型转换逻辑
- 对于日期字段，确保格式统一
- 对于可选字段，添加默认值处理

### 3. API响应格式差异

**问题描述**：后端API响应格式与前端预期不一致。

**解决方案**：
- 修改 `RealSongService.ts` 中的数据转换逻辑
- 确保错误处理机制一致

### 4. 分页参数不一致

**问题描述**：前后端分页参数名称或格式不一致。

**解决方案**：
- 确保查询参数名称与API文档一致
- 验证分页大小限制是否匹配

## 测试和验证方法

### 1. 开发环境测试

1. 启动前端开发服务器：

```bash
npm run dev
```

2. 检查浏览器控制台输出，确认使用的是真实API：
   - 应显示 `[API] Using Real Service: http://your-api-url`

3. 使用浏览器开发者工具的Network面板，检查API请求：
   - 确认请求URL正确
   - 检查请求参数格式
   - 验证响应数据结构

### 2. 功能测试

测试以下核心功能：

1. **歌曲列表**
   - 加载歌曲列表
   - 搜索功能
   - 筛选功能（曲风、标签、语言）
   - 排序功能
   - 分页功能

2. **歌曲详情**
   - 查看歌曲详情
   - 加载演唱记录

3. **热歌榜**
   - 加载热歌榜数据
   - 时间范围筛选

4. **随机歌曲**
   - 获取随机歌曲

5. **粉丝DIY**
   - 加载合集列表
   - 加载作品列表
   - 查看作品详情

### 3. 错误处理测试

1. 网络错误处理
2. 404错误处理
3. 500错误处理
4. 超时处理

## 部署注意事项

1. **生产环境配置**
   - 确保生产环境正确设置 `VITE_API_BASE_URL`
   - 确保 `VITE_USE_MOCK=false`

2. **API密钥和安全**
   - 如需API密钥，通过环境变量配置
   - 确保敏感信息不暴露在前端代码中

3. **性能优化**
   - 考虑实现请求缓存
   - 优化大列表加载性能
   - 实现适当的错误重试机制

## 回滚方案

如果切换到真实API后遇到问题，可以快速回滚到Mock API：

1. 修改 `.env.local` 文件：

```env
VITE_USE_MOCK=true
```

2. 重启开发服务器

## 总结

本项目已经具备完整的API架构支持，切换到真实API主要涉及：

1. 配置环境变量
2. 验证数据映射
3. 测试功能完整性
4. 处理可能的跨域和兼容性问题

通过以上步骤，可以顺利将项目从Mock API切换到真实后端API，同时保持前端代码的稳定性和可维护性。