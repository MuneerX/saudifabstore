'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import styles from './PartnerRail.module.css';

const CREDENTIALS = [
  { label: 'SAUDI ARAMCO APPROVED', detail: 'Vendor #1006542' },
  { label: 'SABIC PRE-QUALIFIED', detail: 'Industrial Supplier' },
  { label: 'SASO SALEEM CERTIFIED', detail: 'Quality Standard' },
  { label: 'SABER DIGITAL CoC', detail: 'Compliant Asset' },
  { label: 'ISO 9001:2015 REGISTERED', detail: 'QMS Certification' },
  { label: 'AWS D1.1 WELDING', detail: 'Certified Structural' },
];

export function PartnerRail() {
  return (
    <div className={styles.partnerMarqueeContainer}>
      <div className={styles.marqueeHeader}>
        <span className={styles.headerLabel}>CERTIFIED INDUSTRY STANDARDS &amp; PRE-QUALIFICATIONS</span>
      </div>

      <div className={styles.marqueeTrackWrapper}>
        <div className={styles.marqueeTrack}>
          {/* First Loop */}
          {CREDENTIALS.map((cred, idx) => (
            <div key={`a-${idx}`} className={styles.credCard}>
              <CheckCircle2 size={16} className={styles.credIcon} />
              <div className={styles.credTextGroup}>
                <span className={styles.credTitle}>{cred.label}</span>
                <span className={styles.credSub}>{cred.detail}</span>
              </div>
            </div>
          ))}

          {/* Duplicate Loop for Smooth Infinte Scrolling */}
          {CREDENTIALS.map((cred, idx) => (
            <div key={`b-${idx}`} className={styles.credCard}>
              <CheckCircle2 size={16} className={styles.credIcon} />
              <div className={styles.credTextGroup}>
                <span className={styles.credTitle}>{cred.label}</span>
                <span className={styles.credSub}>{cred.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
