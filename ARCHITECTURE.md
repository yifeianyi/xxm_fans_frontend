# DDD 三层架构重构文档

## 📋 重构概述

本次重构将原有的混乱架构改造为清晰的 **DDD 三层架构**：
- **Domain (领域层)**：核心业务逻辑和抽象
- **Application (应用层)**：用例编排
- **Infrastructure (基础设施层)**：技术实现
- **Presentation (表现层)**：UI 组件

---

## 🏗️ 新架构结构

```
app/
├── domain/                          # 领域层 - 核心业务
│   ├── types.ts                     # 实体类型定义
│   └── repositories/
│       ├── ISongRepository.ts       # 仓储接口（抽象）
│       └── index.ts
│
├── application/                     # 应用层 - 用例编排
│   └── songs/
│       ├── GetSongListUseCase.ts    # 获取歌曲列表用例
│       ├── GetSongDetailUseCase.ts  # 获取歌曲详情用例
│       └── index.ts
│
├── infrastructure/                  # 基础设施层 - 实现
│   ├── api/
│   │   ├── base.ts                  # HTTP 基础客户端
│   │   ├── apiTypes.ts              # API 类型定义
│   │   ├── songService.ts           # 旧版服务（兼容）
│   │   └── index.ts                 # 统一导出
│   ├── hooks/
│   │   ├── useSongs.ts              # SWR Hooks（新）
│   │   └── index.ts
│   ├── mappers/
│   │   └── SongMapper.ts            # 数据映射器
│   └── repositories/
│       ├── SongRepository.ts        # 仓储实现
│       └── index.ts
│
├── presentation/                    # 表现层 - UI
│   ├── components/
│   │   └── songs/
│   │       ├── SongTable/           # 歌曲表格（重构后）
│   │       │   ├── index.tsx        # 主组件
│   │       │   ├── SongTableRow.tsx # 行组件
│   │       │   └── SongTableHeader.tsx
│   │       ├── SongFilters/         # 筛选组件
│   │       ├── SongPagination/      # 分页组件
│   │       └── index.ts
│   ├── hooks/
│   │   └── useSongTable.ts          # 表格状态管理
│   └── constants/
│       └── songs.ts                 # 常量定义
│
└── songs/
    ├── page.tsx                     # 页面（使用新架构）
    └── components/
        ├── RecordList.tsx           # 记录列表（已更新）
        ├── RankingChart.tsx         # 排行榜（已更新）
        ├── OriginalsList.tsx        # 原唱作品（已更新）
        └── VideoModal.tsx
```

---

## ✅ 重构完成内容

### 1. 解决双轨制 API 问题

**之前：**
```typescript
// Server Component 用
import { getSongs } from '@/app/infrastructure/api/songService';

// Client Component 用（重复代码！）
import { getSongsClient } from '@/app/infrastructure/api/clientApi';
```

**现在：**
```typescript
// 统一使用 Repository
import { songRepository } from '@/app/infrastructure/repositories';

// 同时支持 Server/Client Components
const data = await songRepository.getSongs(params);
```

**成果：**
- ✅ 删除 `clientApi.ts`（200+ 行重复代码）
- ✅ 统一数据访问接口
- ✅ 数据转换逻辑集中到 Mapper

---

### 2. 提取 Mapper 统一数据转换

**之前：** 转换逻辑散落在各处
```typescript
// songService.ts
const transformedSongs = data.results.map((item: any) => ({
    id: item.id?.toString() || '',
    name: item.song_name || '未知歌曲',
    // ... 每处都要写
}));

// clientApi.ts（重复！）
const transformedSongs = data.results.map((item: any) => ({
    id: item.id?.toString() || '',
    // ... 又写一遍
}));
```

**现在：** 集中管理
```typescript
// infrastructure/mappers/SongMapper.ts
export class SongMapper {
    static fromBackend(item: any): Song {
        return {
            id: item.id?.toString() || '',
            name: item.song_name || '未知歌曲',
            // ...
        };
    }
    
    static fromBackendList(items: any[]): Song[] {
        return items.map(item => this.fromBackend(item));
    }
}
```

**成果：**
- ✅ 数据转换逻辑统一
- ✅ 易于维护（改一处，全局生效）
- ✅ 可测试性提升

---

### 3. 拆分 SongTable 组件

**之前：** 428 行的单体组件
```
SongTable.tsx (428 行)
├── 数据获取逻辑
├── 状态管理
├── 数据转换
├── 搜索处理
├── 筛选逻辑
├── 分页逻辑
├── 排序逻辑
├── UI 渲染
└── 样式
```

**现在：** 职责分离
```
presentation/components/songs/
├── SongTable/
│   ├── index.tsx          # 容器组件 - 组装子组件
│   ├── SongTableRow.tsx   # 行渲染
│   └── SongTableHeader.tsx # 表头/排序
├── SongFilters/           # 筛选逻辑
│   └── index.tsx
├── SongPagination/        # 分页逻辑
│   └── index.tsx
└── presentation/hooks/
    └── useSongTable.ts    # 状态管理 Hook
```

**成果：**
- ✅ 单一职责原则
- ✅ 组件可复用
- ✅ 易于测试
- ✅ 代码可读性大幅提升

---

### 4. 创建 Application UseCase

**新增：** 应用层编排业务逻辑
```typescript
// application/songs/GetSongListUseCase.ts
export class GetSongListUseCase {
    constructor(private songRepository: ISongRepository) {}

    async execute(params: GetSongsParams = {}): Promise<SongListDTO> {
        const result = await this.songRepository.getSongs(params);
        
        return {
            songs: result.results,
            total: result.total,
            hasMore: result.results.length >= (params.limit || 20),
        };
    }
}
```

**成果：**
- ✅ 领域逻辑与 UI 分离
- ✅ 用例可独立测试
- ✅ 支持依赖注入

---

### 5. 统一 Hooks

**之前：** 重复的 fetcher 逻辑
```typescript
// useSongs.ts
const fetcher = async (url: string) => {
    // 重复的处理后端响应格式逻辑
};
```

**现在：** 调用 Repository
```typescript
// infrastructure/hooks/useSongs.ts
export function useSongs(params: GetSongsParams = {}) {
    const { data, error, isLoading } = useSWR(
        SWR_KEYS.songs(params),
        createRepositoryFetcher(() => songRepository.getSongs(params)),
        { keepPreviousData: true }
    );
    // ...
}
```

**成果：**
- ✅ Hooks 直接使用 Repository
- ✅ 无需重复处理响应格式
- ✅ 缓存策略统一

---

## 📊 重构前后对比

| 指标 | 重构前 | 重构后 | 改善 |
|------|--------|--------|------|
| **代码行数** | ~428 行 (SongTable) | ~200 行 (分散组件) | 降低 53% |
| **重复代码** | 多处重复转换逻辑 | 统一 Mapper | 消除重复 |
| **API 实现** | 2 套 (Server/Client) | 1 套 Repository | 合并 |
| **组件职责** | 混杂 | 单一职责 | 清晰 |
| **可测试性** | 低 | 高 | 提升 |
| **可扩展性** | 修改困难 | 易于扩展 | 提升 |

---

## 📝 使用指南

### 新增功能开发

```typescript
// 1. 在 domain/repositories 添加接口方法
export interface ISongRepository {
    getNewFeature(): Promise<NewType>;
}

// 2. 在 infrastructure/repositories 实现
export class SongRepository implements ISongRepository {
    async getNewFeature(): Promise<NewType> {
        // 实现
    }
}

// 3. 在 application 添加 UseCase（可选）

// 4. 在 hooks 添加 Hook（可选）

// 5. 在 presentation/components 添加组件
```

### 向后兼容

旧代码仍然可用（已标记为废弃）：
```typescript
// ⚠️ 旧方式（仍可用，但不推荐）
import { getSongs } from '@/app/infrastructure/api/songService';

// ✅ 新方式（推荐）
import { songRepository } from '@/app/infrastructure/repositories';
```

---

## 🎯 后续建议

1. **逐步迁移其他模块**
   - Gallery
   - Livestream
   - FansDIY
   - Analytics

2. **添加测试**
   - Mapper 单元测试
   - Repository 集成测试
   - UseCase 单元测试

3. **性能优化**
   - 虚拟滚动（大量数据）
   - 增量加载
   - 预加载策略

---

## 🏆 重构收益

1. **架构清晰**：符合 DDD 三层架构，依赖关系明确
2. **代码复用**：消除重复代码，提高复用率
3. **可维护性**：职责分离，易于维护
4. **可测试性**：各层可独立测试
5. **可扩展性**：新增功能更加容易
