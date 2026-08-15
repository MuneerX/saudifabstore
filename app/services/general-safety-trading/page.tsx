"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaqSection } from "../../../components/FaqSection";
import { TreatmentQuizModal } from "../../../components/TreatmentQuizModal";
import { Eye, FileCheck, Ruler, ShieldCheck } from "lucide-react";
import styles from "../steel-fabrication/page.module.css";
import ServiceArrowIcon from "../../../components/ServiceArrowIcon";

export default function GeneralSafetyTradingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar isLight={true} hasBorder={true} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroMarqueeContainer}>
          <div className={styles.heroMarqueeTrack}>
            {/* Set 1 */}
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio6.png"
                alt="Safety Trading Portfolio"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio4.png"
                alt="Forklift Servicing"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio7.png"
                alt="Packaging Portfolio"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio9.png"
                alt="Woodworks Portfolio"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>

            {/* Set 2 (Duplicates) */}
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio6.png"
                alt="Safety Trading Portfolio"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio4.png"
                alt="Forklift Servicing"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio7.png"
                alt="Packaging Portfolio"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
            <div className={styles.heroMarqueeCard}>
              <Image
                src="/images/portfolio/portfolio9.png"
                alt="Woodworks Portfolio"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>
          </div>
        </div>

        <div className={styles.heroBottomBar}>
          <div className={styles.heroBottomLeft}>
            <h1 className={styles.heroTitle}>Certified Industrial PPE &amp; Safety Trading</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>ANSI Certified</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>EN Safety Gear</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>OSHA Compliant</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>High-Volume PPE</span>
              </div>
            </div>
          </div>

          <div className={styles.heroBottomRightContainer}>
            <div className={styles.heroBottomRight}>
              <Link 
                href="/contact"
                className={styles.heroCtaCard}
              >
                <div className={styles.heroCtaText}>
                  Request PPE Quote
                </div>
                <span className={styles.heroCtaArrow}>
                  <ServiceArrowIcon width={10} height={18} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className={styles.overviewSection}>
        <div className={styles.overviewContainer}>
          <div className={styles.overviewLeft}>
            <h2 className={styles.overviewLabel}>Trading Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              Direct sourcing and distribution of certified safety gloves, hard hats, coveralls, safety boots, eye protection, and industrial site gear across KSA.
            </p>
          </div>

          <div className={styles.overviewRight}>
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/trading/1.png"
                  alt="Personal Protective Equipment (PPE)"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Personal Protective Equipment (PPE)</h3>
                <p className={styles.cardDesc}>
                  Comprehensive head-to-toe worker protection including ANSI hard hats, anti-impact gloves, safety spectacles, and ear defenders.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/trading/2.png"
                  alt="Flame-Retardant & Chemical Workwear"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Flame-Retardant &amp; Chemical Workwear</h3>
                <p className={styles.cardDesc}>
                  Nomex and Pyrovatex certified flame-retardant coveralls, high-visibility reflective vests, and chemical splash suits.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/trading/3.png"
                  alt="Fall Protection & Site Safety Supply"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Fall Protection &amp; Site Safety Supply</h3>
                <p className={styles.cardDesc}>
                  Full-body safety harnesses, shock-absorbing lanyards, lifeline systems, traffic cones, and emergency eyewash stations.
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
                All Personal Protective Equipment (PPE) is batch-tested for ANSI, EN, and OSHA safety compliance.
              </p>
            </div>

            <div className={styles.qaRight}>
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>ANSI &amp; EN Certification</h3>
                <p className={styles.qaItemDesc}>
                  Every batch of hard hats, goggles, and gloves carries verified CE and ANSI safety tags.
                </p>
              </div>

              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Impact &amp; Tensile Testing</h3>
                <p className={styles.qaItemDesc}>
                  Safety boots and harnesses tested for steel-toe compression and high-altitude fall impact.
                </p>
              </div>

              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Flame Resistance Audit</h3>
                <p className={styles.qaItemDesc}>
                  Coveralls and welding gear certified for thermal protection and arc-flash resistance.
                </p>
              </div>

              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Supplier Traceability</h3>
                <p className={styles.qaItemDesc}>
                  Direct OEM sourcing guarantees 100% authentic protective gear with batch certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      <Footer />

      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
