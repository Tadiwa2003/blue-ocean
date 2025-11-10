/**
 * API Service - Handles all backend API calls
 */

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Ensure it ends with /api
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Check if response has content
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response from server');
    }
  } else {
    const text = await response.text();
    throw new Error(text || `HTTP error! status: ${response.status}`);
  }
  
  if (!response.ok) {
    const errorMessage = data?.message || data?.errors?.join(', ') || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  
  return data;
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Enhanced fetch wrapper with better error handling
const apiFetch = async (url, options = {}) => {
  try {
    // Get auth token if available
    const token = getAuthToken();
    
    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add Authorization header if token exists and not explicitly excluded
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    return await handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please make sure the backend server is running on http://localhost:3001');
    }
    // Re-throw other errors
    throw error;
  }
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Set current user in localStorage
const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// API Service Object
export const api = {
  // Authentication
  auth: {
    async signUp(userData) {
      const data = await apiFetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (data.success && data.data.token) {
        setAuthToken(data.data.token);
        setCurrentUser(data.data.user);
      }
      
      return data;
    },

    async signIn(email, password) {
      const data = await apiFetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (data.success && data.data.token) {
        setAuthToken(data.data.token);
        setCurrentUser(data.data.user);
      }
      
      return data;
    },

    async signOut() {
      const token = getAuthToken();
      if (token) {
        try {
          await apiFetch(`${API_BASE_URL}/auth/signout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Sign out error:', error);
          // Continue with sign out even if API call fails
        }
      }
      
      setAuthToken(null);
      setCurrentUser(null);
    },

    async getCurrentUser() {
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      try {
        const data = await apiFetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return data.success ? data.data.user : null;
      } catch (error) {
        console.error('Get current user error:', error);
        // Clear invalid token
        setAuthToken(null);
        setCurrentUser(null);
        return null;
      }
    },

    async requestPasswordReset(email) {
      return await apiFetch(`${API_BASE_URL}/auth/password-reset`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    isAuthenticated() {
      return !!getAuthToken();
    },

    getToken() {
      return getAuthToken();
    },

    getUser() {
      return getCurrentUser();
    },
  },

  // Orders
  orders: {
    async createOrder(orderData) {
      const token = getAuthToken();
      return await apiFetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
    },

    async getUserOrders() {
      const token = getAuthToken();
      return await apiFetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    },

    async getOrderById(orderId) {
      const token = getAuthToken();
      return await apiFetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    },
  },

  // Contact
  contact: {
    async sendMessage(messageData) {
      return await apiFetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },
  },

  // Products
  products: {
    async getProducts() {
      return await apiFetch(`${API_BASE_URL}/products`);
    },

    async getProductById(productId) {
      return await apiFetch(`${API_BASE_URL}/products/${productId}`);
    },

    async createProduct(productData) {
      return await apiFetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },
  },

  // Services
  services: {
    async getServices() {
      return await apiFetch(`${API_BASE_URL}/services`);
    },

    async getServiceById(serviceId) {
      return await apiFetch(`${API_BASE_URL}/services/${serviceId}`);
    },

    async createService(serviceData) {
      return await apiFetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });
    },
  },

  // Subscriptions
  subscriptions: {
    async getCurrent() {
      return await apiFetch(`${API_BASE_URL}/subscriptions/current`);
    },

    async create(subscriptionData) {
      return await apiFetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });
    },

    async update(subscriptionId, subscriptionData) {
      return await apiFetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        body: JSON.stringify(subscriptionData),
      });
    },

    async cancel(subscriptionId) {
      return await apiFetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;

