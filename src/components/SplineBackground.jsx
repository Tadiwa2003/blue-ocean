import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

export function SplineBackground({ 
  sceneUrl, 
  className = '', 
  interactive = false,
  opacity = 1 
}) {
  if (!sceneUrl) {
    return null;
  }

  const handleLoad = (spline) => {
    if (spline && spline.application) {
      const app = spline.application;
      // Configure Spline settings
      if (app && typeof app.setZoom === 'function') {
        app.setZoom(1);
      }
    }
  };

  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <Suspense fallback={
        <div className="h-full w-full bg-gradient-to-br from-midnight/60 via-ocean/50 to-midnight/70" />
      }>
        <Spline
          scene={sceneUrl}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: interactive ? 'auto' : 'none',
          }}
        />
      </Suspense>
    </div>
  );
}

