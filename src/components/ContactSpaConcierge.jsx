import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from './Button.jsx';

const SPA_EMAIL = 'Tanasbeautyboost@gmail.com';
const SPA_PHONE = '+263710465531'; // WhatsApp format (no spaces)
const SPA_INSTAGRAM = 'tana_beauty_boost'; // Instagram username (without @)
const SPA_INSTAGRAM_URL = 'https://www.instagram.com/tana_beauty_boost?igsh=MTRhemhpNXNhb2ptMA%3D%3D&utm_source=qr'; // Full Instagram URL

export function ContactSpaConcierge({ variant = 'buttons' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEmail = () => {
    const subject = encodeURIComponent('Spa Booking Inquiry');
    const body = encodeURIComponent('Hello, I would like to inquire about booking a spa treatment package.');
    window.location.href = `mailto:${SPA_EMAIL}?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello, I would like to inquire about booking a spa treatment package.');
    const whatsappUrl = `https://wa.me/${SPA_PHONE.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleInstagram = () => {
    window.open(SPA_INSTAGRAM_URL, '_blank');
    setIsOpen(false);
  };

  if (variant === 'dropdown') {
    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2"
        >
          Contact Spa Concierge
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-gradient-to-br from-midnight via-ocean/95 to-midnight shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10 border-b border-white/10"
              >
                <MessageCircle className="h-5 w-5 text-green-400" />
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-xs text-white/60">Quick response</div>
                </div>
              </button>
              <button
                onClick={handleEmail}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10 border-b border-white/10"
              >
                <Mail className="h-5 w-5 text-brand-400" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-xs text-white/60">Detailed inquiry</div>
                </div>
              </button>
              <button
                onClick={handleInstagram}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10"
              >
                <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold">Instagram</div>
                  <div className="text-xs text-white/60">View our page</div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default: Three buttons side by side
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        onClick={handleWhatsApp}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
      <Button
        onClick={handleEmail}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Email
      </Button>
      <Button
        onClick={handleInstagram}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
        Instagram
      </Button>
    </div>
  );
}
