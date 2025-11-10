import { useRef, useState } from 'react';
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
import { Storefront } from './storefront/Storefront.jsx';
import { BeautySpaStorefront } from './storefront/BeautySpaStorefront.jsx';
import { StorefrontLoading } from './storefront/StorefrontLoading.jsx';
import { CounterLoader } from './components/CounterLoader.jsx';
import { TwentyFirstToolbar } from '@21st-extension/toolbar-react';
import { ReactPlugin } from '@21st-extension/react';
import { GradientBackground } from './components/ui/dark-gradient-background.jsx';
import { ShaderAnimation } from './components/ShaderAnimation.jsx';
import { ContainerScrollAnimation } from './components/ui/ScrollTriggerAnimations.jsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('signin'); // 'signin' or 'signup'
  const [isViewingStorefront, setIsViewingStorefront] = useState(false);
  const [storefrontType, setStorefrontType] = useState('products'); // 'products' or 'spa'
  const [isStorefrontLoading, setIsStorefrontLoading] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const storefrontTimeoutRef = useRef(null);

  const handleSignInSuccess = (userData) => {
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
  };

  const handleCounterLoaderComplete = () => {
    setIsDashboardLoading(false);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    closeStorefront();
  };

  const openStorefront = (type = 'products') => {
    setStorefrontType(type);
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
        <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
      <SignInModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalMode('signin'); // Reset to sign-in mode when closing
        }}
        onSuccess={handleSignInSuccess}
        initialMode={modalMode}
      />
      {isDashboardLoading ? (
        <CounterLoader onComplete={handleCounterLoaderComplete} duration={2000} />
      ) : isViewingStorefront ? (
        isStorefrontLoading ? (
          <StorefrontLoading />
        ) : storefrontType === 'spa' ? (
          <BeautySpaStorefront onClose={closeStorefront} />
        ) : (
          <Storefront onClose={closeStorefront} />
        )
      ) : isAuthenticated ? (
        <DashboardLayout
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onViewStorefront={openStorefront}
          onViewSpaStorefront={() => openStorefront('spa')}
        />
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
            <Offerings />
            <Testimonials />
            <CallToAction />
          </main>
          <Footer />
        </ContainerScrollAnimation>
      )}
    </div>
    </GradientBackground>
  );
}
