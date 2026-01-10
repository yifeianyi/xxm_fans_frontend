# API测试目录说明

本目录包含了用于测试后端API接口的所有脚本和相关文档。

## 文件说明

### 全面测试工具
- **`test-all-apis.js`** - API测试脚本，测试所有后端接口并记录响应数据
- **`analyze-api-formats.js`** - 数据格式分析脚本，分析API响应数据结构
- **`package.json`** - 测试工具的依赖配置文件

### 快速测试工具
- **`test-api-request.html`** - HTML页面，可在浏览器中快速测试API请求
- **`test-api-switch.js`** - 测试API切换功能的脚本
- **`switch-api.js`** - API切换工具，可在Mock和Real API间切换
- **`check-env.js`** - 环境变量检查工具，验证API配置是否正确

### 文档
- **`api_testing_strategy.md`** - 完整的API测试策略和执行方案
- **`test-configuration.md`** - 测试配置确认文档
- **`README.md`** - 使用说明

## 使用方法

### 1. 安装依赖

```bash
cd test
npm install
```

### 2. 全面测试（推荐）

```bash
# 运行API测试
node test-all-apis.js

# 分析数据格式
node analyze-api-formats.js

# 或使用npm脚本
npm run test
npm run analyze
npm run full
npm run check
npm run status
```

### 3. 快速测试

#### 浏览器测试
```bash
# 在浏览器中打开HTML测试页面
open test-api-request.html
# 或者直接双击文件打开
```

#### 环境配置检查
```bash
# 检查环境变量配置
node check-env.js
```

#### API切换测试
```bash
# 测试当前API配置
node test-api-switch.js

# 切换API类型
node switch-api.js status   # 查看当前状态
node switch-api.js mock     # 切换到Mock API
node switch-api.js real     # 切换到Real API
node switch-api.js fix-url  # 设置正确的API地址
```

### 4. 查看结果

全面测试完成后，会在当前目录生成以下文件：
- `api-test-results-latest.json` - 最新测试结果
- `api-format-documentation-latest.md` - 最新API格式文档
- `api-format-analysis-latest.json` - 最新分析结果

## 注意事项

1. 确保后端API服务已启动并可访问
2. 根据实际情况修改 `test-all-apis.js` 中的 `API_BASE_URL`
3. 测试结果会自动保存，不会覆盖历史数据（带时间戳的文件）