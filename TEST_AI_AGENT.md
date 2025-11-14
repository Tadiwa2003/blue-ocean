# Testing the ElevenLabs AI Agent

## Quick Test (No API Key Required)

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **Look for the microphone button**:
   - Bottom-right corner of the page
   - Blue gradient circular button with microphone icon

3. **Click the microphone button**:
   - The agent interface should open
   - You should see "Using web interface" label
   - The ElevenLabs web interface loads in an iframe

4. **Test the iframe interface**:
   - The iframe should load the ElevenLabs TalkTo page
   - You can interact with the agent directly in the iframe
   - Microphone access will be requested by the iframe

## Full Test (With API Key)

1. **Add API key to `.env`**:
   ```
   VITE_ELEVENLABS_API_KEY=your_api_key_here
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Open browser console** (F12):
   - You should see connection logs
   - "Connecting to ElevenLabs agent..."
   - "Connected to ElevenLabs agent"

4. **Click microphone button**:
   - Interface opens
   - Status shows "Connected"
   - No iframe (using WebSocket)

5. **Click the microphone button in the interface**:
   - Browser will request microphone permission
   - Allow access
   - Button turns red and pulses when listening
   - Speak into your microphone

6. **Listen for response**:
   - Agent should respond with audio
   - You'll hear the AI voice response
   - Text responses may appear in the chat area

## Troubleshooting

### Iframe Not Loading
- Check browser console for errors
- Try opening the URL directly: `https://elevenlabs.io/app/talk-to?agent_id=agent_9701k9yhpb0meqnsw2gskcj0ncc3`
- Ensure you're not blocking iframes

### WebSocket Connection Fails
- Check API key is correct
- Verify agent ID is correct
- Check browser console for detailed error messages
- Component will automatically fallback to iframe mode

### Microphone Not Working
- Check browser permissions (Settings → Privacy → Microphone)
- Ensure you're on HTTPS or localhost
- Try refreshing the page
- Check browser console for permission errors

### No Audio Playback
- Check if audio is muted (volume icon)
- Ensure browser allows autoplay
- Try clicking the page first, then the agent
- Check browser console for audio errors

## Expected Behavior

✅ **Without API Key**:
- Iframe mode activates automatically
- Web interface loads successfully
- Can talk to agent through iframe

✅ **With API Key**:
- WebSocket connection established
- Real-time audio streaming
- Lower latency responses
- Better integration with your app

## Console Logs to Watch For

- `"No API key found, using iframe mode"` - Fallback working
- `"Connecting to ElevenLabs agent..."` - API connection starting
- `"Connected to ElevenLabs agent"` - Success!
- `"Requesting microphone access..."` - Microphone permission
- `"Started listening..."` - Recording active
- `"Received audio blob"` - Agent responding
- `"Audio loaded, playing..."` - Audio playback

## Success Indicators

- ✅ Microphone button visible
- ✅ Interface opens smoothly
- ✅ Connection status shows "Connected"
- ✅ Microphone button responds to clicks
- ✅ Audio plays when agent responds
- ✅ No error messages in console

