"use client";

import React, { useState } from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';

const ArrowIcon = ({ color = "#ffffff" }: { color?: string }) => (
  <svg
    className={styles.arrowIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 5"
    fill="none"
    width="10"
    height="7"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.32517 0.0354578L5.42397 1.6028e-07L8 2.51064L5.4458 5L4.3052 4.96635L5.57012 3.73355C5.878 3.43348 6.15998 3.16461 6.41658 2.92694L0.205982 2.9077L0.244359 2.0731L6.45486 2.09244C6.20397 1.86046 5.92658 1.59621 5.62262 1.29997L4.32517 0.0354578Z"
      fill={color}
    />
    <path
      d="M0.82393 2.00287e-07L0.82393 2.90815H0L2.64111e-07 1.65186e-07L0.82393 2.00287e-07Z"
      fill={color}
    />
  </svg>
);

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerCard}>
        {/* Top bar: Centered pedestal° Logo + Social Icons on right */}
        <div className={styles.topBar}>
          <div className={styles.topBarInner}>
            <div className={styles.topBarSpacer} />
            <span className={styles.logoText}>Brooq Al Khalij</span>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Hero Headline */}
        <div className={styles.heroHeadline}>
          <h2 className={styles.heroText}>
            Best Solution for your<br />company needs.
          </h2>
        </div>

        {/* Main Footer Grid: Links + CTA Column */}
        <div className={styles.mainGrid}>
          {/* Left: 3 link columns + 2 support blocks + subscribe form */}
          <div className={styles.linkColumns}>
            <div className={styles.colDivider} />

            {/* 3-column link grid */}
            <div className={styles.colsRow}>
              {/* Categories */}
              <div className={styles.col}>
                <h4 className={styles.colHeading}>DIVISIONS</h4>
                <ul className={styles.colList}>
                  <li><a href="#">Gen Con Est</a></li>
                  <li><a href="#">Trading</a></li>
                  <li><a href="#">Protorc</a></li>
                  <li><a href="#">Forklift</a></li>
                </ul>
              </div>

              {/* Popular */}
              <div className={styles.col}>
                <h4 className={styles.colHeading}>SERVICES</h4>
                <ul className={styles.colList}>
                  <li><a href="#">Steel Fabrication</a></li>
                  <li><a href="#">Blasting Works</a></li>
                  <li><a href="#">Painting & Coatings</a></li>
                  <li><a href="#">Safety Materials</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div className={styles.col}>
                <h4 className={styles.colHeading}>RESOURCES</h4>
                <ul className={styles.colList}>
                  <li><a href="#">Company Profile</a></li>
                  <li><a href="#">Project Portfolio</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className={styles.colDivider} />

            {/* Support Emails Row */}
            <div className={styles.supportRow}>
              <div className={styles.supportBlock}>
                <p className={styles.supportLabel}>FOR SALES &amp; INQUIRIES:</p>
                <a href="mailto:sales@brooqalkhalij.com" className={styles.supportEmail}>sales@brooqalkhalij.com</a>
              </div>
              <div className={styles.supportBlock}>
                <p className={styles.supportLabel}>ALTERNATIVE EMAIL:</p>
                <a href="mailto:sales1@brooqalkhalij.com" className={styles.supportEmail}>sales1@brooqalkhalij.com</a>
              </div>
            </div>

            <div className={styles.colDivider} />

            {/* Subscribe Row */}
            <div className={styles.subscribeRow}>
              <div className={styles.legitBadge}>
                <Image
                  src="/images/legitscript-badge.png"
                  alt="LegitScript Certified"
                  width={64}
                  height={64}
                />
              </div>
              <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.subscribeBtn}>
                  <ArrowIcon color="#ffffff" />
                  <span>Subscribe</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Green CTA Card + Separate Member Login Button Below */}
          <div className={styles.rightCtaCol}>
            <div className={styles.ctaCard}>
              <p className={styles.ctaLabel}>READY TO WORK WITH US?</p>
              <div className={styles.ctaScrollText}>
                <div className={styles.ctaScrollTrack}>
                  <span>Request a Quote</span>
                  <span aria-hidden>Request a Quote</span>
                </div>
              </div>
            </div>

            {/* Member Login as a wider left-aligned button with exact arrow icon */}
            <a href="#" className={styles.memberLoginBtn}>
              <ArrowIcon color="#2b2b29" />
              <span>Client Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;