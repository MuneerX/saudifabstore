'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CustomEngineeringBanner.module.css';

export function CustomEngineeringBanner() {
  return (
    <section className={styles.bannerSectionWrapper}>
      <div className={styles.showcaseBannerCard}>
        <Image
          src="/images/custombanner.jpeg"
          alt="Custom Engineering & Steel Fabrication"
          fill
          sizes="100vw"
          className={styles.bgImage}
          priority
        />
        <div className={styles.bannerContent}>
          <div>
            <h2 className={styles.bannerMainTitle}>
              Custom Engineering, Certified Blueprints &amp; Industrial Steel Fabrication
            </h2>
            <Link href="/contact" className={styles.shopNowWhiteBtn}>
              Request a quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
