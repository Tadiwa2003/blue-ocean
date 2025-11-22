import { useState } from 'react';

export function AnayaFindsLogo({ className = '', showText = true, size = 200 }) {
  // Use the image path - Vite handles public folder assets correctly, even with spaces
  // If encoding is needed, browsers will handle it automatically
  const logoSrc = '/assets/images/anaya-finds-logo.png';
  const [imageError, setImageError] = useState(false);

  // Logo aspect ratio: approximately 1:1 (square/circular logo based on golden circle)
  const LOGO_ASPECT_RATIO = 1;
  
  // Determine if this is for header (no text) to optimize layout
  const isHeaderLogo = !showText;
  
  // Extract height classes and remove w-auto to let aspect-ratio handle width
  // Use word-boundary pattern to match w-auto regardless of position
  const cleanClassName = (className || '')
    .replace(/\bw-auto\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // For header logos, return just the logo without extra wrapper
  if (isHeaderLogo) {
    return (
      <div 
        className={`relative inline-block overflow-hidden ${cleanClassName}`}
        style={{ 
          aspectRatio: `${LOGO_ASPECT_RATIO}`, 
          width: 'auto',
          maxWidth: '100%',
        }}
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="ANAYA FINDS Logo"
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
              display: 'block',
            }}
            onError={() => {
              console.warn('ANAYA FINDS logo image failed to load, falling back to SVG');
              setImageError(true);
            }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <AnayaFindsLogoSVG />
        )}
      </div>
    );
  }
  
  // For hero/feature logos with text, use full layout
  // Guard against null/undefined className
  const safeClassName = className || '';
  
  // Remove height and width classes from outer container, keep only layout classes
  // Use word-boundary aware regexes to match classes regardless of position
  const layoutClasses = safeClassName
    .replace(/\b(h-\d+|sm:h-\d+|md:h-\d+|lg:h-\d+|w-auto|mx-auto)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return (
    <div className={`flex flex-col items-center justify-center ${layoutClasses || ''}`}>
      {/* Logo - Use image if available, otherwise SVG */}
      <div 
        className={`relative inline-block overflow-hidden ${(safeClassName || '').split(' ').filter(c => {
          if (!c || !c.trim()) return false;
          // Match height utilities with optional responsive prefixes and numeric or bracketed values
          return /^(?:(?:sm|md|lg):)?h-(?:\d+|auto|px|rem|em|\[.*\])$/.test(c.trim());
        }).join(' ')}`}
        style={{ 
          aspectRatio: `${LOGO_ASPECT_RATIO}`, 
          width: 'auto', 
          maxWidth: '100%',
        }}
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="ANAYA FINDS Logo"
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.5)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4)) drop-shadow(0 4px 12px rgba(251, 191, 36, 0.4)) drop-shadow(0 2px 6px rgba(251, 191, 36, 0.3))',
              display: 'block',
            }}
            onError={() => {
              console.warn('ANAYA FINDS logo image failed to load, falling back to SVG');
              setImageError(true);
            }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <AnayaFindsLogoSVG />
        )}
      </div>

      {/* Text below logo - only show if showText is true */}
      {showText && (
        <div className="mt-6 sm:mt-8 md:mt-10 text-center space-y-2">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-luxury font-bold"
            style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 25%, #f472b6 50%, #ec4899 75%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em',
              filter: 'drop-shadow(0 2px 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 -2px 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 4px 8px rgba(59, 130, 246, 0.6))',
              lineHeight: '1.1',
            }}
          >
            ANAYA FINDS
          </h2>
          <p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-elegant text-white/90"
            style={{
              letterSpacing: '0.08em',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
            }}
          >
            CURATED FASHION DISCOVERIES
          </p>
        </div>
      )}
    </div>
  );
}

// Fallback SVG Logo Component
function AnayaFindsLogoSVG() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      style={{ 
        filter: 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.5)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4))',
        display: 'block',
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Golden circle gradient */}
        <linearGradient id="goldCircle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="1" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="1" />
        </linearGradient>
        {/* Blue gradient */}
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="1" />
        </linearGradient>
        {/* Green gradient */}
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </linearGradient>
        {/* Pink gradient */}
        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
        </linearGradient>
        {/* Magenta gradient */}
        <linearGradient id="magentaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Golden circle frame */}
      <circle
        cx="200"
        cy="200"
        r="190"
        fill="none"
        stroke="url(#goldCircle)"
        strokeWidth="4"
        strokeDasharray="2 2"
      />
      <circle
        cx="200"
        cy="200"
        r="185"
        fill="none"
        stroke="url(#goldCircle)"
        strokeWidth="2"
      />

      {/* ANAYA text - Blue */}
      <text
        x="200"
        y="120"
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fill="url(#blueGradient)"
        fontFamily="Arial, sans-serif"
      >
        ANAYA
      </text>

      {/* FINDS text with gradient colors */}
      <text
        x="200"
        y="160"
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        <tspan fill="url(#greenGradient)">F</tspan>
        <tspan fill="url(#greenGradient)" opacity="0.8">I</tspan>
        <tspan fill="url(#pinkGradient)">N</tspan>
        <tspan fill="url(#pinkGradient)" opacity="0.9">D</tspan>
        <tspan fill="url(#magentaGradient)">S</tspan>
      </text>

      {/* Stylized dress */}
      <g transform="translate(200, 240)">
        {/* Dress bodice - Pink */}
        <path
          d="M -20,-30 L 20,-30 L 25,-10 L 20,10 L -20,10 L -25,-10 Z"
          fill="url(#pinkGradient)"
        />
        {/* Dress skirt - Blue and Teal */}
        <path
          d="M -20,10 Q -40,30 -50,50 Q -60,70 -45,80 Q -30,70 -20,50 L -20,10"
          fill="url(#blueGradient)"
        />
        <path
          d="M -20,10 Q -30,25 -35,40 Q -40,55 -30,60 Q -20,50 -20,30 L -20,10"
          fill="#14b8a6"
        />
        {/* Dress skirt - Green */}
        <path
          d="M 20,10 Q 40,30 50,50 Q 60,70 45,80 Q 30,70 20,50 L 20,10"
          fill="url(#greenGradient)"
        />
      </g>

      {/* Abstract book/frame shape */}
      <g transform="translate(250, 240)">
        {/* Front L-shape - Green */}
        <path
          d="M 0,0 L 30,0 L 30,40 L 0,40 Z M 0,0 L 0,-20 L 20,-20 L 20,0 Z"
          fill="url(#greenGradient)"
        />
        {/* Back L-shape - Blue */}
        <path
          d="M 5,-5 L 35,-5 L 35,35 L 5,35 Z M 5,-5 L 5,-25 L 25,-25 L 25,-5 Z"
          fill="url(#blueGradient)"
          opacity="0.7"
        />
      </g>

      {/* Tagline */}
      <text
        x="200"
        y="320"
        textAnchor="middle"
        fontSize="14"
        fill="#4b5563"
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        CURATED FASHION DISCOVERIES
      </text>
    </svg>
  );
}
