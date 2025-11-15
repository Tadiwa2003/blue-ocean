import {
  createBookings as createBookingsData,
  getAllBookings,
  getBookingsByUserId,
  getBookingById as getBookingByIdData,
  updateBooking,
} from '../db/bookings.js';
import crypto from 'crypto';
import { sendBookingNotifications, sendBookingConfirmation } from '../utils/email.js';

// Create bookings (multiple bookings can be created at once)
export const createBookings = async (req, res) => {
  try {
    const { bookings } = req.body;
    const userId = req.user?.id || null; // Allow null for guest bookings

    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bookings array is required and must not be empty',
      });
    }

    // Validate each booking
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      const bookingNum = i + 1;
      
      // Validate serviceId and name
      if (!booking.serviceId || !booking.name) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: serviceId and name are required`,
        });
      }

      // Validate date format (must be ISO format YYYY-MM-DD)
      if (!booking.date) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: date is required`,
        });
      }
      
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(booking.date)) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: date must be in ISO format (YYYY-MM-DD)`,
        });
      }
      
      // Validate that date is not in the past
      const bookingDate = new Date(booking.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: cannot book a date in the past`,
        });
      }

      // Validate time
      if (!booking.time || typeof booking.time !== 'string' || booking.time.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: time is required`,
        });
      }
      
      // Validate time format (basic check for AM/PM or 24-hour format)
      const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i;
      if (!timeRegex.test(booking.time.trim())) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: invalid time format. Use format like "10:00 AM" or "14:00"`,
        });
      }

      // Validate totalPrice
      if (typeof booking.totalPrice !== 'number' || booking.totalPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: totalPrice must be a positive number`,
        });
      }

      // Validate guestEmail
      if (!booking.guestEmail || typeof booking.guestEmail !== 'string') {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: guestEmail is required`,
        });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(booking.guestEmail.trim())) {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: invalid email format`,
        });
      }

      // Validate serviceId is a string
      if (typeof booking.serviceId !== 'string' || booking.serviceId.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: serviceId must be a non-empty string`,
        });
      }

      // Validate name is a string
      if (typeof booking.name !== 'string' || booking.name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Booking ${bookingNum}: name must be a non-empty string`,
        });
      }
    }

    // Add userId and ensure unique IDs for each booking
    const bookingsWithUserId = bookings.map((booking, index) => {
      // Generate unique ID if not provided or ensure uniqueness
      const bookingId = booking.id || `booking-${Date.now()}-${index}-${crypto.randomUUID().substring(0, 8)}`;
      
      return {
        ...booking,
        id: bookingId,
        userId: userId || booking.userId || null, // Allow null for guest bookings
        status: booking.status || 'pending', // Default status
      };
    });

    const createdBookings = await createBookingsData(bookingsWithUserId);

    console.log(`[Booking] ✅ Created ${createdBookings.length} booking(s) in database`);
    console.log(`[Booking] 📧 Preparing to send email notifications to concierge: tadiwachoga2003@gmail.com`);

    // Send email notifications for each booking (fire-and-forget, don't block response)
    // But log the results for debugging
    createdBookings.forEach((booking, index) => {
      const bookingNum = index + 1;
      console.log(`[Booking] 📧 Processing email for booking ${bookingNum}/${createdBookings.length}:`, {
        id: booking.id || booking._id,
        name: booking.name,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        date: booking.date,
        time: booking.time,
        totalPrice: booking.totalPrice,
      });
      
      // Ensure booking has all required fields before sending
      if (!booking.name || !booking.date || !booking.time) {
        console.error(`[Booking] ❌ Booking ${bookingNum} missing required fields, skipping email`);
        return;
      }
      
      sendBookingNotifications(booking)
        .then(() => {
          console.log(`[Booking] ✅ Email notification processed for booking ${bookingNum}`);
        })
        .catch((error) => {
          console.error(`[Booking] ❌ Email notification failed for booking ${bookingNum}:`, error.message);
          console.error('[Booking] ❌ Error stack:', error.stack);
          // Don't throw - we want bookings to succeed even if email fails
      });
    });

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdBookings.length} booking(s)`,
      data: {
        bookings: createdBookings,
      },
    });
  } catch (error) {
    console.error('Create bookings error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', '),
      });
    }
    
    if (error.code === 11000) {
      // Duplicate key error (MongoDB)
      return res.status(400).json({
        success: false,
        message: 'A booking with this ID already exists. Please try again.',
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create bookings. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
    });
  }
};

// Get all bookings (admin/owner only)
export const getBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();

    res.json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings.',
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await getBookingsByUserId(userId);

    res.json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings.',
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await getBookingByIdData(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns the booking or is admin/owner
    if (booking.userId !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking.',
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await getBookingByIdData(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    if (booking.userId !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updatedBooking = await updateBooking({ id: booking.id, status });

    // Send confirmation email if status is changed to "confirmed"
    if (status === 'confirmed' && updatedBooking) {
      console.log(`[Booking] ✅ Booking ${booking.id} status updated to "confirmed"`);
      console.log(`[Booking] 📧 Preparing to send confirmation email to: tadiwachoga2003@gmail.com`);
      
      // Send confirmation email (fire-and-forget, don't block response)
      sendBookingConfirmation(updatedBooking)
        .then(() => {
          console.log(`[Booking] ✅ Confirmation email processed for booking ${booking.id}`);
        })
        .catch((error) => {
          console.error(`[Booking] ❌ Confirmation email failed for booking ${booking.id}:`, error.message);
          // Don't throw - we want status update to succeed even if email fails
        });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        booking: updatedBooking,
      },
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status.',
    });
  }
};

