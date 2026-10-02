'use client';

import Navbar from '@/app/components/Navbar';
import HeroSection from '@/app/components/HeroSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import BookingSection from '@/app/components/BookingSection';
import ResourcesSection from '@/app/components/ResourcesSection';
import PeerSection from '@/app/components/PeerSection';
import AdminSection from '@/app/components/AdminSection';
import Footer from '@/app/components/Footer';
import ParallaxOrbs from '@/app/components/ParallaxOrbs';
import AISneakPeekCTA from '@/app/components/AISneakPeekCTA';

export default function Home() {
  return (
    <div className="relative">
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient( circle farthest-corner at 10% 20%,  rgba(83,113,245,0.6) 0%, rgba(107,228,184,0.4) 72.3% )"
        }}
      />
      <ParallaxOrbs />
      
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/* Removed AI chatbot from home; replaced with gated CTA */}
      <AISneakPeekCTA />
      <BookingSection />
      <ResourcesSection />
      <PeerSection />
      <AdminSection />
      <Footer />
    </div>
  );
}