// AI API Client
// Frontend utility for calling AI-powered features

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
}

/**
 * Generate storefront copy using AI
 * @param {object} storeInfo - Store information (name, niche, audience, vibe)
 * @returns {Promise<object>} Generated copy
 */
export async function generateStorefrontCopy(storeInfo) {
    return apiRequest('/ai/generate-copy', {
        method: 'POST',
        body: JSON.stringify(storeInfo),
    });
}

/**
 * Generate color palette using AI
 * @param {string} vibe - Brand vibe
 * @param {string} niche - Store niche
 * @returns {Promise<object>} Color palette
 */
export async function generateColorPalette(vibe, niche) {
    return apiRequest('/ai/generate-palette', {
        method: 'POST',
        body: JSON.stringify({ vibe, niche }),
    });
}

/**
 * Generate brand image (logo or hero banner)
 * @param {string} prompt - Image description
 * @param {string} type - Image type ('logo' or 'hero')
 * @returns {Promise<object>} Image URL
 */
export async function generateBrandImage(prompt, type = 'hero') {
    return apiRequest('/ai/generate-brand-image', {
        method: 'POST',
        body: JSON.stringify({ prompt, type }),
    });
}

/**
 * Analyze product image and generate details
 * @param {string} imageUrl - Product image URL
 * @returns {Promise<object>} Product details
 */
export async function analyzeProductImage(imageUrl) {
    return apiRequest('/ai/analyze-product', {
        method: 'POST',
        body: JSON.stringify({ imageUrl }),
    });
}

/**
 * Send chat message to AI assistant
 * @param {string} message - User message
 * @param {object} context - Conversation context
 * @returns {Promise<object>} AI response
 */
export async function sendChatMessage(message, context = {}) {
    return apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
    });
}

/**
 * Complete AI-powered onboarding
 * @param {object} onboardingData - Onboarding information
 * @returns {Promise<object>} Storefront configuration
 */
export async function completeAIOnboarding(onboardingData) {
    return apiRequest('/ai/onboarding', {
        method: 'POST',
        body: JSON.stringify(onboardingData),
    });
}

export default {
    generateStorefrontCopy,
    generateColorPalette,
    generateBrandImage,
    analyzeProductImage,
    sendChatMessage,
    completeAIOnboarding,
};
