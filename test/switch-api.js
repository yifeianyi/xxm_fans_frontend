#!/usr/bin/env node
// API切换脚本

const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../.env.local');

// 读取当前环境变量
function readEnvFile() {
  if (!fs.existsSync(envFilePath)) {
    console.log('❌ .env.local 文件不存在');
    return null;
  }
  
  const content = fs.readFileSync(envFilePath, 'utf8');
  const lines = content.split('\n');
  const env = {};
  
  lines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1]] = match[2];
    }
  });
  
  return env;
}

// 写入环境变量
function writeEnvFile(env) {
  const lines = [
    '# 后端 API 配置',
    '# 请将下面的 URL 替换为你实际的后端地址',
    '# 示例：',
    '# VITE_API_BASE_URL=http://localhost:8000/api',
    '# VITE_API_BASE_URL=http://192.168.1.100:8000/api',
    '',
    `VITE_API_BASE_URL=${env.VITE_API_BASE_URL}`,
    `VITE_USE_MOCK=${env.VITE_USE_MOCK}`
  ];
  
  fs.writeFileSync(envFilePath, lines.join('\n'));
}

// 切换API类型
function switchApi(type) {
  const env = readEnvFile();
  if (!env) return;
  
  const currentType = env.VITE_USE_MOCK === 'true' ? 'mock' : 'real';
  
  if (currentType === type) {
    console.log(`✅ 已经使用 ${type} API`);
    return;
  }
  
  if (type === 'mock') {
    env.VITE_USE_MOCK = 'true';
  } else {
    env.VITE_USE_MOCK = 'false';
    // 确保使用正确的API地址
    if (!env.VITE_API_BASE_URL || env.VITE_API_BASE_URL === '') {
      env.VITE_API_BASE_URL = 'http://172.27.171.134:8000/api';
    }
  }
  
  writeEnvFile(env);
  
  console.log(`✅ 已切换到 ${type} API`);
  console.log('📝 请重启开发服务器使更改生效: npm run dev');
}

// 显示当前状态
function showStatus() {
  const env = readEnvFile();
  if (!env) return;
  
  const type = env.VITE_USE_MOCK === 'true' ? 'Mock' : 'Real';
  console.log(`📊 当前使用: ${type} API`);
  console.log(`🔗 API地址: ${env.VITE_API_BASE_URL}`);
  
  // 验证配置
  if (env.VITE_USE_MOCK === 'false') {
    if (env.VITE_API_BASE_URL.includes('172.27.171.134:8000')) {
      console.log('✅ API地址配置正确');
    } else {
      console.log('⚠️  API地址可能不正确，应该使用 172.27.171.134:8000');
    }
  }
}

// 设置正确的API地址
function setCorrectApiUrl() {
  const env = readEnvFile();
  if (!env) return;
  
  const correctUrl = 'http://172.27.171.134:8000/api';
  
  if (env.VITE_API_BASE_URL !== correctUrl) {
    env.VITE_API_BASE_URL = correctUrl;
    writeEnvFile(env);
    console.log(`✅ 已更新API地址为: ${correctUrl}`);
  } else {
    console.log(`✅ API地址已经是正确的: ${correctUrl}`);
  }
  
  console.log('📝 请重启开发服务器使更改生效: npm run dev');
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'mock':
      switchApi('mock');
      break;
    case 'real':
      switchApi('real');
      break;
    case 'status':
      showStatus();
      break;
    case 'fix-url':
      setCorrectApiUrl();
      break;
    default:
      console.log('用法:');
      console.log('  node switch-api.js mock     - 切换到Mock API');
      console.log('  node switch-api.js real     - 切换到Real API');
      console.log('  node switch-api.js status   - 显示当前状态');
      console.log('  node switch-api.js fix-url  - 设置正确的API地址');
      break;
  }
}

main();