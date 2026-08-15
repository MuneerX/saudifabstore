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

export default function ProtorcTorquingBoltingPage() {
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
                src="/images/portfolio/portfolio5.png"
                alt="ProTorc Work"
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

            {/* Set 2 (Duplicates) */}
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
          </div>
        </div>

        <div className={styles.heroBottomBar}>
          <div className={styles.heroBottomLeft}>
            <h1 className={styles.heroTitle}>ProTorc Industrial Torquing &amp; Machining</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>Hydraulic Torque Control</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>Flange Facing</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>Cold Pipe Cutting</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>Joint Integrity</span>
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
                  Request Torquing Quote
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
            <h2 className={styles.overviewLabel}>Torquing Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              Precision controlled hydraulic bolting, leak-free joint integrity testing, flange facing machining, and cold pipe cutting for refinery plant turnarounds.
            </p>
          </div>

          <div className={styles.overviewRight}>
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/protoc/1.png"
                  alt="Controlled Hydraulic Bolt Torquing"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Controlled Hydraulic Bolt Torquing</h3>
                <p className={styles.cardDesc}>
                  Calibrated low-profile and square-drive hydraulic wrenches for uniform bolt tensioning across high-pressure pipe flanges and pressure vessels.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/protoc/2.png"
                  alt="On-Site Flange Facing & Pipe Cutting"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>On-Site Flange Facing &amp; Pipe Cutting</h3>
                <p className={styles.cardDesc}>
                  Portable split-frame cold pipe cutting (up to 60&quot;) and precision flange re-facing to eliminate steam and chemical leaks.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/protoc/3.png"
                  alt="Shutdown & Turnaround Services"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Shutdown &amp; Turnaround Services</h3>
                <p className={styles.cardDesc}>
                  Rapid-deployment specialized torquing crews and equipment packages for planned refinery and petrochemical plant shutdowns.
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
                Controlled hydraulic torquing and flange facing operations are backed by digital torque logs and joint integrity audits.
              </p>
            </div>

            <div className={styles.qaRight}>
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Calibrated Torque Verification</h3>
                <p className={styles.qaItemDesc}>
                  Hydraulic pumps and wrenches calibrated to NIST standards for exact foot-pound precision.
                </p>
              </div>

              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Flange Surface Audit</h3>
                <p className={styles.qaItemDesc}>
                  Optical alignment check verifies flange face smoothness and zero gasket distortion.
                </p>
              </div>

              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Bolt Elongation Measurement</h3>
                <p className={styles.qaItemDesc}>
                  Ultrasonic bolt elongation gauges measure exact bolt tension under thermal load.
                </p>
              </div>

              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Hydrostatic Leak Test</h3>
                <p className={styles.qaItemDesc}>
                  Pressurized joint testing confirms leak-free performance during refinery plant restarts.
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
