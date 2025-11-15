# 🎤 Marketplace AI Assistant Setup Guide

## ✅ Current Status

The **ElevenLabs AI Assistant** is already integrated into your marketplace! It appears as a floating microphone button in the bottom-right corner of your application.

---

## 🚀 Quick Setup

### Step 1: Get ElevenLabs API Key

1. **Sign up/Login** at [ElevenLabs](https://elevenlabs.io)
2. **Navigate to**: Profile Settings → API Keys
3. **Create a new API key** and copy it

### Step 2: Configure API Key

Create or update the server's `.env` file:

```bash
# Navigate to server directory
cd server

# Create .env file if it doesn't exist
touch .env

# Add your API key
echo "ELEVENLABS_API_KEY=your_api_key_here" >> .env
```

Or manually edit `server/.env`:
```env
ELEVENLABS_API_KEY=your_actual_api_key_here
```

### Step 3: Start the Backend Server

The AI assistant requires the backend server to be running:

```bash
# Option 1: Start server only
npm run dev:server

# Option 2: Start both frontend and backend
npm run dev:all

# Option 3: Use the start script
npm start
```

The server should run on port **3001** (or the port specified in your `.env`).

### Step 4: Verify Frontend is Running

```bash
# Start frontend dev server
npm run dev
```

Frontend should run on port **5178**.

### Step 5: Test the AI Assistant

1. **Open Browser**: Navigate to `http://localhost:5178`
2. **Look for Microphone Button**: Bottom-right corner
3. **Click the Button**: Opens the AI assistant interface
4. **Click Microphone**: Start talking to the AI

---

## ✅ What's Already Configured

### ✅ Code Integration
- **Component**: `src/components/ElevenLabsAgent.jsx` ✅
- **Imported in**: `src/App.jsx` ✅
- **Agent ID**: `agent_9701k9yhpb0meqnsw2gskcj0ncc3` ✅

### ✅ Backend Routes
- **Route**: `/api/elevenlabs/conversation` ✅
- **File**: `server/routes/elevenlabs.js` ✅
- **Registered in**: `server/index.js` ✅

### ✅ Features
- ✅ Voice conversation
- ✅ Real-time audio streaming
- ✅ Microphone access
- ✅ Audio playback
- ✅ Fallback to web interface if API key not configured
- ✅ Error handling

---

## 🔧 Configuration Details

### Environment Variables

**Server-side** (`server/.env`):
```env
ELEVENLABS_API_KEY=your_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:5178
```

**Note**: The API key is handled server-side for security. It's never exposed to the client.

### API Endpoints

- **POST** `/api/elevenlabs/conversation`
  - Initializes a conversation with the ElevenLabs agent
  - Requires: `agent_id` in request body
  - Returns: WebSocket URL for real-time communication

### Agent Configuration

- **Agent ID**: `agent_9701k9yhpb0meqnsw2gskcj0ncc3`
- **Location**: Defined in `src/components/ElevenLabsAgent.jsx`

---

## 🎯 How It Works

1. **User clicks microphone button** → Opens AI assistant interface
2. **Component connects** → Makes POST request to `/api/elevenlabs/conversation`
3. **Server authenticates** → Uses API key to initialize conversation with ElevenLabs
4. **WebSocket connection** → Establishes real-time audio streaming
5. **User speaks** → Audio is streamed to ElevenLabs
6. **AI responds** → Audio response is played back

---

## 🐛 Troubleshooting

### Issue 1: "API key not configured" Error

**Symptoms**: Error message shows "API key not configured on server"

**Solution**:
1. Check if `server/.env` file exists
2. Verify `ELEVENLABS_API_KEY` is set in the file
3. Restart the backend server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev:server
   ```

### Issue 2: Assistant Falls Back to Web Interface

**Symptoms**: Shows iframe with ElevenLabs web interface instead of native integration

**Solution**:
- This is a fallback when API key is not configured
- Configure the API key (see Step 2 above)
- Restart the server

### Issue 3: Microphone Not Working

**Symptoms**: Can't access microphone or recording doesn't start

**Solution**:
1. **Check Browser Permissions**:
   - Click the lock icon in browser address bar
   - Ensure microphone permission is allowed
   - Refresh the page

2. **Use HTTPS or localhost**:
   - Microphone access requires secure context
   - `localhost` is considered secure
   - If using a different domain, use HTTPS

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for permission errors
   - Check for WebSocket connection errors

### Issue 4: Connection Errors

**Symptoms**: "Failed to connect to agent" or WebSocket errors

**Solution**:
1. **Verify Server is Running**:
   ```bash
   # Check if server is running
   lsof -i :3001
   
   # If not, start it
   npm run dev:server
   ```

2. **Check API Key**:
   - Verify API key is valid
   - Check if API key has expired
   - Ensure API key has proper permissions

3. **Check Network**:
   - Verify internet connection
   - Check if ElevenLabs API is accessible
   - Look for firewall issues

### Issue 5: Audio Not Playing

**Symptoms**: AI responds but no audio playback

**Solution**:
1. **Check Browser Audio Settings**:
   - Ensure browser volume is not muted
   - Check system volume
   - Try clicking on the page first (autoplay policy)

2. **Check Mute Button**:
   - Look for mute/unmute button in the interface
   - Click to unmute if muted

3. **Browser Console**:
   - Check for audio playback errors
   - Look for autoplay policy warnings

---

## 📊 Verification Checklist

- [ ] ElevenLabs API key obtained
- [ ] `server/.env` file created with `ELEVENLABS_API_KEY`
- [ ] Backend server running (`npm run dev:server`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Browser open to `http://localhost:5178`
- [ ] Microphone button visible (bottom-right)
- [ ] Microphone permissions granted
- [ ] AI assistant interface opens when clicked
- [ ] Connection successful (shows "Connected")
- [ ] Can start recording (microphone button works)
- [ ] Audio playback works

---

## 🎨 UI Features

### Floating Action Button
- **Location**: Bottom-right corner
- **Icon**: Microphone
- **Action**: Opens AI assistant interface

### AI Assistant Interface
- **Status Indicator**: Shows "Connected" or "Connecting..."
- **Mute/Unmute**: Toggle audio playback
- **Close Button**: Closes the interface
- **Microphone Button**: Start/stop recording
- **Transcript Display**: Shows what you said
- **Response Display**: Shows AI responses

---

## 🔒 Security Notes

- ✅ API key is stored server-side only
- ✅ Never exposed to client
- ✅ All API calls go through backend proxy
- ✅ WebSocket connection uses secure URLs
- ✅ Microphone access requires user permission

---

## 📚 Additional Resources

- **ElevenLabs Documentation**: https://elevenlabs.io/docs
- **ElevenLabs API Reference**: https://elevenlabs.io/docs/api-reference
- **Setup Guide**: `ELEVENLABS_SETUP.md`

---

## ✨ Summary

**The AI assistant is already integrated!** You just need to:

1. ✅ Get an ElevenLabs API key
2. ✅ Add it to `server/.env`
3. ✅ Start the backend server
4. ✅ Start the frontend server
5. ✅ Click the microphone button and start talking!

---

**Last Updated**: Based on current codebase
**Status**: ✅ Code integrated, requires API key configuration

