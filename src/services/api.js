

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
  const contentLength = response.headers.get('content-length');
  
  // Handle empty responses
  if (contentLength === '0' || (!contentType && response.status === 204)) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return null;
  }
  
  let text;
  
  try {
    text = await response.text();
  } catch (error) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    throw new Error(`Failed to read response: ${error.message}`);
  }
  
  // Handle empty text response
  if (!text || text.trim().length === 0) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return null;
  }
  
  // Try to parse as JSON if content-type suggests it, or if no content-type is set
  if (!contentType || contentType.includes('application/json')) {
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      // JSON parsing failed
      if (!response.ok) {
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
      throw new Error(`Invalid JSON response from server: ${error.message}. Response: ${text.substring(0, 200)}`);
    }
    
    if (!response.ok) {
      const errorMessage = data?.message || data?.errors?.join(', ') || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } else {
    // Non-JSON response
    if (!response.ok) {
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    return { text, contentType };
  }
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
    // Handle network errors - server not running or connection refused
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error('Unable to connect to server. Please make sure the backend server is running. Start it with: npm run server');
    }
    // Handle CORS errors
    if (error.message && error.message.includes('CORS')) {
      throw new Error('CORS Error: The server is not allowing requests from this origin. Please check the backend CORS configuration.');
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
      try {
        await apiFetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Sign out error:', error);
        // Continue with sign out even if API call fails
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
        const data = await apiFetch(`${API_BASE_URL}/auth/me`);
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
        skipAuth: true,
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
      return await apiFetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },

    async getUserOrders() {
      return await apiFetch(`${API_BASE_URL}/orders`);
    },

    async getOrderById(orderId) {
      return await apiFetch(`${API_BASE_URL}/orders/${orderId}`);
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
    async getProducts(storefrontId = null) {
      try {
        const url = storefrontId 
          ? `${API_BASE_URL}/products?storefrontId=${storefrontId}`
          : `${API_BASE_URL}/products`;
        const response = await apiFetch(url);
        return response;
      } catch (error) {
        console.error('Error in products.getProducts:', error);
        // If it's a JSON parsing error, provide more context
        if (error.message.includes('Invalid JSON')) {
          throw new Error(`Server returned invalid response. Please check that the backend server is running and responding correctly. ${error.message}`);
        }
        throw error;
      }
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
    async getServices(storefrontId = null) {
      const url = storefrontId 
        ? `${API_BASE_URL}/services?storefrontId=${storefrontId}`
        : `${API_BASE_URL}/services`;
      return await apiFetch(url);
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

  // Storefronts
  storefronts: {
    async getUserStorefronts() {
      return await apiFetch(`${API_BASE_URL}/storefronts`);
    },

    async getStorefrontById(storefrontId) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}`);
    },

    async getStorefrontBySlug(slug) {
      return await apiFetch(`${API_BASE_URL}/storefronts/slug/${slug}`, { skipAuth: true });
    },

    async createStorefront(storefrontData) {
      return await apiFetch(`${API_BASE_URL}/storefronts`, {
        method: 'POST',
        body: JSON.stringify(storefrontData),
      });
    },

    async updateStorefront(storefrontId, updateData) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },

    async deleteStorefront(storefrontId) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}`, {
        method: 'DELETE',
      });
    },

    async publishStorefront(storefrontId) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}/publish`, {
        method: 'POST',
      });
    },

    async unpublishStorefront(storefrontId) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}/unpublish`, {
        method: 'POST',
      });
    },

    // Website Builder methods
    async saveWebsiteSections(storefrontId, sections) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}/sections`, {
        method: 'PUT',
        body: JSON.stringify({ sections }),
      });
    },

    async getWebsiteSections(storefrontId) {
      return await apiFetch(`${API_BASE_URL}/storefronts/${storefrontId}/sections`);
    },
  },

  // Bookings
  bookings: {
    async create(bookingsArray) {
      return await apiFetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        body: JSON.stringify({ bookings: bookingsArray }),
      });
    },

    async getMyBookings() {
      return await apiFetch(`${API_BASE_URL}/bookings/my-bookings`);
    },

    async getAll() {
      return await apiFetch(`${API_BASE_URL}/bookings`);
    },

    async getById(bookingId) {
      return await apiFetch(`${API_BASE_URL}/bookings/${bookingId}`);
    },

    async updateStatus(bookingId, status) {
      return await apiFetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  // Customers (Shopify-style)
  customers: {
    async getCustomers(storeId, params = {}) {
      const queryParams = new URLSearchParams(params).toString();
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/customers?${queryParams}`);
    },

    async getCustomer(storeId, customerId) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/customers/${customerId}`);
    },

    async createCustomer(storeId, customerData) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/customers`, {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
    },

    async updateCustomer(storeId, customerId, customerData) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });
    },

    async deleteCustomer(storeId, customerId) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/customers/${customerId}`, {
        method: 'DELETE',
      });
    },

    async getCustomerStats(storeId) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/stats`);
    },
  },

  // Discounts
  discounts: {
    async getDiscounts(storeId) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/discounts`);
    },

    async getDiscount(storeId, discountId) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/discounts/${discountId}`);
    },

    async createDiscount(storeId, discountData) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/discounts`, {
        method: 'POST',
        body: JSON.stringify(discountData),
      });
    },

    async updateDiscount(storeId, discountId, discountData) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/discounts/${discountId}`, {
        method: 'PUT',
        body: JSON.stringify(discountData),
      });
    },

    async deleteDiscount(storeId, discountId) {
      return await apiFetch(`${API_BASE_URL}/stores/${storeId}/discounts/${discountId}`, {
        method: 'DELETE',
      });
    },

    async validateDiscount(code, orderTotal) {
      return await apiFetch(`${API_BASE_URL}/discounts/validate`, {
        method: 'POST',
        body: JSON.stringify({ code, orderTotal }),
      });
    },
  },

  // Reviews
  reviews: {
    async getReviews(productId) {
      return await apiFetch(`${API_BASE_URL}/products/${productId}/reviews`);
    },

    async createReview(reviewData) {
      return await apiFetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },

    async updateReview(reviewId, reviewData) {
      return await apiFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData),
      });
    },

    async deleteReview(reviewId) {
      return await apiFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
      });
    },
  },

  // Generic GET request
  async get(path, options = {}) {
    return await apiFetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      ...options,
    });
  },
};

export default api;

