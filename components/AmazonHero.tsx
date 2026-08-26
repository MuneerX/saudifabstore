'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, Zap, ShieldCheck, Truck } from 'lucide-react';
import styles from './AmazonHero.module.css';
import { ShaderGradient } from './ShaderGradient';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    eyebrow: 'Get it in as fast as 1 hour*',
    title: 'Industrial & Steel Fabrication Essentials ASAP',
    sub: 'Certified ASTM A36 steel manufacturing, forklift attachments, self-dumping skips & SASO safety gear.',
    slideImage: '/images/home/category_grid/industrial8.jpeg',
    objectPosition: 'center 82%',
    ctaText: 'Shop now',
    link: '/products',
  },
  {
    id: 'slide-2',
    eyebrow: 'Same-Day KSA Dispatch*',
    title: 'Precision Heavy Equipment & Surface Prep Solutions',
    sub: 'SA 2.5 abrasive sandblasting, epoxy coatings & ProTorc bolt torquing equipment in Dammam.',
    slideImage: '/images/home/category_grid/precision8.jpeg',
    objectPosition: 'center 80%',
    ctaText: 'Explore deals',
    link: '/products?sort=popular',
  },
  {
    id: 'slide-3',
    eyebrow: 'Bulk Wholesale Discounts*',
    title: 'Warehouse Storage & Heavy Duty Skip Containers',
    sub: 'Engineered for high load durability & heavy industrial site logistics in Saudi Arabia.',
    slideImage: '/images/home/category_grid/logistics8.jpeg',
    objectPosition: 'center 82%',
    ctaText: 'View catalog',
    link: '/products?category=Warehouse+%26+Logistics',
  },
];

interface AmazonHeroProps {
  children?: React.ReactNode;
}

export function AmazonHero({ children }: AmazonHeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className={styles.heroOuterWrapper}>
      
      {/* Full Width Edge-to-Edge 3D ShaderGradient Background Frame with Bottom Fade */}
      <div className={styles.bannerFrame}>
        <ShaderGradient />
        <div className={styles.bannerGradientOverlay} />
      </div>

      <div className={styles.walmartHeroContainer}>
        
        {/* Walmart Light Sky-Blue Banner Slider */}
        <div className={styles.skyBlueHeroBanner}>
          <Image
            src={activeSlide.slideImage}
            alt={activeSlide.title}
            fill
            priority
            sizes="1200px"
            className={styles.bannerBgImg}
            style={{ objectPosition: activeSlide.objectPosition || 'center 100%' }}
          />
          <div className={styles.bannerBgOverlay} />
        
          {/* Top Right Control Buttons: < || > */}
          <div className={styles.topRightControls}>
          <button 
            type="button" 
            onClick={prevSlide} 
            className={styles.controlCircleBtn}
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>

          <button 
            type="button" 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={styles.controlCircleBtn}
            aria-label={isPlaying ? "Pause slider" : "Play slider"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button 
            type="button" 
            onClick={nextSlide} 
            className={styles.controlCircleBtn}
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className={styles.bannerGridContent}>
          
          {/* Left Column: Eyebrow, Large Bold Title, Subtext, Shop Now Button */}
          <div className={styles.leftTextCol}>
            <span className={styles.eyebrowText}>{activeSlide.eyebrow}</span>
            <h1 className={styles.walmartMainTitle}>{activeSlide.title}</h1>
            <p className={styles.walmartSubTitle}>{activeSlide.sub}</p>

            <Link href={activeSlide.link} className={styles.shopNowPillBtn}>
              {activeSlide.ctaText}
            </Link>
          </div>

          {/* Right Column: Featured Slide Image Showcase Card (Hidden to show full background image) */}

        </div>

      </div>

      {/* Render Nested Children (e.g., Recently Viewed Product Row) */}
      {children && (
        <div className={styles.heroChildrenWrapper}>
          {children}
        </div>
      )}

    </div>
  </div>
  );
}

/* Standalone 4-Category Department Grid Component (All In One Place) */
export function AmazonCategoryGrid() {
  // Dynamically filter 4 items for each core store category
  const forkliftCategory = INITIAL_PRODUCTS.filter(
    (p) => p.category === 'Forklift Attachments' || p.name.includes('Forklift') || p.name.includes('Jib') || p.name.includes('Manbasket')
  ).slice(0, 4);

  const warehouseCategory = INITIAL_PRODUCTS.filter(
    (p) => p.category === 'Warehouse & Logistics' || p.name.includes('Skip') || p.name.includes('Pallet') || p.name.includes('Container')
  ).slice(0, 4);

  const steelCategory = INITIAL_PRODUCTS.filter(
    (p) => p.category === 'Structural Steel' || p.name.includes('Steel') || p.name.includes('Beam') || p.name.includes('Plate')
  ).slice(0, 4);

  const safetyCategory = INITIAL_PRODUCTS.filter(
    (p) => p.category === 'Safety Equipment' || p.category === 'Safety & Chemical' || p.name.includes('Safety') || p.name.includes('Spill') || p.name.includes('Helmet')
  ).slice(0, 4);

  return (
    <div className={styles.gridOverlayContainer}>
      
      {/* CARD 1: Forklift Attachments */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Forklift Attachments</h3>
        <div className={styles.subGrid2x2}>
          {forkliftCategory.map((item) => (
            <Link key={item._id} href={`/products/${item._id}`} className={styles.subGridItem}>
              <div className={styles.subImgBoxProduct}>
                <Image src={item.images[0]} alt={item.name} fill sizes="160px" className={styles.productContainImg} />
              </div>
              <span className={styles.subItemTextName}>{item.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/products?category=Forklift+Attachments" className={styles.cardFooterLink}>
          Shop Forklift Attachments &rarr;
        </Link>
      </div>

      {/* CARD 2: Warehouse & Logistics */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Warehouse &amp; Logistics</h3>
        <div className={styles.subGrid2x2}>
          {warehouseCategory.map((item) => (
            <Link key={item._id} href={`/products/${item._id}`} className={styles.subGridItem}>
              <div className={styles.subImgBoxProduct}>
                <Image src={item.images[0]} alt={item.name} fill sizes="160px" className={styles.productContainImg} />
              </div>
              <span className={styles.subItemTextName}>{item.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/products?category=Warehouse+%26+Logistics" className={styles.cardFooterLink}>
          Shop Warehouse Equipment &rarr;
        </Link>
      </div>

      {/* CARD 3: Structural Steel & Metals */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Structural Steel &amp; Metals</h3>
        <div className={styles.subGrid2x2}>
          {steelCategory.map((item) => (
            <Link key={item._id} href={`/products/${item._id}`} className={styles.subGridItem}>
              <div className={styles.subImgBoxProduct}>
                <Image src={item.images[0]} alt={item.name} fill sizes="160px" className={styles.productContainImg} />
              </div>
              <span className={styles.subItemTextName}>{item.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/products?category=Structural+Steel" className={styles.cardFooterLink}>
          Shop Structural Steel &rarr;
        </Link>
      </div>

      {/* CARD 4: SASO Safety & PPE */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Safety &amp; PPE Equipment</h3>
        <div className={styles.subGrid2x2}>
          {safetyCategory.map((item) => (
            <Link key={item._id} href={`/products/${item._id}`} className={styles.subGridItem}>
              <div className={styles.subImgBoxProduct}>
                <Image src={item.images[0]} alt={item.name} fill sizes="160px" className={styles.productContainImg} />
              </div>
              <span className={styles.subItemTextName}>{item.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/products?category=Safety+Equipment" className={styles.cardFooterLink}>
          Shop Safety Equipment &rarr;
        </Link>
      </div>

    </div>
  );
}


