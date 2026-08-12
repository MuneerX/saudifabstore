"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaqSection } from "../../../components/FaqSection";
import { TreatmentQuizModal } from "../../../components/TreatmentQuizModal";
import { Eye, FileCheck, Ruler, ShieldCheck } from "lucide-react";
import styles from "./page.module.css";

export default function SteelFabricationPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Light Navigation Bar */}
      <Navbar isLight={true} hasBorder={true} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroMarqueeContainer}>
          <div className={styles.heroMarqueeTrack}>
            {/* Set 1 */}
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio1.png"
                alt="Steel Fabrication Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio2.png"
                alt="Blasting Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio3.png"
                alt="Painting Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio5.png"
                alt="ProTorc Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>

            {/* Set 2 (Duplicates) */}
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio1.png"
                alt="Steel Fabrication Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio2.png"
                alt="Blasting Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio3.png"
                alt="Painting Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio5.png"
                alt="ProTorc Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar Details */}
        <div className={styles.heroBottomBar}>
          {/* Left Details & Specs (swatches style) */}
          <div className={styles.heroBottomLeft}>
            <h1 className={styles.heroTitle}>Steel Fabrication</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>AWS D1.1</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>ISO 9001</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>ASME IX</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>SA 2.5 Blasting</span>
              </div>
            </div>
          </div>

          {/* Right Action Button Box */}
          <div className={styles.heroBottomRightContainer}>
            <div className={styles.heroBottomRight}>
              <button 
                className={styles.heroCtaCard}
                onClick={() => setIsContactOpen(true)}
              >
                <div className={styles.heroCtaText}>
                  Request Custom Quote
                </div>
                <span className={styles.heroCtaArrow}>
                  <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                    <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                  </svg>
                </span>
              </button>
            </div>
            <span className={styles.ctaSubtext}>
              * Estimations vary based on raw material specifications and custom configurations.
            </span>
          </div>
        </div>
      </section>

      {/* Overview / Capabilities Section */}
      <section className={styles.overviewSection}>
        <div className={styles.overviewContainer}>
          {/* Left Column */}
          <div className={styles.overviewLeft}>
            <h2 className={styles.overviewLabel}>Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              We fabricate high-tolerance steel structures, customized transport frames, and logistics equipment inside our fully certified workshops in Dammam.
            </p>
          </div>

          {/* Right Column Grid */}
          <div className={styles.overviewRight}>
            {/* Capability 1 */}
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/steel/1.png"
                  alt="Heavy Structural Fabrication"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Heavy Structural Fabrication</h3>
                <p className={styles.cardDesc}>
                  Engineered heavy structural columns, girders, rafter assemblies, and connection plates matching turnkey warehouse and commercial building grids.
                </p>
              </div>
            </div>

            {/* Capability 2 */}
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/steel/2.png"
                  alt="Custom Industrial Iron Baskets"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Custom Industrial Baskets</h3>
                <p className={styles.cardDesc}>
                  Specialized transportable iron containers, safety crates, lifting baskets, and material handling enclosures built for rough site logistics.
                </p>
              </div>
            </div>

            {/* Capability 3 */}
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/steel/3.png"
                  alt="Overhead Crane Girders"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Overhead Crane Girders</h3>
                <p className={styles.cardDesc}>
                  Heavy overhead crane runway girders designed to sustain heavy factory lifting loads, with ISO standard deflection calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance / QA Section inside Section Card Container */}
      <section className={styles.qaSection}>
        <div className={styles.qaCardContainer}>
          <div className={styles.qaBgWrapper}>
            <Image
              src="/images/home/services/service_bg.png"
              alt="Quality assurance background"
              fill
              className={styles.qaBgImage}
              sizes="100vw"
            />
          </div>
          <div className={styles.qaOverlay} />

          <div className={styles.qaContainer}>
            <div className={styles.qaLeft}>
              <h2 className={styles.qaTitle}>Rigorous Quality Standards</h2>
              <p className={styles.qaText}>
                Every steel component undergoes dimensional auditing and welding tests to ensure structural integrity prior to dispatch.
              </p>
            </div>

            <div className={styles.qaRight}>
              {/* QA 1 - Glass Card style */}
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Ultrasonic Welding Check</h3>
                <p className={styles.qaItemDesc}>
                  AWS certified inspectors evaluate all primary structural welds using non-destructive ultrasonic testing methods.
                </p>
              </div>

              {/* QA 2 - Glass Card style */}
              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Mill Test Certificates</h3>
                <p className={styles.qaItemDesc}>
                  We maintain full traceability by logging mill certs (MTC) for all structural carbon steel sourced.
                </p>
              </div>

              {/* QA 3 - Glass Card style */}
              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Dimensional Compliance</h3>
                <p className={styles.qaItemDesc}>
                  Precision laser measures check alignment and tolerance bounds before paint primer coatings.
                </p>
              </div>

              {/* QA 4 - Glass Card style */}
              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Safety Factor Rating</h3>
                <p className={styles.qaItemDesc}>
                  All steel fabrications maintain design safety load margins exceeding KSA industrial standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
