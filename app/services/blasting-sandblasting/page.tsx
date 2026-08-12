"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaqSection } from "../../../components/FaqSection";
import { TreatmentQuizModal } from "../../../components/TreatmentQuizModal";
import { Eye, FileCheck, Ruler, ShieldCheck } from "lucide-react";
import styles from "../steel-fabrication/page.module.css";

export default function BlastingSandblastingPage() {
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
                src="/images/portfolio/portfolio4.png"
                alt="Forklift Servicing"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>

            {/* Set 2 (Duplicates) */}
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
                src="/images/portfolio/portfolio4.png"
                alt="Forklift Servicing"
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
            <h1 className={styles.heroTitle}>Abrasive Blasting &amp; Sandblasting</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>SA 2.5 Standard</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>ISO 8501-1</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>NACE No. 2</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>Grit &amp; Garnet</span>
              </div>
            </div>
          </div>

          <div className={styles.heroBottomRightContainer}>
            <div className={styles.heroBottomRight}>
              <button 
                className={styles.heroCtaCard}
                onClick={() => setIsContactOpen(true)}
              >
                <div className={styles.heroCtaText}>
                  Request Blasting Quote
                </div>
                <span className={styles.heroCtaArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className={styles.overviewSection}>
        <div className={styles.overviewContainer}>
          <div className={styles.overviewLeft}>
            <h2 className={styles.overviewLabel}>Surface Prep Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              We execute high-capacity abrasive blasting inside our certified Dammam blast bays and on-site across industrial terminals, storage tanks, and structural frames.
            </p>
          </div>

          <div className={styles.overviewRight}>
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/blasting/1.png"
                  alt="Abrasive Grit & Garnet Blasting"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Abrasive Grit &amp; Garnet Blasting (SA 2.5)</h3>
                <p className={styles.cardDesc}>
                  High-pressure steel grit and garnet blasting to remove heavy mill scale, rust, and degraded industrial coatings down to bare near-white metal.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/blasting/2.png"
                  alt="Glass Bead & Specialty Media"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Glass Bead &amp; Aluminum Oxide Blasting</h3>
                <p className={styles.cardDesc}>
                  Non-ferrous satin finish media blasting for delicate aluminum, stainless steel, valves, and precision machined components.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/blasting/3.png?v=2"
                  alt="On-Site Tank & Pipe Blasting"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>On-Site Tank &amp; Pipe Blasting</h3>
                <p className={styles.cardDesc}>
                  Mobile environmental blasting units for chemical storage tanks, pipeline spools, and heavy structural steel erection sites.
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
                Surface preparation is audited against international ISO 8501-1 and NACE standards before any primer application.
              </p>
            </div>

            <div className={styles.qaRight}>
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Surface Profile Inspection</h3>
                <p className={styles.qaItemDesc}>
                  Elcometer surface profile gauges measure blast anchor profile depth (50-75 µm).
                </p>
              </div>

              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Cleanliness Certification</h3>
                <p className={styles.qaItemDesc}>
                  Abrasive cleanliness and salt contamination tests guarantee SA 2.5 near-white metal prep.
                </p>
              </div>

              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Dust &amp; Moisture Audit</h3>
                <p className={styles.qaItemDesc}>
                  ISO tape tests verify zero dust and relative humidity (&lt;85%) before protective coating.
                </p>
              </div>

              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Substrate Integrity</h3>
                <p className={styles.qaItemDesc}>
                  Calibrated pressure control prevents metal distortion on thin-gauge structures and tanks.
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
