export function ProductGridSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  const columns = settings.columns || 4;
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-4';

  return (
    <section
      className={`py-16 px-6 bg-gray-50 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="max-w-7xl mx-auto">
        {settings.title && (
          <h2 className="text-3xl font-bold text-center mb-12">{settings.title}</h2>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: settings.limit || 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
              <h3 className="font-semibold mb-2">Product {i + 1}</h3>
              <p className="text-gray-600">$29.99</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

