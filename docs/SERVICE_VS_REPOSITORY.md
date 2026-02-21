# Service 模式 vs Repository 模式对比报告

## 📋 概述

在前端架构设计中，**Service 模式** 和 **Repository 模式** 是两种常见的数据访问模式。虽然它们都用于处理数据交互，但在职责定位、架构层次和使用场景上有明显区别。

---

## 🏗️ 核心概念对比

### Service 模式（服务层）

Service 模式是一个**更宽泛的概念**，它封装了业务逻辑、外部 API 调用、状态管理等各种服务。

```typescript
// 典型的 Service 实现
class SongService {
    private apiClient: ApiClient;
    
    async getSongs(params: GetSongsParams) {
        // 直接处理 HTTP 请求
        const result = await this.apiClient.get('/songs', params);
        // 数据转换
        return this.transformData(result);
    }
    
    async searchSongs(query: string) {
        // 可能包含复杂的业务逻辑
        const cacheResult = await this.checkCache(query);
        if (cacheResult) return cacheResult;
        
        const result = await this.getSongs({ q: query });
        await this.saveCache(query, result);
        return result;
    }
}
```

### Repository 模式（仓储模式）

Repository 模式是**特定于数据访问**的模式，它抽象了数据持久化的细节，让业务逻辑不依赖于具体的数据源。

```typescript
// 领域层 - 定义接口（抽象）
interface ISongRepository {
    getSongs(params: GetSongsParams): Promise<PaginatedResult<Song>>;
    getSongById(id: string): Promise<Song>;
}

// 基础设施层 - 实现（具体）
class SongRepository implements ISongRepository {
    async getSongs(params: GetSongsParams) {
        // 只关注数据获取和映射
        const result = await request('/songs', params);
        return {
            ...result,
            results: result.data.map(mapSong)
        };
    }
}
```

---

## 📊 详细对比

| 维度 | Service 模式 | Repository 模式 |
|------|-------------|----------------|
| **主要职责** | 封装业务逻辑、协调多个操作 | 封装数据访问逻辑、抽象数据源 |
| **关注焦点** | "做什么"（业务功能） | "怎么取数据"（数据操作） |
| **抽象层次** | 较宽泛，可包含各种服务 | 专门化，仅关注数据持久化 |
| **依赖关系** | 可能依赖多个 Repository 或其他 Service | 依赖具体的数据源（API/数据库） |
| **可测试性** | 需要 Mock 更多依赖 | 只需 Mock 数据源 |
| **复用性** | 业务级别的复用 | 数据访问级别的复用 |

---

## 🔄 在实际项目中的协作关系

在复杂的前端架构中，两者通常是**协作关系**而非替代关系：

```
┌─────────────────────────────────────────────────────────────┐
│                    表现层 (Presentation)                      │
│                    UI Components / Hooks                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Application)                       │
│                      UseCase / Service                        │
│              【Service 模式】协调业务逻辑                       │
│         ┌─────────────┬─────────────┐                       │
│         ▼             ▼             ▼                       │
│    调用 Repository  处理业务规则   协调多个操作               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    领域层 (Domain)                            │
│              实体定义、Repository 接口                          │
│              【Repository 模式】抽象定义                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  基础设施层 (Infrastructure)                   │
│              Repository 实现、API Client                       │
│           【Repository 模式】具体实现                         │
└─────────────────────────────────────────────────────────────┘
```

### 协作示例

```typescript
// ========== Repository 层（数据访问）==========
// 只关心如何获取和存储数据
class SongRepository implements ISongRepository {
    async getSongs(params: GetSongsParams) {
        return request('/songs', params);
    }
}

// ========== Service 层（业务逻辑）==========
// 关心业务规则和流程协调
class SongService {
    constructor(
        private songRepository: ISongRepository,
        private cacheService: CacheService,
        private analyticsService: AnalyticsService
    ) {}
    
    async getHotSongs() {
        // 1. 先查缓存（CacheService）
        const cached = await this.cacheService.get('hot_songs');
        if (cached) return cached;
        
        // 2. 获取数据（Repository）
        const songs = await this.songRepository.getTopSongs({ limit: 10 });
        
        // 3. 业务处理：按热度排序、过滤
        const processed = this.calculateHeatScore(songs);
        
        // 4. 保存缓存
        await this.cacheService.set('hot_songs', processed, 300);
        
        // 5. 记录分析数据
        await this.analyticsService.track('hot_songs_viewed');
        
        return processed;
    }
}
```

---

## 🎯 本项目中的实践

### 项目架构演变

本项目经历了从 **Service 模式** 向 **Repository + 分层架构** 的演变：

#### 阶段一：传统 Service 模式（早期）
```typescript
// infrastructure/api/songService.ts
class SongService {
    async getSongs(params) {
        const result = await fetch('/songs');
        // 数据转换 + 错误处理 + 业务逻辑（混杂）
        return transformedData;
    }
}
```

**问题**：
- 数据转换逻辑与 API 调用耦合
- 难以在 Server/Client 组件间复用
- 业务逻辑与数据访问混杂

#### 阶段二：Repository 模式（当前）
```typescript
// domain/repositories/ISongRepository.ts（接口定义）
interface ISongRepository {
    getSongs(params: GetSongsParams): Promise<PaginatedResult<Song>>;
}

// infrastructure/repositories/SongRepository.ts（实现）
class SongRepository implements ISongRepository {
    async getSongs(params) {
        // 专注数据获取和映射
    }
}

// application/songs/GetSongListUseCase.ts（用例编排）
class GetSongListUseCase {
    constructor(private songRepository: ISongRepository) {}
    
    async execute(params) {
        // 业务编排
        return await this.songRepository.getSongs(params);
    }
}
```

**改进**：
- ✅ 清晰的依赖关系（依赖倒置原则）
- ✅ 易于测试（可 Mock Repository）
- ✅ 支持 Server/Client 统一调用
- ✅ 数据转换逻辑集中管理

---

## 💡 如何选择

### 使用 Repository 模式的场景

1. **需要解耦数据源**：业务逻辑不依赖具体是 REST API、GraphQL 还是 LocalStorage
2. **需要统一的数据访问接口**：多个模块共享相同的数据操作
3. **复杂的领域模型**：需要 Domain 层来承载业务规则
4. **需要可测试性**：方便 Mock 数据层进行单元测试

### 使用 Service 模式的场景

1. **简单的 CRUD 应用**：不需要复杂的领域建模
2. **快速原型开发**：架构简单，上手快
3. **特定的外部服务封装**：如封装第三方 SDK（支付、推送等）
4. **跨模块的业务协调**：需要组合多个 Repository 完成业务流程

### 混合使用的最佳实践

在大型前端应用中，推荐**两者结合**：

```typescript
// Repository：专注数据访问
interface IUserRepository {
    findById(id: string): Promise<User>;
    save(user: User): Promise<void>;
}

// Service：专注业务逻辑
class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private tokenService: TokenService,
        private emailService: EmailService
    ) {}
    
    async register(email: string, password: string) {
        // 1. 业务验证
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        
        // 2. 调用 Repository 检查用户是否存在
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new Error('User already exists');
        }
        
        // 3. 创建用户
        const user = new User({ email, password: hash(password) });
        await this.userRepository.save(user);
        
        // 4. 发送欢迎邮件
        await this.emailService.sendWelcomeEmail(user.email);
        
        // 5. 生成 Token
        return this.tokenService.generate(user);
    }
}
```

---

## 📚 总结

| 模式 | 核心思想 | 适用场景 | 本项目中的体现 |
|------|---------|---------|---------------|
| **Repository** | 数据访问抽象 | 需要解耦数据源、统一数据接口 | `ISongRepository` 接口 + `SongRepository` 实现 |
| **Service** | 业务逻辑封装 | 协调多个操作、封装外部服务 | `GetSongListUseCase`（应用层服务）|

### 关键要点

1. **Repository 是 Service 的基础**：Service 可以依赖 Repository，但 Repository 不应该依赖 Service
2. **职责分离**：Repository 专注"取数据"，Service 专注"用数据做业务"
3. **分层架构**：Repository 属于 Infrastructure 层，Service 可以存在于 Application 层或 Domain 层
4. **可测试性**：两者分离后，可以独立测试业务逻辑和数据访问

---

## 📖 参考资源

- [Martin Fowler - Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [DDD 分层架构](https://ddd-practitioners.com/layered-architecture)
- [前端分层架构实践](https://github.com/alan2207/bulletproof-react)
