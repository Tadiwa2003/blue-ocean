# ElevenLabs Agent Integration Setup

This app includes an ElevenLabs AI voice agent that provides conversational AI assistance.

## Quick Start

1. **Get Your ElevenLabs API Key**:
   - Sign up or log in at [ElevenLabs](https://elevenlabs.io)
   - Navigate to your profile settings → API Keys
   - Create a new API key and copy it

2. **Configure the API Key**:
   - Create a `.env` file in the project root (if it doesn't exist)
   - Add your API key:
     ```
     VITE_ELEVENLABS_API_KEY=your_api_key_here
     ```

3. **Restart the Development Server**:
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` again to load the new environment variable

## Using the Agent

- **Floating Button**: A microphone button appears in the bottom-right corner
- **Click to Open**: Opens the voice chat interface
- **Start Talking**: Click the microphone button to start/stop recording
- **Mute/Unmute**: Toggle audio playback with the volume icon

## Agent ID

The agent ID is configured as: `agent_9701k9yhpb0meqnsw2gskcj0ncc3`

## Fallback Mode

If no API key is configured, clicking the agent button will open the ElevenLabs web interface in a new tab as a fallback.

## Troubleshooting

### "API key not configured" error
- Make sure you've created a `.env` file in the project root
- Ensure the variable is named `VITE_ELEVENLABS_API_KEY`
- Restart your dev server after adding the key

### Microphone not working
- Check browser permissions for microphone access
- Ensure you're using HTTPS or localhost (required for microphone access)
- Try refreshing the page and allowing permissions when prompted

### Connection errors
- Verify your API key is valid and has not expired
- Check your internet connection
- Ensure the agent ID is correct

## API Documentation

For more details, see the [ElevenLabs API Documentation](https://elevenlabs.io/docs/api-reference/)

