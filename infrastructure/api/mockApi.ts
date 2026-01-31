import {
    AccountData, VideoStats, TimeGranularity, DataPoint, CorrelationData,
    Gallery, GalleryImage, Livestream, SongRecord, OriginalWork
} from '../../domain/types';

// 生成数据点
const generatePoints = (count: number, base: number, step: number): DataPoint[] => {
    let current = base;
    return Array.from({ length: count }, (_, i) => {
        const delta = Math.floor(Math.random() * step);
        current += delta;
        return {
            time: `${i}:00`,
            value: current,
            delta: delta
        };
    });
};

// 生成演唱记录
const generateSongRecords = (date: string, count: number): SongRecord[] => {
    const songs = ['满天星', '溯光者', '森林来信', '月光小夜曲', '未命名', '你的名字', '陪伴', '晚安曲', '感谢有你', '未来可期'];
    return Array.from({ length: count }, (_, i) => ({
        id: `record-${date}-${i}`,
        songId: `song-${songs[i % songs.length]}`,
        date: date,
        cover: `https://picsum.photos/seed/record-${date}-${i}/800/600`,
        coverThumbnailUrl: `https://picsum.photos/seed/record-${date}-${i}/160/120`,
        note: `精彩演唱 #${i + 1}`,
        videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1xx411c7mD'
    }));
};

// Mock 图集数据
const MOCK_GALLERIES: Gallery[] = [
    {
        id: '1',
        title: '森林日常',
        description: '记录满满在森林中的日常生活瞬间',
        coverUrl: 'https://picsum.photos/seed/forest1/400/500',
        imageCount: 24,
        tags: ['日常', '风景', '生活']
    },
    {
        id: '2',
        title: '演唱会现场',
        description: '精彩演唱瞬间回顾',
        coverUrl: 'https://picsum.photos/seed/concert/400/500',
        imageCount: 36,
        tags: ['演出', '舞台', '精彩']
    },
    {
        id: '3',
        title: '粉丝见面会',
        description: '与粉丝互动的美好时光',
        coverUrl: 'https://picsum.photos/seed/fans/400/500',
        imageCount: 18,
        tags: ['互动', '粉丝', '温馨']
    }
];

// Mock 图集图片数据
const MOCK_GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 24 }, (_, i) => ({
    id: `img-${i}`,
    url: `https://picsum.photos/seed/forest${i}/800/600`,
    title: `森林瞬间 #${i + 1}`,
    date: `2025-01-${(i % 30 + 1).toString().padStart(2, '0')}`,
    galleryIds: ['1']
}));

// Mock 直播数据 - 生成多月份的数据
const MOCK_LIVESTREAMS_BY_MONTH: Record<string, Livestream[]> = {
    '2025-12': [
        {
            id: 'live-2025-12-05',
            date: '2025-12-05',
            title: '冬夜音乐专场',
            summary: '寒冬腊月，暖暖用歌声温暖每一个夜晚。本场直播演唱了多首治愈系歌曲。',
            coverUrl: 'https://picsum.photos/seed/live20251205/800/450',
            viewCount: '8.9w',
            danmakuCount: '2.1w',
            startTime: '20:30',
            endTime: '23:15',
            duration: '2小时45分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD' },
                { title: '上半场', url: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD&p=1' },
                { title: '下半场', url: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD&p=2' }
            ],
            songCuts: [
                { name: '月光小夜曲', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD&p=3' },
                { name: '雪花飘飘', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD&p=4' },
                { name: '森林来信', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD&p=5' },
                { name: '未命名', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7hD&p=6' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251205ss1/800/450',
                'https://picsum.photos/seed/20251205ss2/800/450',
                'https://picsum.photos/seed/20251205ss3/800/450',
                'https://picsum.photos/seed/20251205ss4/800/450',
                'https://picsum.photos/seed/20251205ss5/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251205cloud/800/600'
        },
        {
            id: 'live-2025-12-12',
            date: '2025-12-12',
            title: '双十二特别企划',
            summary: '双十二之夜，满满为大家准备了特别歌单，包括多首粉丝点播歌曲。',
            coverUrl: 'https://picsum.photos/seed/live20251212/800/450',
            viewCount: '11.2w',
            danmakuCount: '2.8w',
            startTime: '20:00',
            endTime: '00:30',
            duration: '4小时30分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1hJ411x7hD' }
            ],
            songCuts: [
                { name: '满天星', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1hJ411x7hD&p=1' },
                { name: '溯光者', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1hJ411x7hD&p=2' },
                { name: '你的名字', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1hJ411x7hD&p=3' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251212ss1/800/450',
                'https://picsum.photos/seed/20251212ss2/800/450',
                'https://picsum.photos/seed/20251212ss3/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251212cloud/800/600'
        },
        {
            id: 'live-2025-12-20',
            date: '2025-12-20',
            title: '冬至温暖夜',
            summary: '冬至夜，暖暖用温暖的音乐陪伴大家度过寒冷的长夜。',
            coverUrl: 'https://picsum.photos/seed/live20251220/800/450',
            viewCount: '9.6w',
            danmakuCount: '2.3w',
            startTime: '19:30',
            endTime: '22:45',
            duration: '3小时15分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1kJ411x7hD' }
            ],
            songCuts: [
                { name: '冬至夜', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1kJ411x7hD&p=1' },
                { name: '暖冬', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1kJ411x7hD&p=2' },
                { name: '陪伴', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1kJ411x7hD&p=3' },
                { name: '晚安曲', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1kJ411x7hD&p=4' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251220ss1/800/450',
                'https://picsum.photos/seed/20251220ss2/800/450',
                'https://picsum.photos/seed/20251220ss3/800/450',
                'https://picsum.photos/seed/20251220ss4/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251220cloud/800/600'
        },
        {
            id: 'live-2025-12-25',
            date: '2025-12-25',
            title: '圣诞音乐派对',
            summary: '圣诞节特别直播，满满带来了满满的圣诞祝福和精彩演出！',
            coverUrl: 'https://picsum.photos/seed/live20251225/800/450',
            viewCount: '15.3w',
            danmakuCount: '4.1w',
            startTime: '20:00',
            endTime: '01:00',
            duration: '5小时00分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD' },
                { title: '上半场', url: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=1' },
                { title: '中场互动', url: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=2' },
                { title: '下半场', url: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=3' }
            ],
            songCuts: [
                { name: '圣诞快乐', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=4' },
                { name: '平安夜', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=5' },
                { name: '满天星', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=6' },
                { name: '溯光者', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=7' },
                { name: '森林来信', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1pJ411x7hD&p=8' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251225ss1/800/450',
                'https://picsum.photos/seed/20251225ss2/800/450',
                'https://picsum.photos/seed/20251225ss3/800/450',
                'https://picsum.photos/seed/20251225ss4/800/450',
                'https://picsum.photos/seed/20251225ss5/800/450',
                'https://picsum.photos/seed/20251225ss6/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251225cloud/800/600'
        },
        {
            id: 'live-2025-12-31',
            date: '2025-12-31',
            title: '跨年倒计时特别直播',
            summary: '2025年最后一场直播，和满满一起跨入2026年！倒计时、回顾、展望！',
            coverUrl: 'https://picsum.photos/seed/live20251231/800/450',
            viewCount: '22.7w',
            danmakuCount: '5.9w',
            startTime: '20:00',
            endTime: '00:30',
            duration: '4小时30分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD' },
                { title: '上半场回顾', url: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=1' },
                { title: '倒计时环节', url: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=2' },
                { title: '2026展望', url: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=3' }
            ],
            songCuts: [
                { name: '这一年', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=4' },
                { name: '新年快乐', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=5' },
                { name: '满天星', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=6' },
                { name: '未来可期', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1vJ411x7hD&p=7' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251231ss1/800/450',
                'https://picsum.photos/seed/20251231ss2/800/450',
                'https://picsum.photos/seed/20251231ss3/800/450',
                'https://picsum.photos/seed/20251231ss4/800/450',
                'https://picsum.photos/seed/20251231ss5/800/450',
                'https://picsum.photos/seed/20251231ss6/800/450',
                'https://picsum.photos/seed/20251231ss7/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251231cloud/800/600'
        }
    ],
    '2025-11': [
        {
            id: 'live-2025-11-08',
            date: '2025-11-08',
            title: '深秋音乐夜',
            summary: '深秋时节，暖暖用音乐描绘秋天的色彩，带来多首怀旧与治愈歌曲。',
            coverUrl: 'https://picsum.photos/seed/live20251108/800/450',
            viewCount: '7.8w',
            danmakuCount: '1.9w',
            startTime: '20:00',
            endTime: '22:30',
            duration: '2小时30分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1cJ411x7hD' }
            ],
            songCuts: [
                { name: '秋意浓', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1cJ411x7hD&p=1' },
                { name: '落叶', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1cJ411x7hD&p=2' },
                { name: '月光小夜曲', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1cJ411x7hD&p=3' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251108ss1/800/450',
                'https://picsum.photos/seed/20251108ss2/800/450',
                'https://picsum.photos/seed/20251108ss3/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251108cloud/800/600'
        },
        {
            id: 'live-2025-11-15',
            date: '2025-11-15',
            title: '粉丝点歌会',
            summary: '本周粉丝点歌专场，满满演唱了多首粉丝投票选出的热门歌曲。',
            coverUrl: 'https://picsum.photos/seed/live20251115/800/450',
            viewCount: '10.1w',
            danmakuCount: '2.6w',
            startTime: '20:30',
            endTime: '23:45',
            duration: '3小时15分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1dJ411x7hD' }
            ],
            songCuts: [
                { name: '满天星', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1dJ411x7hD&p=1' },
                { name: '溯光者', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1dJ411x7hD&p=2' },
                { name: '森林来信', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1dJ411x7hD&p=3' },
                { name: '你的名字', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1dJ411x7hD&p=4' },
                { name: '未命名', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1dJ411x7hD&p=5' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251115ss1/800/450',
                'https://picsum.photos/seed/20251115ss2/800/450',
                'https://picsum.photos/seed/20251115ss3/800/450',
                'https://picsum.photos/seed/20251115ss4/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251115cloud/800/600'
        },
        {
            id: 'live-2025-11-22',
            date: '2025-11-22',
            title: '感恩节特别企划',
            summary: '感恩节特别直播，暖暖用音乐表达感谢，分享创作心得。',
            coverUrl: 'https://picsum.photos/seed/live20251122/800/450',
            viewCount: '9.3w',
            danmakuCount: '2.4w',
            startTime: '19:30',
            endTime: '23:00',
            duration: '3小时30分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD' },
                { title: '上半场', url: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD&p=1' },
                { title: '下半场', url: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD&p=2' }
            ],
            songCuts: [
                { name: '感谢有你', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD&p=3' },
                { name: '陪伴', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD&p=4' },
                { name: '满天星', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD&p=5' },
                { name: '溯光者', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1eJ411x7hD&p=6' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251122ss1/800/450',
                'https://picsum.photos/seed/20251122ss2/800/450',
                'https://picsum.photos/seed/20251122ss3/800/450',
                'https://picsum.photos/seed/20251122ss4/800/450',
                'https://picsum.photos/seed/20251122ss5/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251122cloud/800/600'
        },
        {
            id: 'live-2025-11-29',
            date: '2025-11-29',
            title: '月末音乐总结',
            summary: '11月最后一场直播，总结本月音乐历程，分享新歌创作进展。',
            coverUrl: 'https://picsum.photos/seed/live20251129/800/450',
            viewCount: '8.5w',
            danmakuCount: '2.1w',
            startTime: '20:00',
            endTime: '22:15',
            duration: '2小时15分',
            recordings: [
                { title: '完整回放', url: 'https://player.bilibili.com/player.html?bvid=BV1fJ411x7hD' }
            ],
            songCuts: [
                { name: '11月总结', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1fJ411x7hD&p=1' },
                { name: '新歌预告', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1fJ411x7hD&p=2' },
                { name: '森林来信', videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1fJ411x7hD&p=3' }
            ],
            screenshots: [
                'https://picsum.photos/seed/20251129ss1/800/450',
                'https://picsum.photos/seed/20251129ss2/800/450',
                'https://picsum.photos/seed/20251129ss3/800/450'
            ],
            danmakuCloudUrl: 'https://picsum.photos/seed/20251129cloud/800/600'
        }
    ]
};

// Mock 原唱作品数据
const MOCK_ORIGINAL_WORKS: OriginalWork[] = [
    {
        title: '满天星',
        date: '2024.01.15',
        desc: '第一首个人原创单曲，星光点缀梦境。',
        cover: 'https://picsum.photos/seed/o1/400/400',
        neteaseId: '1330348068',
        featured: true
    },
    {
        title: '溯光者',
        date: '2023.11.20',
        desc: '在音符中寻找光亮，致敬不曾放弃的灵魂。',
        cover: 'https://picsum.photos/seed/o2/400/400',
        bilibiliBvid: 'BV1xx411c7mD',
        featured: true
    },
    {
        title: '森林来信',
        date: '2023.05.10',
        desc: '写给所有小满虫的音乐家书，温暖坚定。',
        cover: 'https://picsum.photos/seed/o3/400/400',
        neteaseId: '1901371647',
        featured: true
    },
    {
        title: '月光小夜曲',
        date: '2023.02.28',
        desc: '温柔的夜晚，用音乐诉说心事。',
        cover: 'https://picsum.photos/seed/o4/400/400',
        neteaseId: '1496089319',
        featured: false
    },
    {
        title: '未发布作品',
        date: '2025.03.01',
        desc: '即将发布的全新原唱作品，敬请期待！',
        cover: 'https://picsum.photos/seed/o5/400/400',
        featured: false
    }
];

// Mock 演唱记录数据
const MOCK_MONTHLY_RECORDS: SongRecord[] = Array.from({ length: 12 }, (_, i) => ({
    id: `rec-${i}`,
    songId: `song-${i % 3}`,
    date: `2025-01-${(i * 2 + 1).toString().padStart(2, '0')}`,
    cover: `https://picsum.photos/seed/rec${i}/800/600`,
    note: `精彩演唱瞬间 #${i + 1}`,
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1xx411c7mD'
}));

export const mockApi = {
    // 数据分析相关
    getAccounts: async (): Promise<AccountData[]> => {
        await new Promise(r => setTimeout(r, 400));
        return [
            {
                id: 'main',
                name: '咻咻满 (主站)',
                totalFollowers: 1254800,
                history: {
                    HOUR: generatePoints(24, 1250000, 300),
                    DAY: generatePoints(30, 1200000, 5000),
                    MONTH: generatePoints(12, 1000000, 100000)
                }
            },
            {
                id: 'sub',
                name: '小满虫的树洞',
                totalFollowers: 158000,
                history: {
                    HOUR: generatePoints(24, 150000, 50),
                    DAY: generatePoints(30, 140000, 800),
                    MONTH: generatePoints(12, 100000, 15000)
                }
            }
        ];
    },

    getVideos: async (): Promise<VideoStats[]> => {
        return Array.from({ length: 15 }, (_, i) => ({
            id: `v-${i}`,
            title: i === 0 ? "【咻咻满】虾头歌友会：女粉献唱《百万个吻》" : i === 1 ? "【咻咻满】她唱的都比较冷门，只有游戏党懂！" : `投稿作品 #${20 - i}`,
            cover: `https://picsum.photos/seed/v${i}/400/225`,
            publishTime: `2026年01月0${(i % 5) + 1}日 11:30:00`,
            duration: '06:53',
            views: Math.floor(Math.random() * 8000) + 1000,
            guestRatio: Number((Math.random() * 15 + 80).toFixed(1)),
            fanWatchRate: Number((Math.random() * 15 + 10).toFixed(1)),
            followerGrowth: Math.floor(Math.random() * 10),
            likes: Math.floor(Math.random() * 200) + 50,
            comments: Math.floor(Math.random() * 30) + 5,
            danmaku: Math.floor(Math.random() * 10) + 1,
            favs: Math.floor(Math.random() * 50) + 1,
            metrics: {
                HOUR: { views: generatePoints(24, 10000, 500), likes: generatePoints(24, 500, 20), danmaku: generatePoints(24, 100, 5) },
                DAY: { views: generatePoints(30, 100000, 8000), likes: generatePoints(30, 5000, 400), danmaku: generatePoints(30, 1000, 80) },
                MONTH: { views: generatePoints(12, 500000, 100000), likes: generatePoints(12, 20000, 5000), danmaku: generatePoints(12, 5000, 1000) }
            }
        }));
    },

    getCorrelation: async (granularity: TimeGranularity): Promise<CorrelationData[]> => {
        const counts = { HOUR: 24, DAY: 30, MONTH: 12 };
        return Array.from({ length: counts[granularity] }, (_, i) => ({
            time: `${i}`,
            videoViewDelta: Math.floor(Math.random() * 50000) + 10000,
            followerDelta: Math.floor(Math.random() * 1000) + 100
        }));
    },

    // 图集相关
    getGalleries: async (): Promise<Gallery[]> => {
        await new Promise(r => setTimeout(r, 300));
        return MOCK_GALLERIES;
    },

    getImagesByGallery: async (id: string): Promise<GalleryImage[]> => {
        await new Promise(r => setTimeout(r, 300));
        return MOCK_GALLERY_IMAGES.filter(img => img.galleryIds.includes(id));
    },

    // 直播相关
    getLivestreams: async (year: number, month: number): Promise<Livestream[]> => {
        await new Promise(r => setTimeout(r, 300));
        // 根据年月返回对应的数据
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        return MOCK_LIVESTREAMS_BY_MONTH[key] || [];
    },

    // 原唱作品相关
    getOriginalWorks: async (): Promise<OriginalWork[]> => {
        await new Promise(r => setTimeout(r, 200));
        return MOCK_ORIGINAL_WORKS;
    },

    // 月度记录相关
    getRecordsByMonth: async (year: number, month: number): Promise<SongRecord[]> => {
        await new Promise(r => setTimeout(r, 300));
        if (year === 2025 && month === 1) {
            return MOCK_MONTHLY_RECORDS;
        }
        return [];
    }
};