'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

function TermsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'conditions' | 'privacy' | 'purchasing' | 'returns'>('conditions');

  useEffect(() => {
    if (tabParam === 'privacy' || tabParam === 'purchasing' || tabParam === 'returns' || tabParam === 'conditions') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.mainContainer}>
        {/* Amazon-style Breadcrumbs */}
        <div className={styles.breadcrumbRow}>
          <Link href="/" className={styles.breadcrumbLink}>Your Account</Link>
          <span>›</span>
          <Link href="/contact" className={styles.breadcrumbLink}>Help &amp; Customer Service</Link>
          <span>›</span>
          <span>Legal Policies</span>
        </div>

        <h1 className={styles.mainTitle}>Saudi Fab Store Legal &amp; Policy Help</h1>
        <p className={styles.lastUpdated}>Last updated: August 27, 2026</p>

        {/* Amazon-style Sidebar + Main Content Layout */}
        <div className={styles.layoutGrid}>
          
          {/* Simple Left Navigation */}
          <nav className={styles.sidebarNav}>
            <div className={styles.sidebarHeader}>Legal Topics</div>
            
            <button
              type="button"
              className={`${styles.navItemBtn} ${activeTab === 'conditions' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('conditions')}
            >
              Conditions of Use
            </button>

            <button
              type="button"
              className={`${styles.navItemBtn} ${activeTab === 'privacy' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Notice
            </button>

            <button
              type="button"
              className={`${styles.navItemBtn} ${activeTab === 'purchasing' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('purchasing')}
            >
              B2B VAT &amp; Purchasing
            </button>

            <button
              type="button"
              className={`${styles.navItemBtn} ${activeTab === 'returns' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('returns')}
            >
              30-Day Site Returns
            </button>
          </nav>

          {/* Clean Amazon Document Content Panel */}
          <div className={styles.contentBox}>
            {activeTab === 'conditions' && (
              <>
                <section>
                  <h2 className={styles.sectionHeading}>Conditions of Use</h2>
                  <p className={styles.paragraph}>
                    Welcome to Saudi Fab Store. If you visit or shop at Saudi Fab Store, you accept these conditions. Please read them carefully.
                  </p>
                </section>

                <section>
                  <h2 className={styles.sectionHeading}>1. Electronic Communications</h2>
                  <p className={styles.paragraph}>
                    When you use Saudi Fab Store or send e-mails, text messages, and other communications from your desktop or mobile device to us, you are communicating with us electronically. You consent to receive communications from us electronically.
                  </p>
                </section>

                <section>
                  <h2 className={styles.sectionHeading}>2. Your Corporate Account</h2>
                  <p className={styles.paragraph}>
                    You are responsible for maintaining the confidentiality of your account credentials and Commercial Registration (CR) data and for restricting access to your computer.
                  </p>
                  <ul className={bulletListStyle}>
                    <li className={styles.bulletItem}>Authorized users must be registered under your company CR.</li>
                    <li className={styles.bulletItem}>B2B credit orders require authorized corporate signature.</li>
                  </ul>
                </section>
              </>
            )}

            {activeTab === 'privacy' && (
              <>
                <section>
                  <h2 className={styles.sectionHeading}>Saudi Fab Store Privacy Notice</h2>
                  <p className={styles.paragraph}>
                    We know that you care how information about you is used and shared, and we appreciate your trust that we will do so carefully and sensibly.
                  </p>
                </section>

                <section>
                  <h2 className={styles.sectionHeading}>1. What Information We Collect</h2>
                  <p className={styles.paragraph}>
                    We collect corporate information to process industrial orders, issue 15% ZATCA tax invoices, and schedule flatbed truck logistics across KSA.
                  </p>
                </section>

                <section>
                  <h2 className={styles.sectionHeading}>2. Information Security</h2>
                  <p className={styles.paragraph}>
                    We protect the security of your corporate information during transmission by using encryption protocols and software.
                  </p>
                </section>
              </>
            )}

            {activeTab === 'purchasing' && (
              <>
                <section>
                  <h2 className={styles.sectionHeading}>B2B VAT Invoicing &amp; Checkout Policy</h2>
                  <p className={styles.paragraph}>
                    All industrial purchases on Saudi Fab Store comply with Kingdom of Saudi Arabia ZATCA e-invoicing laws and SASO product standards.
                  </p>
                </section>

                <section>
                  <h2 className={styles.sectionHeading}>1. 15% VAT Tax Invoices &amp; Mill Heat Certs</h2>
                  <p className={styles.paragraph}>
                    Digital 15% VAT Tax Invoices (PDF) and Mill Test Reports (MTR) are attached to every order and accessible via your profile dashboard upon dispatch.
                  </p>
                </section>
              </>
            )}

            {activeTab === 'returns' && (
              <>
                <section>
                  <h2 className={styles.sectionHeading}>30-Day Free Site Return Guarantee</h2>
                  <p className={styles.paragraph}>
                    Saudi Fab Store offers 30-day free site returns for items that do not meet your specified CAD drawings, mill standards, or dimensional tolerances.
                  </p>
                </section>

                <section>
                  <h2 className={styles.sectionHeading}>1. How to Initiate a Return</h2>
                  <p className={styles.paragraph}>
                    Submit a claim via our Customer Service Help Desk under &apos;30-Day Site Return Claim&apos;. Free flatbed pickup will be dispatched to your site.
                  </p>
                </section>
              </>
            )}

            {/* Amazon-style Yellow Help Notice Box */}
            <div className={styles.supportNoticeBox}>
              <p className={styles.noticeText}>
                Need help with a specific order or purchase order?
              </p>
              <Link href="/contact" className={styles.contactLinkBtn}>
                Customer Support Hub
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

const bulletListStyle = styles.bulletList;

export default function TermsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading Legal Policies...</div>}>
      <TermsContent />
    </Suspense>
  );
}
