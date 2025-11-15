import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Country data with flags (emoji flags)
const countries = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
];

// Detect country from existing phone number
const detectCountryFromPhone = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check for country codes (longest first to avoid false matches)
  const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
  
  for (const country of sortedCountries) {
    if (cleaned.startsWith(country.dialCode)) {
      return country;
    }
  }
  
  return null;
};

export function PhoneInput({
  value = '',
  onChange,
  placeholder = 'Phone number',
  required = false,
  className = '',
  defaultCountry = 'ZW', // Default to Zimbabwe
  onBlur,
  name,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Try to detect country from value, otherwise use default
    const detected = value ? detectCountryFromPhone(value) : null;
    return detected || countries.find(c => c.code === defaultCountry) || countries[0];
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Extract phone number without country code from value
    if (!value) return '';
    const cleaned = value.replace(/[^\d+]/g, '');
    const country = detectCountryFromPhone(value);
    if (country && cleaned.startsWith(country.dialCode)) {
      return cleaned.slice(country.dialCode.length).trim();
    }
    return cleaned.replace(/^\+/, '').trim();
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update parent when phone number or country changes
  useEffect(() => {
    // Only trigger onChange if we have a valid phone number or if the value is being cleared
    const fullPhone = phoneNumber ? `${selectedCountry.dialCode} ${phoneNumber}` : '';
    if (onChange) {
      // Pass full phone with country code in the same format as regular input onChange
      const syntheticEvent = {
        target: {
          name: name || 'phone',
          id: id,
          value: fullPhone.trim(),
        },
        currentTarget: {
          name: name || 'phone',
          id: id,
          value: fullPhone.trim(),
        }
      };
      // Also store country info in the event for reference
      syntheticEvent.countryCode = selectedCountry.dialCode;
      syntheticEvent.country = selectedCountry.code;
      onChange(syntheticEvent);
    }
  }, [phoneNumber, selectedCountry, onChange, name, id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    // Focus back on input after selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handlePhoneChange = (e) => {
    // Only allow digits and spaces
    const value = e.target.value.replace(/[^\d\s]/g, '');
    setPhoneNumber(value);
  };

  const displayValue = phoneNumber;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {/* Country Code Selector */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-l-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50"
            style={{ minWidth: '100px' }}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="hidden sm:inline text-xs font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-white/10 bg-gradient-to-br from-midnight via-ocean/95 to-midnight shadow-2xl backdrop-blur-xl overflow-hidden"
                  style={{ maxHeight: '300px' }}
                >
                  {/* Search */}
                  <div className="sticky top-0 border-b border-white/10 bg-white/5 p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search country..."
                      className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Country List */}
                  <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                            selectedCountry.code === country.code
                              ? 'bg-brand-500/20 text-white'
                              : 'text-white/80'
                          }`}
                        >
                          <span className="text-xl">{country.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium">{country.name}</div>
                            <div className="text-xs text-white/60">{country.dialCode}</div>
                          </div>
                          {selectedCountry.code === country.code && (
                            <Check className="h-4 w-4 text-brand-400" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-white/60">
                        No countries found
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="tel"
            name={name || 'phone'}
            id={id}
            value={displayValue}
            onChange={handlePhoneChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            className="w-full rounded-r-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}

