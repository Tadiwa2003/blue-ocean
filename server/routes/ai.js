// AI Routes - Handles all AI-powered features
import express from 'express';
import aiService from '../services/aiService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/ai/generate-copy
 * Generate storefront copy (tagline, about us, etc.)
 */
router.post('/generate-copy', authenticateToken, async (req, res) => {
    try {
        const { name, niche, audience, vibe } = req.body;

        if (!name || !niche) {
            return res.status(400).json({
                success: false,
                message: 'Store name and niche are required',
            });
        }

        const copy = await aiService.generateStorefrontCopy({
            name,
            niche,
            audience: audience || 'everyone',
            vibe: vibe || 'professional',
        });

        res.json({
            success: true,
            data: { copy },
        });
    } catch (error) {
        console.error('Error generating copy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate copy',
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/generate-palette
 * Generate a color palette based on vibe and niche
 */
router.post('/generate-palette', authenticateToken, async (req, res) => {
    try {
        const { vibe, niche } = req.body;

        if (!vibe || !niche) {
            return res.status(400).json({
                success: false,
                message: 'Vibe and niche are required',
            });
        }

        const palette = await aiService.generateColorPalette(vibe, niche);

        res.json({
            success: true,
            data: { palette },
        });
    } catch (error) {
        console.error('Error generating palette:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate color palette',
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/generate-brand-image
 * Generate a brand image (logo or hero banner)
 */
router.post('/generate-brand-image', authenticateToken, async (req, res) => {
    try {
        const { prompt, type } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Image prompt is required',
            });
        }

        const imageUrl = await aiService.generateImage(prompt, {
            size: type === 'logo' ? '1024x1024' : '1792x1024',
            quality: 'standard',
        });

        res.json({
            success: true,
            data: { imageUrl },
        });
    } catch (error) {
        console.error('Error generating brand image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate brand image',
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/analyze-product
 * Analyze a product image and generate details
 */
router.post('/analyze-product', authenticateToken, async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required',
            });
        }

        const productDetails = await aiService.analyzeProductImage(imageUrl);

        res.json({
            success: true,
            data: { product: productDetails },
        });
    } catch (error) {
        console.error('Error analyzing product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze product image',
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/chat
 * General AI chat endpoint for conversational onboarding
 */
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required',
            });
        }

        const systemPrompt = `You are a helpful assistant for BrightPath, an AI-powered storefront builder. 
You help users create their online stores by asking questions about their business.
Be friendly, concise, and professional. Ask one question at a time.
Context: ${JSON.stringify(context || {})}`;

        const response = await aiService.generateText(message, {
            systemPrompt,
            temperature: 0.7,
            maxTokens: 300,
        });

        res.json({
            success: true,
            data: { response },
        });
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat message',
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/onboarding
 * Complete AI-powered onboarding - creates storefront from conversation
 */
router.post('/onboarding', authenticateToken, async (req, res) => {
    try {
        const { name, niche, audience, vibe, products } = req.body;

        if (!name || !niche) {
            return res.status(400).json({
                success: false,
                message: 'Store name and niche are required',
            });
        }

        // Generate all AI content in parallel
        const [copy, palette] = await Promise.all([
            aiService.generateStorefrontCopy({ name, niche, audience, vibe }),
            aiService.generateColorPalette(vibe, niche),
        ]);

        // Prepare storefront configuration
        const storefrontConfig = {
            name,
            type: 'products',
            design: {
                colors: {
                    primary: palette.primary,
                    secondary: palette.secondary,
                    accent: palette.accent,
                },
                hero: {
                    title: copy.heroTitle,
                    subtitle: copy.heroSubtitle,
                    backgroundColor: palette.background,
                },
                branding: {
                    storeName: name,
                    tagline: copy.tagline,
                },
                layout: {
                    style: vibe,
                },
            },
            seo: {
                title: `${name} - ${copy.tagline}`,
                description: copy.metaDescription,
            },
            settings: {
                aboutUs: copy.aboutUs,
                niche,
                targetAudience: audience,
                vibe,
            },
        };

        res.json({
            success: true,
            data: {
                storefrontConfig,
                copy,
                palette,
            },
            message: 'AI onboarding completed successfully',
        });
    } catch (error) {
        console.error('Error in AI onboarding:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete AI onboarding',
            error: error.message,
        });
    }
});

export default router;
