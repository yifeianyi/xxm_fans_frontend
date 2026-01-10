// 环境变量检查脚本
console.log('=== 检查环境变量 ===');

// 正确的环境变量配置
const mockEnv = {
  VITE_API_BASE_URL: 'http://172.27.171.134:8000/api',
  VITE_USE_MOCK: 'false'
};

console.log('当前环境变量配置:');
console.log('VITE_API_BASE_URL:', mockEnv.VITE_API_BASE_URL);
console.log('VITE_USE_MOCK:', mockEnv.VITE_USE_MOCK);

// 模拟config.ts中的逻辑
const config = {
  api: {
    baseURL: mockEnv.VITE_API_BASE_URL || '',
    timeout: 30000,
    useMock: mockEnv.VITE_USE_MOCK === 'true' || !mockEnv.VITE_API_BASE_URL
  }
};

console.log('\n计算后的配置:');
console.log('baseURL:', config.api.baseURL);
console.log('useMock:', config.api.useMock);

console.log('\n=== 结论 ===');
if (config.api.useMock) {
  console.log('❌ 当前配置会使用Mock API');
  console.log('💡 请检查环境变量 VITE_API_BASE_URL 是否正确设置');
} else {
  console.log('✅ 当前配置会使用Real API');
  console.log('📍 API地址:', config.api.baseURL);
}

console.log('\n=== 测试建议 ===');
console.log('1. 确保后端服务在 http://172.27.171.134:8000 上运行');
console.log('2. 可以使用以下命令测试连接:');
console.log('   curl http://172.27.171.134:8000/api/songs/?limit=1');
console.log('3. 或在浏览器中访问:');
console.log('   http://172.27.171.134:8000/api/songs/?limit=1');

// 快速连接测试
console.log('\n=== 快速连接测试 ===');
const testUrl = 'http://172.27.171.134:8000/api/songs/?limit=1';

if (typeof fetch !== 'undefined') {
  // 浏览器环境
  fetch(testUrl)
    .then(response => {
      if (response.ok) {
        console.log('✅ API连接测试成功');
        return response.json();
      } else {
        console.log(`❌ API连接测试失败: ${response.status}`);
      }
    })
    .then(data => {
      if (data && data.results && data.results.length > 0) {
        console.log('📝 测试数据:', data.results[0].song_name || data.results[0].name);
      }
    })
    .catch(error => {
      console.log('❌ API连接测试异常:', error.message);
    });
} else {
  console.log('💡 在Node.js环境中，请使用以下命令测试连接:');
  console.log(`curl "${testUrl}"`);
}