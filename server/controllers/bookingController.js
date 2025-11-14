import { createBookings as createBookingsData, getAllBookings, getBookingsByUserId, getBookingById as getBookingByIdData, updateBooking } from '../db/bookings.js';
import crypto from 'crypto';

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
      if (!booking.serviceId || !booking.name) {
        return res.status(400).json({
          success: false,
          message: `Booking ${i + 1}: serviceId and name are required`,
        });
      }

      if (!booking.date || !booking.time) {
        return res.status(400).json({
          success: false,
          message: `Booking ${i + 1}: date and time are required`,
        });
      }

      if (!booking.totalPrice || booking.totalPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: `Booking ${i + 1}: totalPrice must be a positive number`,
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

