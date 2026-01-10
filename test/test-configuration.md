# 测试配置确认

## 当前测试API地址

所有测试脚本已配置使用 `http://172.27.171.134:8000/api` 作为后端API地址。

## 配置文件确认

### .env.local
```
VITE_API_BASE_URL=http://172.27.171.134:8000/api
VITE_USE_MOCK=false
```

### 测试脚本中的API地址
- `test/test-all-apis.js` - ✅ 已配置为 172.27.171.134:8000
- `test/test-api-request.html` - ✅ 已配置为 172.27.171.134:8000
- `test/check-env.js` - ✅ 已配置为 172.27.171.134:8000

## 测试前确认

在执行测试前，请确认：

1. 后端服务在 `http://172.27.171.134:8000` 上运行并可访问
2. 所有API端点都已正确部署
3. 防火墙设置允许访问该地址

## 测试执行顺序

1. **环境检查**
   ```bash
   cd test
   node check-env.js
   ```

2. **快速验证**
   ```bash
   # 在浏览器中打开
   open test-api-request.html
   
   # 或者检查环境配置
   npm run check
   ```

3. **全面测试**
   ```bash
   npm install
   npm run test
   ```

4. **数据分析**
   ```bash
   npm run analyze
   ```

5. **一键完整测试**
   ```bash
   npm run full
   ```

所有测试都将使用 `172.27.171.134:8000` 作为后端API地址。