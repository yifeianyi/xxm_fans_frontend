// API数据格式分析脚本 - 分析API响应数据结构
const fs = require('fs');
const path = require('path');

// 读取最新的测试结果
function loadTestResults() {
  try {
    const resultsPath = path.join(__dirname, 'api-test-results-latest.json');
    if (!fs.existsSync(resultsPath)) {
      throw new Error('测试结果文件不存在，请先运行 test-all-apis.js');
    }
    return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  } catch (error) {
    console.error('读取测试结果失败:', error.message);
    process.exit(1);
  }
}

// 分析数据类型
function analyzeDataType(value, depth = 0) {
  if (depth > 3) return { type: 'nested_too_deep', note: '嵌套层级过深' };
  
  const indent = '  '.repeat(depth);
  
  if (value === null) {
    return { type: 'null', note: '空值' };
  }
  
  if (value === undefined) {
    return { type: 'undefined', note: '未定义' };
  }
  
  const type = Array.isArray(value) ? 'array' : typeof value;
  
  switch (type) {
    case 'string':
      return { 
        type: 'string', 
        length: value.length,
        sample: value.length > 50 ? value.substring(0, 50) + '...' : value
      };
      
    case 'number':
      return { 
        type: 'number', 
        isInteger: Number.isInteger(value),
        range: Number.isInteger(value) ? 'integer' : 'float'
      };
      
    case 'boolean':
      return { type: 'boolean', value };
      
    case 'array':
      if (value.length === 0) {
        return { type: 'array', length: 0, itemType: 'unknown' };
      }
      
      const firstItem = value[0];
      const itemType = analyzeDataType(firstItem, depth + 1);
      
      return { 
        type: 'array', 
        length: value.length,
        itemType: itemType.type,
        sampleItem: firstItem
      };
      
    case 'object':
      const fields = {};
      const required = [];
      const optional = [];
      
      for (const [key, val] of Object.entries(value)) {
        fields[key] = analyzeDataType(val, depth + 1);
        
        // 简单的必填/可选判断（基于值是否为空）
        if (val !== null && val !== undefined && val !== '') {
          required.push(key);
        } else {
          optional.push(key);
        }
      }
      
      return {
        type: 'object',
        fields,
        required: required.sort(),
        optional: optional.sort(),
        fieldCount: Object.keys(fields).length
      };
      
    default:
      return { type, note: '未知类型' };
  }
}

// 分析API响应格式
function analyzeApiResponse(testResult) {
  if (!testResult.data) {
    return {
      error: '无响应数据',
      status: testResult.status,
      errorInfo: testResult.error
    };
  }
  
  const analysis = {
    url: testResult.url,
    status: testResult.status,
    responseTime: testResult.responseTime,
    dataStructure: analyzeDataType(testResult.data),
    headers: {
      contentType: testResult.headers['content-type'],
      contentLength: testResult.headers['content-length']
    }
  };
  
  // 特殊分析：如果是分页响应
  if (testResult.data.total !== undefined && 
      testResult.data.page !== undefined && 
      testResult.data.results !== undefined) {
    analysis.pagination = {
      total: testResult.data.total,
      page: testResult.data.page,
      pageSize: testResult.data.page_size || testResult.data.pageSize,
      resultCount: Array.isArray(testResult.data.results) ? testResult.data.results.length : 0
    };
    
    if (testResult.data.results.length > 0) {
      analysis.itemStructure = analyzeDataType(testResult.data.results[0]);
    }
  }
  
  return analysis;
}

// 生成数据格式文档
function generateDocumentation(analysis) {
  let doc = `# API响应数据格式文档\n\n`;
  doc += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
  doc += `API地址: ${analysis.apiBaseUrl}\n\n`;
  
  // 添加测试总结
  doc += `## 测试总结\n\n`;
  doc += `- 总测试数: ${analysis.summary.total}\n`;
  doc += `- 成功: ${analysis.summary.success}\n`;
  doc += `- 失败: ${analysis.summary.failed}\n`;
  doc += `- 成功率: ${((analysis.summary.success / analysis.summary.total) * 100).toFixed(2)}%\n\n`;
  
  // 按类别生成文档
  for (const [category, tests] of Object.entries(analysis.analyzedResults)) {
    doc += `## ${category.toUpperCase()}\n\n`;
    
    for (const test of tests) {
      if (test.error) {
        doc += `### ❌ ${test.name}\n\n`;
        doc += `**状态**: 失败\n\n`;
        doc += `**错误**: ${test.error}\n\n`;
        doc += `**URL**: ${test.url}\n\n`;
        continue;
      }
      
      doc += `### ✅ ${test.name}\n\n`;
      doc += `**URL**: ${test.url}\n\n`;
      doc += `**状态**: ${test.status}\n\n`;
      doc += `**响应时间**: ${test.responseTime}ms\n\n`;
      doc += `**Content-Type**: ${test.headers.contentType}\n\n`;
      
      // 数据结构
      if (test.dataStructure) {
        doc += `**数据结构**:\n\n`;
        doc += `\`\`\`json\n`;
        doc += JSON.stringify(test.dataStructure, null, 2);
        doc += `\n\`\`\`\n\n`;
      }
      
      // 分页信息
      if (test.pagination) {
        doc += `**分页信息**:\n\n`;
        doc += `- 总数: ${test.pagination.total}\n`;
        doc += `- 当前页: ${test.pagination.page}\n`;
        doc += `- 页大小: ${test.pagination.pageSize}\n`;
        doc += `- 当前页结果数: ${test.pagination.resultCount}\n\n`;
        
        if (test.itemStructure) {
          doc += `**列表项结构**:\n\n`;
          doc += `\`\`\`json\n`;
          doc += JSON.stringify(test.itemStructure, null, 2);
          doc += `\n\`\`\`\n\n`;
        }
      }
      
      doc += `---\n\n`;
    }
  }
  
  return doc;
}

// 主函数
async function main() {
  console.log('开始分析API数据格式...');
  
  // 加载测试结果
  const testResults = loadTestResults();
  console.log(`已加载测试结果: ${testResults.summary.total} 个测试`);
  
  // 分析每个测试结果
  const analyzedResults = {};
  
  for (const [category, tests] of Object.entries(testResults.results)) {
    console.log(`分析类别: ${category}`);
    analyzedResults[category] = tests.map(test => analyzeApiResponse(test));
  }
  
  // 生成分析结果
  const analysis = {
    timestamp: new Date().toISOString(),
    apiBaseUrl: testResults.apiBaseUrl,
    summary: testResults.summary,
    analyzedResults
  };
  
  // 保存分析结果
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const analysisFile = `api-format-analysis-${timestamp}.json`;
  
  fs.writeFileSync(
    path.join(__dirname, analysisFile),
    JSON.stringify(analysis, null, 2)
  );
  
  // 生成文档
  const documentation = generateDocumentation(analysis);
  const docFile = `api-format-documentation-${timestamp}.md`;
  
  fs.writeFileSync(
    path.join(__dirname, docFile),
    documentation
  );
  
  // 保存最新版本
  fs.writeFileSync(
    path.join(__dirname, 'api-format-analysis-latest.json'),
    JSON.stringify(analysis, null, 2)
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'api-format-documentation-latest.md'),
    documentation
  );
  
  console.log('\n===== 分析完成 =====');
  console.log(`分析结果已保存到: ${analysisFile}`);
  console.log(`文档已保存到: ${docFile}`);
  
  // 输出简单统计
  console.log('\n===== 数据格式统计 =====');
  for (const [category, tests] of Object.entries(analyzedResults)) {
    const successCount = tests.filter(t => !t.error).length;
    console.log(`${category}: ${successCount}/${tests.length} 成功`);
  }
  
  return analysis;
}

// 执行分析
main().catch(error => {
  console.error('分析失败:', error);
  process.exit(1);
});