"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaqSection } from "../../../components/FaqSection";
import { TreatmentQuizModal } from "../../../components/TreatmentQuizModal";
import ServiceArrowIcon from "../../../components/ServiceArrowIcon";
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
              <Link 
                href="/contact"
                className={styles.heroCtaCard}
              >
                <div className={styles.heroCtaText}>
                  Request Custom Quote
                </div>
                <span className={styles.heroCtaArrow}>
                  <ServiceArrowIcon width={10} height={18} />
                </span>
              </Link>
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
