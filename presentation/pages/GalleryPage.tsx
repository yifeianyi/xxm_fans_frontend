import React, { useState, useEffect } from 'react';
import { mockApi } from '../../infrastructure/api/mockApi';
import { Gallery, GalleryImage } from '../../domain/types';
import { Camera, ArrowLeft, Maximize2, X, Tag, Calendar } from 'lucide-react';

const GalleryPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const loadGalleries = async () => {
      setLoading(true);
      const data = await mockApi.getGalleries();
      setGalleries(data);
      setLoading(false);
    };
    loadGalleries();
  }, []);

  const handleOpenGallery = async (gallery: Gallery) => {
    setActiveGallery(gallery);
    setLoading(true);
    const data = await mockApi.getImagesByGallery(gallery.id);
    setImages(data);
    setLoading(false);
  };

  const handleBack = () => {
    setActiveGallery(null);
    setImages([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#fef5f0] text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-sm">
          <Camera size={18} />
          <span className="text-xs font-black uppercase tracking-[0.4em]">Forest Collection</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#4a3728] tracking-tighter">
          {activeGallery ? activeGallery.title : '森林图册'}
        </h1>
        <p className="text-[#8eb69b] font-bold text-lg max-w-2xl mx-auto">
          {activeGallery ? activeGallery.description : '每一帧定格，都是藏在时光信封里的绝色。'}
        </p>
      </div>

      {activeGallery && (
        <button
          onClick={handleBack}
          className="group flex items-center gap-3 px-8 py-4 bg-white rounded-3xl text-[#8eb69b] font-black hover:text-[#f8b195] transition-all border-2 border-white shadow-sm hover:shadow-xl active:scale-95 mx-auto"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>返回图册列表</span>
        </button>
      )}

      {loading ? (
        <div className="py-48 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-8 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin"></div>
          <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs">正在冲洗照片...</span>
        </div>
      ) : activeGallery ? (
        /* 照片展示流 */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 animate-in zoom-in-95"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => setLightboxImage(img)}
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#fef5f0]">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 size={32} className="text-white transform scale-50 group-hover:scale-100 transition-transform" />
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-[#4a3728] text-lg">{img.title}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8eb69b] font-black uppercase tracking-wider">
                    <Calendar size={12} />
                    {img.date}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {img.galleryIds.map(gid => {
                    const g = galleries.find(gal => gal.id === gid);
                    return g ? (
                      <span key={gid} className="px-2 py-1 bg-[#fef5f0] text-[#f8b195] text-[9px] font-black rounded-lg border border-[#f8b195]/10">
                        #{g.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 图集列表 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {galleries.map((gal, idx) => (
            <div
              key={gal.id}
              className="group relative cursor-pointer animate-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => handleOpenGallery(gal)}
            >
              {/* Stacked Paper Effect */}
              <div className="absolute inset-0 bg-white rounded-[3.5rem] rotate-3 translate-y-2 translate-x-1 shadow-sm opacity-50 transition-transform group-hover:rotate-6"></div>
              <div className="absolute inset-0 bg-white rounded-[3.5rem] -rotate-2 translate-y-1 shadow-sm opacity-80 transition-transform group-hover:-rotate-4"></div>

              <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-lg border-4 border-white transition-all group-hover:-translate-y-4">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={gal.coverUrl} alt={gal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    {gal.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{gal.title}</h2>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs font-bold opacity-80">{gal.imageCount} 张瞬间</span>
                    <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          <div className="relative max-w-full max-h-full flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
            />
            <div className="text-center text-white space-y-2">
              <h3 className="text-3xl font-black tracking-tight">{lightboxImage.title}</h3>
              <p className="text-white/40 font-bold tracking-widest uppercase text-sm">Captured on {lightboxImage.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;