import { testimonials } from '../data/testimonials.js';
import { SectionTitle } from '../components/SectionTitle.jsx';
import { TestimonialCard } from '../components/TestimonialCard.jsx';

export function Testimonials() {
  return (
    <section id="journal" className="mx-auto mt-24 max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-[0.6fr,1fr] lg:items-center">
        <SectionTitle
          eyebrow="Loved by coastal visionaries"
          title="Boutiques, resorts, and experience studios choose Blue Ocean for its transportive details."
          description="From scent to storytelling, every touchpoint is designed to immerse your guests in velvet twilight and sea breeze memory."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
