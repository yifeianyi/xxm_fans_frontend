import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, SlidersHorizontal, RotateCcw, Play, Plus } from 'lucide-react';
import { Song, FilterState } from '../../../domain/types';
import { GENRES, TAGS, LANGUAGES } from '../../../infrastructure/config/constants';
import { songService } from '../../../infrastructure/api';
import { Loading } from './Loading';

interface CustomWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSong: (song: Song) => void;
}

// 转盘配色 - 温暖的 pastel 色系
const WHEEL_COLORS = [
  '#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d',
  '#99b898', '#feceab', '#ff847c', '#e84a5f', '#2a363b',
  '#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94',
  '#b4a7d6', '#d5a6bd', '#ea9999', '#f9cb9c', '#ffe599',
  '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b6d7a8', '#d9ead3',
  '#f4cccc', '#fce5cd', '#fff2cc', '#d9d2e9', '#ead1dc',
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Fisher-Yates 洗牌算法，确保均匀随机
const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const CustomWheelModal: React.FC<CustomWheelModalProps> = ({ isOpen, onClose, onSelectSong }) => {
  const [step, setStep] = useState<'filter' | 'wheel'>('filter');
  const [filters, setFilters] = useState<FilterState>({ genres: [], tags: [], languages: [] });
  const [artists, setArtists] = useState<string[]>([]);
  const [artistInput, setArtistInput] = useState('');
  const [wheelSongs, setWheelSongs] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // 绘制转盘
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || wheelSongs.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 14;
    const sliceAngle = (2 * Math.PI) / wheelSongs.length;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    wheelSongs.forEach((song, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;

      // 绘制扇区
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制文字
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Noto Sans SC", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2;
      const displayName = song.name.length > 8 ? song.name.slice(0, 7) + '…' : song.name;
      ctx.fillText(displayName, radius - 22, 5);
      ctx.restore();
    });

    ctx.restore();
  }, [wheelSongs, rotation]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setStep('filter');
      setFilters({ genres: [], tags: [], languages: [] });
      setArtists([]);
      setArtistInput('');
      setWheelSongs([]);
      setIsSpinning(false);
      setRotation(0);
    }
  }, [isOpen]);





  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) ? prev[type].filter(v => v !== value) : [...prev[type], value]
    }));
  };

  const handleAddArtist = async () => {
    const name = artistInput.trim();
    if (!name) return;
    if (artists.includes(name)) {
      setArtistInput('');
      return;
    }
    // 实时调用 API 校验歌手是否在曲库中
    try {
      const result = await songService.getSongs({ q: name, limit: 1 });
      if (result.data && result.data.total > 0) {
        setArtists([...artists, name]);
        setArtistInput('');
      } else {
        alert('曲库中，没有这名歌手的歌');
      }
    } catch (e) {
      console.error(e);
      alert('校验歌手失败，请重试');
    }
  };

  const handleArtistKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddArtist();
    }
  };

  const handleConfirmFilter = async () => {
    setLoadingSongs(true);
    try {
      const hasGenres = filters.genres.length > 0;
      const hasTags = filters.tags.length > 0;
      const hasLanguages = filters.languages.length > 0;
      const hasArtists = artists.length > 0;

      // 没有任何筛选条件时，获取全部歌曲
      if (!hasGenres && !hasTags && !hasLanguages && !hasArtists) {
        const result = await songService.getSongs({ page: 1, limit: 500, ordering: '?' });
        if (result.data && result.data.results.length > 0) {
          setWheelSongs(result.data.results.slice(0, 30));
          setStep('wheel');
        } else {
          alert('没有符合条件的歌曲，请调整筛选条件');
        }
        setLoadingSongs(false);
        return;
      }

      // 每个具体条件单独请求，最后取并集（"或"关系）
      const requests: Promise<any>[] = [];
      filters.genres.forEach(genre => {
        requests.push(songService.getSongs({ page: 1, limit: 500, ordering: '?', styles: genre }));
      });
      filters.tags.forEach(tag => {
        requests.push(songService.getSongs({ page: 1, limit: 500, ordering: '?', tags: tag }));
      });
      filters.languages.forEach(language => {
        requests.push(songService.getSongs({ page: 1, limit: 500, ordering: '?', language: language }));
      });
      artists.forEach(artist => {
        requests.push(songService.getSongs({ page: 1, limit: 500, ordering: '?', q: artist }));
      });

      const results = await Promise.all(requests);
      const songMap = new Map<string, Song>();

      results.forEach(result => {
        if (result.data && result.data.results) {
          result.data.results.forEach((song: Song) => {
            songMap.set(song.id, song);
          });
        }
      });

      const mergedSongs = Array.from(songMap.values());

      if (mergedSongs.length > 0) {
        const shuffled = shuffle(mergedSongs);
        setWheelSongs(shuffled.slice(0, 30));
        setStep('wheel');
      } else {
        alert('没有符合条件的歌曲，请调整筛选条件');
      }
    } catch (e) {
      console.error(e);
      alert('获取歌曲失败，请重试');
    } finally {
      setLoadingSongs(false);
    }
  };

  const spin = () => {
    if (isSpinning || wheelSongs.length === 0) return;

    setIsSpinning(true);
    const sliceAngle = (2 * Math.PI) / wheelSongs.length;
    // 随机选中一个索引
    const targetIndex = Math.floor(Math.random() * wheelSongs.length);
    // 指针在顶部 (-PI/2)，需要让 targetIndex 的中心线转到顶部
    // 当前旋转为 rotation，目标 rotation 满足：
    // targetIndex * sliceAngle + sliceAngle/2 + targetRotation = -PI/2 (mod 2PI)
    // targetRotation = -PI/2 - (targetIndex * sliceAngle + sliceAngle/2) - rotation_base
    // 额外旋转 5-8 圈
    const extraSpins = 5 + Math.floor(Math.random() * 4);
    const currentNormalized = rotation % (2 * Math.PI);
    const targetOffset = -Math.PI / 2 - (targetIndex * sliceAngle + sliceAngle / 2);
    const targetRotation = rotation - currentNormalized + targetOffset - extraSpins * 2 * Math.PI;

    const duration = 4000;
    const startTime = performance.now();
    const startRotation = rotation;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const newRotation = startRotation + (targetRotation - startRotation) * eased;
      setRotation(newRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // 计算最终结果
        const normalized = (-newRotation - Math.PI / 2) % (2 * Math.PI);
        const positiveNormalized = normalized < 0 ? normalized + 2 * Math.PI : normalized;
        const finalIndex = Math.floor(positiveNormalized / sliceAngle) % wheelSongs.length;
        const selected = wheelSongs[finalIndex];
        if (selected) {
          // 短暂延迟后弹出结果
          setTimeout(() => {
            onSelectSong(selected);
          }, 400);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#4a3728]/30 backdrop-blur-xl animate-in fade-in duration-500">
      <div
        className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 border-4 border-white"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#f8b195]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f8b195] to-[#f67280] text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-black text-[#4a3728]">
              {step === 'filter' ? '自定义盲盒' : '命运大转盘'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-[#fef5f0] hover:bg-[#f8b195]/20 rounded-2xl transition-all text-[#f8b195]"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'filter' ? (
            <div className="space-y-6">
              <p className="text-[#8eb69b] font-bold text-center">
                选择你心仪的歌曲范围，同类型多选为"或"关系，最多会随机挑选 30 首歌进入转盘
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: '曲风', type: 'genres' as const, data: GENRES },
                  { title: '标签', type: 'tags' as const, data: TAGS },
                  { title: '语种', type: 'languages' as const, data: LANGUAGES }
                ].map(group => (
                  <div key={group.type} className="glass-card rounded-2xl p-4">
                    <h4 className="font-bold text-[#4a3728] mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <div className="w-1 h-3 bg-[#f8b195] rounded-full" />
                      {group.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.data.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleFilter(group.type, item)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            filters[group.type].includes(item)
                              ? 'bg-[#f8b195] text-white border-[#f8b195]'
                              : 'bg-white/50 text-[#8eb69b] border-[#8eb69b]/20 hover:border-[#f8b195]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {/* 歌手筛选 */}
                <div className="glass-card rounded-2xl p-4 md:col-span-2">
                  <h4 className="font-bold text-[#4a3728] mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <div className="w-1 h-3 bg-[#f8b195] rounded-full" />
                    歌手
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {artists.map(artist => (
                      <span
                        key={artist}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#f8b195] text-white border border-[#f8b195]"
                      >
                        {artist}
                        <button
                          onClick={() => setArtists(artists.filter(a => a !== artist))}
                          className="hover:text-white/80"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={artistInput}
                        onChange={(e) => setArtistInput(e.target.value)}
                        onKeyDown={handleArtistKeyDown}
                        placeholder="输入歌手名，按回车添加"
                        className="flex-1 px-4 py-2 rounded-full bg-white border-2 border-[#8eb69b]/20 focus:border-[#f8b195] transition-all outline-none text-[#4a3728] placeholder:text-[#8eb69b]/40 font-bold text-sm"
                      />
                      <button
                        onClick={handleAddArtist}
                        disabled={!artistInput.trim()}
                        className="px-4 py-2 bg-[#f8b195] text-white rounded-full font-bold text-xs hover:brightness-105 transition-all disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleConfirmFilter}
                  disabled={loadingSongs}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#f8b195] to-[#f67280] text-white rounded-full font-black shadow-lg hover:brightness-105 transition-all disabled:opacity-60"
                >
                  {loadingSongs ? (
                    <>
                      <Loading text="" size="sm" />
                      <span>正在准备...</span>
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal size={18} />
                      <span>确认筛选，生成转盘</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center space-y-1">
                <p className="text-[#4a3728] font-black text-lg">
                  共 {wheelSongs.length} 首候选歌曲
                </p>
                <p className="text-[#8eb69b] font-bold text-sm">
                  点击转盘中间按钮，看看命运指向哪首歌
                </p>
              </div>

              <div className="relative">
                {/* 指针 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-[#f67280] drop-shadow-md" />
                </div>

                {/* 转盘 Canvas */}
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={520}
                  className="w-[340px] h-[340px] md:w-[460px] md:h-[460px] rounded-full shadow-2xl"
                />

                {/* 中心按钮 */}
                <button
                  onClick={spin}
                  disabled={isSpinning}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-[5px] border-[#f8b195] flex flex-col items-center justify-center text-[#f67280] hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed z-10"
                >
                  <Play size={24} fill="currentColor" className="ml-1" />
                  <span className="text-xs font-black mt-0.5">开始</span>
                </button>
              </div>

              <button
                onClick={() => setStep('filter')}
                className="flex items-center gap-2 px-5 py-2 text-[#8eb69b] font-bold hover:text-[#f8b195] transition-colors"
              >
                <RotateCcw size={16} />
                重新筛选
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomWheelModal;
