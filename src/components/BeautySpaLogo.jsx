import { useState } from 'react';

export function BeautySpaLogo({ className = '', showText = true, size = 200 }) {
  // Try to load the logo image, fallback to SVG if not found
  const logoSrc = '/assets/images/Tana beauty boost.png';
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Circular Logo - Use image if available, otherwise SVG */}
      <div
        className="relative"
        style={{
          width: `${size * 1.3}px`,
          height: `${size}px`,
        }}
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="Tana's Beauty Boost Logo"
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
              borderRadius: '50% / 45%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              padding: '6px',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <svg
            width={size * 1.3}
            height={size}
            viewBox="0 0 260 200"
            className="drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))' }}
          >
          <defs>
            {/* Purple gradient */}
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6B46C1" stopOpacity="1" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="1" />
            </linearGradient>
            {/* Gold gradient */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="1" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="1" />
            </linearGradient>
            {/* Gold gradient for text */}
            <linearGradient id="goldTextGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="1" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="1" />
            </linearGradient>
            {/* Shadow filter for 3D effect */}
            <filter id="emboss">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer golden border circle */}
          <ellipse
            cx="130"
            cy="100"
            rx="120"
            ry="95"
            fill="url(#goldGradient)"
            stroke="#B45309"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(217, 119, 6, 0.4))' }}
          />

          {/* Inner purple gradient ellipse */}
          <ellipse cx="130" cy="100" rx="105" ry="85" fill="url(#purpleGradient)" />

          {/* Woman's profile silhouette */}
          <g transform="translate(130, 100)">
            {/* Face profile */}
            <path
              d="M -25,-15 Q -20,-25 -15,-20 Q -10,-15 -5,-10 Q 0,-5 5,-8 Q 10,-10 15,-8 Q 20,-5 25,-3 L 25,15 Q 20,20 15,18 Q 10,15 5,12 Q 0,10 -5,12 Q -10,15 -15,18 Q -20,20 -25,15 Z"
              fill="#F3E8FF"
              stroke="#E9D5FF"
              strokeWidth="0.5"
            />

            {/* Hair with golden outlines and leaves */}
            <g>
              {/* Hair strands */}
              <path
                d="M -30,-20 Q -35,-30 -30,-40 Q -25,-50 -20,-55 Q -15,-60 -10,-58 Q -5,-55 0,-52 Q 5,-50 10,-52 Q 15,-55 20,-58 Q 25,-60 30,-55 Q 35,-50 40,-45 Q 35,-40 30,-35 Q 25,-30 20,-25 Q 15,-20 10,-18 Q 5,-15 0,-18 Q -5,-20 -10,-22 Q -15,-25 -20,-28 Q -25,-30 -30,-25 Z"
                fill="#E9D5FF"
                fillOpacity="0.6"
                stroke="url(#goldGradient)"
                strokeWidth="1.5"
              />
              
              {/* Additional hair details */}
              <path
                d="M -25,-25 Q -30,-35 -25,-45 Q -20,-50 -15,-48 Q -10,-45 -5,-42 Q 0,-40 5,-42 Q 10,-45 15,-48 Q 20,-50 25,-45 Q 30,-40 25,-30 Z"
                fill="#E9D5FF"
                fillOpacity="0.4"
                stroke="url(#goldGradient)"
                strokeWidth="1"
              />

              {/* Leaves integrated in hair */}
              <g transform="translate(-15, -35)">
                <path
                  d="M 0,0 Q -5,-8 -3,-15 Q -1,-20 2,-18 Q 5,-15 3,-10 Q 1,-5 0,0 Z"
                  fill="url(#goldGradient)"
                  stroke="#B45309"
                  strokeWidth="0.5"
                />
                <path
                  d="M 5,-5 Q 0,-12 2,-18 Q 4,-22 7,-20 Q 10,-17 8,-12 Q 6,-7 5,-5 Z"
                  fill="url(#goldGradient)"
                  stroke="#B45309"
                  strokeWidth="0.5"
                />
              </g>
              <g transform="translate(10, -40)">
                <path
                  d="M 0,0 Q -3,-6 -2,-12 Q -1,-16 1,-14 Q 3,-12 2,-8 Q 1,-4 0,0 Z"
                  fill="url(#goldGradient)"
                  stroke="#B45309"
                  strokeWidth="0.5"
                />
              </g>
            </g>

            {/* Branch with leaves and flower */}
            <g transform="translate(15, 5)">
              {/* Branch stem */}
              <line
                x1="0"
                y1="0"
                x2="5"
                y2="15"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              
              {/* Leaves on branch */}
              <path
                d="M 3,8 Q 8,5 10,10 Q 12,15 8,18 Q 4,15 3,8 Z"
                fill="url(#goldGradient)"
                stroke="#B45309"
                strokeWidth="0.5"
              />
              <path
                d="M 5,12 Q 10,9 12,14 Q 14,19 10,22 Q 6,19 5,12 Z"
                fill="url(#goldGradient)"
                stroke="#B45309"
                strokeWidth="0.5"
              />
              
              {/* Flower at base */}
              <g transform="translate(0, 0)">
                {/* Flower center (purple bud) */}
                <circle cx="0" cy="0" r="3" fill="#8B5CF6" />
                {/* Flower petals (teal) */}
                <path
                  d="M 0,0 Q -4,-4 -6,-2 Q -8,0 -6,2 Q -4,4 0,0 Z"
                  fill="#5EEAD4"
                  stroke="#14B8A6"
                  strokeWidth="0.5"
                />
                <path
                  d="M 0,0 Q 4,-4 6,-2 Q 8,0 6,2 Q 4,4 0,0 Z"
                  fill="#5EEAD4"
                  stroke="#14B8A6"
                  strokeWidth="0.5"
                />
                <path
                  d="M 0,0 Q -4,4 -6,2 Q -8,0 -6,-2 Q -4,-4 0,0 Z"
                  fill="#5EEAD4"
                  stroke="#14B8A6"
                  strokeWidth="0.5"
                />
                <path
                  d="M 0,0 Q 4,4 6,2 Q 8,0 6,-2 Q 4,-4 0,0 Z"
                  fill="#5EEAD4"
                  stroke="#14B8A6"
                  strokeWidth="0.5"
                />
                <path
                  d="M 0,0 Q 0,-6 -2,-6 Q -4,-6 -2,-4 Q 0,-2 0,0 Z"
                  fill="#5EEAD4"
                  stroke="#14B8A6"
                  strokeWidth="0.5"
                />
              </g>
            </g>
          </g>
        </svg>
        )}
      </div>

      {/* Text below logo */}
      {showText && (
        <div className="mt-4 sm:mt-6 text-center">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold"
            style={{
              background: 'linear-gradient(180deg, #FCD34D 0%, #D97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 4px rgba(217, 119, 6, 0.3)',
              letterSpacing: '0.05em',
              filter: 'drop-shadow(0 2px 4px rgba(217, 119, 6, 0.2))',
            }}
          >
            Tana's Beauty Boost Spa
          </h1>
        </div>
      )}
    </div>
  );
}

