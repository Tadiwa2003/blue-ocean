import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '../hooks/useProducts.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { SectionTitle } from '../components/SectionTitle.jsx';

gsap.registerPlugin(ScrollTrigger);

export function ProductShowcase() {
  const { products: allProducts, loading } = useProducts();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoriesRef = useRef(null);
  const gridRef = useRef(null);
  
  // Get featured products (limit to 6 for showcase)
  const highlightProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return allProducts.filter((p) => p.category !== 'Beauty Spa Services').slice(0, 6);
  }, [allProducts]);
  
  // Extract categories from products
  const categories = useMemo(() => {
    const cats = new Set();
    highlightProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All Capsules', ...Array.from(cats)];
  }, [highlightProducts]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Animate categories
    if (categoriesRef.current) {
      const categoryItems = categoriesRef.current.querySelectorAll('span');
      gsap.fromTo(
        categoryItems,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Animate product cards with stagger
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('article, [data-product-card]');
      
      gsap.set(cards, {
        opacity: 0,
        y: 60,
        scale: 0.9,
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.6,
          from: 'start',
        },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [highlightProducts]);

  return (
    <section ref={sectionRef} id="retail" data-section="collections" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div ref={titleRef}>
          <SectionTitle
            eyebrow="Featured Capsule"
            title="Oceanic signatures curated for scent bars, spas, and gallery retail."
            description="Blend these pieces across lobby merchandising, suite amenities, or seasonal activations. Each item ships with tactile swatch kits, ingredient cards, and media-ready imagery."
          />
        </div>
        <div ref={categoriesRef} className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.3em] text-white/40">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-white/10 px-3 py-1">
              {category}
            </span>
          ))}
        </div>
      </div>
      <div ref={gridRef} className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3" style={{ perspective: '1000px' }}>
        {loading ? (
          <div className="col-span-full text-center text-white/60 py-12">Loading products...</div>
        ) : highlightProducts.length === 0 ? (
          <div className="col-span-full text-center text-white/60 py-12">No products available</div>
        ) : (
          highlightProducts.map((product) => (
            <div key={product.id} data-product-card>
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
