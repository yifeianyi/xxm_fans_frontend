
import { Song, SongRecord, Recommendation, FanCollection, FanWork } from './types';

export const GENRES = ['流行', '古风', '戏腔', '摇滚', '民族', '美声', '儿歌', 'RAP'];
export const TAGS = ['Ban位', 'remix', '助眠', '小甜歌', '有清唱', '渣女三部曲', '满绝', '老歌'];
export const LANGUAGES = ['国语', '日语', '英语', '韩语', '粤语'];

// Helper to generate a range of dates
const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Generate 65 Mock Songs for Pagination testing (Page size is 50)
const generateSongs = (): Song[] => {
  const baseSongs: Song[] = [
    { id: '1', name: '铃儿响叮当', originalArtist: 'ediq', genres: ['流行', '古风', '戏腔'], languages: ['国语'], firstPerformance: '2024-11-19', lastPerformance: '2025-11-30', performanceCount: 57, tags: ['满绝'] },
    { id: '2', name: '晚安喵', originalArtist: '艾露露', genres: ['流行'], languages: ['国语'], firstPerformance: '2023-05-10', lastPerformance: '2025-12-01', performanceCount: 290, tags: ['小甜歌', '助眠'] },
    { id: '3', name: '十年人间', originalArtist: '李常超', genres: ['古风', '流行'], languages: ['国语'], firstPerformance: '2024-01-15', lastPerformance: '2025-11-15', performanceCount: 80, tags: ['老歌'] },
    { id: '4', name: '赤伶', originalArtist: 'HITA', genres: ['古风', '戏腔'], languages: ['国语'], firstPerformance: '2023-12-10', lastPerformance: '2025-11-20', performanceCount: 67, tags: ['满绝', '有清唱'] },
    { id: '5', name: '云与海', originalArtist: '阿YueYue', genres: ['流行'], languages: ['国语'], firstPerformance: '2024-02-14', lastPerformance: '2025-11-25', performanceCount: 60, tags: [] },
    { id: '6', name: '不舍', originalArtist: '徐佳莹', genres: ['流行'], languages: ['国语'], firstPerformance: '2024-03-10', lastPerformance: '2025-11-10', performanceCount: 48, tags: [] },
    { id: '7', name: '如愿', originalArtist: '王菲', genres: ['流行'], languages: ['国语'], firstPerformance: '2024-05-01', lastPerformance: '2025-11-05', performanceCount: 48, tags: [] },
    { id: '8', name: '孤勇者', originalArtist: '陈奕迅', genres: ['流行'], languages: ['国语'], firstPerformance: '2024-06-15', lastPerformance: '2025-11-12', performanceCount: 48, tags: [] },
  ];

  const extraSongs: Song[] = Array.from({ length: 57 }, (_, i) => ({
    id: (i + 9).toString(),
    name: `测试歌曲 ${i + 9}`,
    originalArtist: `原唱歌手 ${Math.floor(i / 5)}`,
    genres: [GENRES[i % GENRES.length]],
    languages: [LANGUAGES[i % LANGUAGES.length]],
    firstPerformance: getDate(300 + i),
    lastPerformance: getDate(2 + i),
    performanceCount: Math.floor(Math.random() * 50) + 1,
    tags: i % 3 === 0 ? [TAGS[i % TAGS.length]] : []
  }));

  return [...baseSongs, ...extraSongs];
};

export const MOCK_SONGS = generateSongs();

// Generate 45 records for song '1' for infinite scroll testing (Page size is 20)
const generateRecords = (): SongRecord[] => {
  const records: SongRecord[] = [];
  
  // High volume records for song ID '1'
  for (let i = 0; i < 45; i++) {
    records.push({
      id: `r-1-${i}`,
      songId: '1',
      date: getDate(i * 2 + 1),
      cover: `https://picsum.photos/seed/song1-${i}/300/400`,
      note: i % 3 === 0 ? `这是一段关于第 ${45-i} 次演唱的详细备注信息，测试排版是否美观居中。` : `第 ${45-i} 次精彩演唱`,
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD'
    });
  }

  // Some records for song ID '2'
  for (let i = 0; i < 15; i++) {
    records.push({
      id: `r-2-${i}`,
      songId: '2',
      date: getDate(i * 5),
      cover: `https://picsum.photos/seed/song2-${i}/300/400`,
      note: `甜蜜瞬间 ${i + 1}`,
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD'
    });
  }

  // Add a few records for other songs
  MOCK_SONGS.slice(2, 20).forEach(song => {
    records.push({
      id: `r-${song.id}-0`,
      songId: song.id,
      date: song.lastPerformance,
      cover: `https://picsum.photos/seed/song${song.id}/300/400`,
      note: '单次记录测试',
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD'
    });
  });

  return records;
};

export const MOCK_RECORDS = generateRecords();

export const MOCK_RECOMMENDATION: Recommendation = {
  content: '站长墙裂推荐（欢迎多点点！！！）',
  recommendedSongs: ['1', '2', '3', '4']
};

export const MOCK_COLLECTIONS: FanCollection[] = [
  { id: 'c1', name: '满虫浓度测试', description: '来看看你对满虫的了解程度吧', worksCount: 1 },
  { id: 'c2', name: '高能混剪', description: '各种精彩瞬间大合集', worksCount: 16 },
  { id: 'c3', name: '历年生日会', description: '每年的感动瞬间', worksCount: 8 }
];

const generateFanWorks = (): FanWork[] => {
  const works: FanWork[] = [
    {
      id: 'w1',
      title: '【互动视频】咻咻满知识问答',
      author: '自发粉',
      cover: 'https://picsum.photos/seed/w1/400/225',
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
      note: '测试长备注：欢迎大家来挑战这个互动视频，看看你是不是真爱粉！',
      collectionId: 'c1',
      position: 1
    },
    {
      id: 'w2',
      title: '【周深×咻咻满】《人是_》伪合唱',
      author: 'yoyowon7',
      cover: 'https://picsum.photos/seed/w2/400/225',
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
      note: '震撼人心的双声部',
      collectionId: 'c2',
      position: 20
    }
  ];

  // Generate more for c2 and c3
  for (let i = 3; i <= 25; i++) {
    const colId = i > 18 ? 'c3' : 'c2';
    works.push({
      id: `w${i}`,
      title: i > 18 ? `${2025 - (25-i)} 生日会精选` : `精彩混剪作品 ${i}`,
      author: i % 2 === 0 ? '咻咻满的表情包' : '小满虫粉丝团',
      cover: `https://picsum.photos/seed/work${i}/400/225`,
      videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
      note: i % 4 === 0 ? '这是一段非常长的备注信息，用来测试卡片下方文字居中显示以及高度自适应的情况，确保即使备注很长也不会遮挡内容。' : `作品描述信息 ${i}`,
      collectionId: colId,
      position: i
    });
  }

  return works;
};

export const MOCK_FAN_WORKS = generateFanWorks();
