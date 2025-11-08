import { useRef, useState } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Hero } from './sections/Hero.jsx';
import { Intro } from './sections/Intro.jsx';
import { About } from './sections/About.jsx';
import { Offerings } from './sections/Offerings.jsx';
import { Impact } from './sections/Impact.jsx';
import { Founder } from './sections/Founder.jsx';
import { Features } from './sections/Features.jsx';
import { Testimonials } from './sections/Testimonials.jsx';
import { Wholesale } from './sections/Wholesale.jsx';
import { CallToAction } from './sections/CallToAction.jsx';
import { DashboardLayout } from './dashboard/DashboardLayout.jsx';
import { SignInModal } from './components/SignInModal.jsx';
import { Storefront } from './storefront/Storefront.jsx';
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
  const [isStorefrontLoading, setIsStorefrontLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const storefrontTimeoutRef = useRef(null);

  const handleSignInSuccess = () => {
    setCurrentUser({
      name: 'Kim Moyo',
      email: 'founder@blueocean.co',
      role: 'owner',
    });
    setIsModalOpen(false);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    closeStorefront();
  };

  const openStorefront = () => {
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
        isStorefrontLoading ? <StorefrontLoading /> : <Storefront onClose={closeStorefront} />
      ) : isAuthenticated ? (
        <DashboardLayout currentUser={currentUser} onSignOut={handleSignOut} onViewStorefront={openStorefront} />
      ) : (
        <>
          <Header onSignInClick={() => setIsModalOpen(true)} onViewStorefront={openStorefront} />
          <main className="flex flex-col gap-20 pb-24">
            <Hero />
            <Intro />
            <About />
            <Offerings />
            <Impact />
            <Features />
            <Founder />
            <Testimonials />
            <Wholesale />
            <CallToAction />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
