/**
 * SEO 工具函数
 * 
 * 提供 SEO 相关的辅助函数
 */

/**
 * 生成图片的 SEO 友好 alt 文本
 * 
 * @param context - 图片上下文（如：直播封面、歌曲封面等）
 * @param details - 详细信息（如日期、歌曲名等）
 * @param index - 图片序号（可选）
 * @returns SEO 友好的 alt 文本
 * 
 * @example
 * generateImageAlt('直播封面', '2024年1月15日') 
 * // => "咻咻满直播封面 - 2024年1月15日"
 * 
 * generateImageAlt('歌曲封面', '翻唱《红豆》', 1)
 * // => "咻咻满歌曲封面 - 翻唱《红豆》 第1张"
 */
export const generateImageAlt = (
  context: string,
  details?: string,
  index?: number
): string => {
  let alt = `咻咻满${context}`;
  
  if (details) {
    alt += ` - ${details}`;
  }
  
  if (index !== undefined && index > 0) {
    alt += ` 第${index}张`;
  }
  
  return alt;
};

/**
 * 生成歌曲相关的 alt 文本
 */
export const generateSongAlt = (songName: string, type: 'cover' | 'performance' = 'cover'): string => {
  if (type === 'performance') {
    return `咻咻满演唱《${songName}》表演封面`;
  }
  return `咻咻满《${songName}》歌曲封面`;
};

/**
 * 生成直播相关的 alt 文本
 */
export const generateLiveAlt = (date: string, description?: string): string => {
  let alt = `咻咻满${date}直播`;
  if (description) {
    alt += ` - ${description}`;
  }
  return alt;
};

/**
 * 生成图集相关的 alt 文本
 */
export const generateGalleryAlt = (
  galleryName: string, 
  filename: string,
  index?: number
): string => {
  // 尝试从文件名提取信息
  const patterns: Record<string, string> = {
    'live': '直播截图',
    'cover': '封面',
    'portrait': '照片',
    'performance': '表演',
    'backstage': '幕后',
  };
  
  let type = '图片';
  for (const [key, value] of Object.entries(patterns)) {
    if (filename.toLowerCase().includes(key)) {
      type = value;
      break;
    }
  }
  
  let alt = `咻咻满${galleryName}${type}`;
  if (index !== undefined) {
    alt += `第${index + 1}张`;
  }
  
  return alt;
};

/**
 * 生成 Meta 描述文本（限制长度）
 * 
 * @param text - 原始文本
 * @param maxLength - 最大长度（默认 160）
 * @returns 截断后的文本
 */
export const generateMetaDescription = (text: string, maxLength: number = 160): string => {
  if (text.length <= maxLength) return text;
  
  // 在句子结尾截断
  const truncated = text.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastComma = truncated.lastIndexOf('，');
  
  const cutIndex = Math.max(lastPeriod, lastComma);
  if (cutIndex > maxLength * 0.7) {
    return truncated.slice(0, cutIndex + 1);
  }
  
  return truncated.slice(0, maxLength - 3) + '...';
};

/**
 * 生成 Canonical URL
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://www.xxm8777.cn';
  // 移除尾部斜杠，统一 URL 格式
  const cleanPath = path.replace(/\/$/, '') || '/';
  return `${baseUrl}${cleanPath}`;
};

/**
 * 关键词密度检查
 * 
 * @param content - 内容文本
 * @param keyword - 目标关键词
 * @returns 关键词密度百分比
 */
export const checkKeywordDensity = (content: string, keyword: string): number => {
  const cleanContent = content.replace(/\s+/g, '');
  const keywordCount = (cleanContent.match(new RegExp(keyword, 'g')) || []).length;
  const density = (keywordCount / cleanContent.length) * 100;
  return Math.round(density * 100) / 100;
};

/**
 * 推荐的关键词密度检查
 * 对于"咻咻满"关键词，建议密度在 2-8% 之间
 */
export const checkXxmKeywordDensity = (content: string): {
  density: number;
  count: number;
  status: 'low' | 'optimal' | 'high';
  suggestion: string;
} => {
  const keyword = '咻咻满';
  const cleanContent = content.replace(/\s+/g, '');
  const count = (cleanContent.match(new RegExp(keyword, 'g')) || []).length;
  const density = (count / (cleanContent.length / 3)) * 100; // 中文字符按3字节估算
  
  let status: 'low' | 'optimal' | 'high';
  let suggestion: string;
  
  if (density < 2) {
    status = 'low';
    suggestion = '建议适当增加"咻咻满"关键词的出现频率';
  } else if (density > 8) {
    status = 'high';
    suggestion = '关键词密度过高，建议适当减少，避免被搜索引擎判定为关键词堆砌';
  } else {
    status = 'optimal';
    suggestion = '关键词密度适中，继续保持';
  }
  
  return {
    density: Math.round(density * 100) / 100,
    count,
    status,
    suggestion
  };
};

/**
 * 生成分享文本
 */
export const generateShareText = (title: string, type: 'weibo' | 'wechat' | 'default' = 'default'): string => {
  const baseText = `推荐你来看看：${title}`;
  
  switch (type) {
    case 'weibo':
      return `${baseText} #咻咻满# #满满来信#`;
    case 'wechat':
      return baseText;
    default:
      return baseText;
  }
};

export default {
  generateImageAlt,
  generateSongAlt,
  generateLiveAlt,
  generateGalleryAlt,
  generateMetaDescription,
  generateCanonicalUrl,
  checkKeywordDensity,
  checkXxmKeywordDensity,
  generateShareText,
};
