export function TestimonialCard({ testimonial }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-ocean/60 p-6 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <img
          src={testimonial.avatar}
          alt={`${testimonial.name} avatar`}
          className="h-12 w-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{testimonial.role}</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-white/70">“{testimonial.quote}”</p>
    </div>
  );
}
