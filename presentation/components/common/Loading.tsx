import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text, className = '' }) => {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[#f8b195]`} />
      {text && <span className="text-xs font-black text-[#8eb69b]">{text}</span>}
    </div>
  );
};
