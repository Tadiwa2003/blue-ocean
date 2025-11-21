// AI Service Configuration
// Handles all AI-related API calls (OpenAI GPT-4, DALL-E, etc.)

import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1';

/**
 * Generate text using OpenAI GPT-4
 * @param {string} prompt - The prompt to send to GPT-4
 * @param {object} options - Additional options (temperature, max_tokens, etc.)
 * @returns {Promise<string>} Generated text
 */
export async function generateText(prompt, options = {}) {
    if (!OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured. Using fallback responses.');
        return getFallbackResponse(prompt);
    }

    try {
        const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: options.model || 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: options.systemPrompt || 'You are a helpful assistant for an e-commerce platform called BrightPath.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 500,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating text:', error);
        return getFallbackResponse(prompt);
    }
}

/**
 * Generate an image using DALL-E 3
 * @param {string} prompt - The image description
 * @param {object} options - Additional options (size, quality, etc.)
 * @returns {Promise<string>} Image URL
 */
export async function generateImage(prompt, options = {}) {
    if (!OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured. Using placeholder image.');
        return getPlaceholderImage(prompt);
    }

    try {
        const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: options.size || '1024x1024',
                quality: options.quality || 'standard',
            }),
        });

        if (!response.ok) {
            throw new Error(`DALL-E API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data[0].url;
    } catch (error) {
        console.error('Error generating image:', error);
        return getPlaceholderImage(prompt);
    }
}

/**
 * Generate storefront copy (About Us, tagline, etc.)
 * @param {object} storeInfo - Store information (name, niche, audience, vibe)
 * @returns {Promise<object>} Generated copy
 */
export async function generateStorefrontCopy(storeInfo) {
    const { name, niche, audience, vibe } = storeInfo;

    const prompt = `
Create compelling e-commerce copy for a store with these details:
- Store Name: ${name}
- Niche: ${niche}
- Target Audience: ${audience}
- Brand Vibe: ${vibe}

Generate the following in JSON format:
1. tagline: A catchy 5-8 word tagline
2. aboutUs: A compelling 100-150 word "About Us" section
3. metaDescription: An SEO-optimized meta description (150-160 characters)
4. heroTitle: A bold hero section title (5-10 words)
5. heroSubtitle: A supporting subtitle (10-15 words)

Return only valid JSON, no additional text.
`;

    try {
        const response = await generateText(prompt, {
            systemPrompt: 'You are an expert e-commerce copywriter. Always return valid JSON.',
            temperature: 0.8,
            maxTokens: 800,
        });

        // Try to parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback if JSON parsing fails
        return getFallbackCopy(storeInfo);
    } catch (error) {
        console.error('Error generating storefront copy:', error);
        return getFallbackCopy(storeInfo);
    }
}

/**
 * Generate a color palette based on vibe
 * @param {string} vibe - The brand vibe (minimalist, bold, elegant, etc.)
 * @param {string} niche - The store niche
 * @returns {Promise<object>} Color palette
 */
export async function generateColorPalette(vibe, niche) {
    const prompt = `
Generate a professional color palette for a ${vibe} ${niche} e-commerce store.

Return a JSON object with these hex color codes:
- primary: Main brand color
- secondary: Supporting color
- accent: Accent/CTA color
- background: Background color
- text: Primary text color

Consider color psychology and modern design trends.
Return only valid JSON, no additional text.
`;

    try {
        const response = await generateText(prompt, {
            systemPrompt: 'You are a professional brand designer. Always return valid JSON with hex color codes.',
            temperature: 0.7,
            maxTokens: 300,
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return getVibeColorPalette(vibe);
    } catch (error) {
        console.error('Error generating color palette:', error);
        return getVibeColorPalette(vibe);
    }
}

/**
 * Analyze a product image and generate details
 * @param {string} imageUrl - URL of the product image
 * @returns {Promise<object>} Product details
 */
export async function analyzeProductImage(imageUrl) {
    if (!OPENAI_API_KEY) {
        return getFallbackProductAnalysis();
    }

    const prompt = `
Analyze this product image and generate:
1. title: A clear, descriptive product title
2. description: A compelling 50-100 word product description
3. category: The product category
4. suggestedPrice: A reasonable price range (e.g., "$50-$75")
5. tags: 3-5 relevant tags

Return only valid JSON, no additional text.
`;

    try {
        const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            { type: 'image_url', image_url: { url: imageUrl } },
                        ],
                    },
                ],
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI Vision API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return getFallbackProductAnalysis();
    } catch (error) {
        console.error('Error analyzing product image:', error);
        return getFallbackProductAnalysis();
    }
}

// ============================================================================
// FALLBACK FUNCTIONS (Used when AI API is not available)
// ============================================================================

function getFallbackResponse(prompt) {
    return 'AI service is currently unavailable. Please configure your OpenAI API key.';
}

function getPlaceholderImage(prompt) {
    // Return a placeholder image URL
    const seed = encodeURIComponent(prompt);
    return `https://source.unsplash.com/1024x1024/?${seed}`;
}

function getFallbackCopy(storeInfo) {
    const { name, niche, audience } = storeInfo;

    return {
        tagline: `Premium ${niche} for ${audience}`,
        aboutUs: `Welcome to ${name}! We are passionate about bringing you the finest ${niche} products. Our carefully curated selection is designed with ${audience} in mind, ensuring quality, style, and value in every purchase. We believe in excellence and are committed to providing an exceptional shopping experience.`,
        metaDescription: `Shop premium ${niche} at ${name}. Curated collection for ${audience}. Quality products, exceptional service.`,
        heroTitle: `Discover Premium ${niche}`,
        heroSubtitle: `Curated collection designed for ${audience}`,
    };
}

function getVibeColorPalette(vibe) {
    const palettes = {
        minimalist: {
            primary: '#000000',
            secondary: '#FFFFFF',
            accent: '#808080',
            background: '#F5F5F5',
            text: '#1A1A1A',
        },
        bold: {
            primary: '#FF4500',
            secondary: '#1E90FF',
            accent: '#FFD700',
            background: '#FFFFFF',
            text: '#000000',
        },
        elegant: {
            primary: '#2C1810',
            secondary: '#D4AF37',
            accent: '#8B7355',
            background: '#F5F5DC',
            text: '#2C1810',
        },
        playful: {
            primary: '#FF6B9D',
            secondary: '#4ECDC4',
            accent: '#FFE66D',
            background: '#FFFFFF',
            text: '#2C3E50',
        },
        professional: {
            primary: '#1E3A8A',
            secondary: '#3B82F6',
            accent: '#10B981',
            background: '#F9FAFB',
            text: '#111827',
        },
        luxury: {
            primary: '#1A1A1A',
            secondary: '#D4AF37',
            accent: '#8B4513',
            background: '#0A0A0A',
            text: '#FFFFFF',
        },
    };

    return palettes[vibe.toLowerCase()] || palettes.professional;
}

function getFallbackProductAnalysis() {
    return {
        title: 'Product Title',
        description: 'A high-quality product that meets your needs. Features premium materials and excellent craftsmanship.',
        category: 'General',
        suggestedPrice: '$50-$100',
        tags: ['quality', 'premium', 'new'],
    };
}

export default {
    generateText,
    generateImage,
    generateStorefrontCopy,
    generateColorPalette,
    analyzeProductImage,
};
