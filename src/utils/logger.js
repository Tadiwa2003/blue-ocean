// Simple logger utility for the application
// In production, only errors and warnings are logged to console
// In development, all log levels are shown

const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';

export const logger = {
  // Development-only logging (replaces console.log)
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },

  // Debug level logging (development only)
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  // Info level logging (development only)
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },

  // Warning level logging (always shown)
  warn: (...args) => {
    console.warn(...args);
  },

  // Error level logging (always shown)
  error: (...args) => {
    console.error(...args);
  },
};

// For backward compatibility and convenience
export default logger;
