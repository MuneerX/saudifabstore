'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './WalmartPromoBannerGrid.module.css';

export function WalmartPromoBannerGrid() {
  return (
    <section className={styles.promoGridSection} aria-label="Featured Promotions Showcase">
      <div className={styles.gridContainer}>
        
        {/* CARD 1: Left Large Banner */}
        <div className={styles.cardLeftLarge}>
          <Image
            src="/images/home/category_grid/custom2.jpeg"
            alt="Custom Steel Fabrication & Precision Manufacturing"
            fill
            sizes="(max-width: 1024px) 100vw, 35vw"
            className={styles.bgImage}
            priority
          />
          <div className={styles.overlayLeft} />
          <div className={styles.cardContent}>
            <span className={styles.eyebrowLeft}>Tailored Metalwork &amp; Engineering</span>
            <h2 className={styles.titleLeft}>
              Custom Steel Fabrication &amp; Precision Manufacturing
            </h2>
            <Link href="/contact" className={styles.capsuleCtaBtn}>
              Request Quote
            </Link>
          </div>
        </div>

        {/* MIDDLE COLUMN: Top Landscape Banner + Bottom 2 Split Cards */}
        <div className={styles.middleCol}>
          
          {/* CARD 2: Middle Top Wide Banner */}
          <div className={styles.cardMiddleTop}>
            <Image
              src="/images/home/category_grid/grp2.jpeg"
              alt="GRP Non-Slip Stair Nosing & Anti-Corrosion Grating"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className={styles.bgImage}
            />
            <div className={styles.overlayTop} />
            <div className={styles.cardContent}>
              <span className={styles.eyebrowTop}>Composite Flooring &amp; Tread Systems</span>
              <h3 className={styles.titleTop}>
                GRP Non-Slip Stair Nosing &amp; Grating
              </h3>
              <Link href="/products?category=Safety+Equipment" className={styles.underlineLinkGreen}>
                Shop now
              </Link>
              <p className={styles.subtextTop}>
                *BS 7976-2 extremely low slip rating for wet and oily industrial environments.
              </p>
            </div>
          </div>

          {/* BOTTOM ROW: Split Cards 3 & 4 */}
          <div className={styles.bottomRow}>
            
            {/* CARD 3: Middle Bottom-Left Peach/Orange Card */}
            <div className={styles.cardPeach}>
              <Image
                src="/images/home/category_grid/spill.jpeg"
                alt="Secondary Oil Spill Containment Sump Pallets"
                fill
                sizes="(max-width: 640px) 100vw, 20vw"
                className={styles.bgImage}
              />
              <div className={styles.overlayPeach} />
              <div className={styles.cardContent}>
                <h3 className={styles.titlePeach}>
                  Secondary Oil Spill Containment Sump Pallets
                </h3>
                <Link href="/products?category=Safety+%26+Chemical" className={styles.underlineLinkPeach}>
                  Explore sumps
                </Link>
              </div>
            </div>

            {/* CARD 4: Middle Bottom-Right White/B2B Card */}
            <div className={styles.cardWhite}>
              <Image
                src="/images/home/category_grid/b2b.jpeg"
                alt="Saudi Fab Business B2B Wholesale Rates"
                fill
                sizes="(max-width: 640px) 100vw, 20vw"
                className={styles.bgImage}
              />
              <div className={styles.overlayWhite} />
              <div className={styles.cardContent}>
                <h3 className={styles.titleWhite}>
                  Saudi Fab B2B: Direct Factory &amp; Wholesale Rates
                </h3>
                <Link href="/signup" className={styles.capsuleBtnBlue}>
                  Register now
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* CARD 5: Right Large Banner */}
        <div className={styles.cardRightLarge}>
          <Image
            src="/images/home/category_grid/jib3.jpeg"
            alt="High-Reach Boom Jibs & Heavy Cantilever Supports"
            fill
            sizes="(max-width: 1024px) 100vw, 30vw"
            className={styles.bgImage}
          />
          <div className={styles.overlayRight} />
          <div className={styles.cardContent}>
            <span className={styles.eyebrowRight}>Mobile Boom &amp; Masonry Support</span>
            <h2 className={styles.titleRight}>
              High-Reach Boom Jibs &amp; Heavy Cantilever Supports
            </h2>
            <Link href="/products?category=Forklift+Attachments" className={styles.underlineLinkRight}>
              View catalog
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

