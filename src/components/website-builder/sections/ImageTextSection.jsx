export function ImageTextSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  const alignment = settings.alignment || 'left';
  const isLeft = alignment === 'left';

  return (
    <section
      className={`py-16 px-6 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
          !isLeft ? 'md:flex-row-reverse' : ''
        }`}>
          <div className={!isLeft ? 'md:order-2' : ''}>
            {settings.image ? (
              <img
                src={settings.image}
                alt=""
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Add Image</span>
              </div>
            )}
          </div>
          <div className={!isLeft ? 'md:order-1' : ''}>
            <p className="text-lg text-gray-700 mb-6">{settings.text || 'Add your text here'}</p>
            {settings.buttonText && (
              <a
                href={settings.buttonLink || '#'}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {settings.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

