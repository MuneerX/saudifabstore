'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, Zap, ShieldCheck, Truck } from 'lucide-react';
import styles from './AmazonHero.module.css';
import { ShaderGradient } from './ShaderGradient';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    eyebrow: 'Get it in as fast as 1 hour*',
    title: 'Industrial & Steel Fabrication Essentials ASAP',
    sub: 'Certified ASTM A36 steel manufacturing, forklift attachments, self-dumping skips & SASO safety gear.',
    slideImage: '/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg',
    ctaText: 'Shop now',
    link: '/products',
  },
  {
    id: 'slide-2',
    eyebrow: 'Same-Day KSA Dispatch*',
    title: 'Precision Heavy Equipment & Surface Prep Solutions',
    sub: 'SA 2.5 abrasive sandblasting, epoxy coatings & ProTorc bolt torquing equipment in Dammam.',
    slideImage: '/uploads/1eecdedc-cd94-4183-ab5b-3010a00e0ef1.png',
    ctaText: 'Explore deals',
    link: '/products?sort=popular',
  },
  {
    id: 'slide-3',
    eyebrow: 'Bulk Wholesale Discounts*',
    title: 'Warehouse Storage & Heavy Duty Skip Containers',
    sub: 'Engineered for high load durability & heavy industrial site logistics in Saudi Arabia.',
    slideImage: '/uploads/49dc8447-7b24-4eaf-b051-7700b2145207.png',
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

          {/* Right Column: Featured Slide Image Showcase Card */}
          <div className={styles.rightPromoCol}>
            
            {/* Featured Product Image Showcase Card */}
            <div className={styles.slideImageShowcaseCard}>
              <Image 
                src={activeSlide.slideImage} 
                alt={activeSlide.title} 
                width={200} 
                height={160} 
                className={styles.slideProductImg}
              />
            </div>

            {/* Express Delivery Badge Pill - Commented out for later use */}
            {/*
            <div className={styles.expressDeliveryPill}>
              <div className={styles.lightningIconBadge}>
                <Zap size={18} fill="#0071dc" color="#0071dc" />
              </div>
              <div className={styles.expressTextGroup}>
                <span className={styles.expressTitle}>Express Delivery</span>
                <span className={styles.expressSub}>Direct to job site</span>
              </div>
            </div>
            */}

          </div>

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

/* Standalone 4-Card Category Grid Component */
export function AmazonCategoryGrid() {
  return (
    <div className={styles.gridOverlayContainer}>
      
      {/* CARD 1: 2x2 Subgrid */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Equipment for your facility | Up to 45% off</h3>
        <div className={styles.subGrid2x2}>
          <Link href="/products/prod-1" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/3ea54b4f-1709-49b3-be9c-1b4302dc01e9.jpg" alt="Forklift Hooks" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Forklift Hooks</span>
          </Link>

          <Link href="/products/prod-2" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/e8ee6716-6e69-452c-be8e-3144204da037.png" alt="Double Hoists" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Double Hoists</span>
          </Link>

          <Link href="/products/prod-3" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/24cb699e-8ef3-42ad-bad6-fd80de609556.png" alt="Work Platforms" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Work Platforms</span>
          </Link>

          <Link href="/products/prod-4" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/948c5187-5f11-4c45-9803-693baa5c22f2.png" alt="Telescopic Jibs" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Telescopic Jibs</span>
          </Link>
        </div>
        <Link href="/products?category=Forklift+Attachments" className={styles.cardFooterLink}>
          Shop all
        </Link>
      </div>

      {/* CARD 2: 2x2 Subgrid */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Deals on safety essentials | From SAR 89</h3>
        <div className={styles.subGrid2x2}>
          <Link href="/products/prod-7" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/images/home/category_grid/safety_3.jpeg" alt="Safety Bollards" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Safety Bollards</span>
          </Link>

          <Link href="/products/prod-14" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/49dc8447-7b24-4eaf-b051-7700b2145207.png" alt="Spill Pallets" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Spill Pallets</span>
          </Link>

          <Link href="/products/prod-11" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/058abd83-17f8-4fa1-950f-1681b2535ed3.png" alt="Eyewash Stations" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Eyewash Stations</span>
          </Link>

          <Link href="/products/prod-13" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/0789f391-5211-4cca-a005-68636b78f3aa.jpeg" alt="Stair Nosing" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Stair Nosing</span>
          </Link>
        </div>
        <Link href="/products?category=Safety+Equipment" className={styles.cardFooterLink}>
          Explore all
        </Link>
      </div>

      {/* CARD 3: Single Feature Card */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Up to 60% off | Self-Dumping Skips &amp; Hoppers</h3>
        <div className={styles.singleHeroCardContent}>
          <div className={styles.singleImgFrame}>
            <Image src="/uploads/1eecdedc-cd94-4183-ab5b-3010a00e0ef1.png" alt="Self Dumping Skip" width={220} height={180} className={styles.singleImg} />
          </div>
          <p className={styles.singleDescText}>Automatic self-dumping steel waste skip hopper for forklift material handling.</p>
        </div>
        <Link href="/products/prod-8" className={styles.cardFooterLink}>
          Shop now
        </Link>
      </div>

      {/* CARD 4: B2B Saudi Fab Business 2x2 */}
      <div className={styles.walmartGridCard}>
        <h3 className={styles.cardHeaderTitle}>Bulk order discounts + 10% Guaranteed cashback</h3>
        <div className={styles.subGrid2x2}>
          <Link href="/products/prod-6" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/b3030289-577c-47e1-aadc-3b49d74266c4.png" alt="Steel Pallets" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Steel Pallets</span>
          </Link>

          <Link href="/products/prod-9" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/9e04c6cb-0f40-4191-b51d-ac83348863e4.png" alt="Workshop Trolleys" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Workshop Trolleys</span>
          </Link>

          <Link href="/products/prod-12" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/uploads/ebf4945d-a426-4772-bd50-f897ed90ac8b.png" alt="Rig Clamps" width={110} height={100} className={styles.subImg} />
            </div>
            <span className={styles.subItemLabel}>Industrial Supplies</span>
          </Link>

          <Link href="/signup" className={styles.subGridItem}>
            <div className={styles.subImgBox}>
              <Image src="/images/logo.png" alt="Saudi Fab Business" width={110} height={100} className={styles.subImg} style={{ objectFit: 'contain' }} />
            </div>
            <span className={styles.subItemLabel}>Register B2B Account</span>
          </Link>
        </div>
        <Link href="/signup" className={styles.cardFooterLink}>
          Create a free account
        </Link>
      </div>

    </div>
  );
}


