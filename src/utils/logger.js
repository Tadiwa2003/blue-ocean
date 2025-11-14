// Simple logger utility for the application
// In production, only errors are logged to console
// In development, all log levels are shown

const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },
  warn: (...args) => {
    console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

