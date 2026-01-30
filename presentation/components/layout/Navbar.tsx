




import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const location = ReactRouterDOM.useLocation();
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);

    const isSongs = location.pathname.startsWith('/songs');
    const isFans = location.pathname.startsWith('/fansDIY');
    const isGallery = location.pathname.startsWith('/gallery');
    const isLive = location.pathname.startsWith('/live');
    const isData = location.pathname.startsWith('/data');
    const isAbout = location.pathname.startsWith('/about');

    // 监听路由变化，自动关闭菜单
    useEffect(() => {
        setIsLeftMenuOpen(false);
        setIsRightMenuOpen(false);
    }, [location.pathname]);

    // 导航项配置
    const leftNavItems = [
        { path: '/songs', label: '满の歌声', active: isSongs },
        { path: '/gallery', label: '满の图册', active: isGallery },
        { path: '/live', label: '直播日历', active: isLive },
    ];

    const rightNavItems = [
        { path: '/fansDIY', label: '精选二创', active: isFans },
        { path: '/data', label: '满の数据', active: isData },
        { path: '/about', label: '关于满满', active: isAbout },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/50 px-4 py-2.5">
            <div className="flex items-center justify-center gap-3 md:gap-6">
                {/* 左侧菜单按钮（仅移动端） */}
                <button
                    onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
                    className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors text-[#8eb69b]"
                    aria-label={isLeftMenuOpen ? '关闭左侧菜单' : '打开左侧菜单'}
                >
                    {isLeftMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* 左侧导航项 */}
                <div className={`flex gap-3 md:gap-6 transition-all duration-300 overflow-hidden ${isLeftMenuOpen ? 'md:flex' : 'hidden md:flex'}`}>
                    {leftNavItems.map((item) => (
                        <ReactRouterDOM.Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsLeftMenuOpen(false)}
                            className={`relative py-1 flex flex-col items-center transition-all ${
                                item.active ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'
                            }`}
                        >
                            <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">
                                {item.label}
                            </span>
                            {item.active && (
                                <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>
                            )}
                        </ReactRouterDOM.Link>
                    ))}
                </div>

                {/* 头像（始终显示） */}
                <ReactRouterDOM.Link
                    to="/"
                    className="flex items-center gap-2 shrink-0 px-2"
                    onClick={() => {
                        setIsLeftMenuOpen(false);
                        setIsRightMenuOpen(false);
                    }}
                    aria-label="返回首页"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-110">
                        <img src="/favicon-32x32.png" alt="咻咻满头像" className="w-full h-full object-cover" />
                    </div>
                </ReactRouterDOM.Link>

                {/* 右侧导航项 */}
                <div className={`flex gap-3 md:gap-6 transition-all duration-300 overflow-hidden ${isRightMenuOpen ? 'md:flex' : 'hidden md:flex'}`}>
                    {rightNavItems.map((item) => (
                        <ReactRouterDOM.Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsRightMenuOpen(false)}
                            className={`relative py-1 flex flex-col items-center transition-all ${
                                item.active ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'
                            }`}
                        >
                            <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">
                                {item.label}
                            </span>
                            {item.active && (
                                <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>
                            )}
                        </ReactRouterDOM.Link>
                    ))}
                </div>

                {/* 右侧菜单按钮（仅移动端） */}
                <button
                    onClick={() => setIsRightMenuOpen(!isRightMenuOpen)}
                    className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors text-[#8eb69b]"
                    aria-label={isRightMenuOpen ? '关闭右侧菜单' : '打开右侧菜单'}
                >
                    {isRightMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
