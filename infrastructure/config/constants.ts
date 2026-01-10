
import { Song, SongRecord, Recommendation, FanCollection, FanWork, TimeRange } from '../../domain/types';

export const GENRES = ['流行', '古风', '戏腔', '摇滚', '民族', '美声', '儿歌', 'RAP'];
export const TAGS = ['Ban位', 'remix', '助眠', '小甜歌', '有清唱', '渣女三部曲', '满绝', '老歌'];
export const LANGUAGES = ['国语', '日语', '英语', '韩语', '粤语'];

const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const generateSongs = (): Song[] => {
  const baseSongs: Song[] = [
    { id: '1', name: '铃儿响叮当', originalArtist: 'ediq', genres: ['流行', '古风', '戏腔'], languages: ['国语'], firstPerformance: '2024-11-19', lastPerformance: '2025-11-30', performanceCount: 57, tags: ['满绝'] },
    { id: '2', name: '晚安喵', originalArtist: '艾露露', genres: ['流行'], languages: ['国语'], firstPerformance: '2023-05-10', lastPerformance: '2025-12-01', performanceCount: 290, tags: ['小甜歌', '助眠'] },
  ];

  const extraSongs: Song[] = Array.from({ length: 58 }, (_, i) => ({
    id: (i + 3).toString(),
    name: `满老师的信件 ${i + 3}`,
    originalArtist: `原唱歌手 ${Math.floor(i / 5) + 1}`,
    genres: [GENRES[i % GENRES.length]],
    languages: [LANGUAGES[i % LANGUAGES.length]],
    firstPerformance: getDate(300 + i),
    lastPerformance: getDate(2 + i),
    performanceCount: Math.floor(Math.random() * 50) + 5,
    tags: i % 3 === 0 ? [TAGS[i % TAGS.length]] : []
  }));

  return [...baseSongs, ...extraSongs];
};

export const MOCK_SONGS = generateSongs();

export const MOCK_RECORDS: SongRecord[] = Array.from({ length: 40 }, (_, i) => ({
  id: `r-${i}`,
  songId: (Math.floor(i / 5) + 1).toString(),
  date: getDate(i * 3),
  cover: `https://picsum.photos/seed/rec${i}/400/225`,
  note: i % 3 === 0 ? `这是一份珍贵的演唱记录，记录了满老师在森林里的动听时刻。` : `精彩记录 ${i}`,
  videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD'
}));

export const MOCK_RECOMMENDATION: Recommendation = {
  content: '森林树洞墙裂推荐 🌲',
  recommendedSongs: ['1', '2']
};

export const MOCK_COLLECTIONS: FanCollection[] = [
  { id: 'c1', name: '满虫浓度测试', description: '来看看你对满虫的了解程度', worksCount: 1 },
  { id: 'c2', name: '高能混剪', description: '各种精彩瞬间', worksCount: 12 }
];

export const MOCK_FAN_WORKS: FanWork[] = Array.from({ length: 15 }, (_, i) => ({
  id: `w${i}`,
  title: `【二创】精彩瞬间作品 ${i + 1}`,
  author: i % 2 === 0 ? '自发粉' : '小满虫',
  cover: `https://picsum.photos/seed/work${i}/400/225`,
  videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
  note: i % 4 === 0 ? '这是一个关于满老师的超长备注信息，用来测试卡片在不同内容长度下的自适应表现。' : `作品简述 ${i}`,
  collectionId: i === 0 ? 'c1' : 'c2',
  position: i
}));
