import Booking from '../models/Booking.js';

export const getAllBookings = async () => {
  return await Booking.find({}).sort({ createdAt: -1 }).lean();
};

export const getBookingsByUserId = async (userId) => {
  return await Booking.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const getBookingById = async (id) => {
  return await Booking.findOne({ id }).lean();
};

export const createBookings = async (bookingsArray) => {
  const bookings = await Booking.insertMany(bookingsArray);
  return bookings.map(b => b.toObject());
};

export const updateBooking = async (id, updateData) => {
  const booking = await Booking.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();
  return booking;
};

export const deleteBooking = async (id) => {
  const result = await Booking.findOneAndDelete({ id });
  return result ? result.toObject() : null;
};
