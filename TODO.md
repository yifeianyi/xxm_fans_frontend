# XXM Next.js 项目 TODO 清单

> 本文档记录项目待办事项，按优先级和模块分类
> 最后更新: 2026-02-18

---

## 🔴 P0 - 关键架构任务 (必须完成)

### DDD 分层架构实现
- [x] 分析现有架构债务
- [x] 创建项目状态报告
- [x] **实现 Domain 层 - Repository 接口**
  - [x] 创建 `domain/repositories/ISongRepository.ts`
  - [x] 创建 `domain/repositories/IGalleryRepository.ts`
  - [x] 创建 `domain/repositories/ILivestreamRepository.ts`
  - [x] 创建 `domain/repositories/IFansDIYRepository.ts`
  - [x] 创建 `domain/repositories/IAnalyticsRepository.ts`
  - [x] 创建 `domain/repositories/index.ts` 统一导出
- [x] **实现 Infrastructure Mappers**
  - [x] 创建 `infrastructure/mappers/SongMapper.ts`
  - [x] 创建 `infrastructure/mappers/GalleryMapper.ts`
  - [x] 创建 `infrastructure/mappers/LivestreamMapper.ts`
  - [x] 创建 `infrastructure/mappers/FansDIYMapper.ts`
  - [x] 创建 `infrastructure/mappers/AnalyticsMapper.ts`
  - [x] 创建 `infrastructure/mappers/index.ts` 统一导出
- [x] **实现 Infrastructure Repositories**
  - [x] 创建 `infrastructure/repositories/SongRepository.ts`
  - [x] 创建 `infrastructure/repositories/GalleryRepository.ts`
  - [x] 创建 `infrastructure/repositories/LivestreamRepository.ts`
  - [x] 创建 `infrastructure/repositories/FansDIYRepository.ts`
  - [x] 创建 `infrastructure/repositories/AnalyticsRepository.ts`
  - [x] 创建 `infrastructure/repositories/index.ts` 统一导出
- [x] **实现 Application 层 - UseCases**
  - [x] 创建 `application/songs/GetSongListUseCase.ts`
  - [x] 创建 `application/songs/GetSongDetailUseCase.ts`
  - [x] 创建 `application/songs/GetHotSongsUseCase.ts`
  - [x] 创建 `application/songs/GetRandomSongUseCase.ts`
  - [x] 创建 `application/songs/SearchSongsUseCase.ts`
  - [x] 创建 `application/gallery/GetGalleryTreeUseCase.ts`
  - [x] 创建 `application/index.ts` 统一导出
- [x] **Service 层适配**
  - [x] 重构 `songService.ts` 调用 SongRepository
  - [x] 更新 `api/index.ts` 导出 Repository
- [x] **验证架构完整性**
  - [x] 检查所有导入路径正确
  - [x] 验证类型检查通过 (`npx tsc --noEmit`)
  - [x] 更新 ARCHITECTURE.md 与代码一致

---

## 🟡 P1 - 重要优化任务

### 目录结构整理
- [x] **统一组件目录**
  - [x] 将 `app/components/layout/` 移至 `app/presentation/components/layout/`
  - [x] 将 `app/components/features/` 移至 `app/presentation/components/features/`
  - [x] 通用组件保持在 `shared/components/` (ErrorBoundary, LazyImage)
  - [x] 将 `app/songs/components/` 整合到 `app/presentation/components/songs/`
  - [x] 更新所有相关导入路径
  - [x] 删除空的 `app/components/` 目录

### 类型系统完善
- [ ] 统一 API 错误处理类型
- [ ] 完善 DTO (Data Transfer Object) 定义
- [ ] 分离 Command 和 Query 类型

### Hooks 优化
- [ ] 提取通用 SWR 配置到 `infrastructure/config/swr.ts`
- [ ] 添加 SWR 全局错误处理
- [ ] 实现乐观更新 (Optimistic Updates)

---

## 🟢 P2 - 功能扩展任务

### 新页面开发
- [x] **直播日历页面** `/live`
  - [x] 日历组件 (CalendarGrid, CalendarCell, CalendarControl)
  - [x] 直播列表 (LiveDetail)
  - [x] 页面装饰和样式
- [x] **图集页面** `/albums` (注意：不使用 `/gallery` 避免与 nginx 静态资源冲突)
  - [x] 图集列表 (GalleryCard, Sidebar)
  - [x] 图集详情 (ImageGrid, ChildrenImagesDisplay)
  - [x] 图片浏览 (ImageViewer 灯箱)
- [x] **数据分析页面** `/data`
  - [x] 粉丝数趋势图 (TrendChart)
  - [x] OverviewSection 组件
  - [x] ComingSoonSection 组件

### 性能优化
- [ ] 实现虚拟滚动 (react-window)
- [ ] 图片懒加载优化
- [ ] 路由级别代码分割
- [ ] API 响应缓存策略优化

### 测试覆盖
- [ ] 配置 Jest + React Testing Library
- [ ] Mapper 单元测试
- [ ] Repository Mock 测试
- [ ] Hook 测试
- [ ] 组件快照测试

---

## 🔵 P3 - 代码质量任务

### 文档完善
- [x] 更新 `ARCHITECTURE.md` 与实现保持一致
- [ ] 添加 JSDoc 注释到所有公共 API
- [ ] 创建 `CONTRIBUTING.md` 贡献指南
- [ ] 编写架构决策记录 (ADR)

### 代码规范
- [ ] 配置 ESLint 规则
- [ ] 配置 Prettier 格式化
- [ ] 添加 import 排序规则
- [ ] 添加 Git Hooks (husky)

### 开发体验
- [ ] 配置 Path Alias 自动补全
- [ ] 添加 VSCode 推荐插件
- [ ] 创建开发环境 Docker 配置
- [ ] 添加 API Mock 服务 (MSW)

---

## 📊 进度追踪

| 阶段 | 任务数 | 已完成 | 进度 |
|------|--------|--------|------|
| P0 - 关键架构 | 7 | 7 | 100% ✅ |
| P1 - 重要优化 | 3 | 1 | 33% |
| P2 - 功能扩展 | 3 | 3 | 100% ✅ |
| P3 - 代码质量 | 3 | 1 | 33% |
| **总计** | **16** | **12** | **75%** |

---

## 🏷️ 任务标签说明

- `架构` - 与架构设计相关的任务
- `重构` - 代码重构任务
- `功能` - 新功能开发
- `优化` - 性能或体验优化
- `文档` - 文档编写
- `测试` - 测试相关

---

## 💡 快速开始

对于新加入的开发者，建议按以下顺序完成任务：

1. **首先理解现有架构**
   - 阅读 `docs/PROJECT_STATUS.md`
   - 阅读 `docs/ARCHITECTURE_COMPLETION_REPORT.md`
   - 阅读 `docs/SERVICE_VS_REPOSITORY.md`
   - 浏览 `ARCHITECTURE.md`

2. **使用新的 Repository 模式**
   ```typescript
   // ✅ 推荐方式
   import { songRepository } from '@/app/infrastructure/repositories';
   const songs = await songRepository.getSongs({ page: 1 });
   ```

3. **验证代码**
   - 运行类型检查: `npx tsc --noEmit`
   - 启动开发服务器: `npm run dev`
   - 测试功能是否正常

---

## 📝 修改记录

| 日期 | 修改内容 | 作者 |
|------|---------|------|
| 2026-02-18 | 初始创建，基于项目状态分析 | AI Assistant |
| 2026-02-18 | 完成 DDD 分层架构实现 | AI Assistant |
| 2026-02-19 | 确认目录结构整理已完成，更新进度追踪 | AI Assistant |
| 2026-02-19 | 完成 P2 功能扩展：直播日历、图集、数据分析页面 | AI Assistant |
