'use client';

import React from 'react';
import Link from 'next/link';
import styles from './WalmartPromoBannerGrid.module.css';

export function WalmartPromoBannerGrid() {
  return (
    <section className={styles.promoGridSection} aria-label="Featured Promotions Showcase">
      <div className={styles.gridContainer}>
        
        {/* CARD 1: Left Large Banner */}
        <div className={styles.cardLeftLarge}>
          <span className={styles.eyebrowLeft}>Heavy Industrial Steel &amp; Logistics</span>
          <h2 className={styles.titleLeft}>
            Save time with Fast On-Site Delivery*
          </h2>
          <Link href="/products" className={styles.capsuleCtaBtn}>
            Learn more
          </Link>
        </div>

        {/* MIDDLE COLUMN: Top Landscape Banner + Bottom 2 Split Cards */}
        <div className={styles.middleCol}>
          
          {/* CARD 2: Middle Top Wide Banner */}
          <div className={styles.cardMiddleTop}>
            <span className={styles.eyebrowTop}>Laser Cutting, Bending &amp; Welding</span>
            <h3 className={styles.titleTop}>
              Precision Steel Fabrication, All in 1 Place
            </h3>
            <Link href="/products" className={styles.underlineLinkGreen}>
              Shop now
            </Link>
            <p className={styles.subtextTop}>
              *SASO certified steel plates &amp; ISO 9001 precision tolerances across Saudi Arabia.
            </p>
          </div>

          {/* BOTTOM ROW: Split Cards 3 & 4 */}
          <div className={styles.bottomRow}>
            
            {/* CARD 3: Middle Bottom-Left Peach/Orange Card */}
            <div className={styles.cardPeach}>
              <h3 className={styles.titlePeach}>
                Heavy Duty Waste Skips &amp; Steel Storage
              </h3>
              <Link href="/products?category=Warehouse+%26+Logistics" className={styles.underlineLinkPeach}>
                Shop now
              </Link>
            </div>

            {/* CARD 4: Middle Bottom-Right White Card */}
            <div className={styles.cardWhite}>
              <h3 className={styles.titleWhite}>
                Saudi Fab Corporate Accounts get 5% Rebate on Bulk Orders
              </h3>
              <Link href="/signup" className={styles.underlineLinkBlue}>
                Learn more
              </Link>
            </div>

          </div>

        </div>

        {/* CARD 5: Right Tall Banner */}
        <div className={styles.cardRightLarge}>
          <span className={styles.eyebrowRight}>Power Tools &amp; Hydraulic Systems</span>
          <h2 className={styles.titleRight}>
            Industrial Equipment &amp; Safety Gear
          </h2>
          <Link href="/products?category=Precision+Tools" className={styles.underlineLinkRight}>
            Learn more
          </Link>
        </div>

      </div>
    </section>
  );
}
