




import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = ReactRouterDOM.useLocation();
    const isSongs = location.pathname.startsWith('/songs');
    const isGallery = location.pathname.startsWith('/gallery');
    const isLive = location.pathname.startsWith('/live');
    const isData = location.pathname.startsWith('/data');
    const isFans = location.pathname.startsWith('/fansDIY');
    const isAbout = location.pathname.startsWith('/about');

    return (
        <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/50 px-4 py-2.5 flex items-center justify-center gap-4 md:gap-8">
            <ReactRouterDOM.Link to="/songs" className={`relative py-1 flex flex-col items-center transition-all ${isSongs ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">满の歌声</span>
                {isSongs && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>}
            </ReactRouterDOM.Link>

            <ReactRouterDOM.Link to="/gallery" className={`relative py-1 flex flex-col items-center transition-all ${isGallery ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">满满图集</span>
                {isGallery && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>}
            </ReactRouterDOM.Link>

            <ReactRouterDOM.Link to="/live" className={`relative py-1 flex flex-col items-center transition-all ${isLive ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">满国日历</span>
                {isLive && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>}
            </ReactRouterDOM.Link>

            <div className="flex items-center gap-2 shrink-0 px-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-110">
                    <img src="/咻咻满.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
            </div>

            <ReactRouterDOM.Link to="/data" className={`relative py-1 flex flex-col items-center transition-all ${isData ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">数据洞察</span>
                {isData && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>}
            </ReactRouterDOM.Link>

            <ReactRouterDOM.Link to="/fansDIY" className={`relative py-1 flex flex-col items-center transition-all ${isFans ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">精选二创</span>
                {isFans && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>}
            </ReactRouterDOM.Link>

            <ReactRouterDOM.Link to="/about" className={`relative py-1 flex flex-col items-center transition-all ${isAbout ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-sm font-black whitespace-nowrap px-2">关于满满</span>
                {isAbout && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-sm"></div>}
            </ReactRouterDOM.Link>
        </nav>
    );
};

export default Navbar;
