import { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useServices } from '../hooks/useServices.js';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal.jsx';
import { BookingDrawer } from '../components/BookingDrawer.jsx';
import { CartNotification } from '../components/CartNotification.jsx';
import { Button } from '../components/Button.jsx';
import { BeautySpaLogo } from '../components/BeautySpaLogo.jsx';
import { PackagesPage } from '../components/PackagesPage.jsx';
import { ContactSpaConcierge } from '../components/ContactSpaConcierge.jsx';
import { ContainerScrollAnimation } from '../components/ui/ScrollTriggerAnimations.jsx';
import { SplineBackground } from '../components/SplineBackground.jsx';
import DataGridHero from '../components/ui/DataGridHero.jsx';
import { motion } from 'framer-motion';
import ImageTrail from '../components/ui/ImageTrail.jsx';
import api from '../services/api.js';
import { convertDateLabelToISO, isPastDateTime, getRelativeDateLabel } from '../utils/dateHelpers.js';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_GRADIENT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGIyMzNlO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZGEwZTY7c3RvcC1vcGFjaXR5OjAuNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA0MGIxODtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function BeautySpaStorefront({ onClose, customStorefront = null }) {
  // Extract custom storefront branding and design
  const storefrontName = customStorefront?.design?.branding?.storeName || customStorefront?.name || "Tana's Beauty Boost Spa";
  const storefrontTagline = customStorefront?.design?.branding?.tagline || '';
  const heroTitle = customStorefront?.design?.hero?.title || '';
  const heroSubtitle = customStorefront?.design?.hero?.subtitle || '';
  const primaryColor = customStorefront?.design?.colors?.primary || '#9333EA';
  const secondaryColor = customStorefront?.design?.colors?.secondary || '#0b233e';
  const heroBackgroundColor = customStorefront?.design?.hero?.backgroundColor || secondaryColor;
  const heroBackgroundImage = customStorefront?.design?.hero?.backgroundImage || null;

  // Fetch services from backend
  const { services: allServices, loading: servicesLoading, error: servicesError } = useServices();

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);
  const [bookingIntent, setBookingIntent] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const [isConfirming, setIsConfirming] = useState(false);

  // LocalStorage key for persisting bookings
  const BOOKINGS_STORAGE_KEY = 'beautySpaBookings';

  // Restore bookings from localStorage on component mount
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);
        // Validate that parsed data is an array
        if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
          setBookings(parsedBookings);
          console.log('📦 Restored bookings from localStorage:', parsedBookings.length);
        }
      }
    } catch (error) {
      // Handle parse errors or quota exceeded errors silently
      console.warn('Failed to restore bookings from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem(BOOKINGS_STORAGE_KEY);
      } catch (clearError) {
        // Ignore errors when clearing
      }
    }
  }, []);

  // Debug: Log bookings state changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('📊 Bookings state updated:', {
        count: bookings.length,
        bookings: bookings,
      });
    }
  }, [bookings]);

  // Save bookings to localStorage
  const saveBookingsToLocalStorage = (bookingsToSave) => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookingsToSave));
    } catch (error) {
      // Handle quota exceeded or other storage errors
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded, unable to save bookings');
      } else {
        console.warn('Failed to save bookings to localStorage:', error);
      }
    }
  };

  const serviceCategories = useMemo(() => {
    const uniqueCategories = new Set((allServices || []).map((service) => service.serviceCategory));
    return ['All', ...uniqueCategories];
  }, [allServices]);

  const filteredServices = useMemo(() => {
    if (!allServices || allServices.length === 0) return [];
    if (activeCategory === 'All') {
      return allServices;
    }
    return allServices.filter((service) => service.serviceCategory === activeCategory);
  }, [activeCategory, allServices]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleShowService = (service, intent = 'view') => {
    if (!service) {
      console.error('❌ Cannot show service: Service is missing');
      return;
    }

    setSelectedService(service);
    setBookingIntent(intent);
    setIsModalOpen(true);

    if (intent === 'book') {
      console.log('📅 Opening booking modal for:', service.name);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setBookingIntent('view');
  };

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 3200);
  };

  // Quick book handler - directly adds service to bookings without opening modal
  const handleQuickBook = (service) => {
    console.log('⚡ handleQuickBook called', {
      service: service?.name,
      hasService: !!service,
      bookableDates: service?.bookableDates,
      timeSlots: service?.timeSlots,
    });

    // Validate service
    if (!service) {
      console.error('❌ Cannot book: Service is missing');
      showNotification('Error: Service information is missing. Please try again.');
      return;
    }

    // Auto-select first available date and time, or use placeholders
    // ALWAYS default to tomorrow to avoid any past date issues
    let defaultDate = '';
    let defaultTime = service.timeSlots?.[0] || '10:00 AM';
    let dateLabel = '';

    // Try to get a valid future date from bookableDates
    if (service.bookableDates && service.bookableDates.length > 0) {
      for (const dateOption of service.bookableDates) {
        const isoDate = convertDateLabelToISO(dateOption.value);
        if (isoDate) {
          // Check if this date/time combination is in the future
          if (!isPastDateTime(isoDate, defaultTime)) {
            defaultDate = isoDate;
            dateLabel = dateOption.label;
            break;
          }
        }
      }
    }

    // If no valid future date found, or no dates available, use tomorrow
    if (!defaultDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      defaultDate = tomorrow.toISOString().split('T')[0];
      dateLabel = getRelativeDateLabel(defaultDate);
    }

    // Final check: ensure the date/time is not in the past
    if (defaultDate && defaultTime && isPastDateTime(defaultDate, defaultTime)) {
      // If somehow still in the past, use tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      defaultDate = tomorrow.toISOString().split('T')[0];
      dateLabel = getRelativeDateLabel(defaultDate);
    }

    // Ensure we always have a valid time
    if (!defaultTime) {
      defaultTime = '10:00 AM';
    }

    // Ensure dateLabel is always set to a readable format
    if (!dateLabel) {
      dateLabel = getRelativeDateLabel(defaultDate);
    }

    // Final validation: ensure date is valid ISO format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(defaultDate)) {
      // Last resort: use tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      defaultDate = tomorrow.toISOString().split('T')[0];
      dateLabel = getRelativeDateLabel(defaultDate);
    }

    // Log for debugging
    console.log('📅 Quick book date selection:', {
      defaultDate,
      defaultTime,
      dateLabel,
      isPast: isPastDateTime(defaultDate, defaultTime),
    });

    // Generate unique booking ID using crypto.randomUUID() when available
    let bookingId;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      bookingId = crypto.randomUUID();
    } else {
      // Fallback: use incrementing counter with service ID and timestamp for uniqueness
      const counter = (window.__bookingCounter = (window.__bookingCounter || 0) + 1);
      bookingId = `${service.id || service._id || 'service'}-${Date.now()}-${counter}`;
    }

    // Create booking entry with default values
    const bookingEntry = {
      bookingId,
      serviceId: service.id || service._id,
      name: service.name || 'Spa Service',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      serviceCategory: service.serviceCategory || 'General',
      duration: service.duration || 60,
      basePrice: service.basePrice || 0,
      currency: service.currency || 'USD',
      therapistLevel: service.therapistLevel || 'Standard',
      image: service.image || null,
      date: defaultDate,
      dateLabel: dateLabel,
      time: defaultTime,
      addOns: [],
      addOnTotal: 0,
      totalPrice: service.basePrice || 0,
      notes: '',
    };

    console.log('📝 Creating booking entry:', bookingEntry);

    // Add booking to state using functional update
    setBookings((prev) => {
      // Ensure prev is an array
      const prevBookings = Array.isArray(prev) ? prev : [];

      // Check for duplicates (same service, date, and time)
      const isDuplicate = prevBookings.some(
        (booking) =>
          booking.serviceId === bookingEntry.serviceId &&
          booking.date === bookingEntry.date &&
          booking.time === bookingEntry.time
      );

      if (isDuplicate) {
        showNotification(`⚠️ This booking already exists: ${bookingEntry.name} on ${bookingEntry.dateLabel} at ${bookingEntry.time}`);
        // Still open drawer to show existing booking
        setTimeout(() => {
          setIsBookingOpen(true);
          setBookingIntent('view');
        }, 100);
        return prevBookings;
      }

      const updatedBookings = [...prevBookings, bookingEntry];

      // Log successful addition
      console.log('✅ Quick booking added successfully:', {
        bookingId: bookingEntry.bookingId,
        serviceName: bookingEntry.name,
        date: bookingEntry.dateLabel,
        time: bookingEntry.time,
        totalBookings: updatedBookings.length,
        bookingEntry: bookingEntry,
      });

      // Save to localStorage
      try {
        saveBookingsToLocalStorage(updatedBookings);
        console.log('💾 Quick booking saved to localStorage, total bookings:', updatedBookings.length);
      } catch (error) {
        console.warn('⚠️ Failed to save quick booking to localStorage:', error);
      }

      // Open booking drawer after state update
      // Use setTimeout to ensure state is updated before opening drawer
      setTimeout(() => {
        setIsBookingOpen(true);
        setBookingIntent('view');
        console.log('📂 Opening booking drawer with quick booking, total bookings:', updatedBookings.length);
      }, 150);

      return updatedBookings;
    });

    // Show success notification
    showNotification(`✅ Added: ${service.name} · ${dateLabel} at ${defaultTime}`);
  };

  const handleBookService = (service, bookingData) => {
    console.log('📞 handleBookService called', {
      service: service?.name,
      bookingData,
      hasService: !!service,
      hasBookingData: !!bookingData,
    });

    // Validate inputs
    if (!service) {
      console.error('❌ Cannot book: Service is missing');
      showNotification('Error: Service information is missing. Please try again.');
      return;
    }

    if (!bookingData) {
      console.error('❌ Cannot book: Booking data is missing');
      showNotification('Error: Booking data is missing. Please try again.');
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      console.error('❌ Cannot book: Booking data is incomplete', {
        date: bookingData.date,
        time: bookingData.time,
        bookingData,
      });
      showNotification('Error: Please select both date and time for your booking.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!bookingData.guestEmail || !emailRegex.test(bookingData.guestEmail.trim())) {
      console.error('❌ Cannot book: Guest email is missing or invalid', bookingData);
      showNotification('Error: Please provide a valid email address so we can confirm your booking.');
      return;
    }

    // Generate unique booking ID using crypto.randomUUID() when available
    let bookingId;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      bookingId = crypto.randomUUID();
    } else {
      // Fallback: use incrementing counter with service ID and timestamp for uniqueness
      const counter = (window.__bookingCounter = (window.__bookingCounter || 0) + 1);
      bookingId = `${service.id || service._id || 'service'}-${Date.now()}-${counter}`;
    }

    // Ensure bookingData.date is in ISO format (YYYY-MM-DD)
    let bookingDate = bookingData.date;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingDate)) {
      // Convert date label to ISO format using date helper
      const isoDate = convertDateLabelToISO(bookingDate);
      if (isoDate) {
        bookingDate = isoDate;
        bookingData.date = isoDate;
      } else {
        // Try to parse if not in ISO format
        try {
          const parsedDate = new Date(bookingDate);
          if (!isNaN(parsedDate.getTime())) {
            bookingDate = parsedDate.toISOString().split('T')[0];
            bookingData.date = bookingDate;
          } else {
            throw new Error('Invalid date format');
          }
        } catch (e) {
          showNotification('Error: Invalid date format. Please select a valid date.');
          return;
        }
      }
    }

    // Validate that the selected date/time is not in the past
    if (isPastDateTime(bookingDate, bookingData.time)) {
      showNotification('Error: Cannot book a date and time in the past. Please select a future date and time.');
      return;
    }

    // Find date label for display
    const dateLabel = service.bookableDates?.find((date) => {
      const dateValue = convertDateLabelToISO(date.value) || date.value;
      return dateValue === bookingDate;
    })?.label || getRelativeDateLabel(bookingDate);

    // Map add-on IDs to add-on objects
    const selectedAddOns = Array.isArray(bookingData.addOns)
      ? bookingData.addOns
        .map((addOnId) => service.addOns?.find((addOn) => addOn.id === addOnId))
        .filter(Boolean)
      : [];

    // Calculate total price
    const addOnTotal = bookingData.addOnTotal || selectedAddOns.reduce((sum, addOn) => sum + (addOn?.price || 0), 0);
    const totalPrice = bookingData.totalPrice || (service.basePrice || 0) + addOnTotal;

    // Create booking entry
    const bookingEntry = {
      bookingId,
      serviceId: service.id || service._id,
      name: service.name || 'Spa Service',
      guestName: bookingData.guestName || '',
      guestEmail: bookingData.guestEmail || '',
      guestPhone: bookingData.guestPhone || '',
      serviceCategory: service.serviceCategory || 'General',
      duration: service.duration || 60,
      basePrice: service.basePrice || 0,
      currency: service.currency || 'USD',
      therapistLevel: service.therapistLevel || 'Standard',
      image: service.image || null,
      date: bookingData.date,
      dateLabel: dateLabel || bookingData.date,
      time: bookingData.time,
      addOns: selectedAddOns,
      addOnTotal: addOnTotal,
      totalPrice: totalPrice,
      notes: bookingData.notes || '',
    };

    // Add booking to state
    setBookings((prev) => {
      // Ensure prev is an array
      const prevBookings = Array.isArray(prev) ? prev : [];

      // Check for duplicates (same service, date, and time)
      const isDuplicate = prevBookings.some(
        (booking) =>
          booking.serviceId === bookingEntry.serviceId &&
          booking.date === bookingEntry.date &&
          booking.time === bookingEntry.time
      );

      if (isDuplicate) {
        showNotification(`⚠️ This booking already exists: ${bookingEntry.name} on ${bookingEntry.dateLabel} at ${bookingEntry.time}`);
        return prevBookings;
      }

      const updatedBookings = [...prevBookings, bookingEntry];

      // Log successful addition
      console.log('✅ Booking added successfully:', {
        bookingId: bookingEntry.bookingId,
        serviceName: bookingEntry.name,
        date: bookingEntry.dateLabel,
        time: bookingEntry.time,
        totalBookings: updatedBookings.length,
        bookingEntry: bookingEntry,
      });

      // Save to localStorage
      try {
        saveBookingsToLocalStorage(updatedBookings);
        console.log('💾 Booking saved to localStorage, total bookings:', updatedBookings.length);
      } catch (error) {
        console.warn('⚠️ Failed to save booking to localStorage:', error);
      }

      return updatedBookings;
    });

    // Show success notification
    showNotification(`✅ Reserved: ${service.name} · ${bookingEntry.dateLabel} at ${bookingEntry.time}`);

    // Close the service modal first
    handleCloseModal();

    // Open booking drawer after state update completes
    // Use setTimeout to ensure React state update completes before opening drawer
    setTimeout(() => {
      setIsBookingOpen(true);
      setBookingIntent('view');
      console.log('📂 Opening booking drawer with updated bookings');
    }, 350);
  };

  const handleCancelBooking = (bookingId) => {
    setBookings((prev) => {
      const updatedBookings = prev.filter((booking) => booking.bookingId !== bookingId);
      saveBookingsToLocalStorage(updatedBookings);
      return updatedBookings;
    });
  };

  const handleClearBookings = () => {
    setBookings([]);
    try {
      localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear bookings from localStorage:', error);
    }
  };

  // Recreated Confirm Booking Handler with enhanced functionality
  const handleConfirmBookings = async () => {
    // Early validation: Check if there are any bookings
    if (!bookings || bookings.length === 0) {
      showNotification('No bookings to confirm. Please add services to your booking first.');
      return;
    }

    // Prevent multiple simultaneous submissions
    if (isConfirming) {
      return;
    }

    setIsConfirming(true);

    try {
      // Step 1: Comprehensive validation of all bookings
      const validationErrors = [];
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      bookings.forEach((booking, index) => {
        const bookingNum = index + 1;
        if (!booking.serviceId) {
          validationErrors.push(`Booking ${bookingNum}: Service ID is required`);
        }
        if (!booking.name || booking.name.trim() === '') {
          validationErrors.push(`Booking ${bookingNum}: Service name is required`);
        }

        // Validate and convert date to ISO format
        let bookingDate = booking.date || '';
        if (!bookingDate || bookingDate.trim() === '') {
          validationErrors.push(`Booking ${bookingNum}: Date is required`);
        } else {
          // Convert date if not in ISO format
          if (!dateRegex.test(bookingDate)) {
            const isoDate = convertDateLabelToISO(bookingDate || booking.dateLabel);
            if (isoDate && dateRegex.test(isoDate)) {
              bookingDate = isoDate;
              // Update the booking date
              booking.date = isoDate;
            } else {
              validationErrors.push(`Booking ${bookingNum}: Invalid date format. Please select a valid date.`);
            }
          }

          // Validate date is not in the past
          if (bookingDate && booking.time && isPastDateTime(bookingDate, booking.time)) {
            validationErrors.push(`Booking ${bookingNum}: Date and time cannot be in the past. Please select a future date and time.`);
          }
        }

        if (!booking.time || booking.time.trim() === '') {
          validationErrors.push(`Booking ${bookingNum}: Time is required`);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!booking.guestEmail || booking.guestEmail.trim() === '' || !emailRegex.test(booking.guestEmail.trim())) {
          validationErrors.push(`Please enter a valid email address in the booking drawer to receive confirmation`);
        }
        if (!booking.totalPrice || typeof booking.totalPrice !== 'number' || booking.totalPrice <= 0) {
          validationErrors.push(`Booking ${bookingNum}: Valid total price is required`);
        }
      });

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.length === 1
          ? validationErrors[0]
          : `Please fix the following:\n${validationErrors.slice(0, 3).join('\n')}${validationErrors.length > 3 ? '\n...' : ''}`;
        showNotification(errorMessage);
        setIsConfirming(false);
        return;
      }

      // Step 2: Transform bookings to match backend API format
      const bookingsToSubmit = bookings.map((booking, index) => {
        // Transform addOns array to backend format
        const transformedAddOns = Array.isArray(booking.addOns)
          ? booking.addOns
            .filter(addOn => addOn != null)
            .map(addOn => {
              if (typeof addOn === 'object') {
                return {
                  name: String(addOn.name || 'Add-on').trim() || 'Add-on',
                  price: Number(addOn.price) || 0,
                };
              }
              return { name: 'Add-on', price: 0 };
            })
          : [];

        // Generate unique booking ID if not present
        let bookingId;
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          bookingId = booking.id || booking.bookingId || crypto.randomUUID();
        } else {
          const counter = (window.__bookingCounter = (window.__bookingCounter || 0) + 1);
          bookingId = booking.id || booking.bookingId || `booking-${Date.now()}-${index}-${counter}`;
        }

        // Ensure date is in correct ISO format (YYYY-MM-DD)
        let bookingDate = booking.date || '';

        // Validate date format with regex
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!bookingDate || !dateRegex.test(bookingDate)) {
          // If date is not in ISO format, try to convert using date helper
          const isoDate = convertDateLabelToISO(bookingDate || booking.dateLabel);
          if (isoDate) {
            bookingDate = isoDate;
          } else if (booking.dateLabel) {
            // Try to parse from dateLabel
            try {
              const parsedDate = new Date(booking.dateLabel);
              if (!isNaN(parsedDate.getTime())) {
                bookingDate = parsedDate.toISOString().split('T')[0];
              } else {
                // If parsing fails, this is invalid
                throw new Error(`Booking ${index + 1}: Invalid date format. Expected ISO date (YYYY-MM-DD) or parseable date string.`);
              }
            } catch (parseError) {
              throw new Error(`Booking ${index + 1}: Invalid date format. Expected ISO date (YYYY-MM-DD) or parseable date string.`);
            }
          } else {
            throw new Error(`Booking ${index + 1}: Date is required and must be in ISO format (YYYY-MM-DD).`);
          }
        }

        // Final validation that we have a valid ISO date
        if (!dateRegex.test(bookingDate)) {
          throw new Error(`Booking ${index + 1}: Date validation failed. Expected ISO format (YYYY-MM-DD).`);
        }

        // Validate that the date/time is not in the past
        // But first, ensure we have a valid date
        if (bookingDate && booking.time) {
          // Double-check the date is valid ISO format
          if (!dateRegex.test(bookingDate)) {
            // Try to convert again
            const convertedDate = convertDateLabelToISO(bookingDate);
            if (convertedDate && dateRegex.test(convertedDate)) {
              bookingDate = convertedDate;
              booking.date = convertedDate;
            }
          }

          // Now check if it's in the past
          if (isPastDateTime(bookingDate, booking.time)) {
            // Instead of throwing error, try to fix it by using tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowISO = tomorrow.toISOString().split('T')[0];

            // Only throw error if we can't fix it
            if (isPastDateTime(tomorrowISO, booking.time)) {
              throw new Error(`Booking ${index + 1}: The selected time is too early. Please select a later time.`);
            } else {
              // Auto-fix: use tomorrow with the same time
              bookingDate = tomorrowISO;
              booking.date = tomorrowISO;
              booking.dateLabel = getRelativeDateLabel(tomorrowISO);
              console.log(`⚠️ Auto-fixed booking ${index + 1} date to tomorrow:`, tomorrowISO);
            }
          }
        }

        // Build booking object with all required and optional fields
        return {
          id: bookingId,
          serviceId: String(booking.serviceId || '').trim(),
          name: String(booking.name || '').trim(),
          guestName: booking.guestName ? String(booking.guestName).trim() : '',
          guestEmail: String(booking.guestEmail || '').trim(),
          guestPhone: booking.guestPhone ? String(booking.guestPhone).trim() : '',
          serviceCategory: String(booking.serviceCategory || 'General').trim(),
          duration: Number(booking.duration) || 60,
          basePrice: Number(booking.basePrice || booking.totalPrice || 0),
          totalPrice: Number(booking.totalPrice || booking.basePrice || 0),
          currency: String(booking.currency || 'USD').trim().toUpperCase(),
          date: String(bookingDate).trim(),
          time: String(booking.time || '').trim(),
          therapistLevel: String(booking.therapistLevel || 'Standard').trim(),
          addOns: transformedAddOns,
          addOnTotal: Number(booking.addOnTotal || 0),
          notes: booking.notes ? String(booking.notes).trim() : '',
          image: booking.image ? String(booking.image).trim() : null,
        };
      });

      // Step 3: Final validation before submission
      const finalValidationErrors = [];
      bookingsToSubmit.forEach((booking, index) => {
        const bookingNum = index + 1;
        if (!booking.serviceId || booking.serviceId.trim() === '') {
          finalValidationErrors.push(`Booking ${bookingNum}: Service ID is missing`);
        }
        if (!booking.name || booking.name.trim() === '') {
          finalValidationErrors.push(`Booking ${bookingNum}: Service name is missing`);
        }
        if (!booking.date || booking.date.trim() === '') {
          finalValidationErrors.push(`Booking ${bookingNum}: Date is missing`);
        }
        if (!booking.time || booking.time.trim() === '') {
          finalValidationErrors.push(`Booking ${bookingNum}: Time is missing`);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!booking.guestEmail || booking.guestEmail.trim() === '' || !emailRegex.test(booking.guestEmail.trim())) {
          finalValidationErrors.push(`Please enter a valid email address in the booking drawer to receive confirmation`);
        }
        if (!booking.totalPrice || booking.totalPrice <= 0) {
          finalValidationErrors.push(`Booking ${bookingNum}: Total price is invalid`);
        }
      });

      if (finalValidationErrors.length > 0) {
        const errorMessage = finalValidationErrors.length === 1
          ? finalValidationErrors[0]
          : `Please fix the following:\n${finalValidationErrors.slice(0, 3).join('\n')}${finalValidationErrors.length > 3 ? '\n...' : ''}`;
        showNotification(errorMessage);
        setIsConfirming(false);
        return;
      }

      // Log submission in development mode
      if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
        console.log('📅 Submitting bookings:', {
          count: bookingsToSubmit.length,
          bookings: bookingsToSubmit,
        });
      }

      // Step 4: Call API to create bookings
      let response;
      try {
        response = await api.bookings.create(bookingsToSubmit);
      } catch (apiError) {
        // Re-throw to be caught by outer catch block
        throw apiError;
      }

      if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
        console.log('📅 Booking API response:', response);
      }

      // Step 5: Handle successful response
      if (response && response.success) {
        const createdBookings = response.data?.bookings || [];
        const bookingCount = createdBookings.length || bookings.length;

        // Show success notification
        showNotification(
          `✅ Successfully confirmed ${bookingCount} booking${bookingCount > 1 ? 's' : ''}! ` +
          `Our spa concierge will contact you within 15 minutes.`
        );

        // Clear bookings from state
        setBookings([]);

        // Clear localStorage
        try {
          localStorage.removeItem(BOOKINGS_STORAGE_KEY);
        } catch (error) {
          console.warn('⚠️ Failed to clear bookings from localStorage:', error);
        }

        // Close drawer after showing success message
        setTimeout(() => {
          setIsBookingOpen(false);
        }, 2500);
      } else {
        // Handle API error response
        const errorMsg = response?.message || 'Failed to confirm bookings. Please try again.';
        showNotification(`❌ ${errorMsg}`);
        console.error('❌ Booking confirmation failed:', response);
      }
    } catch (error) {
      // Step 6: Handle exceptions with detailed error messages
      console.error('❌ Error confirming bookings:', error);

      let errorMessage = 'Failed to confirm bookings. Please try again.';

      if (error && error.message) {
        const errorMsg = error.message.toLowerCase();

        // Network/connection errors
        if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('failed to fetch')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection and ensure the backend server is running.';
        }
        // Authentication errors
        else if (errorMsg.includes('401') || errorMsg.includes('unauthorized') || errorMsg.includes('authentication')) {
          // Save bookings locally before showing error
          try {
            saveBookingsToLocalStorage(bookings);
            errorMessage = 'Please sign in to confirm your bookings. Your bookings have been saved locally and will be available when you sign in.';
          } catch (saveError) {
            errorMessage = 'Please sign in to confirm your bookings.';
          }
        }
        // Validation errors
        else if (errorMsg.includes('400') || errorMsg.includes('validation') || errorMsg.includes('required')) {
          errorMessage = 'Invalid booking data. Please review your bookings and try again.';
        }
        // Server errors
        else if (errorMsg.includes('500') || errorMsg.includes('server')) {
          errorMessage = 'Server error occurred. Please try again in a few moments.';
        }
        // Use the error message if it's descriptive
        else if (error.message.length < 100) {
          errorMessage = error.message;
        }
      }

      showNotification(`❌ ${errorMessage}`);
    } finally {
      // Always reset confirming state
      setIsConfirming(false);
    }
  };

  // Image trail items - spa and wellness related images from Unsplash
  const imageTrailItems = useMemo(() => [
    // Spa and wellness treatments
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600334128875-592d8fc6b3f2?w=400&h=400&fit=crop',
    // Beauty and skincare products
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
    // Relaxation and meditation
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    // Facial treatments
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1570554886113-bf63fba53583?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    // Massage and body treatments
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&h=400&fit=crop',
  ], []);

  // Parallax effect for hero section
  const heroRef = useRef(null);
  const servicesGridRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const heroTop = rect.top + scrolled;
        const heroHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Only apply parallax when hero is in viewport
        if (scrolled < heroTop + heroHeight && scrolled + windowHeight > heroTop) {
          const parallax = (scrolled - heroTop) * 0.3;
          heroRef.current.style.transform = `translateY(${parallax}px)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animations for services grid
  useEffect(() => {
    if (!servicesGridRef.current) return;

    const cards = servicesGridRef.current.querySelectorAll('.storefront-card');
    if (cards.length === 0) return;

    // Store event listeners for cleanup
    const hoverHandlers = [];

    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: 80,
      scale: 0.85,
      rotationX: -15,
    });

    // Create scroll-triggered animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: servicesGridRef.current,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: {
            amount: 0.8,
            from: 'start',
          },
        });
      },
    });

    // Add hover effects with GSAP
    cards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -12,
          scale: 1.03,
          rotationX: 5,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      hoverHandlers.push({ card, handleMouseEnter, handleMouseLeave });
    });

    return () => {
      // Cleanup ScrollTrigger
      if (scrollTrigger) {
        scrollTrigger.kill();
      }

      // Cleanup event listeners
      hoverHandlers.forEach(({ card, handleMouseEnter, handleMouseLeave }) => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [filteredServices]);

  return (
    <ContainerScrollAnimation className="min-h-screen bg-midnight text-white relative">
      {/* Image Trail Background - full viewport background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      >
        <div style={{
          pointerEvents: 'auto',
          height: '100%',
          width: '100%',
          position: 'relative'
        }}>
          <ImageTrail
            items={imageTrailItems}
            variant={1}
          />
        </div>
        {/* Subtle overlay to ensure content readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(11, 35, 62, 0.3) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-ocean/80 backdrop-blur-xl relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            {/* Logo - optimized for header */}
            <div className="flex items-center justify-center flex-shrink-0">
              <BeautySpaLogo
                className="h-12 w-auto sm:h-16 md:h-20 transition-transform duration-200 hover:scale-105"
                showText={false}
              />
            </div>
            {/* Brand name - visible on medium screens and up */}
            <div className="hidden lg:block ml-1 flex-shrink-0">
              <p
                className="text-sm md:text-base font-serif font-semibold whitespace-nowrap leading-tight"
                style={{
                  background: 'linear-gradient(180deg, #C084FC 0%, #9333EA 50%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#9333EA',
                  letterSpacing: '0.05em',
                  filter: 'drop-shadow(0 1px 2px rgba(147, 51, 234, 0.2)) drop-shadow(0 2px 4px rgba(147, 51, 234, 0.3))',
                }}
              >
                {storefrontName}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="hidden lg:inline text-xs sm:text-sm text-white/70 whitespace-nowrap">
              Luxury spa services & wellness itineraries
            </span>
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="relative flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-2 sm:px-4 sm:py-2 transition-all duration-200 backdrop-blur-sm hover:bg-white/20 hover:scale-105 active:scale-95"
              aria-label="View bookings"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V5a4 4 0 118 0v2m-9 4h10l1 9H6l1-9zm2 0V7m4 0v4"
                />
              </svg>
              {bookings.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-xs font-bold text-white shadow-lg animate-pulse">
                  {bookings.length > 9 ? '9+' : bookings.length}
                </span>
              )}
            </button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 whitespace-nowrap"
            >
              Exit Preview
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-24 relative z-10">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" ref={heroRef}>
            {/* 3D Spline Background - can be enabled via environment variable */}
            {import.meta.env.VITE_SPA_SPLINE_SCENE && (
              <SplineBackground
                sceneUrl={import.meta.env.VITE_SPA_SPLINE_SCENE}
                className="z-0"
                interactive={false}
                opacity={0.7}
              />
            )}
            {/* Fallback image background - shown if Spline is not configured */}
            {!import.meta.env.VITE_SPA_SPLINE_SCENE && (
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85"
                data-fallback-index="0"
                alt="Luxury spa treatment room with ocean view"
                className="storefront-hero-image h-full w-full object-cover transition-transform duration-300 z-0"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                style={{ backgroundColor: '#0b233e', objectPosition: 'center 50%', filter: 'brightness(0.85) contrast(1.1)' }}
                onError={(e) => {
                  const sources = [
                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85', // spa treatment room
                    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85', // luxury spa interior
                    'https://images.unsplash.com/photo-1600334125308-73316e67749a?auto=format&fit=crop&w=1600&q=85', // spa relaxation area
                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85', // wellness spa
                    '/assets/images/hero-bg.jpg',
                    FALLBACK_GRADIENT,
                  ];
                  const currentIndex = Number(e.currentTarget.getAttribute('data-fallback-index') || '0');
                  const nextIndex = Math.min(currentIndex, sources.length - 1);
                  e.currentTarget.setAttribute('data-fallback-index', String(nextIndex + 1));
                  e.currentTarget.src = sources[nextIndex];
                }}
              />
            )}
            <div className="storefront-background-overlay absolute inset-0 bg-gradient-to-b from-amber-900/30 via-orange-800/20 to-amber-800/30 z-10" />
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-24 sm:py-32 md:py-48 text-center z-20">
            {/* Logo with text - displayed directly on background */}
            <div className="storefront-hero-text mb-8 sm:mb-10 md:mb-12 flex justify-center" style={{ animationDelay: '0s' }}>
              <BeautySpaLogo className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80" showText={true} />
            </div>

            {/* Text boxes */}
            <div className="storefront-hero-text flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6" style={{ animationDelay: '0.1s' }}>
              <div className="rounded-lg bg-white/20 backdrop-blur-md px-6 py-3 sm:px-8 sm:py-3.5 border border-white/30 shadow-lg">
                <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-white whitespace-nowrap drop-shadow-lg">
                  {storefrontName.toUpperCase()}
                </span>
              </div>
              <div className="rounded-lg bg-white/20 backdrop-blur-md px-6 py-3 sm:px-8 sm:py-3.5 border border-white/30 shadow-lg">
                <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-white whitespace-nowrap drop-shadow-lg">
                  WELLNESS 2026
                </span>
              </div>
            </div>

            {/* Description text */}
            <p className="storefront-hero-text max-w-2xl text-sm sm:text-base md:text-lg text-white/95 leading-relaxed mt-8 sm:mt-10 drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
              Experience our signature spa services featuring marine botanicals, heated ocean stones, and reef-safe rituals designed for complete relaxation and renewal.
            </p>

            {/* Action buttons */}
            <div className="storefront-hero-text flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8" style={{ animationDelay: '0.3s' }}>
              <Button
                onClick={() => {
                  if (allServices && allServices.length > 0) {
                    handleShowService(allServices[0], 'book');
                  }
                }}
                className="text-sm sm:text-base px-6 py-3"
              >
                Book Treatment
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsBookingOpen(true)}
                className="text-sm sm:text-base px-6 py-3"
              >
                View Itinerary
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6">
          <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Spa Services</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-white">Our Treatment Menu</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/65 sm:max-w-md">
                Browse curated ocean-inspired rituals designed to balance mind, body, and spirit.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-6 backdrop-blur-md shadow-xl">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-brand-400/10 blur-2xl" />

              <div className="relative mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 shadow-lg">
                  <svg className="h-5 w-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Filter Services</h3>
                  <p className="text-xs text-white/50">Select a category</p>
                </div>
              </div>

              <div className="no-scrollbar relative -mx-2 flex gap-3 overflow-x-auto px-2 pb-1">
                {serviceCategories.map((category) => {
                  const isActive = activeCategory === category;
                  const categoryCount =
                    category === 'All'
                      ? (allServices || []).length
                      : (allServices || []).filter((service) => service.serviceCategory === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={[
                        'group relative inline-flex min-w-fit items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300',
                        isActive
                          ? 'border-brand-400/50 bg-gradient-to-br from-brand-500/30 to-brand-600/20 text-white shadow-[0_8px_30px_rgb(29,160,230,0.25)]'
                          : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white',
                      ].join(' ')}
                    >
                      {isActive && (
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 blur-lg" />
                      )}
                      <span className="text-base opacity-80">
                        {category === 'All'
                          ? '✨'
                          : category === 'Facials'
                            ? '💆'
                            : category === 'Massages'
                              ? '🧘'
                              : category === 'Body Treatments'
                                ? '🌊'
                                : category === 'Makeup'
                                  ? '💄'
                                  : category === 'Beauty Tech & Electronics'
                                    ? '🔆'
                                    : '💅'}
                      </span>
                      <span className="whitespace-nowrap">{category}</span>
                      <span
                        className={[
                          'inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white/80',
                        ].join(' ')}
                      >
                        {categoryCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={servicesGridRef} data-services-section className="relative mt-10">
            {/* Animated Dot Grid Background */}
            <div className="absolute inset-0 -z-10">
              <DataGridHero
                rows={30}
                cols={40}
                spacing={6}
                duration={5.0}
                color="#FCD34D"
                animationType="pulse"
                pulseEffect={true}
                mouseGlow={true}
                opacityMin={0.3}
                opacityMax={0.8}
                background="transparent"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10" style={{ perspective: '1000px' }}>
              {servicesLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-400 border-t-transparent"></div>
                  <p className="text-white/60">Loading spa services...</p>
                </div>
              ) : servicesError ? (
                <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                  <p className="text-red-200 font-semibold">Error loading services</p>
                  <p className="mt-2 text-sm text-red-200/70">{servicesError}</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-white/60">No services found in this category.</p>
                </div>
              ) : (
                filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="storefront-card"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <ServiceCard
                      service={service}
                      onViewDetails={(selected) => handleShowService(selected, 'view')}
                      onBook={(selected) => handleQuickBook(selected)}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-br from-brand-500/20 to-brand-600/10 px-8 py-12 text-center backdrop-blur-sm">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">Wellness Packages</p>
            <h3 className="font-display text-3xl text-white">Ready to book your spa experience?</h3>
          </div>
          <p className="mt-4 text-base text-white/80">
            Contact our spa concierge to customize a treatment package tailored to your wellness needs.
          </p>
          <div className="mt-6 mb-4 flex flex-wrap justify-center gap-3 text-sm text-white/70">
            <a href="tel:+27788637252" className="flex items-center gap-2 hover:text-brand-200 transition-colors">
              <span>📞</span>
              <span>+27 788637252</span>
            </a>
            <span className="text-white/30">•</span>
            <a href="mailto:Tanasbeautyboost@gmail.com" className="flex items-center gap-2 hover:text-brand-200 transition-colors">
              <span>📧</span>
              <span>Tana'sbeautyboost@gmail.com</span>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ContactSpaConcierge variant="buttons" />
            <Button variant="secondary" onClick={() => setIsPackagesOpen(true)}>
              View Packages
            </Button>
          </div>
        </section>
      </main>

      <ServiceDetailsModal
        service={selectedService}
        open={isModalOpen}
        intent={bookingIntent}
        onClose={handleCloseModal}
        onBook={handleBookService}
      />

      <BookingDrawer
        bookings={bookings}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onCancelBooking={handleCancelBooking}
        onClearBookings={handleClearBookings}
        onConfirmBookings={handleConfirmBookings}
        isConfirming={isConfirming}
        onUpdateGuestInfo={(guestInfo) => {
          // Update all bookings with guest info
          setBookings((prev) => {
            return prev.map((booking) => ({
              ...booking,
              guestName: guestInfo.name || booking.guestName || '',
              guestEmail: guestInfo.email || booking.guestEmail || '',
              guestPhone: guestInfo.phone || booking.guestPhone || '',
            }));
          });
        }}
      />

      <PackagesPage
        isOpen={isPackagesOpen}
        onClose={() => setIsPackagesOpen(false)}
        onBookPackage={(pkg) => {
          // Show notification that user can book through services
          showNotification(`✨ ${pkg.name} selected! Browse our services to customize your package experience.`);
          setIsPackagesOpen(false);
          // Optionally scroll to services section or open booking drawer
          setTimeout(() => {
            const servicesSection = document.querySelector('[data-services-section]');
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }}
      />

      <CartNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ message: '', isVisible: false })}
      />
    </ContainerScrollAnimation>
  );
}

