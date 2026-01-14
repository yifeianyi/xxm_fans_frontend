
import React from 'react';
// Use star import to resolve "no exported member" errors for Link and useLocation
import * as ReactRouterDOM from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = ReactRouterDOM.useLocation();
    const isSongs = location.pathname.startsWith('/songs');
    const isFans = location.pathname.startsWith('/fansDIY');

    return (
        <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/50 px-4 py-2.5 flex items-center justify-center gap-8 md:gap-16">
            <ReactRouterDOM.Link to="/songs" className={`relative py-1 w-20 flex flex-col items-center transition-all ${isSongs ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-base font-black">满の歌声</span>
                {isSongs && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-[0_2px_8px_rgba(248,177,149,0.4)]"></div>}
            </ReactRouterDOM.Link>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-[1.5rem] overflow-hidden border-2 md:border-4 border-white shadow-sm transition-transform hover:scale-110">
                    <img src="/咻咻满.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-base md:text-xl font-black text-[#4a3728] tracking-tighter leading-none">小满虫之家</h1>
                    <span className="text-[8px] text-[#8eb69b] uppercase tracking-widest font-black">Forest & Letters</span>
                </div>
            </div>
            <ReactRouterDOM.Link to="/fansDIY" className={`relative py-1 w-20 flex flex-col items-center transition-all ${isFans ? 'text-[#f8b195] scale-105' : 'text-[#8eb69b]'}`}>
                <span className="text-xs md:text-base font-black">精选二创</span>
                {isFans && <div className="absolute -bottom-1.5 h-1 w-6 bg-[#f8b195] rounded-full shadow-[0_2px_8px_rgba(248,177,149,0.4)]"></div>}
            </ReactRouterDOM.Link>
        </nav>
    );
};

export default Navbar;
