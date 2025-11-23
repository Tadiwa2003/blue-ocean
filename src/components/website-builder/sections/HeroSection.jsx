import { useState } from 'react';
import { Edit2, X } from 'lucide-react';

export function HeroSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section
      className={`relative min-h-[500px] flex items-center justify-center ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        backgroundImage: settings.backgroundImage
          ? `url(${settings.backgroundImage})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h1 className="text-5xl font-bold mb-4">{settings.title || 'Welcome'}</h1>
        <p className="text-xl mb-8">{settings.subtitle || 'Add your subtitle'}</p>
        {settings.buttonText && (
          <a
            href={settings.buttonLink || '#'}
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {settings.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

