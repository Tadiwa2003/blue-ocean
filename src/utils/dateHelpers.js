/**
 * Date Helper Utilities
 * Converts relative date labels to ISO dates and handles date operations
 */

/**
 * Convert relative date labels to ISO date strings (YYYY-MM-DD)
 * @param {string} dateLabel - Relative date label (e.g., "today", "tomorrow", "saturday")
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function convertDateLabelToISO(dateLabel) {
  if (!dateLabel) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const label = dateLabel.toLowerCase().trim();
  
  // Handle ISO dates (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    return label;
  }
  
  // Handle relative dates
  switch (label) {
    case 'today':
      return today.toISOString().split('T')[0];
    
    case 'tomorrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    
    default:
      // Handle day names (monday, tuesday, etc.)
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDayIndex = dayNames.findIndex(day => label.includes(day));
      
      if (targetDayIndex !== -1) {
        const currentDayIndex = today.getDay();
        let daysToAdd = targetDayIndex - currentDayIndex;
        
        // If the day has passed this week, get next week's occurrence
        if (daysToAdd <= 0) {
          daysToAdd += 7;
        }
        
        // Handle "next [day]" format
        if (label.includes('next')) {
          daysToAdd += 7;
        }
        
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + daysToAdd);
        return targetDate.toISOString().split('T')[0];
      }
      
      // Try to parse as a date string
      try {
        const parsed = new Date(label);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      } catch (e) {
        // Invalid date
      }
      
      // Fallback: return today's date
      return today.toISOString().split('T')[0];
  }
}

/**
 * Format ISO date to readable format
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(isoDate, options = {}) {
  if (!isoDate) return '';
  
  const date = new Date(isoDate + 'T00:00:00');
  if (isNaN(date.getTime())) return isoDate;
  
  const {
    weekday = 'short',
    month = 'short',
    day = 'numeric',
    year = 'numeric',
  } = options;
  
  return new Intl.DateTimeFormat('en-US', {
    weekday,
    month,
    day,
    year,
  }).format(date);
}

/**
 * Get relative date label from ISO date
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {string} Relative date label
 */
export function getRelativeDateLabel(isoDate) {
  if (!isoDate) return '';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(isoDate + 'T00:00:00');
  date.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) return isoDate;
  
  const diffTime = date - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) {
    return formatDate(isoDate, { weekday: 'long' });
  }
  
  return formatDate(isoDate, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Check if a date is in the past
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {boolean} True if date is in the past
 */
export function isPastDate(isoDate) {
  if (!isoDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(isoDate + 'T00:00:00');
  date.setHours(0, 0, 0, 0);
  
  return date < today;
}

/**
 * Get available dates for the next N days
 * @param {number} days - Number of days to generate
 * @param {Date} startDate - Start date (defaults to today)
 * @returns {Array} Array of date objects with label and ISO value
 */
export function getAvailableDates(days = 14, startDate = null) {
  const start = startDate || new Date();
  start.setHours(0, 0, 0, 0);
  
  const dates = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    const isoDate = date.toISOString().split('T')[0];
    const dayName = dayNames[date.getDay()];
    
    let label;
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else if (i < 7) {
      label = dayName;
    } else {
      label = formatDate(isoDate, { month: 'short', day: 'numeric' });
    }
    
    dates.push({
      label,
      value: isoDate,
      dayName,
      date: new Date(date),
    });
  }
  
  return dates;
}

/**
 * Validate time slot format
 * @param {string} timeSlot - Time slot string (e.g., "10:00 AM")
 * @returns {boolean} True if valid
 */
export function isValidTimeSlot(timeSlot) {
  if (!timeSlot) return false;
  
  // Match formats like "10:00 AM", "10:00AM", "10:00", "10:00:00 AM"
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i;
  return timeRegex.test(timeSlot.trim());
}

/**
 * Convert time slot to 24-hour format
 * @param {string} timeSlot - Time slot string (e.g., "10:00 AM")
 * @returns {string} 24-hour format (e.g., "10:00")
 */
export function convertTo24Hour(timeSlot) {
  if (!timeSlot) return '';
  
  const trimmed = timeSlot.trim();
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i;
  const match = trimmed.match(timeRegex);
  
  if (!match) return trimmed;
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Check if a date and time combination is in the past
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @param {string} timeSlot - Time slot string (e.g., "10:00 AM")
 * @returns {boolean} True if date/time is in the past
 */
export function isPastDateTime(isoDate, timeSlot) {
  if (!isoDate || !timeSlot) return false;
  
  const date = new Date(isoDate + 'T00:00:00');
  const time24 = convertTo24Hour(timeSlot);
  const [hours, minutes] = time24.split(':').map(Number);
  
  date.setHours(hours || 0, minutes || 0, 0, 0);
  
  return date < new Date();
}

