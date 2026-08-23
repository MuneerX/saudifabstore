'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { LegalModal, LegalTab } from './LegalModal';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationSquareIcon, Mail01Icon, UserIcon, UserAddIcon, DeliveryBox01Icon, PhoneCallIcon, Message01Icon, Location01Icon } from '@hugeicons/core-free-icons';

interface FooterProps {
  noGradient?: boolean;
  isContactPage?: boolean;
}

export function Footer({ noGradient, isContactPage }: FooterProps = {}) {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  const openLegalModal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <footer className={`${styles.noonFooterContainer} ${isContactPage ? styles.contactFooterContainer : ''}`}>
      
      {/* DIRECT CONTACT OFFICES & DETAILS INCLUDED IN CONTACT PAGE FOOTER */}
      {isContactPage && (
        <div className={styles.contactFooterOfficesSection}>
          <div className={styles.detailsHeaderBlock}>
            <h2 className={styles.detailsMainTitle}>Direct Contact Details &amp; Offices</h2>
            <p className={styles.detailsSubText}>
              Reach out directly to our commercial desk, regional logistics hubs, or headquarters in Saudi Arabia.
            </p>
          </div>

          <div className={styles.unboxedDetailsRow}>
            
            {/* Detail Item 1: Email Support */}
            <div className={styles.unboxedDetailItem}>
              <div className={styles.detailIconCircle}>
                <HugeiconsIcon icon={Mail01Icon} size={20} strokeWidth={2.2} />
              </div>
              <div className={styles.detailTextGroup}>
                <span className={styles.detailLabelTag}>EMAIL SUPPORT</span>
                <a href="mailto:care@saudifab.com" className={styles.detailPrimaryLink}>
                  care@saudifab.com
                </a>
                <p className={styles.detailSubTextDesc}>General inquiries, sales &amp; quotations</p>
              </div>
            </div>

            {/* Detail Item 2: Phone Hotline */}
            <div className={styles.unboxedDetailItem}>
              <div className={styles.detailIconCircle}>
                <HugeiconsIcon icon={PhoneCallIcon} size={20} strokeWidth={2.2} />
              </div>
              <div className={styles.detailTextGroup}>
                <span className={styles.detailLabelTag}>HOTLINE DESK</span>
                <a href="tel:+966138121100" className={styles.detailPrimaryLink}>
                  +966 13 812 1100
                </a>
                <p className={styles.detailSubTextDesc}>Dammam commercial desk &amp; WhatsApp</p>
              </div>
            </div>

            {/* Detail Item 3: Dammam HQ Address */}
            <div className={styles.unboxedDetailItem}>
              <div className={styles.detailIconCircle}>
                <HugeiconsIcon icon={Location01Icon} size={20} strokeWidth={2.2} />
              </div>
              <div className={styles.detailTextGroup}>
                <span className={styles.detailLabelTag}>DAMMAM HEADQUARTERS</span>
                <h4 className={styles.detailPrimaryText}>2nd Industrial City, Street 68</h4>
                <p className={styles.detailSubTextDesc}>Dammam, Eastern Province, KSA</p>
              </div>
            </div>

            {/* Detail Item 4: Riyadh Branch Address */}
            <div className={styles.unboxedDetailItem}>
              <div className={styles.detailIconCircle}>
                <HugeiconsIcon icon={Location01Icon} size={20} strokeWidth={2.2} />
              </div>
              <div className={styles.detailTextGroup}>
                <span className={styles.detailLabelTag}>RIYADH BRANCH HUB</span>
                <h4 className={styles.detailPrimaryText}>Al-Sulay Industrial District</h4>
                <p className={styles.detailSubTextDesc}>Riyadh, Central Region, KSA</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {!isContactPage && (
        <>
          {/* 1. TOP HELP & SUPPORT BANNER */}
          <div className={styles.helpBannerWrapper}>
            <div className={styles.helpBannerContainer}>
              <div className={styles.helpTextGroup}>
                <h3 className={styles.helpTitle}>We&apos;re Always Here To Help</h3>
                <p className={styles.helpSubtitle}>Reach out to us through any of these support channels</p>
              </div>

              <div className={styles.supportChannelsGroup}>
                
                {/* Channel 1: Help Center */}
                <Link href="/contact" className={styles.channelBadgeCard}>
                  <div className={styles.channelIconCircle}>
                    <HugeiconsIcon icon={InformationSquareIcon} size={18} strokeWidth={2.2} />
                  </div>
                  <div className={styles.channelLabelGroup}>
                    <span className={styles.channelLabelTag}>HELP CENTER</span>
                    <span className={styles.channelValueText}>help.saudifab.com</span>
                  </div>
                </Link>

                {/* Channel 2: Email Support */}
                <a href="mailto:care@saudifab.com" className={styles.channelBadgeCard}>
                  <div className={styles.channelIconCircle}>
                    <HugeiconsIcon icon={Mail01Icon} size={18} strokeWidth={2.2} />
                  </div>
                  <div className={styles.channelLabelGroup}>
                    <span className={styles.channelLabelTag}>EMAIL SUPPORT</span>
                    <span className={styles.channelValueText}>care@saudifab.com</span>
                  </div>
                </a>

              </div>
            </div>
          </div>

          {/* 2. MULTI-COLUMN CATEGORY & BRAND NAVIGATION LINKS */}
          <div className={styles.navLinksSection}>
            <div className={styles.navLinksContainer}>
              
              {/* Column 1 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Steel &amp; Metals</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/products?category=Structural+Steel">Structural Beams</Link></li>
                  <li><Link href="/products?category=Structural+Steel">High-Tensile Plates</Link></li>
                  <li><Link href="/products?category=Structural+Steel">Hollow Tubing</Link></li>
                  <li><Link href="/products?category=Structural+Steel">Expanded Metal Mesh</Link></li>
                  <li><Link href="/products?category=Structural+Steel">Rebar &amp; Round Bars</Link></li>
                  <li><Link href="/products?category=Structural+Steel">Grating &amp; Catwalks</Link></li>
                  <li><Link href="/products?category=Structural+Steel">Angles &amp; Flat Bars</Link></li>
                  <li><Link href="/products?category=Structural+Steel">Pipe &amp; Flanges</Link></li>
                </ul>
              </div>

              {/* Column 2 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Services</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/services/steel-fabrication">Steel Fabrication</Link></li>
                  <li><Link href="/services/blasting-sandblasting">SA 2.5 Sandblasting</Link></li>
                  <li><Link href="/services/industrial-painting-coatings">Industrial Coating</Link></li>
                  <li><Link href="/services/protorc-torquing-bolting">Hydraulic Torquing</Link></li>
                  <li><Link href="/services/steel-fabrication">CNC Laser Cutting</Link></li>
                  <li><Link href="/services/steel-fabrication">Sheet Metal Bending</Link></li>
                  <li><Link href="/services/forklift-repair">Workshop Repair</Link></li>
                  <li><Link href="/services/smart-woodworks">Crating &amp; Pallets</Link></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Warehouse</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Self-Dumping Skips</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Pallet Racks</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Pallet Trucks</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Forklift Attachments</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Cargo Containers</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Storage Bins</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Material Carts</Link></li>
                  <li><Link href="/products?category=Warehouse+%26+Logistics">Site Enclosures</Link></li>
                </ul>
              </div>

              {/* Column 4 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>SASO Safety</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/services/general-safety-trading">SASO Safety Helmets</Link></li>
                  <li><Link href="/services/general-safety-trading">Safety Harnesses</Link></li>
                  <li><Link href="/services/general-safety-trading">Protective Eyewear</Link></li>
                  <li><Link href="/services/general-safety-trading">High-Vis Vests</Link></li>
                  <li><Link href="/services/general-safety-trading">Welding Shields</Link></li>
                  <li><Link href="/services/general-safety-trading">Steel-Toe Boots</Link></li>
                  <li><Link href="/services/general-safety-trading">Mask Filters</Link></li>
                </ul>
              </div>

              {/* Column 5 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Certifications</h4>
                <ul className={styles.columnList}>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>SASO Compliance</button></li>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>ISO 9001:2015 Quality</button></li>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>MTR Heat Traceable</button></li>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>SWL Proof Tested</button></li>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>Aramco Vendor</button></li>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>SABIC Compliant</button></li>
                  <li><button type="button" onClick={() => openLegalModal('saso-iso')} className={styles.linkBtn}>Ma&apos;aden Approved</button></li>
                </ul>
              </div>

              {/* Column 6 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Top Brands</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/products">Saudi Fab Store</Link></li>
                  <li><Link href="/services/protorc-torquing-bolting">ProTorc Torquing</Link></li>
                  <li><Link href="/products">DeWalt Heavy Duty</Link></li>
                  <li><Link href="/products">Makita Industrial</Link></li>
                  <li><Link href="/products">Lincoln Electric</Link></li>
                  <li><Link href="/products">ESAB Welding</Link></li>
                  <li><Link href="/products">Bosch Professional</Link></li>
                </ul>
              </div>

              {/* Column 7 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Discover Now</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/about">Saudi Fab Portal</Link></li>
                  <li><Link href="/contact">Steel Calculator</Link></li>
                  <li><Link href="/contact">Custom Quote Tool</Link></li>
                  <li><Link href="/portfolio">Catalog 2026</Link></li>
                  <li><Link href="/products">Wholesale Rates</Link></li>
                  <li><Link href="/contact">B2B Credit Line</Link></li>
                  <li><Link href="/services/steel-fabrication">Express Delivery</Link></li>
                </ul>
              </div>

              {/* Column 8 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Popular</h4>
                <ul className={styles.columnList}>
                  <li><Link href="/products">ASTM Steel Plates</Link></li>
                  <li><Link href="/services/blasting-sandblasting">SA 2.5 Sandblast</Link></li>
                  <li><Link href="/products">Self-Dumping Skips</Link></li>
                  <li><Link href="/products">SWL Shackles</Link></li>
                  <li><Link href="/products">Heavy Flanges</Link></li>
                  <li><Link href="/products">Forklift Skips</Link></li>
                </ul>
              </div>

              {/* Column 9 */}
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>GCC Regions</h4>
                <ul className={styles.columnList}>
                  <li><span className={styles.regionText}>Saudi Arabia (KSA)</span></li>
                  <li><span className={styles.regionText}>Bahrain</span></li>
                  <li><span className={styles.regionText}>Kuwait</span></li>
                  <li><span className={styles.regionText}>Oman</span></li>
                  <li><span className={styles.regionText}>Qatar</span></li>
                  <li><span className={styles.regionText}>United Arab Emirates</span></li>
                </ul>
              </div>

            </div>

            {/* 3. SHOP ON THE GO & CONNECT WITH US */}
            <div className={styles.appSocialRow}>
              <div className={styles.appSocialContainer}>
                
                {/* Left: B2B CLIENT ACCESS */}
                <div className={styles.shopOnGoBlock}>
                  <span className={styles.sectionHeaderTitle}>B2B CLIENT PORTAL &amp; QUICK ACCESS</span>
                  <div className={styles.appStoreBadgesGroup}>
                    <Link href="/login" className={styles.appBadgePill}>
                      <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={2.2} />
                      <span>Client Login</span>
                    </Link>

                    <Link href="/signup" className={styles.appBadgePill}>
                      <HugeiconsIcon icon={UserAddIcon} size={16} strokeWidth={2.2} />
                      <span>Register B2B Account</span>
                    </Link>

                    <Link href="/admin/orders" className={styles.appBadgePill}>
                      <HugeiconsIcon icon={DeliveryBox01Icon} size={16} strokeWidth={2.2} />
                      <span>Track PO Order</span>
                    </Link>
                  </div>
                </div>

                {/* Right: CONNECT WITH US */}
                <div className={styles.connectWithUsBlock}>
                  <span className={styles.sectionHeaderTitle}>CONNECT WITH US</span>
                  <div className={styles.yellowSocialGroup}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.yellowSocialCircle} aria-label="Facebook">
                      f
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.yellowSocialCircle} aria-label="X">
                      X
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.yellowSocialCircle} aria-label="Instagram">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.yellowSocialCircle} aria-label="LinkedIn">
                      in
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </>
      )}

      {/* 4. BOTTOM LEGAL BAR */}
      <div className={styles.bottomLegalSection}>
        <div className={styles.bottomLegalContainer}>
          
          <div className={styles.legalTopFlexRow}>
            <div className={styles.copyrightText}>
              &copy; 2026 Saudi Fab Store. All Rights Reserved
            </div>

            {/* Payment Method Badges (Hidden on Contact Page Footer) */}
            {!isContactPage && (
              <div className={styles.paymentBadgesRow}>
                <Image src="/images/visa.svg" alt="Visa" width={44} height={26} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/mastercard.png" alt="Mastercard" width={44} height={26} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/applepay.png" alt="Apple Pay" width={44} height={26} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/gpay.png" alt="Google Pay" width={44} height={26} className={styles.paymentBadgeImg} unoptimized />
                <Image src="/images/Amazon_Pay_logo.svg" alt="Amazon Pay" width={44} height={26} className={styles.paymentBadgeImg} unoptimized />
              </div>
            )}

            {/* Policy Footer Links */}
            <div className={styles.policyLinksRow}>
              <Link href="/about">Careers</Link>
              <button type="button" onClick={() => openLegalModal('privacy')} className={styles.policyBtn}>Warranty Policy</button>
              <Link href="/signup">Sell with us</Link>
              <button type="button" onClick={() => openLegalModal('terms')} className={styles.policyBtn}>Terms of Use</button>
              <button type="button" onClick={() => openLegalModal('terms')} className={styles.policyBtn}>Terms of Sale</button>
              <button type="button" onClick={() => openLegalModal('privacy')} className={styles.policyBtn}>Privacy Policy</button>
            </div>
          </div>

        </div>
      </div>

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />
    </footer>
  );
}

export default Footer;
