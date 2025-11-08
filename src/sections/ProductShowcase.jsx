import { highlightProducts, categories } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { SectionTitle } from '../components/SectionTitle.jsx';

export function ProductShowcase() {
  return (
    <section id="collections" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow="Featured Capsule"
          title="Oceanic signatures curated for scent bars, spas, and gallery retail."
          description="Blend these pieces across lobby merchandising, suite amenities, or seasonal activations. Each item ships with tactile swatch kits, ingredient cards, and media-ready imagery."
        />
        <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.3em] text-white/40">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-white/10 px-3 py-1">
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {highlightProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
