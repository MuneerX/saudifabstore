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

export default function SmartWoodworksPage() {
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
                src="/images/portfolio/portfolio9.png"
                alt="Woodworks Portfolio"
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
                src="/images/portfolio/portfolio1.png"
                alt="Steel Fabrication Work"
                fill
                className={styles.heroColumnImage}
                sizes="520px"
                priority
              />
            </div>

            {/* Set 2 (Duplicates) */}
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
                src="/images/portfolio/portfolio1.png"
                alt="Steel Fabrication Work"
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
            <h1 className={styles.heroTitle}>Smart Woodworks &amp; Architectural Joinery</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>5-Axis CNC Milling</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>Kiln-Dried Timber</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>Boardroom Millwork</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>Commercial Joinery</span>
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
                  Request Joinery Quote
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
            <h2 className={styles.overviewLabel}>Woodwork Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              Custom architectural corporate boardroom millwork, hotel reception desks, timber paneling, wooden packaging crates, and 5-axis CNC carving.
            </p>
          </div>

          <div className={styles.overviewRight}>
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/wood/1.png"
                  alt="Corporate Millwork & Architectural Joinery"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Corporate Millwork &amp; Architectural Joinery</h3>
                <p className={styles.cardDesc}>
                  Custom engineered wood reception counters, wall acoustic timber paneling, executive boardroom tables, and custom cabinetry.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/wood/2.png"
                  alt="Industrial Wooden Crates & Pallets"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Industrial Wooden Crates &amp; Pallets</h3>
                <p className={styles.cardDesc}>
                  Heavy-duty heat-treated (ISPM-15) wooden shipping crates, machinery skids, and custom timber transport pallets.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/wood/3.png"
                  alt="Precision 5-Axis CNC Wood Carving"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Precision 5-Axis CNC Wood Carving</h3>
                <p className={styles.cardDesc}>
                  Automated 5-axis CNC router carving for intricate architectural wood panels, decorative screens, and custom furniture parts.
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
                Custom timber joinery and millwork undergo kiln-moisture checks and precision CNC dimensional auditing.
              </p>
            </div>

            <div className={styles.qaRight}>
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Kiln-Dried Moisture Audit</h3>
                <p className={styles.qaItemDesc}>
                  Digital pin meters verify wood moisture levels (8-12%) to prevent warping and cracking.
                </p>
              </div>

              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>CNC Precision Tolerances</h3>
                <p className={styles.qaItemDesc}>
                  High-speed 5-axis CNC routers execute intricate joinery cuts within ±0.2mm tolerances.
                </p>
              </div>

              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Seamless Edge Banding</h3>
                <p className={styles.qaItemDesc}>
                  Thermal PUR adhesive edge-banding creates invisible, water-resistant timber seams.
                </p>
              </div>

              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Polyurethane Finish Quality</h3>
                <p className={styles.qaItemDesc}>
                  Multi-coat lacquer finishes tested for scratch, stain, and heat resistance.
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
