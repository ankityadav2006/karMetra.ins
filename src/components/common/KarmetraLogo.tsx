import React from 'react';

interface KarmetraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const KarmetraLogo: React.FC<KarmetraLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = true,
  className = '',
  onClick,
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-xl',
    xl: 'w-14 h-14 text-2xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-0.5',
    xl: 'text-xs px-2 py-1',
  };

  const isDark = variant === 'dark';
  const isWhite = variant === 'white';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Official Karmetra Vector Icon */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 text-teal-950 font-black flex items-center justify-center shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform shrink-0 border border-teal-300/30 overflow-hidden`}
      >
        {/* Geometric Accent Line */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-200/30 rounded-full blur-xs pointer-events-none" />
        <svg
          viewBox="0 0 32 32"
          className="w-5/6 h-5/6 fill-current text-white drop-shadow-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized K Mark */}
          <path
            d="M8 5h4v22H8z M12 16l8-11h5l-9 11 9.5 11h-5.2L12 17.5z"
            fill="currentColor"
          />
          <circle cx="23" cy="7" r="2.5" className="text-cyan-300 fill-current" />
        </svg>
      </div>

      {/* Typography & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`${textSizes[size]} font-black tracking-tight ${
              isWhite || isDark ? 'text-white' : 'text-slate-900'
            } transition-colors`}
          >
            Kar<span className="text-teal-500">Metra</span>
          </span>
          <span
            className={`${badgeSizes[size]} font-extrabold rounded tracking-wider uppercase ${
              isWhite || isDark
                ? 'bg-teal-900/80 text-teal-300 border border-teal-700/60'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
          >
            IN
          </span>
        </div>

        {showTagline && (
          <span
            className={`text-[10px] font-semibold tracking-wide ${
              isWhite || isDark ? 'text-teal-300/80' : 'text-teal-700/80'
            } hidden sm:inline-block mt-0.5`}
          >
            Empowering Careers • Verified Hiring
          </span>
        )}
      </div>
    </div>
  );
};
