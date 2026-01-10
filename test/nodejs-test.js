// 简单的API连接测试脚本（使用Node.js内置模块）
const https = require('https');
const http = require('http');

const API_BASE_URL = 'http://172.27.171.134:8000/api';

function testConnection(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

async function runTest() {
  console.log('=== API连接测试 ===');
  console.log(`测试地址: ${API_BASE_URL}`);
  
  try {
    console.log('\n1. 测试基本连接...');
    const result = await testConnection(`${API_BASE_URL}/songs/?limit=1`);
    
    console.log(`状态码: ${result.status}`);
    console.log(`Content-Type: ${result.headers['content-type']}`);
    
    if (result.status === 200) {
      console.log('✅ 连接成功！');
      
      if (typeof result.data === 'object' && result.data.total !== undefined) {
        console.log('数据概要:', {
          total: result.data.total,
          返回条数: result.data.results?.length || 0
        });
        
        if (result.data.results && result.data.results.length > 0) {
          console.log('示例数据:', {
            id: result.data.results[0].id,
            歌名: result.data.results[0].song_name,
            歌手: result.data.results[0].singer
          });
        }
      }
    } else {
      console.log('❌ 连接失败，状态码:', result.status);
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

runTest();