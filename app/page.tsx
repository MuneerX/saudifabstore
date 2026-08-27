'use client';

import React from 'react';

import { Navbar } from "@/components/Navbar";
import { AmazonHero, AmazonCategoryGrid } from "@/components/AmazonHero";
import { AmazonProductRow } from "@/components/AmazonProductRow";
import { WalmartDualShowcaseSection } from "@/components/WalmartDualShowcaseSection";
import { WalmartHeroGridSection } from "@/components/WalmartHeroGridSection";
import { CustomEngineeringBanner } from "@/components/CustomEngineeringBanner";
import { AboutTermsFooterSection } from "@/components/AboutTermsFooterSection";
import Footer from "@/components/Footer";
import { INITIAL_PRODUCTS } from "@/lib/data/initialProducts";
import { useProducts } from "@/lib/hooks/useProducts";
import { getHomePageRows } from "@/lib/utils/badgeHelper";

export default function Home() {
  const { products: liveProducts } = useProducts(true);
  const rawProducts = liveProducts && liveProducts.length > 0 ? liveProducts : INITIAL_PRODUCTS;

  const { newArrivals, popularBestsellers, trendingDeals } = getHomePageRows(rawProducts);

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      {/* Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner Slider + Recently Viewed Row Sharing Full-Width Background */}
        <AmazonHero>
          <WalmartHeroGridSection />
          <AmazonProductRow 
            title="New Arrivals & Latest Products" 
            linkText="See all"
            linkHref="/products?sort=newest"
            products={newArrivals}
          />
        </AmazonHero>

        {/* Main Content Container */}
        <div style={{ maxWidth: '1520px', margin: '0 auto', padding: '0 16px' }}>
          
          {/* 4-Card Category Grid */}
          <div style={{ margin: '8px 0 24px 0' }}>
            <AmazonCategoryGrid />
          </div>

          {/* Bestsellers Product Row */}
          <AmazonProductRow 
            title="Popular Bestsellers in Industrial Fabrication" 
            linkText="Explore Bestsellers"
            linkHref="/products?sort=popular"
            products={popularBestsellers}
          />

          {/* New 2x2 Dual Showcase Section */}
          <WalmartDualShowcaseSection />

          {/* Recently Dispatched & Trending Items Row */}
          <AmazonProductRow 
            title="Recently Dispatched & Trending Items" 
            linkText="See all"
            linkHref="/products"
            products={trendingDeals}
          />

          {/* Custom Engineering & Request a Quote Banner */}
          <CustomEngineeringBanner />
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