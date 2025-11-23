import { useRef, useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Hero } from './sections/Hero.jsx';
import { Intro } from './sections/Intro.jsx';
import { FeatureTiles } from './sections/FeatureTiles.jsx';
import { ValueJourney } from './sections/ValueJourney.jsx';
import { Offerings } from './sections/Offerings.jsx';
import { Testimonials } from './sections/Testimonials.jsx';
import { CallToAction } from './sections/CallToAction.jsx';
import { DashboardLayout } from './dashboard/DashboardLayout.jsx';
import { SignInModal } from './components/SignInModal.jsx';
import { ContactModal } from './components/ContactModal.jsx';
import { SubscriptionRequiredModal } from './components/SubscriptionRequiredModal.jsx';
import { Storefront } from './storefront/Storefront.jsx';
import { BeautySpaStorefront } from './storefront/BeautySpaStorefront.jsx';
import { UserStorefront } from './storefront/UserStorefront.jsx';
import { StorefrontLoading } from './storefront/StorefrontLoading.jsx';
import { CounterLoader } from './components/CounterLoader.jsx';
import { TwentyFirstToolbar } from '@21st-extension/toolbar-react';
import { ReactPlugin } from '@21st-extension/react';
import { GradientBackground } from './components/ui/dark-gradient-background.jsx';
import { ShaderAnimation } from './components/ShaderAnimation.jsx';
import { ContainerScrollAnimation } from './components/ui/ScrollTriggerAnimations.jsx';
import { downloadRitualMenu } from './utils/generateRitualMenu.js';
import api from './services/api.js';
import { ElevenLabsAgent } from './components/ElevenLabsAgent.jsx';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('signin'); // 'signin' or 'signup'
  const [isViewingStorefront, setIsViewingStorefront] = useState(false);
  const [storefrontType, setStorefrontType] = useState('products'); // 'products' or 'spa'
  const [currentStorefront, setCurrentStorefront] = useState(null); // Custom storefront data
  const [isStorefrontLoading, setIsStorefrontLoading] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const storefrontTimeoutRef = useRef(null);

  const checkSubscriptionStatus = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setSubscriptionRequired(false);
        return;
      }

      const response = await api.subscriptions.getCurrent();
      if (response.success) {
        const subData = response.data;
        if (!subData.subscription) {
          // No subscription or expired
          setSubscriptionRequired(true);
          setTrialExpired(subData.trialExpired || false);
          setSubscription(null);
        } else {
          // Check if trial has expired
          const sub = subData.subscription;
          if (sub.isTrial && sub.trialEndDate) {
            const trialEnd = new Date(sub.trialEndDate);
            const now = new Date();
            if (trialEnd < now) {
              setSubscriptionRequired(true);
              setTrialExpired(true);
              setSubscription(null);
            } else {
              setSubscription(sub);
              setSubscriptionRequired(false);
              setTrialExpired(false);
            }
          } else {
            setSubscription(sub);
            setSubscriptionRequired(false);
            setTrialExpired(false);
          }
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      // On error, don't block access (graceful degradation)
    }
  };

  const handleSignInSuccess = async (userData) => {
    // userData is passed from SignInModal after successful authentication
    if (userData) {
      setCurrentUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } else {
      // Fallback for backward compatibility
      setCurrentUser({
        name: 'Kim Moyo',
        email: 'founder@blueocean.co',
        role: 'owner',
      });
    }
    setIsModalOpen(false);
    setIsDashboardLoading(true);

    // Check subscription status after sign in
    await checkSubscriptionStatus();
  };

  const handleCounterLoaderComplete = () => {
    setIsDashboardLoading(false);
    setIsAuthenticated(true);
  };

  const handleSignOut = async () => {
    try {
      await api.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      // Continue with sign out even if API call fails
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setSubscriptionRequired(false);
      setSubscription(null);
      setTrialExpired(false);
      closeStorefront();
      // Clear all auth-related data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  };

  const handleSubscribeSuccess = async (newSubscription) => {
    setSubscription(newSubscription);
    setSubscriptionRequired(false);
    setTrialExpired(false);
    // Refresh subscription status
    await checkSubscriptionStatus();
  };

  // Check for storefront URL parameter and load storefront
  useEffect(() => {
    const loadStorefrontFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const storefrontSlug = urlParams.get('storefront');

      if (storefrontSlug) {
        try {
          setIsStorefrontLoading(true);
          // Fetch storefront by slug using api service
          const response = await api.storefronts.getStorefrontBySlug(storefrontSlug);

          if (response.success && response.data.storefront) {
            const storefront = response.data.storefront;
            console.log('Loaded storefront from URL:', storefront);
            openStorefront(storefront.type, storefront);
          } else {
            console.error('Storefront not found:', storefrontSlug);
            setIsStorefrontLoading(false);
          }
        } catch (error) {
          console.error('Error loading storefront from URL:', error);
          setIsStorefrontLoading(false);
        }
      }
    };

    loadStorefrontFromURL();
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const user = await api.auth.getCurrentUser();
          if (user) {
            setCurrentUser({
              name: user.name,
              email: user.email,
              role: user.role,
            });
            setIsAuthenticated(true);
            await checkSubscriptionStatus();
          } else {
            // Invalid token, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    };

    checkAuthStatus();
  }, []);

  // Check subscription status periodically and on mount
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      checkSubscriptionStatus();

      // Check every 5 minutes
      const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, currentUser]);

  // Verify 21st.dev extension is loaded (single check on mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Single connection status log on mount
      const logConnectionStatus = () => {
        const status = {
          toolbarAvailable: typeof TwentyFirstToolbar !== 'undefined',
          reactPluginAvailable: typeof ReactPlugin !== 'undefined',
          port: window.location.port || '5178',
          host: window.location.hostname,
          protocol: window.location.protocol,
          url: window.location.href,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        };

        console.log('%c✅ 21st.dev Extension Status', 'color: #4CAF50; font-weight: bold; font-size: 14px;', status);
      };

      // Log status once on mount
      logConnectionStatus();

      // Single toolbar detection check (no polling)
      const detectToolbar = () => {
        const selectors = [
          '[data-21st-toolbar]',
          '[data-21st]',
          '[class*="21st"]',
          '[id*="21st"]',
        ];

        for (const selector of selectors) {
          try {
            const element = document.querySelector(selector);
            if (element && (element.offsetParent !== null || element.style.display !== 'none')) {
              console.log(`%c✅ 21st.dev Toolbar Found: ${selector}`, 'color: #4CAF50; font-weight: bold;');
              return true;
            }
          } catch (e) {
            // Ignore selector errors
          }
        }
        return false;
      };

      // Check once after a short delay to allow toolbar to mount
      const timeoutId = setTimeout(() => {
        detectToolbar();
      }, 3000);

      // Cleanup timeout on unmount
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const openStorefront = (type = 'products', storefrontData = null) => {
    setStorefrontType(type);
    setCurrentStorefront(storefrontData); // Set custom storefront data if provided
    setIsViewingStorefront(true);
    setIsStorefrontLoading(true);
    if (storefrontTimeoutRef.current) {
      clearTimeout(storefrontTimeoutRef.current);
    }
    storefrontTimeoutRef.current = setTimeout(() => {
      setIsStorefrontLoading(false);
      storefrontTimeoutRef.current = null;
    }, 1200);
  };

  const closeStorefront = () => {
    setIsViewingStorefront(false);
    setCurrentStorefront(null); // Clear storefront data when closing
    setIsStorefrontLoading(false);
    if (storefrontTimeoutRef.current) {
      clearTimeout(storefrontTimeoutRef.current);
      storefrontTimeoutRef.current = null;
    }
    // Clear URL parameter
    const url = new URL(window.location);
    url.searchParams.delete('storefront');
    window.history.pushState({}, '', url);
  };

  return (
    <GradientBackground>
      <div className="relative min-h-screen text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
          <ShaderAnimation />
        </div>
        {/* 21st.dev Toolbar - Requires Cursor/VSCode extension to be installed and active */}
        {typeof window !== 'undefined' && (
          <TwentyFirstToolbar
            config={{
              plugins: [ReactPlugin],
              // Connection settings - enable auto-connect
              autoConnect: true,
              // Development mode settings
              devMode: process.env.NODE_ENV === 'development',
              // Connection retry settings
              reconnect: true,
              reconnectInterval: 3000,
              maxReconnectAttempts: 10,
              // Enable debugging in development
              debug: process.env.NODE_ENV === 'development',
              // Connection timeout
              connectionTimeout: 10000,
              // Server configuration
              server: {
                port: 5178,
                host: 'localhost',
              },
            }}
            key="21st-toolbar" // Stable key for consistent rendering
          />
        )}
        <SignInModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalMode('signin'); // Reset to sign-in mode when closing
          }}
          onSuccess={handleSignInSuccess}
          initialMode={modalMode}
        />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          onSuccess={(data) => {
            console.log('Contact form submitted:', data);
            setIsContactModalOpen(false);
          }}
        />
        {isDashboardLoading ? (
          <CounterLoader onComplete={handleCounterLoaderComplete} duration={2000} />
        ) : isViewingStorefront ? (
          isStorefrontLoading ? (
            <StorefrontLoading />
          ) : currentStorefront ? (
            // User's custom storefront - use dedicated component
            <UserStorefront onClose={closeStorefront} customStorefront={currentStorefront} />
          ) : storefrontType === 'spa' ? (
            // Platform spa storefront
            <BeautySpaStorefront onClose={closeStorefront} />
          ) : (
            // Platform products storefront
            <Storefront onClose={closeStorefront} />
          )
        ) : isAuthenticated ? (
          <>
            <SubscriptionRequiredModal
              isOpen={subscriptionRequired && currentUser?.role !== 'owner'}
              trialExpired={trialExpired}
              onSubscribeSuccess={handleSubscribeSuccess}
            />
            {(!subscriptionRequired || currentUser?.role === 'owner') && (
              <DashboardLayout
                currentUser={currentUser}
                onSignOut={handleSignOut}
                onViewStorefront={openStorefront}
                onViewSpaStorefront={() => openStorefront('spa')}
              />
            )}
          </>
        ) : (
          <ContainerScrollAnimation>
            <Header
              onSignInClick={() => {
                setModalMode('signin');
                setIsModalOpen(true);
              }}
              onSignUpClick={() => {
                setModalMode('signup');
                setIsModalOpen(true);
              }}
              onViewStorefront={() => openStorefront('products')}
              onViewSpaStorefront={() => openStorefront('spa')}
            />
            <main className="flex flex-col gap-20 pb-24">
              <Hero />
              <FeatureTiles />
              <Intro />
              <ValueJourney />
              <Offerings
                onBookStrategyCall={() => setIsContactModalOpen(true)}
                onViewSpaStorefront={() => openStorefront('spa')}
                onDownloadMenu={() => {
                  downloadRitualMenu(() => {
                    // Optional: Show success notification
                    console.log('Ritual menu downloaded successfully');
                  });
                }}
              />
              <Testimonials />
              <CallToAction
                onGetStarted={() => {
                  setModalMode('signup');
                  setIsModalOpen(true);
                }}
                onTalkToTeam={() => setIsContactModalOpen(true)}
              />
            </main>
            <Footer />
          </ContainerScrollAnimation>
        )}
        <ElevenLabsAgent />
      </div>
    </GradientBackground>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}
