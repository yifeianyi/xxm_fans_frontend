// 完整的API测试脚本 - 测试所有后端接口并记录真实响应数据
const fs = require('fs');
const path = require('path');

// 正确的API基础URL（包含端口号）
const API_BASE_URL = 'http://172.27.171.134:8000/api';

// 测试用例配置
const testCases = {
  // 音乐管理API测试用例
  songs: [
    { 
      name: '基本歌曲列表', 
      url: '/api/songs/', 
      params: {} 
    },
    { 
      name: '搜索歌曲', 
      url: '/api/songs/', 
      params: { q: '测试', page: 1, limit: 10 } 
    },
    { 
      name: '按曲风筛选', 
      url: '/api/songs/', 
      params: { styles: '流行,摇滚' } 
    },
    { 
      name: '按标签筛选', 
      url: '/api/songs/', 
      params: { tags: '经典,热门' } 
    },
    { 
      name: '按语言筛选', 
      url: '/api/songs/', 
      params: { language: '中文' } 
    },
    { 
      name: '按歌手排序', 
      url: '/api/songs/', 
      params: { ordering: 'singer' } 
    },
    { 
      name: '按演唱次数排序', 
      url: '/api/songs/', 
      params: { ordering: 'perform_count' } 
    },
    { 
      name: '分页测试', 
      url: '/api/songs/', 
      params: { page: 2, limit: 5 } 
    },
    { 
      name: '大数据量测试', 
      url: '/api/songs/', 
      params: { limit: 1000 } 
    }
  ],
  
  // 歌曲记录API测试用例
  records: [
    { 
      name: '获取歌曲记录', 
      url: '/api/songs/1/records/', 
      params: {} 
    },
    { 
      name: '歌曲记录分页', 
      url: '/api/songs/1/records/', 
      params: { page: 1, page_size: 5 } 
    }
  ],
  
  // 曲风和标签API测试用例
  metadata: [
    { 
      name: '获取曲风列表', 
      url: '/api/styles/', 
      params: {} 
    },
    { 
      name: '获取标签列表', 
      url: '/api/tags/', 
      params: {} 
    }
  ],
  
  // 热歌榜API测试用例
  topsongs: [
    { 
      name: '全部时间热歌榜', 
      url: '/api/top_songs/', 
      params: { range: 'all', limit: 10 } 
    },
    { 
      name: '一个月热歌榜', 
      url: '/api/top_songs/', 
      params: { range: '1m', limit: 5 } 
    },
    { 
      name: '三个月热歌榜', 
      url: '/api/top_songs/', 
      params: { range: '3m', limit: 5 } 
    },
    { 
      name: '一年热歌榜', 
      url: '/api/top_songs/', 
      params: { range: '1y', limit: 5 } 
    },
    { 
      name: '十天热歌榜', 
      url: '/api/top_songs/', 
      params: { range: '10d', limit: 5 } 
    }
  ],
  
  // 随机歌曲和推荐API测试用例
  random: [
    { 
      name: '获取随机歌曲', 
      url: '/api/random-song/', 
      params: {} 
    },
    { 
      name: '获取推荐语', 
      url: '/api/recommendation/', 
      params: {} 
    }
  ],
  
  // 粉丝DIY合集API测试用例
  collections: [
    { 
      name: '获取合集列表', 
      url: '/api/fansDIY/collections/', 
      params: {} 
    },
    { 
      name: '合集列表分页', 
      url: '/api/fansDIY/collections/', 
      params: { page: 1, limit: 5 } 
    },
    { 
      name: '获取合集详情', 
      url: '/api/fansDIY/collections/1/', 
      params: {} 
    }
  ],
  
  // 粉丝DIY作品API测试用例
  works: [
    { 
      name: '获取作品列表', 
      url: '/api/fansDIY/works/', 
      params: {} 
    },
    { 
      name: '作品列表分页', 
      url: '/api/fansDIY/works/', 
      params: { page: 1, limit: 5 } 
    },
    { 
      name: '按合集筛选作品', 
      url: '/api/fansDIY/works/', 
      params: { collection: 1 } 
    },
    { 
      name: '获取作品详情', 
      url: '/api/fansDIY/works/1/', 
      params: {} 
    }
  ]
};

// 执行单个测试
async function runSingleTest(category, test) {
  try {
    // 构建URL
    const url = new URL(test.url, API_BASE_URL);
    
    // 添加查询参数
    Object.keys(test.params).forEach(key => {
      if (test.params[key] !== undefined && test.params[key] !== '') {
        url.searchParams.set(key, test.params[key]);
      }
    });
    
    const urlString = url.toString();
    console.log(`Testing: ${test.name} - ${urlString}`);
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 发送请求
    const response = await fetch(urlString);
    
    // 记录结束时间
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 获取响应数据
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // 返回测试结果
    return {
      name: test.name,
      url: urlString,
      method: 'GET',
      status: response.status,
      statusText: response.statusText,
      responseTime,
      headers: Object.fromEntries(response.headers.entries()),
      data: data,
      success: response.ok
    };
    
  } catch (error) {
    console.error(`Error testing ${test.name}:`, error.message);
    return {
      name: test.name,
      url: test.url,
      method: 'GET',
      error: error.message,
      success: false
    };
  }
}

// 执行所有测试
async function runAllTests() {
  console.log('开始执行API测试...');
  console.log(`API基础URL: ${API_BASE_URL}`);
  
  const results = {};
  const summary = {
    total: 0,
    success: 0,
    failed: 0,
    categories: {}
  };
  
  // 按类别执行测试
  for (const [category, tests] of Object.entries(testCases)) {
    console.log(`\n测试类别: ${category}`);
    results[category] = [];
    summary.categories[category] = { total: 0, success: 0, failed: 0 };
    
    for (const test of tests) {
      summary.total++;
      summary.categories[category].total++;
      
      const result = await runSingleTest(category, test);
      results[category].push(result);
      
      if (result.success) {
        summary.success++;
        summary.categories[category].success++;
        console.log(`✅ ${test.name} - ${result.status} (${result.responseTime}ms)`);
        
        // 显示数据概要
        if (result.data) {
          if (result.data.total !== undefined) {
            console.log(`   数据总数: ${result.data.total}`);
          }
          if (result.data.results && Array.isArray(result.data.results)) {
            console.log(`   返回条数: ${result.data.results.length}`);
          }
        }
      } else {
        summary.failed++;
        summary.categories[category].failed++;
        console.log(`❌ ${test.name} - ${result.error || result.status}`);
        
        // 显示错误详情
        if (result.data && result.data.error) {
          console.log(`   错误详情: ${result.data.error}`);
        }
      }
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  // 保存详细测试结果
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = `api-test-results-${timestamp}.json`;
  
  fs.writeFileSync(
    path.join(__dirname, resultsFile),
    JSON.stringify({
      summary,
      results,
      timestamp: new Date().toISOString(),
      apiBaseUrl: API_BASE_URL
    }, null, 2)
  );
  
  // 保存简化版结果用于快速查看
  fs.writeFileSync(
    path.join(__dirname, 'api-test-results-latest.json'),
    JSON.stringify({
      summary,
      results,
      timestamp: new Date().toISOString(),
      apiBaseUrl: API_BASE_URL
    }, null, 2)
  );
  
  // 输出测试总结
  console.log('\n===== 测试总结 =====');
  console.log(`总计: ${summary.total} 个测试`);
  console.log(`成功: ${summary.success} 个测试`);
  console.log(`失败: ${summary.failed} 个测试`);
  console.log(`成功率: ${((summary.success / summary.total) * 100).toFixed(2)}%`);
  
  console.log('\n各类别详情:');
  for (const [category, stats] of Object.entries(summary.categories)) {
    console.log(`${category}: ${stats.success}/${stats.total} 成功`);
  }
  
  console.log(`\n详细结果已保存到: ${resultsFile}`);
  
  return { summary, results };
}

// 检查是否有fetch函数，如果没有则导入node-fetch
if (typeof fetch === 'undefined') {
  try {
    global.fetch = require('node-fetch');
  } catch (error) {
    console.error('请先安装node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

// 执行测试
runAllTests().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});
