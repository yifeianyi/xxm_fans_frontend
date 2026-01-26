import React, { useState, useEffect } from 'react';
import { galleryService } from '../../infrastructure/api/RealGalleryService';
import { Gallery, GalleryImage, Breadcrumb } from '../../domain/types';
import { Camera, ArrowLeft, Maximize2, X, ChevronRight, Play, ChevronLeft, ChevronRight as ChevronRightIcon, Menu, Search, ChevronDown } from 'lucide-react';
import LazyImage from '../components/common/LazyImage';

const GalleryPage: React.FC = () => {
    const [galleryTree, setGalleryTree] = useState<Gallery[]>([]);
    const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [loading, setLoading] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Gallery[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [childrenImagesGroups, setChildrenImagesGroups] = useState<{
        gallery: Gallery;
        images: GalleryImage[];
    }[]>([]);
    const [allChildrenImages, setAllChildrenImages] = useState<GalleryImage[]>([]); // 扁平化的所有子集图片

    // 加载图集树
    useEffect(() => {
        loadGalleryTree();
    }, []);

    // 智能展开：当当前图集改变时，自动展开路径上的所有节点
    useEffect(() => {
        if (currentGallery) {
            autoExpandPath(currentGallery.id);
        }
    }, [currentGallery, galleryTree]);

    // 搜索功能
    useEffect(() => {
        if (searchTerm.trim()) {
            const results = searchGalleries(galleryTree, searchTerm.trim().toLowerCase());
            setSearchResults(results);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchTerm, galleryTree]);

    const loadGalleryTree = async () => {
        setLoading(true);
        const data = await galleryService.getGalleryTree();
        setGalleryTree(data);
        setLoading(false);
    };

    // 自动展开到当前图集的路径
    const autoExpandPath = (galleryId: string) => {
        const path = findPathToGallery(galleryTree, galleryId, []);
        if (path.length > 0) {
            setExpandedNodes(new Set(path.map(g => g.id)));
        }
    };

    // 查找路径
    const findPathToGallery = (tree: Gallery[], targetId: string, path: Gallery[]): Gallery[] => {
        for (const gallery of tree) {
            const currentPath = [...path, gallery];
            if (gallery.id === targetId) {
                return currentPath;
            }
            if (gallery.children) {
                const result = findPathToGallery(gallery.children, targetId, currentPath);
                if (result.length > 0) {
                    return result;
                }
            }
        }
        return [];
    };

    // 搜索图集
    const searchGalleries = (tree: Gallery[], term: string, results: Gallery[] = []): Gallery[] => {
        for (const gallery of tree) {
            if (gallery.title.toLowerCase().includes(term) || gallery.description.toLowerCase().includes(term)) {
                results.push(gallery);
            }
            if (gallery.children) {
                searchGalleries(gallery.children, term, results);
            }
        }
        return results;
    };

    // 判断是否为叶子节点
    const isLeafGallery = (gallery: Gallery): boolean => {
        return !gallery.children || gallery.children.length === 0;
    };

    // 处理图集点击
    const handleGalleryClick = async (gallery: Gallery) => {
        setSearchTerm('');
        setShowSearchResults(false);

        setCurrentGallery(gallery);
        updateBreadcrumbs(gallery);

        if (isLeafGallery(gallery)) {
            // 叶子节点：加载自己的图片
            await loadImages(gallery.id);
            setChildrenImagesGroups([]);
        } else {
            // 父节点：加载所有子图集的图片
            await loadChildrenImages(gallery.id);
            setImages([]);
        }
    };

    // 切换展开状态
    const toggleExpand = (galleryId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(galleryId)) {
                newSet.delete(galleryId);
            } else {
                newSet.add(galleryId);
            }
            return newSet;
        });
    };

    // 加载图片
    const loadImages = async (galleryId: string) => {
        setLoading(true);
        const data = await galleryService.getGalleryImages(galleryId);
        setImages(data);
        setCurrentImageIndex(0);
        setLoading(false);
    };

    // 加载子图集图片（用于父图集显示所有子图集的图片）
    const loadChildrenImages = async (galleryId: string) => {
        setLoading(true);
        const data = await galleryService.getGalleryChildrenImages(galleryId);
        setChildrenImagesGroups(data);

        // 创建扁平化的图片列表，用于灯箱连续切换
        const allImages = data.flatMap(group => group.images);
        setAllChildrenImages(allImages);

        setLoading(false);
    };

    // 更新面包屑
    const updateBreadcrumbs = async (gallery: Gallery) => {
        const data = await galleryService.getGalleryDetail(gallery.id);
        if (data && data.breadcrumbs) {
            setBreadcrumbs(data.breadcrumbs);
        }
    };

    // 返回上级
    const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
        if (breadcrumb.id === currentGallery?.id) return;

        if (breadcrumb.id === 'root') {
            setCurrentGallery(null);
            setBreadcrumbs([]);
            setImages([]);
        } else {
            const findGallery = (tree: Gallery[], id: string): Gallery | null => {
                for (const gallery of tree) {
                    if (gallery.id === id) return gallery;
                    if (gallery.children) {
                        const found = findGallery(gallery.children, id);
                        if (found) return found;
                    }
                }
                return null;
            };

            const gallery = findGallery(galleryTree, breadcrumb.id);
            if (gallery) {
                handleGalleryClick(gallery);
            }
        }
    };

    // 图片点击处理
    const handleImageClick = (img: GalleryImage, index: number, allImages?: GalleryImage[]) => {
        setLightboxImage(img);

        // 如果提供了完整的图片列表（用于子集图片），使用它
        if (allImages) {
            // 找到图片在全局列表中的索引
            const globalIndex = allImages.findIndex(image => image.id === img.id);
            setCurrentImageIndex(globalIndex >= 0 ? globalIndex : 0);
            setImages(allImages);
        } else {
            setCurrentImageIndex(index);
        }
    };

    // 上一张图片
    const handlePreviousImage = () => {
        if (images.length === 0) return;
        const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        setLightboxImage(images[newIndex]);
    };

    // 下一张图片
    const handleNextImage = () => {
        if (images.length === 0) return;
        const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
        setLightboxImage(images[newIndex]);
    };

    // 键盘事件处理
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxImage) return;

            switch (e.key) {
                case 'ArrowLeft':
                    handlePreviousImage();
                    break;
                case 'ArrowRight':
                    handleNextImage();
                    break;
                case 'Escape':
                    setLightboxImage(null);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxImage, currentImageIndex, images]);

    // 返回列表
    const handleBack = () => {
        if (breadcrumbs.length > 1) {
            handleBreadcrumbClick(breadcrumbs[breadcrumbs.length - 2]);
        } else {
            setCurrentGallery(null);
            setBreadcrumbs([]);
            setImages([]);
        }
    };

    // 渲染快速选择下拉选项
    const renderQuickSelectOptions = (galleries: Gallery[], level: number = 0): JSX.Element[] => {
        return galleries.flatMap(gallery => {
            const indent = '　'.repeat(level);
            const prefix = gallery.children?.length ? '📁 ' : '📄 ';

            return [
                <option key={gallery.id} value={gallery.id}>
                    {indent}{prefix}{gallery.title} ({gallery.imageCount})
                </option>,
                ...(gallery.children?.length ? renderQuickSelectOptions(gallery.children, level + 1) : [])
            ];
        });
    };

    return (
        <div className="flex h-screen bg-[#fef5f0]">
            {/* 左侧树形导航 */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:translate-x-0`}>
                <div className="h-full flex flex-col">
                    {/* 侧边栏头部 */}
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-black text-[#4a3728]">图集导航</h2>
                        <p className="text-xs text-gray-500 mt-1">点击展开/收起</p>
                    </div>

                    {/* 树形导航内容 */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {galleryTree.map(gallery => (
                            <GalleryTreeNode
                                key={gallery.id}
                                gallery={gallery}
                                currentGallery={currentGallery}
                                expandedNodes={expandedNodes}
                                onToggle={toggleExpand}
                                onSelect={handleGalleryClick}
                                level={0}
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* 移动端侧边栏遮罩 */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* 顶部导航栏 */}
                <header className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                        {/* 侧边栏切换按钮 */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} className="text-[#8eb69b]" />
                        </button>

                        {/* 面包屑导航 */}
                        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                            <button
                                onClick={() => handleBreadcrumbClick({ id: 'root', title: '首页' })}
                                className="text-[#8eb69b] hover:text-[#f8b195] transition-colors whitespace-nowrap"
                            >
                                首页
                            </button>
                            {breadcrumbs.map((breadcrumb, idx) => (
                                <React.Fragment key={breadcrumb.id}>
                                    <ChevronRight size={16} className="text-[#8eb69b]/50 flex-shrink-0" />
                                    <button
                                        onClick={() => handleBreadcrumbClick(breadcrumb)}
                                        className={`font-black transition-colors whitespace-nowrap ${idx === breadcrumbs.length - 1
                                            ? 'text-[#f8b195]'
                                            : 'text-[#8eb69b] hover:text-[#f8b195]'
                                            }`}
                                    >
                                        {breadcrumb.title}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* 搜索框 */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="搜索图集..."
                                className="w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8eb69b] text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* 搜索结果下拉 */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto z-50">
                                    {searchResults.map(gallery => (
                                        <div
                                            key={gallery.id}
                                            className="p-3 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                handleGalleryClick(gallery);
                                                setSearchTerm('');
                                                setShowSearchResults(false);
                                            }}
                                        >
                                            <div className="font-medium text-[#4a3728]">{gallery.title}</div>
                                            <div className="text-xs text-gray-500">{gallery.folderPath}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 快速选择器 */}
                        <select
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8eb69b] text-sm bg-white"
                            value={currentGallery?.id || ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    const findGallery = (tree: Gallery[], id: string): Gallery | null => {
                                        for (const gallery of tree) {
                                            if (gallery.id === id) return gallery;
                                            if (gallery.children) {
                                                const found = findGallery(gallery.children, id);
                                                if (found) return found;
                                            }
                                        }
                                        return null;
                                    };
                                    const gallery = findGallery(galleryTree, e.target.value);
                                    if (gallery) handleGalleryClick(gallery);
                                }
                            }}
                        >
                            <option value="">快速跳转</option>
                            {renderQuickSelectOptions(galleryTree)}
                        </select>
                    </div>
                </header>

                {/* 内容区 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Header - 只在根页面显示提示框 */}
                    {!currentGallery && (
                        <div className="max-w-4xl mx-auto mb-12">
                            <div className="bg-gradient-to-r from-[#f8b195]/10 to-[#8eb69b]/10 rounded-3xl p-8 border-2 border-[#f8b195]/20">
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white text-[#f8b195] rounded-full border border-[#f8b195]/20 shadow-sm">
                                        <Camera size={16} />
                                        <span className="text-xs font-black uppercase tracking-[0.4em]">满の图册</span>
                                    </div>
                                    <p className="text-[#4a3728] font-bold text-lg leading-relaxed">
                                        图集持续整理更新中~~~欢迎各位小满虫投稿和分享图片、表情包等物料~
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="py-48 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-8 border-[#f8b195]/20 border-t-[#f8b195] rounded-full animate-spin"></div>
                            <span className="text-[#8eb69b] font-black tracking-widest uppercase text-xs">正在加载...</span>
                        </div>
                    )}

                    {/* Image Gallery (Leaf Node) - 九宫格布局 */}
                    {!loading && currentGallery && isLeafGallery(currentGallery) && images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-4xl mx-auto">
                            {images.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    onClick={() => handleImageClick(img, idx)}
                                >
                                    <div className="w-full h-full overflow-hidden bg-[#fef5f0]">
                                        {img.isVideo ? (
                                            <video
                                                src={img.url}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                onMouseEnter={(e) => e.currentTarget.play()}
                                                onMouseLeave={(e) => e.currentTarget.pause()}
                                            />
                                        ) : (
                                            <div className="w-full h-full group-hover:scale-110 transition-transform duration-500">
                                                <LazyImage
                                                    src={img.url}
                                                    alt={img.title}
                                                />
                                            </div>
                                        )}
                                        {(img.isGif || img.isVideo) && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                                                <Play size={10} fill="white" />
                                                <span className="text-[10px] font-bold">{img.isVideo ? 'VIDEO' : 'GIF'}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Maximize2 size={24} className="text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Children Images Display - 显示子图集的所有图片 */}
                    {!loading && currentGallery && !isLeafGallery(currentGallery) && childrenImagesGroups.length > 0 && (
                        <div className="max-w-6xl mx-auto space-y-12">
                            {childrenImagesGroups.map((group, groupIndex) => (
                                <div key={group.gallery.id} className="space-y-6">
                                    {/* 子图集标题 */}
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-[#4a3728]">{group.gallery.title}</h3>
                                        <span className="px-3 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-full text-xs font-black uppercase tracking-widest">
                                            {group.images.length} 张
                                        </span>
                                    </div>

                                    {/* 子图集图片网格 */}
                                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                                        {group.images.map((img, idx) => (
                                            <div
                                                key={`${group.gallery.id}-${img.id}`}
                                                className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                onClick={() => handleImageClick(img, idx, allChildrenImages)}
                                            >
                                                <div className="w-full h-full overflow-hidden bg-[#fef5f0]">
                                                    {img.isVideo ? (
                                                        <video
                                                            src={img.url}
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            loop
                                                            playsInline
                                                            onMouseEnter={(e) => e.currentTarget.play()}
                                                            onMouseLeave={(e) => e.currentTarget.pause()}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full group-hover:scale-110 transition-transform duration-500">
                                                            <LazyImage
                                                                src={img.url}
                                                                alt={img.title}
                                                            />
                                                        </div>
                                                    )}
                                                    {(img.isGif || img.isVideo) && (
                                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                                                            <Play size={10} fill="white" />
                                                            <span className="text-[10px] font-bold">{img.isVideo ? 'VIDEO' : 'GIF'}</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Maximize2 size={24} className="text-white drop-shadow-lg" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 分隔线（最后一个不显示） */}
                                    {groupIndex < childrenImagesGroups.length - 1 && (
                                        <div className="flex items-center gap-4 py-4">
                                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
                                            <span className="text-[#f8b195]/40 text-xs font-black uppercase tracking-[0.3em]">
                                                ↓
                                            </span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f8b195]/30 to-transparent"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Gallery List (Non-leaf Node) - 网格相册布局 */}
                    {!loading && currentGallery && !isLeafGallery(currentGallery) && childrenImagesGroups.length === 0 && (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {currentGallery.children?.map((gallery) => (
                                    <div
                                        key={gallery.id}
                                        className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                        onClick={() => handleGalleryClick(gallery)}
                                    >
                                        {/* 封面图 */}
                                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-[#f8b195]/20 to-[#8eb69b]/20">
                                            <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
                                                <LazyImage
                                                    src={gallery.coverUrl || '/placeholder.jpg'}
                                                    alt={gallery.title}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            {/* 遮罩层 */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                        </div>

                                        {/* 信息区 */}
                                        <div className="p-4 space-y-3">
                                            {/* 标签 */}
                                            {gallery.tags.length > 0 && (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {gallery.tags.map(t => (
                                                        <span key={t} className="px-2 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-md text-[9px] font-black uppercase tracking-widest">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* 标题 */}
                                            <h2 className="text-lg font-black text-[#4a3728] line-clamp-1">
                                                {gallery.title}
                                            </h2>

                                            {/* 底部信息 */}
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="font-bold">
                                                    {gallery.imageCount} 张
                                                </span>
                                                <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 text-[#8eb69b]" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Root Gallery List - 网格相册布局 */}
                    {!loading && !currentGallery && (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {galleryTree.map((gallery) => (
                                    <div
                                        key={gallery.id}
                                        className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                        onClick={() => handleGalleryClick(gallery)}
                                    >
                                        {/* 封面图 */}
                                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-[#f8b195]/20 to-[#8eb69b]/20">
                                            <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
                                                <LazyImage
                                                    src={gallery.coverUrl || '/placeholder.jpg'}
                                                    alt={gallery.title}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            {/* 遮罩层 */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                        </div>

                                        {/* 信息区 */}
                                        <div className="p-4 space-y-3">
                                            {/* 标签 */}
                                            {gallery.tags.length > 0 && (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {gallery.tags.map(t => (
                                                        <span key={t} className="px-2 py-1 bg-[#f8b195]/10 text-[#f8b195] rounded-md text-[9px] font-black uppercase tracking-widest">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* 标题 */}
                                            <h2 className="text-lg font-black text-[#4a3728] line-clamp-1">
                                                {gallery.title}
                                            </h2>

                                            {/* 底部信息 */}
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="font-bold">
                                                    {gallery.imageCount} 张
                                                </span>
                                                <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 text-[#8eb69b]" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={40} />
                    </button>

                    {images.length > 0 && (
                        <>
                            <button
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviousImage();
                                }}
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage();
                                }}
                            >
                                <ChevronRightIcon size={32} />
                            </button>
                        </>
                    )}

                    <div className="relative max-w-full max-h-full flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
                        {lightboxImage.isVideo ? (
                            <video
                                src={lightboxImage.url}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
                                controls
                                autoPlay
                                loop
                            />
                        ) : (
                            <img
                                src={lightboxImage.url}
                                alt={lightboxImage.title}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
                            />
                        )}
                        <div className="text-center text-white space-y-2">
                            <h3 className="text-3xl font-black tracking-tight">{lightboxImage.title}</h3>
                            <p className="text-white/40 font-bold tracking-widest uppercase text-sm">
                                {lightboxImage.filename}
                                {images.length > 0 && ` (${currentImageIndex + 1} / ${images.length})`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Gallery Tree Node Component
const GalleryTreeNode: React.FC<{
    gallery: Gallery;
    currentGallery: Gallery | null;
    expandedNodes: Set<string>;
    onToggle: (id: string) => void;
    onSelect: (gallery: Gallery) => void;
    level: number;
}> = ({ gallery, currentGallery, expandedNodes, onToggle, onSelect, level }) => {
    const isExpanded = expandedNodes.has(gallery.id);
    const hasChildren = gallery.children && gallery.children.length > 0;
    const isActive = currentGallery?.id === gallery.id;
    const paddingLeft = level * 16;

    return (
        <div className="space-y-1">
            <div
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-[#f8b195] text-white' : 'hover:bg-gray-100 text-[#4a3728]'
                    }`}
                style={{ paddingLeft: `${paddingLeft + 8}px` }}
                onClick={() => {
                    if (hasChildren) {
                        onToggle(gallery.id);
                    }
                    onSelect(gallery);
                }}
            >
                {hasChildren && (
                    <span className="text-xs flex-shrink-0">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}

                <span className="font-medium flex-1 truncate">{gallery.title}</span>

                <span className="text-xs flex-shrink-0 opacity-60">({gallery.imageCount})</span>
            </div>

            {isExpanded && hasChildren && (
                <div className="border-l border-gray-200 ml-4">
                    {gallery.children!.map(child => (
                        <GalleryTreeNode
                            key={child.id}
                            gallery={child}
                            currentGallery={currentGallery}
                            expandedNodes={expandedNodes}
                            onToggle={onToggle}
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Gallery Card Component
const GalleryCard: React.FC<{ gallery: Gallery, onClick: (gallery: Gallery) => void }> = ({ gallery, onClick }) => (
    <div
        className="group relative cursor-pointer"
        onClick={() => onClick(gallery)}
    >
        <div className="absolute inset-0 bg-white rounded-[3.5rem] rotate-3 translate-y-2 translate-x-1 shadow-sm opacity-50 transition-transform group-hover:rotate-6"></div>
        <div className="absolute inset-0 bg-white rounded-[3.5rem] -rotate-2 translate-y-1 shadow-sm opacity-80 transition-transform group-hover:-rotate-4"></div>
        <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-lg border-4 border-white transition-all group-hover:-translate-y-4">
            <div className="aspect-[3/4] overflow-hidden">
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-1000">
                    <LazyImage
                        src={gallery.coverUrl}
                        alt={gallery.title}
                        className="w-full h-full"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
                <div className="flex items-center gap-2">
                    {gallery.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black uppercase tracking-widest">{t}</span>
                    ))}
                </div>
                <h2 className="text-3xl font-black tracking-tight">{gallery.title}</h2>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs font-bold opacity-80">{gallery.imageCount} 张瞬间</span>
                    <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" size={18} />
                </div>
            </div>
        </div>
    </div>
);

export default GalleryPage;