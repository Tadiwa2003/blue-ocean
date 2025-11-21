export function TextSection({ settings, isSelected, onSelect, onUpdate, onDelete }) {
  const alignment = settings.alignment || 'center';
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment] || 'text-center';

  return (
    <section
      className={`py-16 px-6 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className={`max-w-4xl mx-auto ${alignClass}`}>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: settings.content || 'Add your text content here' }}
        />
      </div>
    </section>
  );
}

