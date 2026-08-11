'use client';

import { useState } from 'react';

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { StudioBanner } from "@/components/StudioBanner";
import { FeaturedGridTwo } from "@/components/FeaturedGridTwo";
import { AboutSection } from "@/components/AboutSection";
import { QualityCareSection } from "@/components/QualityCareSection";
import { MedicalSupportSection } from "@/components/MedicalSupportSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { DailyWellnessSection } from "@/components/DailyWellnessSection";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import Footer from "@/components/Footer";
import IntroVideo from "@/components/IntroVideo";

// Preload component for homepage content
function PreloadHomepage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="animate-slide-up animate-delay-200">
          <Hero />
        </div>
        <div className="animate-fade-blur animate-delay-250">
          <CategoryGrid />
        </div>
        <div className="animate-fade-blur animate-delay-280">
          <StudioBanner />
        </div>
        <div className="animate-fade-blur animate-delay-290">
          <FeaturedGridTwo />
        </div>
        <div className="animate-slide-stagger animate-delay-300">
          <DailyWellnessSection />
        </div>
        <div className="animate-fade-blur animate-delay-400">
          <AboutSection />
        </div>
        <div className="animate-fade-blur animate-delay-450">
          <QualityCareSection />
        </div>
        <div className="animate-fade-blur animate-delay-480">
          <MedicalSupportSection />
        </div>
        <div className="animate-fade-blur animate-delay-490">
          <HowItWorksSection />
        </div>
        <div className="animate-slide-stagger animate-delay-800">
          <Testimonials />
        </div>
        <div className="animate-fade-blur">
          <FaqSection />
        </div>
      </main>
      <div style={{ position: 'relative' }} className="animate-slide-up animate-delay-500">
        <Footer />
      </div>
    </div>
  );
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleIntroAlmostComplete = () => {
    // Homepage content starts loading immediately when video starts
  };

  if (showIntro) {
    return (
      <>
        <IntroVideo
          onComplete={handleIntroComplete}
          onAlmostComplete={handleIntroAlmostComplete}
        />
        {/* Homepage content loads in background while video plays */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <PreloadHomepage />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="animate-slide-up animate-delay-200">
          <Hero />
        </div>
        <div className="animate-fade-blur animate-delay-250">
          <CategoryGrid />
        </div>
        <div className="animate-fade-blur animate-delay-280">
          <StudioBanner />
        </div>
        <div className="animate-fade-blur animate-delay-290">
          <FeaturedGridTwo />
        </div>
        <div className="animate-slide-stagger animate-delay-300">
          <DailyWellnessSection />
        </div>
        <div className="animate-fade-blur animate-delay-400">
          <AboutSection />
        </div>
        <div className="animate-fade-blur animate-delay-450">
          <QualityCareSection />
        </div>
        <div className="animate-fade-blur animate-delay-480">
          <MedicalSupportSection />
        </div>
        <div className="animate-fade-blur animate-delay-490">
          <HowItWorksSection />
        </div>
        <div className="animate-slide-stagger animate-delay-800">
          <Testimonials />
        </div>
        <div className="animate-fade-blur">
          <FaqSection />
        </div>
      </main>
      <div style={{ position: 'relative' }} className="animate-slide-up animate-delay-500">
        <Footer />
      </div>
    </div>
  );
}