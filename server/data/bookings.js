import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import lockfile from 'proper-lockfile';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BOOKINGS_FILE = join(__dirname, 'bookings.json');

// Ensure data directory exists
const dataDir = dirname(BOOKINGS_FILE);
if (!existsSync(dataDir)) {
  await mkdir(dataDir, { recursive: true });
}

// Get all bookings from file (async)
export const getAllBookings = async () => {
  try {
    const data = await readFile(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading bookings:', error);
    throw error;
  }
};

// Internal write function without locking (caller must hold lock)
async function _writeBookingsUnlocked(bookings) {
  // Atomic write: write to temp file then rename
  const tempPath = `${BOOKINGS_FILE}.tmp`;
  await writeFile(tempPath, JSON.stringify(bookings, null, 2), 'utf8');
  const fs = await import('fs/promises');
  await fs.rename(tempPath, BOOKINGS_FILE);
}

// Save bookings to file with file locking
export const saveAllBookings = async (bookings, skipLock = false) => {
  if (skipLock) {
    await _writeBookingsUnlocked(bookings);
    return;
  }
  
  let release;
  try {
    // Acquire file lock with retries
    release = await lockfile.lock(BOOKINGS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    await _writeBookingsUnlocked(bookings);
  } catch (error) {
    // Clean up temp file on error
    try {
      const fs = await import('fs/promises');
      await fs.unlink(`${BOOKINGS_FILE}.tmp`).catch(() => {});
    } catch {}
    console.error('Error saving bookings:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Create a new booking (async with locking)
export const createBooking = async (booking) => {
  let release;
  try {
    // Acquire exclusive file lock
    release = await lockfile.lock(BOOKINGS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Re-load latest bookings from disk while holding lock
    const bookings = await getAllBookings();
    
    // Generate unique booking ID if not provided
    const bookingWithId = {
      ...booking,
      id: booking.id || `booking_${crypto.randomUUID()}`,
      createdAt: booking.createdAt || new Date().toISOString(),
      status: booking.status || 'pending',
    };
    
    bookings.push(bookingWithId);
    await saveAllBookings(bookings, true); // Skip lock, we already hold it
    
    return bookingWithId;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Create multiple bookings atomically
export const createBookings = async (bookingsArray) => {
  let release;
  try {
    // Acquire exclusive file lock
    release = await lockfile.lock(BOOKINGS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Re-load latest bookings from disk while holding lock
    const existingBookings = await getAllBookings();
    
    // Generate IDs and timestamps for all bookings
    const newBookings = bookingsArray.map(booking => ({
      ...booking,
      id: booking.id || `booking_${crypto.randomUUID()}`,
      createdAt: booking.createdAt || new Date().toISOString(),
      status: booking.status || 'pending',
    }));
    
    existingBookings.push(...newBookings);
    await saveAllBookings(existingBookings, true); // Skip lock, we already hold it
    
    return newBookings;
  } catch (error) {
    console.error('Error creating bookings:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Get bookings by user ID (async)
export const getBookingsByUserId = async (userId) => {
  const bookings = await getAllBookings();
  return bookings.filter(booking => booking.userId === userId);
};

// Get booking by ID (async)
export const getBookingById = async (id) => {
  const bookings = await getAllBookings();
  return bookings.find(booking => booking.id === id);
};

// Update booking (async with locking)
export const updateBooking = async (updatedBooking) => {
  let release;
  try {
    // Acquire exclusive file lock
    release = await lockfile.lock(BOOKINGS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Re-load latest bookings from disk while holding lock
    const bookings = await getAllBookings();
    const index = bookings.findIndex(booking => booking.id === updatedBooking.id);
    if (index !== -1) {
      bookings[index] = {
        ...bookings[index],
        ...updatedBooking,
        updatedAt: new Date().toISOString(),
      };
      await saveAllBookings(bookings, true); // Skip lock, we already hold it
      return bookings[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

