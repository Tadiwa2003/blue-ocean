import { useEffect, useState } from 'react';
import { TwentyFirstToolbar } from '@21st-extension/toolbar-react';
import { ReactPlugin } from '@21st-extension/react';

export function TwentyFirstToolbarWrapper() {
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const checkExtension = () => {
      const available =
        typeof TwentyFirstToolbar !== 'undefined' && typeof ReactPlugin !== 'undefined';
      setIsExtensionAvailable(available);

      if (available) {
        console.log(
          '%c✅ 21st.dev Toolbar Available',
          'color: #4CAF50; font-weight: bold; font-size: 14px;',
        );
      } else {
        console.log(
          '%c⚠️ 21st.dev Extension Not Detected',
          'color: #FF9800; font-weight: bold; font-size: 14px;',
        );
        console.log('%cTo use the 21st.dev toolbar:', 'color: #2196F3; font-weight: bold;');
        console.log('1. Install the 21st.dev extension in Cursor (Cmd+Shift+X)');
        console.log('2. Enable the extension');
        console.log('3. Reload this page');
      }
    };

    checkExtension();
    const timeout = setTimeout(checkExtension, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isExtensionAvailable) {
    return null;
  }

  return (
    <>
      {/* Visual indicator for development debugging */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '60px',
          background: isConnected ? 'rgba(34, 197, 94, 0.9)' : 'rgba(251, 146, 60, 0.9)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 'bold',
          zIndex: 9999,
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: isConnected ? 'default' : 'pointer'
        }}
        onClick={() => {
          if (!isConnected) {
            console.log('%c🔄 Manually retrying 21st.dev connection...', 'color: #FF9800; font-weight: bold;');
            window.location.reload();
          }
        }}
        title={isConnected ? 'Connected to 21st.dev' : 'Click to retry connection'}
      >
        <span>21st.dev</span>
        <span>{isConnected ? '✅' : '🔄'}</span>
        <span>{isConnected ? 'Connected' : 'Retry'}</span>
      </div>
      <TwentyFirstToolbar
        config={{
          plugins: [ReactPlugin],
          autoConnect: true,
          reconnect: true,
          reconnectInterval: 2000,
          maxReconnectAttempts: 100,
          debug: true,
          connectionTimeout: 8000,
        }}
        onConnectionChange={(connected) => {
          setIsConnected(connected);
          console.log(`%c21st.dev Connection Status: ${connected ? '✅ Connected' : '❌ Disconnected'}`,
            connected ? 'color: #4CAF50; font-weight: bold;' : 'color: #F44336; font-weight: bold;');
        }}
        onError={(error) => {
          console.error('%c21st.dev Error:', 'color: #F44336; font-weight: bold;', error);
        }}
      />
    </>
  );
}