export function TestimonialsSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  return (
    <section
      className={`py-16 px-6 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="max-w-7xl mx-auto">
        {settings.title && (
          <h2 className="text-3xl font-bold text-center mb-12">{settings.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Customer {i}</h4>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
              <p className="text-gray-700">"Great product! Highly recommend."</p>
              <div className="mt-4 text-yellow-400">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

