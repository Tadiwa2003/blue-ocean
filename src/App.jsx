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

function BackgroundTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,160,230,0.18),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(4,11,24,0.95),_rgba(4,11,24,1))]" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }}
      />
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewingStorefront, setIsViewingStorefront] = useState(false);
  const [storefrontType, setStorefrontType] = useState('products'); // 'products' or 'spa'
  const [isStorefrontLoading, setIsStorefrontLoading] = useState(false);
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
    <div className="relative min-h-screen bg-midnight text-white">
      <BackgroundTexture />
      <SignInModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSignInSuccess}
      />
      {isViewingStorefront ? (
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
        <>
          <Header
            onSignInClick={() => setIsModalOpen(true)}
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
        </>
      )}
    </div>
  );
}
