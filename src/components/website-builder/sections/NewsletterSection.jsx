export function NewsletterSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  return (
    <section
      className={`py-16 px-6 bg-blue-600 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="max-w-2xl mx-auto text-center text-white">
        {settings.title && (
          <h2 className="text-3xl font-bold mb-4">{settings.title}</h2>
        )}
        {settings.subtitle && (
          <p className="text-lg mb-8">{settings.subtitle}</p>
        )}
        <div className="flex gap-4">
          <input
            type="email"
            placeholder={settings.placeholder || 'Enter your email'}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          />
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

