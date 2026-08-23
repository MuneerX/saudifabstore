'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Award, Factory, Clock } from 'lucide-react';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.heroViewport}>
      {/* Background Media Container */}
      <div className={styles.heroBackgroundMedia}>
        <Image 
          src="/images/bg_4.jpeg" 
          alt="Saudi Fab Store Heavy Engineering" 
          fill 
          priority 
          className={styles.heroImg}
        />
        <div className={styles.vignetteOverlay} />
        <div className={styles.ambientBeamGlow} />
      </div>

      {/* Main Content Area */}
      <div className={styles.heroContentContainer}>
        
        {/* Proof Badge */}
        <div className={styles.proofPill}>
          <ShieldCheck size={16} className={styles.shieldIcon} />
          <span>ISO 9001:2015 &amp; SASO CERTIFIED • ARAMCO APPROVED VENDOR</span>
        </div>

        {/* Editorial Headline */}
        <h1 className={styles.editorialHeadline}>
          NEXT-GENERATION <span className={styles.serifAccentWord}>Structural Steel</span> <br />
          &amp; INDUSTRIAL SOLUTIONS
        </h1>

        {/* Subtitle Copy */}
        <p className={styles.editorialSubtext}>
          Precision engineered structural fabrication, heavy skips, SASO safety equipment, and industrial surface sandblasting in Dammam &amp; Eastern Province, Saudi Arabia.
        </p>

        {/* Action Buttons */}
        <div className={styles.ctaCluster}>
          <Link href="/products" className={styles.primaryGlassBtn}>
            <span>Explore Industrial Catalog</span>
            <ArrowRight size={18} className={styles.btnArrow} />
          </Link>

          <Link href="/contact" className={styles.secondaryGlassBtn}>
            <span>Request B2B Quote</span>
          </Link>
        </div>

        {/* Floating Glass Metrics Strip */}
        <div className={styles.metricsGlassStrip}>
          <div className={styles.metricItem}>
            <Factory size={20} className={styles.metricIcon} />
            <div className={styles.metricTextGroup}>
              <span className={styles.metricValue}>2,000+</span>
              <span className={styles.metricLabel}>Projects Delivered KSA</span>
            </div>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricItem}>
            <Award size={20} className={styles.metricIcon} />
            <div className={styles.metricTextGroup}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>SASO &amp; ISO Compliance</span>
            </div>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricItem}>
            <Clock size={20} className={styles.metricIcon} />
            <div className={styles.metricTextGroup}>
              <span className={styles.metricValue}>24/7</span>
              <span className={styles.metricLabel}>Dammam Workshop Dispatch</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
