/**
 * API Connection Check Utility
 * Checks if the backend server is accessible
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const checkApiConnection = async () => {
  try {
    // Build health URL explicitly using URL constructor
    const baseUrl = API_BASE_URL.endsWith('/api') 
      ? API_BASE_URL.slice(0, -4) 
      : API_BASE_URL.replace(/\/api\/?$/, '');
    const healthUrl = new URL('/api/health', baseUrl).toString();
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        connected: true,
        message: data.message || 'Connected to backend',
      };
    }
    
    return {
      connected: false,
      message: 'Backend server responded with an error',
    };
  } catch (error) {
    return {
      connected: false,
      message: 'Unable to connect to backend server. Please make sure the server is running on http://localhost:3001',
      error: error.message,
    };
  }
};

export default checkApiConnection;

