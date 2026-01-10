// 测试API切换功能
import { config } from './infrastructure/config/config.js';
import { songService, fanDIYService } from './infrastructure/api/index.js';

console.log('=== API切换测试 ===');
console.log('配置:', config.api);
console.log('使用Mock:', config.api.useMock);
console.log('API地址:', config.api.baseURL);

// 测试获取歌曲列表
async function testGetSongs() {
  console.log('\n--- 测试获取歌曲列表 ---');
  try {
    const result = await songService.getSongs({ page: 1, limit: 5 });
    if (result.data) {
      console.log('✅ 成功获取歌曲列表');
      console.log('总数:', result.data.total);
      console.log('第一首歌:', result.data.results[0]?.name);
    } else {
      console.log('❌ 获取歌曲列表失败:', result.error?.message);
    }
  } catch (error) {
    console.log('❌ 获取歌曲列表异常:', error.message);
  }
}

// 测试获取热歌榜
async function testGetTopSongs() {
  console.log('\n--- 测试获取热歌榜 ---');
  try {
    const result = await songService.getTopSongs({ limit: 3 });
    if (result.data) {
      console.log('✅ 成功获取热歌榜');
      console.log('第一首歌:', result.data[0]?.name);
    } else {
      console.log('❌ 获取热歌榜失败:', result.error?.message);
    }
  } catch (error) {
    console.log('❌ 获取热歌榜异常:', error.message);
  }
}

// 测试获取粉丝DIY合集
async function testGetCollections() {
  console.log('\n--- 测试获取粉丝DIY合集 ---');
  try {
    const result = await fanDIYService.getCollections({ page: 1, limit: 3 });
    if (result.data) {
      console.log('✅ 成功获取粉丝DIY合集');
      console.log('第一个合集:', result.data.results[0]?.name);
    } else {
      console.log('❌ 获取粉丝DIY合集失败:', result.error?.message);
    }
  } catch (error) {
    console.log('❌ 获取粉丝DIY合集异常:', error.message);
  }
}

// 运行测试
async function runTests() {
  await testGetSongs();
  await testGetTopSongs();
  await testGetCollections();
  console.log('\n=== 测试完成 ===');
}

runTests();