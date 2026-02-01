/**
 * 数据分析页面工具函数
 */

// 通用数值格式化
export const formatNumber = (num: number) => {
  if (num === 0) return '0';
  if (Math.abs(num) >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

// 精确数值格式化（用于提示框，带千位分隔符）
export const formatExactNumber = (num: number) => {
  return num.toLocaleString('zh-CN');
};