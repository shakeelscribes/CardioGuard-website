// app/page.tsx - Landing Page
import Navbar from '@/components/layout/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';
import TechStack from '@/components/landing/TechStack';
import FAQ from '@/components/landing/FAQ';

import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background overflow-x-hidden">
      <Navbar />
      <LandingHero />
      <StatsSection />
      <FeaturesSection />
      <TechStack />
      <HowItWorks />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
