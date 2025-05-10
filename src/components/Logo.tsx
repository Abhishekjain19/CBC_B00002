
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo = ({ className, size = 'md', animated = true }: LogoProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div 
        className={cn(
          'relative', 
          sizeClasses[size], 
          animated && mounted && 'animate-float'
        )}
      >
        {/* 3D logo effect with layered elements */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="relative w-9 h-9">
            {/* Brain shape background */}
            <div className="absolute inset-0 bg-thinksparkPurple-300 rounded-full opacity-20 transform scale-110"></div>
            
            {/* Main brain shape */}
            <div className="absolute inset-0 bg-gradient-to-tr from-thinksparkPurple-500 to-thinksparkPurple-300 rounded-full shadow-lg"></div>
            
            {/* Lightning bolt cut-out */}
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="white" />
              </svg>
            </div>
            
            {/* Highlight effects */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
      
      <div className="font-bold text-lg tracking-tight">
        <span className="text-thinksparkPurple-400">Think</span>
        <span className="text-thinksparkPurple-300">Spark</span>
      </div>
    </div>
  );
};

export default Logo;
