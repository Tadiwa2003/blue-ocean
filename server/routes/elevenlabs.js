import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env explicitly
dotenv.config({ path: join(__dirname, '../../.env') });

const router = express.Router();

// Get ElevenLabs API key from server-side environment (not exposed to client)
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY || '';

// Initialize conversation with ElevenLabs API
router.post('/conversation', async (req, res) => {
  try {
    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured');
      return res.status(500).json({
        success: false,
        message: 'ElevenLabs API key not configured on server',
      });
    }

    const { agent_id } = req.body;

    if (!agent_id) {
      return res.status(400).json({
        success: false,
        message: 'agent_id is required',
      });
    }

    console.log(`Initializing ElevenLabs conversation for agent: ${agent_id}`);

    const response = await fetch('https://api.elevenlabs.io/v1/convai/conversation', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs API error response:', errorData);
      const errorMessage = errorData.detail?.message || errorData.message || `HTTP ${response.status}: Failed to initialize conversation`;

      return res.status(response.status).json({
        success: false,
        message: errorMessage,
      });
    }

    const data = await response.json();
    console.log('ElevenLabs conversation initialized successfully');

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize ElevenLabs conversation',
    });
  }
});

export default router;
