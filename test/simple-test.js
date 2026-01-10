// 简单的API连接测试脚本
const fetch = require('node-fetch');

const API_BASE_URL = 'http://172.27.171.134:8000/api';

async function testConnection() {
  console.log('=== API连接测试 ===');
  console.log(`测试地址: ${API_BASE_URL}`);
  
  try {
    // 测试基本连接
    console.log('\n1. 测试基本连接...');
    const response = await fetch(`${API_BASE_URL}/songs/?limit=1`);
    
    console.log(`状态码: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 连接成功！');
      console.log('数据概要:', {
        total: data.total,
        返回条数: data.results?.length || 0
      });
      
      if (data.results && data.results.length > 0) {
        console.log('示例数据:', {
          id: data.results[0].id,
          歌名: data.results[0].song_name,
          歌手: data.results[0].singer
        });
      }
    } else {
      console.log('❌ 连接失败:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ 连接异常:', error.message);
    console.log('\n可能的原因:');
    console.log('1. 后端服务未启动');
    console.log('2. 网络连接问题');
    console.log('3. 防火墙阻止连接');
    console.log('4. API地址不正确');
  }
}

// 检查node-fetch是否可用
if (typeof fetch === 'undefined') {
  try {
    global.fetch = require('node-fetch');
    testConnection();
  } catch (error) {
    console.error('请先安装node-fetch: npm install node-fetch');
    console.log('或者在test目录下运行: npm install');
  }
} else {
  testConnection();
}