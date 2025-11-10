/**
 * API Connection Check Utility
 * Checks if the backend server is accessible
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`, {
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

