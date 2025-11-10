import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';
import { Mail, Phone, Building, User, MessageSquare, X, PhoneCall } from 'lucide-react';

const CONTACT_PHONE = '+263 71 046 5531';

export function ContactModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // GSAP animations
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const form = formRef.current;

    // Entrance animation
    gsap.fromTo(
      container,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
      }
    );

    // Form fields animation
    if (form) {
      const fields = form.querySelectorAll('input, textarea');
      gsap.fromTo(
        fields,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.05,
          delay: 0.2,
        }
      );
    }

    return () => {
      gsap.killTweensOf([container, form]);
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number.');
      return false;
    }
    return true;
  };

  const formatWhatsAppMessage = () => {
    return `Hello Blue Ocean Team,

I'm interested in partnering with Blue Ocean Capsule. Here are my details:

👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
${formData.company ? `🏢 Company: ${formData.company}` : ''}

💬 Message:
${formData.message || 'I would like to learn more about your products and partnership opportunities.'}

Looking forward to hearing from you!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create WhatsApp link with formatted message
    const message = formatWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    // Remove spaces but keep + sign for WhatsApp
    const phoneNumber = CONTACT_PHONE.replace(/\s/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);

    if (onSuccess) {
      onSuccess({
        ...formData,
        contactMethod: 'WhatsApp',
        phone: CONTACT_PHONE,
      });
    }

    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .contact-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-midnight/98 backdrop-blur-lg contact-backdrop"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <Logo className="scale-75" />
            <div>
              <h2 className="font-display text-2xl text-white">Contact Blue Ocean</h2>
              <p className="text-sm text-white/60 mt-1">
                We'll connect you with our partnership team
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                <User className="inline h-4 w-4 mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                <Phone className="inline h-4 w-4 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                placeholder="+263 77 123 4567"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                <Building className="inline h-4 w-4 mr-2" />
                Company / Organization (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                placeholder="Your Company Name"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                <MessageSquare className="inline h-4 w-4 mr-2" />
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300 resize-none"
                placeholder="Tell us about your partnership interests, questions, or how we can help..."
              />
            </div>

            {/* Contact Info */}
            <div className="rounded-xl border border-brand-400/30 bg-brand-500/10 p-4 space-y-3">
              <p className="text-sm text-white/80">
                <strong className="text-brand-200">Contact Options:</strong>
              </p>
              
              {/* Call Button */}
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-brand-400/50 bg-brand-500/20 px-4 py-3 text-white hover:bg-brand-500/30 hover:border-brand-400 transition-all duration-300 group"
              >
                <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Call Now: {CONTACT_PHONE}</span>
              </a>

              {/* WhatsApp Info */}
              <div className="pt-2 border-t border-brand-400/20">
                <p className="text-sm text-white/70 mb-1">
                  📱 WhatsApp: <a href={`https://wa.me/${CONTACT_PHONE.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-200 hover:text-brand-100 underline">{CONTACT_PHONE}</a>
                </p>
                <p className="text-xs text-white/60 mt-2">
                  Or fill out the form above to send a message via WhatsApp.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Send via WhatsApp
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

