import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ELEVENLABS_AGENT_ID = 'agent_9701k9yhpb0meqnsw2gskcj0ncc3';
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

export function ElevenLabsAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [useIframe, setUseIframe] = useState(false);

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioElementRef = useRef(null);
  const lastObjectUrlRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectToAgent();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      // Revoke any remaining object URLs
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    };
  }, [isOpen]);

  const connectToAgent = async () => {
    try {
      if (!ELEVENLABS_API_KEY) {
        // If no API key, use iframe mode as fallback
        console.log('No API key found, using iframe mode');
        setUseIframe(true);
        setIsConnected(true);
        setError(null);
        return;
      }

      console.log('Connecting to ElevenLabs agent...');
      
      // Initialize conversation with ElevenLabs API
      const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: ELEVENLABS_AGENT_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail?.message || errorData.message || `HTTP ${response.status}: Failed to initialize conversation`;
        console.error('API Error:', errorMessage);
        
        // If API fails, fallback to iframe
        if (response.status === 401 || response.status === 403) {
          setError('API key invalid. Using web interface instead.');
          setUseIframe(true);
          setIsConnected(true);
          return;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Conversation initialized:', data);
      
      // Get WebSocket URL - ElevenLabs provides this in the response
      const conversationId = data.conversation_id || data.id || data.conversationId;
      let wsUrl = data.websocket_url || data.websocketUrl;
      
      if (!wsUrl && conversationId) {
        wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation/${conversationId}/audio?agent_id=${ELEVENLABS_AGENT_ID}`;
      }

      if (!wsUrl) {
        console.error('No WebSocket URL found in response:', data);
        // Fallback to iframe
        setError('WebSocket URL not available. Using web interface instead.');
        setUseIframe(true);
        setIsConnected(true);
        return;
      }

      // Connect to WebSocket - add API key if not already in URL
      const finalWsUrl = wsUrl.includes('xi-api-key') 
        ? wsUrl 
        : `${wsUrl}${wsUrl.includes('?') ? '&' : '?'}xi-api-key=${ELEVENLABS_API_KEY}`;
      
      console.log('Connecting to WebSocket:', finalWsUrl.replace(ELEVENLABS_API_KEY, '***'));
      const ws = new WebSocket(finalWsUrl);

      ws.onopen = () => {
        console.log('Connected to ElevenLabs agent');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            // Audio response from agent
            console.log('Received audio blob');
            const audioBlob = event.data;
            playAudio(audioBlob);
          } else if (typeof event.data === 'string') {
            // Text response or metadata
            try {
              const data = JSON.parse(event.data);
              console.log('Received message:', data);
              
              if (data.type === 'audio' && data.audio) {
                // Base64 audio data
                const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
                if (audioBlob) {
                  playAudio(audioBlob);
                }
              } else if (data.type === 'conversation_initiation') {
                setAgentResponse('Agent is ready. Start speaking!');
              } else if (data.type === 'response_audio' || data.type === 'audio') {
                // Handle audio response
                if (data.audio) {
                  const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
                  if (audioBlob) {
                    playAudio(audioBlob);
                  }
                }
              } else if (data.text || data.message) {
                setAgentResponse(data.text || data.message);
              } else if (data.transcript) {
                setTranscript(data.transcript);
              }
            } catch (e) {
              // Not JSON, might be plain text
              console.log('Received text:', event.data);
              if (event.data.length > 0 && !event.data.startsWith('{')) {
                setAgentResponse(event.data);
              }
            }
          }
        } catch (err) {
          console.error('Error processing message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again.');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsListening(false);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Error connecting to agent:', err);
      setError(err.message || 'Failed to connect to agent. Please check your API key.');
      setIsConnected(false);
    }
  };

  const playAudio = (audioBlob) => {
    if (isMuted) {
      console.log('Audio muted, skipping playback');
      return;
    }

    try {
      // Revoke previous object URL if it exists
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      lastObjectUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      
      audio.onloadeddata = () => {
        console.log('Audio loaded, playing...');
      };
      
      audio.onerror = (err) => {
        console.error('Audio playback error:', err);
        if (lastObjectUrlRef.current === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          lastObjectUrlRef.current = null;
        }
      };
      
      audio.onended = () => {
        if (lastObjectUrlRef.current === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          lastObjectUrlRef.current = null;
        }
        console.log('Audio playback finished');
      };

      // Play audio
      audio.play().catch((err) => {
        console.error('Error playing audio:', err);
        if (lastObjectUrlRef.current === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          lastObjectUrlRef.current = null;
        }
        // If autoplay is blocked, show a message
        if (err.name === 'NotAllowedError') {
          setError('Please interact with the page first to enable audio playback.');
        }
      });

      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
      }
    } catch (err) {
      console.error('Error creating audio:', err);
      // Revoke URL on error
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    // Guard for falsy/non-string input
    if (!base64 || typeof base64 !== 'string') {
      console.error('base64ToBlob: Invalid input - expected non-empty string');
      return null;
    }

    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (err) {
      console.error('base64ToBlob: Error decoding base64 string:', err);
      return null;
    }
  };

  const startListening = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Microphone access not available in this browser. Please use a modern browser.');
        return;
      }

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setError('Not connected to agent. Please wait for connection.');
        return;
      }

      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      // Try different audio formats
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          // Send audio data to WebSocket
          try {
            wsRef.current.send(event.data);
            console.log('Sent audio chunk:', event.data.size, 'bytes');
          } catch (err) {
            console.error('Error sending audio:', err);
          }
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Error recording audio. Please try again.');
        stopListening();
      };

      // Start recording with small chunks for real-time streaming
      mediaRecorder.start(250); // Send chunks every 250ms for better real-time performance
      mediaRecorderRef.current = mediaRecorder;
      setIsListening(true);
      setError(null);
      console.log('Started listening...');
    } catch (err) {
      console.error('Error starting microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError(`Microphone error: ${err.message}. Please try again.`);
      }
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
    setIsListening(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleClose = () => {
    stopListening();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsOpen(false);
    setTranscript('');
    setAgentResponse('');
    setError(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg hover:shadow-xl transition-all"
        aria-label="Open AI Agent"
      >
        <Mic className="h-6 w-6 text-white" />
      </motion.button>

      {/* Agent Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-white/10 bg-gradient-to-br from-ocean/95 to-midnight/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/60">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {useIframe ? (
                <div className="relative h-96 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                  <iframe
                    src={`https://elevenlabs.io/app/talk-to?agent_id=${ELEVENLABS_AGENT_ID}`}
                    className="w-full h-full"
                    title="ElevenLabs AI Agent"
                    allow="microphone; camera; autoplay"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  />
                  <div className="absolute top-2 left-2 text-xs text-white/60 bg-black/40 px-2 py-1 rounded z-10">
                    Using web interface
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                      <p className="text-sm text-red-200">{error}</p>
                      {!ELEVENLABS_API_KEY && (
                        <button
                          onClick={() => {
                            setUseIframe(true);
                            setError(null);
                          }}
                          className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                        >
                          Use web interface instead
                        </button>
                      )}
                    </div>
                  )}

                  {agentResponse && (
                    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm text-white/90">{agentResponse}</p>
                    </div>
                  )}

                  {!isConnected && !error && (
                    <div className="text-center py-8">
                      <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-brand-400 border-t-transparent mb-4"></div>
                      <p className="text-sm text-white/60">Connecting to AI agent...</p>
                    </div>
                  )}

                  {isConnected && !isListening && !error && (
                    <div className="text-center py-4">
                      <p className="text-sm text-white/70 mb-4">Click the microphone to start talking</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {!useIframe && (
              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!isConnected || !!error}
                    className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-brand-500 hover:bg-brand-600'
                    } ${!isConnected || error ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  >
                    {isListening ? (
                      <MicOff className="h-6 w-6 text-white" />
                    ) : (
                      <Mic className="h-6 w-6 text-white" />
                    )}
                  </button>
                </div>
                {transcript && (
                  <p className="mt-3 text-center text-xs text-white/60">You: {transcript}</p>
                )}
              </div>
            )}

            <audio ref={audioElementRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

