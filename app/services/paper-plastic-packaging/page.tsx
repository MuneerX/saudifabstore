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

export default function PaperPlasticPackagingPage() {
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
            <h1 className={styles.heroTitle}>Industrial Paper &amp; Plastic Packaging Factory</h1>
            <div className={styles.swatchesRow}>
              <span className={styles.swatchLabel}>Specs / Standards</span>
              <div className={styles.swatchPills}>
                <span className={`${styles.swatchPill} ${styles.pillAws}`}>BCT Rated Corrugated</span>
                <span className={`${styles.swatchPill} ${styles.pillIso}`}>Industrial Bags</span>
                <span className={`${styles.swatchPill} ${styles.pillAsme}`}>Custom Printing</span>
                <span className={`${styles.swatchPill} ${styles.pillBlasting}`}>Stretch Film</span>
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
                  Request Packaging Quote
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
            <h2 className={styles.overviewLabel}>Packaging Capabilities</h2>
            <div className={styles.overviewDivider} />
            <p className={styles.overviewDesc}>
              Automated high-speed converting of heavy-duty corrugated shipping boxes, industrial paper bags, stretch wrap, and custom printed cartons.
            </p>
          </div>

          <div className={styles.overviewRight}>
            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/paper/1.png"
                  alt="Heavy Compression Corrugated Boxes"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Heavy Compression Corrugated Boxes</h3>
                <p className={styles.cardDesc}>
                  BCT-rated single, double, and triple-wall corrugated containers built for heavy industrial machinery export and warehouse stacking.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/paper/2.png"
                  alt="Custom Printed Retail & Shipping Cartons"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Custom Printed Retail &amp; Shipping Cartons</h3>
                <p className={styles.cardDesc}>
                  High-resolution flexographic and offset printed packaging boxes, die-cut display trays, and branded shipping cartons.
                </p>
              </div>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.cardImgWrapper}>
                <Image
                  src="/images/services/paper/3.png"
                  alt="Industrial Film & Protective Wrapping"
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Industrial Film &amp; Protective Wrapping</h3>
                <p className={styles.cardDesc}>
                  Machine-grade pallet stretch film, bubble wrap, poly bags, and moisture barrier wrapping sheets for logistics.
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
                Industrial packaging is tested for Box Compression Test (BCT) strength and moisture barrier defense.
              </p>
            </div>

            <div className={styles.qaRight}>
              <div className={styles.qaItem}>
                <Eye className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>BCT Compression Testing</h3>
                <p className={styles.qaItemDesc}>
                  Hydraulic crush testers measure maximum stacking load limits for heavy cargo boxes.
                </p>
              </div>

              <div className={styles.qaItem}>
                <FileCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Mullen Bursting Strength</h3>
                <p className={styles.qaItemDesc}>
                  Mullen burst testers verify paper fluting resistance under extreme logistics transport.
                </p>
              </div>

              <div className={styles.qaItem}>
                <Ruler className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Cobb Water Absorption Check</h3>
                <p className={styles.qaItemDesc}>
                  Sizing tests ensure corrugated board resists humidity and moisture degradation in transit.
                </p>
              </div>

              <div className={styles.qaItem}>
                <ShieldCheck className={styles.qaItemIcon} />
                <h3 className={styles.qaItemTitle}>Precision Die-Cut Fit</h3>
                <p className={styles.qaItemDesc}>
                  Automated high-speed converting guarantees millimeter accuracy on custom box folds.
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
