import React from 'react';
import { ArrowUp } from 'lucide-react';
import useScrollPosition from '../../../shared/hooks/useScrollPosition';

const BackToTop: React.FC = () => {
    const { y } = useScrollPosition();
    const visible = y > 300;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="回到顶部"
            className={`
                fixed bottom-6 right-6 z-50
                w-11 h-11 rounded-full
                flex items-center justify-center
                bg-meadow-green/90 hover:bg-meadow-green
                text-white shadow-lg
                hover:shadow-xl hover:scale-110
                active:scale-95
                transition-all duration-300 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
        >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
    );
};

export default BackToTop;
