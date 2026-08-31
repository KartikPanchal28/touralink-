import React from 'react';

const LOGO_SRC = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6SXIxAvipz7DQTiQJl1HF8_SrJZghM-sTRW2xo8hDSQ&s=10";

export default function Logo({ 
  size = 'md', // 'sm' | 'md' | 'lg'
  showText = true, 
  showTagline = true,
  showBadge = true,
  className = '' 
}) {
  const sizeMap = {
    sm: { 
      img: 'w-11 h-11', 
      title: 'text-xl', 
      subtitle: 'text-[11px]',
      badge: 'text-[9px] px-1.5 py-0.5'
    },
    md: { 
      img: 'w-16 h-16 sm:w-18 sm:h-18', 
      title: 'text-2xl sm:text-3xl font-black', 
      subtitle: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5'
    },
    lg: { 
      img: 'w-20 h-20 sm:w-24 sm:h-24', 
      title: 'text-3xl sm:text-4xl font-black', 
      subtitle: 'text-sm',
      badge: 'text-xs px-2.5 py-1'
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* High-Definition Logo without any ugly border box */}
      <img
        src={LOGO_SRC}
        alt="Touralink Logo"
        className={`object-contain shrink-0 drop-shadow-md transition-transform duration-200 hover:scale-105 ${currentSize.img}`}
      />

      {/* Brand Text & Region Badge */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`font-display tracking-tight text-slate-950 flex items-center gap-1.5 ${currentSize.title}`}>
              Touralink
              <span className="w-2 h-2 rounded-full bg-adventure-500 shadow-sm shadow-adventure-500/50" />
            </span>

            {showBadge && (
              <span className={`uppercase font-extrabold tracking-wider rounded-md bg-white/70 backdrop-blur-md text-brand-800 border border-brand-200/80 shadow-xs ${currentSize.badge}`}>
                India Beta
              </span>
            )}
          </div>

          {showTagline && (
            <p className={`text-slate-600 font-semibold tracking-wide mt-0.5 ${currentSize.subtitle}`}>
              Direct Driver & Cab Rentals
            </p>
          )}
        </div>
      )}
    </div>
  );
}
