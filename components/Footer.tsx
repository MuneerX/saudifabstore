"use client";

import React, { useState } from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { LegalModal, LegalTab } from './LegalModal';

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

interface FooterProps {
  noGradient?: boolean;
}

const Footer: React.FC<FooterProps> = ({ noGradient = false }) => {
  const [email, setEmail] = useState('');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  const openLegalModal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className={`${styles.footer} ${noGradient ? styles.noGradient : ''}`}>
      <div className={styles.footerCard}>
        {/* Top bar: Centered pedestal° Logo + Social Icons on right */}
        <div className={styles.topBar}>
          <div className={styles.topBarInner}>
            <Link href="/" className={styles.logoWrapper}>
              <Image
                src="/images/logo.png"
                alt="Brooq Al Khalij Logo"
                width={150}
                height={48}
                className={styles.logoImg}
                priority
              />
            </Link>
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
              {/* Company */}
              <div className={styles.col}>
                <h4 className={styles.colHeading}>COMPANY</h4>
                <ul className={styles.colList}>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/services">Our Services</Link></li>
                  <li><Link href="/products">Products Catalog</Link></li>
                  <li><Link href="/contact">Contact Support</Link></li>
                </ul>
              </div>

              {/* Services */}
              <div className={styles.col}>
                <h4 className={styles.colHeading}>SERVICES</h4>
                <ul className={styles.colList}>
                  <li><Link href="/services/steel-fabrication">Steel Fabrication</Link></li>
                  <li><Link href="/services/blasting-sandblasting">Blasting &amp; Sandblasting</Link></li>
                  <li><Link href="/services/industrial-painting-coatings">Painting &amp; Coatings</Link></li>
                  <li><Link href="/services/forklift-repair">Forklift Servicing</Link></li>
                  <li><Link href="/services/general-safety-trading">Safety Gear Trading</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div className={styles.col}>
                <h4 className={styles.colHeading}>RESOURCES</h4>
                <ul className={styles.colList}>
                  <li><Link href="/about">Company Profile</Link></li>
                  <li><Link href="/services/protorc-torquing-bolting">ProTorc Bolting</Link></li>
                  <li><Link href="/services/paper-plastic-packaging">Packaging Factory</Link></li>
                  <li><Link href="/services/smart-woodworks">Smart Woodworks</Link></li>
                  <li><Link href="/contact">Request Quote</Link></li>
                </ul>
              </div>
            </div>

            <div className={styles.colDivider} />

            {/* Support Emails Row */}
            <div className={styles.supportRow}>
              <div className={styles.supportBlock}>
                <p className={styles.supportLabel}>FOR B2B SALES &amp; PROJECT INQUIRIES:</p>
                <a href="mailto:sales@brooqalkhalij.com" className={styles.supportEmail}>sales@brooqalkhalij.com</a>
              </div>
              <div className={styles.supportBlock}>
                <p className={styles.supportLabel}>GENERAL SUPPORT &amp; HELP:</p>
                <a href="mailto:info@brooqalkhalij.com" className={styles.supportEmail}>info@brooqalkhalij.com</a>
              </div>
            </div>

            <div className={styles.colDivider} />

            {/* Subscribe Row */}
            <div className={styles.subscribeRow}>
              <div className={styles.legitBadge}>
                <Image
                  src="/images/certified2.png"
                  alt="Brooq Al Khalij Certified"
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
            <Link href="/contact" className={styles.ctaCard}>
              <p className={styles.ctaLabel}>READY TO WORK WITH US?</p>
              <div className={styles.ctaScrollText}>
                <div className={styles.ctaScrollTrack}>
                  <span>Request a Quote</span>
                  <span aria-hidden>Request a Quote</span>
                </div>
              </div>
            </Link>

            {/* Member Login as a wider left-aligned button with exact arrow icon */}
            <Link href="/login" className={styles.memberLoginBtn}>
              <ArrowIcon color="#2b2b29" />
              <span>Client Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-Footer Bar below footerCard matching reference design */}
      <div className={styles.subFooterBar}>
        <div className={styles.subFooterLeft}>
          <span>© 2026 Brooq Al Khalij Co. LLC. All rights reserved.</span>
          <span className={styles.brandDivider}>•</span>
          <div className={styles.mubarakBranding}>
            <span className={styles.mubarakLabel}>Engineered by</span>
            <a
              href="https://mubaraktech.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mubarakLink}
            >
              Mubarak
            </a>
          </div>
        </div>
        <div className={styles.subFooterCenter}>
          <button onClick={() => openLegalModal('privacy')} className={styles.subFooterLink}>Privacy Policy</button>
          <button onClick={() => openLegalModal('terms')} className={styles.subFooterLink}>Terms &amp; Conditions</button>
          <button onClick={() => openLegalModal('saso-iso')} className={styles.subFooterLink}>SASO &amp; ISO Compliance</button>
        </div>
        <div className={styles.subFooterRight}>
          <button onClick={() => openLegalModal('privacy')} className={styles.privacyChoicesBtn}>
            <svg width="30" height="14" viewBox="0 0 30 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="29" height="13" rx="6.5" fill="#0066CC" stroke="#0066CC"/>
              <path d="M7 1H14L11.5 13H7C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1Z" fill="#FFFFFF"/>
              <path d="M4.5 7L6.5 9L9.5 4.5" stroke="#0066CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 4.5L24 9.5M24 4.5L19 9.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Your Privacy Choices</span>
          </button>
        </div>
      </div>

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />
    </footer>
  );
};

export default Footer;