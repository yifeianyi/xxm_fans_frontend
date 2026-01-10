import React from 'react';

const Footer: React.FC = () => (
  <footer className="mt-auto py-16 px-4 border-t border-white/40 text-center space-y-4 bg-white/10 backdrop-blur-sm">
    <div className="flex items-center justify-center gap-8 text-sm font-black text-[#8eb69b]">
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-[#f8b195] transition-colors underline underline-offset-8 decoration-[#f8b195]/30">
        蜀ICP备00000000号-1
      </a>
      <span>© 2025 满满来信</span>
    </div>
    <p className="text-[10px] text-[#a5c9b1] max-w-xl mx-auto leading-relaxed font-bold tracking-widest uppercase">
      Spring breezes, green meadows, and Manman's voice.<br/>
      All rights reserved by original creators.
    </p>
  </footer>
);

export default Footer;
