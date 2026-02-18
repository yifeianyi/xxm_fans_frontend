import { Metadata } from 'next';
import { getSongs } from '@/app/infrastructure/api/songService';
import { Song } from '@/app/domain/types';

export const metadata: Metadata = {
    title: '歌曲列表 | 小满虫之家',
    description: '咻咻满全部翻唱、原唱作品，支持搜索、筛选、排序',
};

// 强制动态渲染，每次请求都获取最新数据
export const dynamic = 'force-dynamic';

export default async function SongsPage() {
    let songs: Song[] = [];
    let error: string | null = null;
    
    try {
        const result = await getSongs({ page: 1, limit: 10 });
        songs = result.results || [];
        console.log(`[SongsPage] Loaded ${songs.length} songs`);
    } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error';
        console.error('[SongsPage] Error:', error);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#5d4037] mb-6">歌曲列表</h1>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-600">加载失败: {error}</p>
                </div>
            )}
            
            {!error && songs.length === 0 && (
                <div className="text-center py-12 text-[#8d6e63]">
                    <p>暂无数据</p>
                </div>
            )}
            
            <div className="grid gap-4">
                {songs.map((song) => (
                    <div 
                        key={song.id} 
                        className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex-1">
                            <h3 className="font-bold text-[#5d4037] text-lg">{song.name}</h3>
                            <p className="text-[#8d6e63] text-sm">{song.originalArtist}</p>
                            <div className="flex gap-2 mt-2">
                                {song.genres.map((genre: string) => (
                                    <span 
                                        key={genre} 
                                        className="px-2 py-1 bg-[#f8b195]/20 text-[#f8b195] text-xs rounded-full"
                                    >
                                        {genre}
                                    </span>
                                ))}
                                {song.languages.map((lang: string) => (
                                    <span 
                                        key={lang} 
                                        className="px-2 py-1 bg-[#8eb69b]/20 text-[#8eb69b] text-xs rounded-full"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right text-sm text-[#8d6e63]">
                            <p>演唱 {song.performanceCount} 次</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center text-sm text-[#8d6e63]">
                共加载 {songs.length} 首歌曲
            </div>
        </div>
    );
}
