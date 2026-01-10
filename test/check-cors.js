// 检查CORS问题的脚本
const http = require('http');

const API_BASE_URL = 'http://172.27.171.134:8000/api';

function checkCORS(url) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    const req = http.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function runCORSCheck() {
  console.log('=== CORS检查 ===');
  console.log(`测试地址: ${API_BASE_URL}`);
  
  try {
    console.log('\n1. 检查CORS配置...');
    const result = await checkCORS(`${API_BASE_URL}/songs/`);
    
    console.log(`状态码: ${result.status}`);
    console.log('CORS相关响应头:');
    console.log(`  Access-Control-Allow-Origin: ${result.headers['access-control-allow-origin'] || '未设置'}`);
    console.log(`  Access-Control-Allow-Methods: ${result.headers['access-control-allow-methods'] || '未设置'}`);
    console.log(`  Access-Control-Allow-Headers: ${result.headers['access-control-allow-headers'] || '未设置'}`);
    
    if (result.headers['access-control-allow-origin']) {
      console.log('\n✅ 服务器已配置CORS');
      if (result.headers['access-control-allow-origin'] === '*') {
        console.log('  - 允许所有来源访问');
      } else {
        console.log(`  - 允许特定来源访问: ${result.headers['access-control-allow-origin']}`);
      }
    } else {
      console.log('\n❌ 服务器未配置CORS');
      console.log('  - 这可能是HTML页面测试失败的原因');
      console.log('  - 建议在后端服务器添加CORS配置');
    }
    
  } catch (error) {
    console.error('❌ CORS检查失败:', error.message);
  }
}

runCORSCheck();