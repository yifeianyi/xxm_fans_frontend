
import React, { useState, useEffect } from 'react';
import { songService } from '../../../infrastructure/api';
import { Song, TimeRange, Recommendation } from '../../../domain/types';
import { Sparkles } from 'lucide-react';
import { Loading } from '../common/Loading';
import MysteryBoxModal from '../common/MysteryBoxModal';
import VideoModal from '../common/VideoModal';

const RANGE_OPTIONS = [
  { value: TimeRange.ALL, label: '全部' },
  { value: TimeRange.THREE_MONTHS, label: '近3月榜' },
  { value: TimeRange.YEAR, label: '年榜' }
];

const RankingChart: React.FC = () => {
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recommendedSongsDetails, setRecommendedSongsDetails] = useState<any[]>([]);
  const [range, setRange] = useState<TimeRange>(TimeRange.ALL);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('🔍 Fetching top songs with range:', range);
      try {
        const [songsResult, recResult] = await Promise.all([
          songService.getTopSongs({ range, limit: 10 }),
          songService.getRecommendation()
        ]);
        
        console.log('📊 热歌榜结果:', songsResult);
        if (songsResult.data) {
          console.log('✅ 热歌榜数据:', songsResult.data);
          setTopSongs(songsResult.data);
        }
        if (songsResult.error) console.error('❌ 获取热歌榜失败:', songsResult.error);
        
        console.log('💬 推荐语结果:', recResult);
        if (recResult.data) {
          console.log('✅ 推荐语数据:', recResult.data);
          console.log('📝 推荐语内容:', recResult.data.content);
          console.log('🎵 推荐歌曲ID:', recResult.data.recommendedSongs);

          // 检查是否有推荐的歌曲详情
          const details = (recResult.data as any).recommendedSongsDetails;
          console.log('🔍 检查推荐歌曲详情:', details);
          console.log('🔍 推荐歌曲详情类型:', typeof details);
          console.log('🔍 推荐歌曲详情长度:', details?.length);

          if (details && Array.isArray(details) && details.length > 0) {
            console.log('🎵 推荐歌曲详情:', details);
            setRecommendedSongsDetails(details);
          } else {
            console.warn('⚠️ 没有找到推荐歌曲详情或详情为空');
            console.warn('⚠️ recResult.data 对象的所有属性:', Object.keys(recResult.data));
          }

          setRecommendation(recResult.data);
        } else {
          console.warn('⚠️ 推荐语数据为空');
        }
        if (recResult.error) console.error('❌ 获取推荐语失败:', recResult.error);
      } catch (error) {
        console.error('❌ 数据加载失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  const maxCount = topSongs.length > 0 ? Math.max(...topSongs.map(s => s.performanceCount), 1) : 1;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 极简推荐位 - 改为单行设计以节省空间 */}
      {recommendation && (
        <div className="px-6 py-3 bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-white/50">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-200 fill-yellow-200" />
            <span className="text-[11px] font-black tracking-wider whitespace-nowrap">{recommendation.content}</span>
          </div>
          <div className="flex gap-2">
            {recommendedSongsDetails.map(song => (
              <button
                key={song.id}
                onClick={() => {
                  // 将推荐歌曲转换为Song对象格式
                  const songObject: Song = {
                    id: song.id,
                    name: song.name,
                    originalArtist: song.singer,
                    genres: [], // 推荐歌曲API不返回这些信息
                    languages: song.language ? [song.language] : [],
                    firstPerformance: '',
                    lastPerformance: '',
                    performanceCount: 0, // 推荐歌曲API不返回演唱次数
                    tags: []
                  };
                  setSelectedSong(songObject);
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black transition-all"
                title={`${song.name} - ${song.singer}`}
              >
                {song.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 排行榜切换按钮 */}
      <div className="flex justify-center">
        <div className="relative flex p-1 bg-white/40 rounded-full shadow-inner border-2 border-white overflow-hidden">
          <div className={`absolute top-1 bottom-1 transition-all duration-300 ease-out z-0 bg-gradient-to-r from-[#f8b195] to-[#f67280] rounded-full`}
               style={{ width: `${100 / RANGE_OPTIONS.length}%`, left: `${RANGE_OPTIONS.findIndex(r => r.value === range) * (100 / RANGE_OPTIONS.length) + 0.5}%` }}>
          </div>
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                console.log('🖱️ Clicked range option:', option.value);
                setRange(option.value);
              }}
              className={`relative z-10 flex-1 py-2 px-4 text-xs font-black transition-all whitespace-nowrap ${range === option.value ? 'text-white' : 'text-[#8eb69b]'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 排行榜主体 - 高密度布局 */}
      <div className="glass-card p-6 rounded-[2.5rem] border-2 border-white shadow-xl">
        {loading ? (
          <div className="py-24"><Loading text="加载中..." /></div>
        ) : (
          <div className="flex flex-col gap-2">
            {topSongs.map((song, index) => (
              <div key={song.id} className="group flex items-center gap-4 py-1.5 px-2 hover:bg-white/40 rounded-2xl transition-all">
                {/* 排名数字 - 缩小尺寸 */}
                <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-lg font-black italic transform transition-all group-hover:scale-110 ${
                  index === 0 ? 'bg-[#f8b195] text-white' : 
                  index === 1 ? 'bg-[#f67280] text-white' : 
                  index === 2 ? 'bg-[#c06c84] text-white' : 
                  'bg-white/50 text-[#8eb69b] border border-white'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-baseline gap-2 overflow-hidden">
                      <span className="font-black text-[#4a3728] text-sm hover:text-[#f8b195] cursor-pointer truncate" onClick={() => setSelectedSong(song)}>
                        {song.name}
                      </span>
                      <span className="text-[9px] text-[#8eb69b] font-bold uppercase truncate opacity-60">
                        {song.originalArtist}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="text-sm font-black text-[#f8b195]">{song.performanceCount}</span>
                      <span className="text-[8px] font-bold text-[#8eb69b]">演唱次数</span>
                    </div>
                  </div>
                  
                  {/* 极简进度条 - 降低高度 */}
                  <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden border border-white/30 relative shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        index < 3 ? 'bg-gradient-to-r from-[#f8b195] to-[#f67280]' : 'bg-[#d1e7d0]'
                      }`} 
                      style={{ width: `${(song.performanceCount / maxCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MysteryBoxModal isOpen={!!selectedSong} onClose={() => setSelectedSong(null)} song={selectedSong} onPlay={setVideoUrl} />
      <VideoModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl || ''} />
    </div>
  );
};

export default RankingChart;
