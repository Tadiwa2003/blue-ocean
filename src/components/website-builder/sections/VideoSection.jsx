export function VideoSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  return (
    <section
      className={`py-16 px-6 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="max-w-4xl mx-auto">
        {settings.videoUrl ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={settings.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={settings.title || 'Video'}
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Add Video URL</span>
          </div>
        )}
        {settings.title && (
          <h3 className="text-xl font-semibold mt-4 text-center">{settings.title}</h3>
        )}
      </div>
    </section>
  );
}

