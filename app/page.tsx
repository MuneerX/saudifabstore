'use client';

import { useState } from 'react';

import { Navbar } from "@/components/Navbar";
import { AmazonHero, AmazonCategoryGrid } from "@/components/AmazonHero";
import { AmazonProductRow } from "@/components/AmazonProductRow";
import { WalmartPromoBannerGrid } from "@/components/WalmartPromoBannerGrid";
import { WalmartDualShowcaseSection } from "@/components/WalmartDualShowcaseSection";
import { WalmartHeroGridSection } from "@/components/WalmartHeroGridSection";
import { AboutTermsFooterSection } from "@/components/AboutTermsFooterSection";
import Footer from "@/components/Footer";
import IntroVideo from "@/components/IntroVideo";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";

// Preload component for homepage content
function PreloadHomepage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      <Navbar />
      <main className="flex-1">
        <AmazonHero>
          <WalmartHeroGridSection />
          <AmazonProductRow 
            title="Discover Industrial Fabrication Essentials" 
            linkText="See all"
            linkHref="/products"
            products={INITIAL_PRODUCTS.slice(0, 8)}
          />
        </AmazonHero>
        <div style={{ maxWidth: '1520px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ margin: '24px 0' }}>
            <AmazonCategoryGrid />
          </div>
          <WalmartPromoBannerGrid />
          <AmazonProductRow 
            title="Bestsellers in Industrial Fabrication" 
            linkText="Explore Bestsellers"
            linkHref="/products?badge=BESTSELLER"
            products={INITIAL_PRODUCTS.slice(4, 12)}
          />
          <WalmartDualShowcaseSection />
          <AmazonProductRow 
            title="Recently Viewed Items" 
            linkText="See all"
            linkHref="/products"
            products={INITIAL_PRODUCTS.slice(2, 10)}
          />
        </div>
        <AboutTermsFooterSection />
      </main>
      <Footer />
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
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <PreloadHomepage />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      {/* Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner Slider + Recently Viewed Row Sharing Full-Width Background */}
        <AmazonHero>
          <WalmartHeroGridSection />
          <AmazonProductRow 
            title="Discover Industrial Fabrication Essentials" 
            linkText="See all"
            linkHref="/products"
            products={INITIAL_PRODUCTS.slice(0, 8)}
          />
        </AmazonHero>

        {/* Main Content Container */}
        <div style={{ maxWidth: '1520px', margin: '0 auto', padding: '0 16px' }}>
          
          {/* 4-Card Category Grid */}
          <div style={{ margin: '24px 0' }}>
            <AmazonCategoryGrid />
          </div>

          {/* 5-Card Walmart Promo Banner Showcase Section */}
          <WalmartPromoBannerGrid />

          {/* Bestsellers Product Row */}
          <AmazonProductRow 
            title="Bestsellers in Industrial Fabrication" 
            linkText="Explore Bestsellers"
            linkHref="/products?badge=BESTSELLER"
            products={INITIAL_PRODUCTS.slice(4, 12)}
          />

          {/* New 2x2 Dual Showcase Section */}
          <WalmartDualShowcaseSection />

          {/* Recently Viewed Product Row */}
          <AmazonProductRow 
            title="Recently Viewed Items" 
            linkText="See all"
            linkHref="/products"
            products={INITIAL_PRODUCTS.slice(2, 10)}
          />
        </div>

        {/* Bottom About & Terms Section */}
        <AboutTermsFooterSection />
      </main>

      <div style={{ position: 'relative' }}>
        <Footer />
      </div>
    </div>
  );
}