# DDD 分层架构文档

> 本文档描述 XXM Next.js 项目的架构设计和最佳实践
> 最后更新: 2026-02-18

---

## 📋 架构概述

本项目采用 **DDD（领域驱动设计）分层架构**，将代码组织为清晰的层次结构：

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation 层                         │
│                    (UI 组件、页面、状态管理)                    │
├─────────────────────────────────────────────────────────────┤
│                      Application 层                          │
│              (用例编排、业务流程、缓存策略)                     │
├─────────────────────────────────────────────────────────────┤
│                        Domain 层                             │
│         (领域模型、仓储接口、业务规则定义)                      │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure 层                        │
│    (仓储实现、数据映射、API 客户端、外部服务)                   │
└─────────────────────────────────────────────────────────────┘
```

### 依赖规则

**上层依赖下层，下层不依赖上层**
- Presentation → Application → Domain
- Infrastructure → Domain
- 跨层调用必须通过接口（Domain 层定义）

---

## 🏗️ 目录结构

```
app/
├── domain/                          # 领域层 - 核心业务
│   ├── types.ts                     # 领域模型类型定义
│   └── repositories/                # 仓储接口（抽象）
│       ├── ISongRepository.ts
│       ├── IGalleryRepository.ts
│       ├── ILivestreamRepository.ts
│       ├── IFansDIYRepository.ts
│       ├── IAnalyticsRepository.ts
│       └── index.ts
│
├── application/                     # 应用层 - 用例编排
│   ├── songs/
│   │   ├── GetSongListUseCase.ts
│   │   ├── GetSongDetailUseCase.ts
│   │   ├── GetHotSongsUseCase.ts
│   │   ├── GetRandomSongUseCase.ts
│   │   ├── SearchSongsUseCase.ts
│   │   └── index.ts
│   ├── gallery/
│   │   ├── GetGalleryTreeUseCase.ts
│   │   └── index.ts
│   └── index.ts
│
├── infrastructure/                  # 基础设施层 - 实现
│   ├── api/
│   │   ├── base.ts                  # API 客户端
│   │   ├── apiTypes.ts              # API 类型定义
│   │   ├── songService.ts           # 兼容层（调用 Repository）
│   │   ├── submissionService.ts     # 投稿服务
│   │   └── index.ts                 # 统一导出
│   ├── mappers/                     # 数据映射器
│   │   ├── SongMapper.ts
│   │   ├── GalleryMapper.ts
│   │   ├── LivestreamMapper.ts
│   │   ├── FansDIYMapper.ts
│   │   ├── AnalyticsMapper.ts
│   │   └── index.ts
│   ├── repositories/                # 仓储实现
│   │   ├── SongRepository.ts
│   │   ├── GalleryRepository.ts
│   │   ├── LivestreamRepository.ts
│   │   ├── FansDIYRepository.ts
│   │   ├── AnalyticsRepository.ts
│   │   └── index.ts
│   ├── hooks/                       # 基础设施 Hooks
│   │   ├── useSongs.ts
│   │   ├── useGallery.ts
│   │   └── index.ts
│   └── config/
│       └── config.ts
│
├── presentation/                    # 表现层 - UI
│   ├── components/                  # UI 组件
│   │   └── songs/
│   │       ├── SongTable/
│   │       ├── SongFilters/
│   │       ├── SongPagination/
│   │       └── index.ts
│   ├── hooks/                       # 表现层 Hooks
│   │   └── useSongTable.ts
│   └── constants/
│       └── songs.ts
│
├── shared/                          # 共享层 - 通用工具
│   ├── components/
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── device.ts
│   │   └── index.ts
│   └── services/
│       └── VideoPlayerService.ts
│
├── components/                      # ⚠️ 待迁移到 presentation/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── features/
│   │   └── HomePageClient.tsx
│   └── common/
│
├── songs/                           # 页面路由
│   ├── page.tsx
│   └── components/                  # ⚠️ 待迁移到 presentation/
│
├── gallery/                         # 页面路由
├── live/                            # 页面路由
├── fansDIY/                         # 页面路由
├── about/                           # 页面路由
├── contact/                         # 页面路由
├── page.tsx                         # 首页
└── layout.tsx                       # 根布局
```

---

## 🎯 各层职责

### 1. Domain 层（领域层）

**职责**：定义核心业务概念，不依赖任何外部技术

```typescript
// domain/types.ts - 领域模型
export interface Song {
    id: string;
    name: string;
    originalArtist: string;
    // ...
}

// domain/repositories/ISongRepository.ts - 仓储接口
export interface ISongRepository {
    getSongs(params?: GetSongsParams): Promise<PaginatedResult<Song>>;
    getSongById(id: string): Promise<Song>;
    // ...
}
```

**特点**：
- 纯 TypeScript 类型和接口
- 不依赖任何框架或库
- 可被任何实现复用

### 2. Application 层（应用层）

**职责**：编排业务逻辑，协调多个领域对象

```typescript
// application/songs/GetSongListUseCase.ts
export class GetSongListUseCase {
    constructor(private songRepository: ISongRepository) {}

    async execute(params: GetSongsParams = {}) {
        const result = await this.songRepository.getSongs(params);
        
        // 业务逻辑：计算是否有更多数据
        const hasMore = result.results.length >= (params.limit || 20);

        return { songs: result.results, total: result.total, hasMore };
    }
}
```

**特点**：
- 依赖 Domain 层的接口
- 实现具体的业务用例
- 可以包含缓存、权限等业务规则

### 3. Infrastructure 层（基础设施层）

**职责**：提供技术实现，包括数据访问、外部 API 调用等

```typescript
// infrastructure/repositories/SongRepository.ts
export class SongRepository implements ISongRepository {
    constructor(private apiClient: ApiClient) {}

    async getSongs(params?: GetSongsParams) {
        const result = await this.apiClient.get('/songs/', params);
        return SongMapper.fromBackendList(result.data);
    }
}

// infrastructure/mappers/SongMapper.ts
export class SongMapper {
    static fromBackend(item: any): Song {
        return {
            id: item.id?.toString() || '',
            name: item.song_name || '未知歌曲',
            // ...
        };
    }
}
```

**特点**：
- 实现 Domain 层定义的接口
- 处理数据转换（Backend → Domain）
- 封装技术细节（HTTP、缓存等）

### 4. Presentation 层（表现层）

**职责**：处理用户界面和用户交互

```typescript
// presentation/components/songs/SongTable/index.tsx
export function SongTable() {
    const { songs, isLoading } = useSongs(params);
    
    return (
        <table>
            {/* 渲染逻辑 */}
        </table>
    );
}
```

**特点**：
- 依赖 Application 或 Infrastructure 层
- 只关注 UI 渲染和交互
- 不包含业务逻辑

---

## 📝 使用指南

### 获取数据（推荐方式）

```typescript
// 方式 1：直接使用 Repository（Server/Client 通用）
import { songRepository } from '@/app/infrastructure/repositories';

const songs = await songRepository.getSongs({ page: 1 });

// 方式 2：使用 SWR Hooks（Client Component）
import { useSongs } from '@/app/infrastructure/hooks';

function SongList() {
    const { songs, isLoading } = useSongs({ page: 1 });
    // ...
}

// 方式 3：使用 UseCase（复杂业务场景）
import { GetHotSongsUseCase } from '@/app/application/songs';

const useCase = new GetHotSongsUseCase(songRepository);
const { songs } = await useCase.execute('1m', 10);
```

### 向后兼容（旧代码）

```typescript
// ⚠️ 旧方式（仍可用，但不推荐）
import { songService } from '@/app/infrastructure/api';

const result = await songService.getSongs(params);
if (result.data) {
    // 处理数据
}

// ✅ 新方式（推荐）
import { songRepository } from '@/app/infrastructure/repositories';

const songs = await songRepository.getSongs(params);
// 直接返回领域模型
```

---

## 🔄 数据流向

```
用户操作 → Presentation 层
              ↓
         调用 Hooks
              ↓
    Infrastructure 层
              ↓
         Repository
              ↓
    调用 Mapper 转换数据
              ↓
         API Client
              ↓
         后端 API
```

---

## ✅ 架构优势

| 优势 | 说明 |
|------|------|
| **可测试性** | 可以 Mock Repository 进行单元测试 |
| **可替换性** | 可以轻松替换数据源（如从 REST 改为 GraphQL） |
| **可维护性** | 职责清晰，修改影响范围可控 |
| **可复用性** | Domain 层可以在不同平台复用 |

---

## 📚 相关文档

- `docs/PROJECT_STATUS.md` - 项目状态报告
- `docs/TODO.md` - 任务清单
- `docs/SERVICE_VS_REPOSITORY.md` - 架构模式对比

---

## 🏷️ 命名规范

| 层级 | 文件命名 | 类/接口命名 |
|------|---------|------------|
| Domain | `IxxxRepository.ts` | `ISongRepository` |
| Application | `XxxUseCase.ts` | `GetSongListUseCase` |
| Infrastructure | `xxxMapper.ts`, `xxxRepository.ts` | `SongMapper`, `SongRepository` |
| Presentation | `xxx/index.tsx` | `SongTable` |
