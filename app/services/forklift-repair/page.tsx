"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaqSection } from "../../../components/FaqSection";
import { TreatmentQuizModal } from "../../../components/TreatmentQuizModal";
import { Eye, FileCheck, Ruler, ShieldCheck } from "lucide-react";
import styles from "../steel-fabrication/page.module.css";

export default function ForkliftRepairPage() {
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
                src="/images/portfolio/portfolio6.png"
                alt="Trading Products"
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
                src="/images/portfolio/portfolio6.png"
                alt="Trading Products"
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
            <h1 className={styles.heroTitle}>Forklift Maintenance &amp; Heavy Fleet Repair</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>Engine Overhaul</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>Hydraulic Systems</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>Mobile Vans</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>AMC Contracts</span>
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
                  Request Repair Quote
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
            <h2 className={styles.overviewLabel}>Maintenance Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              Full workshop engine rebuilds, hydraulic cylinder overhauls, mobile emergency service teams, and Annual Maintenance Contracts for material handling fleets.
            </p>
          </div>

          <div className={styles.overviewRight}>
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/forklift/1.png?v=2"
                  alt="Full Engine & Transmission Rebuilds"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Full Engine &amp; Transmission Rebuilds</h3>
                <p className={styles.cardDesc}>
                  Complete mechanical overhauls for diesel, LPG, and electric forklifts, including engine machining, transmission rebuilds, and brake overhauls.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/forklift/2.png?v=2"
                  alt="Hydraulic Mast & Cylinder Servicing"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Hydraulic Mast &amp; Cylinder Servicing</h3>
                <p className={styles.cardDesc}>
                  Precision hydraulic cylinder repacking, hose replacement, control valve recalibration, and mast chain safety inspections.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/forklift/3.png?v=2"
                  alt="Mobile Emergency Repairs & AMC Fleets"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Mobile Emergency Repairs &amp; AMC Fleets</h3>
                <p className={styles.cardDesc}>
                  On-site 24/7 emergency repair dispatch vans and customized Annual Maintenance Contracts (AMC) to minimize warehouse downtime.
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
                Every serviced forklift undergoes hydraulic pressure testing and full load capacity verification.
              </p>
            </div>

            <div className={styles.qaRight}>
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Hydraulic Pressure Audit</h3>
                <p className={styles.qaItemDesc}>
                  Calibrated gauges verify relief valve settings and hydraulic lift cylinder pressure integrity.
                </p>
              </div>

              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Diagnostic Scans</h3>
                <p className={styles.qaItemDesc}>
                  Computerized diagnostic tools test engine compression, emissions, and automatic transmission shifts.
                </p>
              </div>

              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Brake &amp; Steering Check</h3>
                <p className={styles.qaItemDesc}>
                  Stopping distance and power steering response are tested under 100% rated working load.
                </p>
              </div>

              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>AMC Safety Certification</h3>
                <p className={styles.qaItemDesc}>
                  Official Annual Maintenance Certificate (AMC) and safety inspection tags issued upon sign-off.
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
