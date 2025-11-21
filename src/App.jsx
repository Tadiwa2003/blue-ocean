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
import { AnayaFindsStorefront } from './storefront/AnayaFindsStorefront.jsx';
import { UserStorefront } from './storefront/UserStorefront.jsx';
import { StorefrontLoading } from './storefront/StorefrontLoading.jsx';
import { CounterLoader } from './components/CounterLoader.jsx';
import { TwentyFirstToolbarWrapper } from './components/TwentyFirstToolbarWrapper.jsx';
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
  };

  return (
    <GradientBackground>
      <div className="relative min-h-screen text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
          <ShaderAnimation />
        </div>
        {/* 21st.dev Toolbar - AI-powered editing toolbar (development only) */}
        <TwentyFirstToolbarWrapper />
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
        ) : storefrontType === 'clothing' ? (
          // Platform Anaya Finds clothing storefront
          <AnayaFindsStorefront onClose={closeStorefront} />
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
