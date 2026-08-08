"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AboutSection } from "../../components/AboutSection";
import { FaqSection } from "../../components/FaqSection";
import styles from "./page.module.css";
import { TreatmentQuizModal } from "../../components/TreatmentQuizModal";


const SERVICE_DIFFERENCE = [
  {
    num: "01",
    title: "10-Year Warranty",
    desc: "We provide an industry-leading 10-year warranty on all stone, acrylic, and solid surface contracting works."
  },
  {
    num: "02",
    title: "In-House Execution",
    desc: "We execute 100% of our fabrication, blasting, and machining in-house to guarantee quality and timelines."
  },
  {
    num: "03",
    title: "Certified Engineers",
    desc: "Our project managers and welding operators hold leading safety and professional credentials."
  },
  {
    num: "04",
    title: "On-Site Turnkey Delivery",
    desc: "From initial design to final erection and inspection, we handle the complete contracting lifecycle."
  }
];


export default function ServicesPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 20 }}>
        <Navbar isLight={false} hasBorder={false} />
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.bgWrapper}>
          <Image
            src="/images/services/services_hero4.jpeg"
            alt="Brooq Al Khalij Services background"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.overlay} />

        <div className={styles.introGrid}>
          <div className={styles.rightColumnContent}>
            <div className={styles.contentArea}>
              <span className={styles.badge}>Our Core Offerings</span>
              <h1 className={styles.title}>
                Precision fabrication. Expert contracting.
              </h1>
              <button 
                className={styles.ctaButton}
                onClick={() => setIsContactOpen(true)}
              >
                <span className={styles.arrowIcon}>→</span> Book a consultation
              </button>
            </div>

            <div className={styles.featuresArea}>
              <div className={styles.dividerLine} />
              <div className={styles.featuresGrid}>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Custom CNC machining & heavy structural steel works
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Abrasive blasting & certified protective coating applications
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Commercial stone, solid surface, & warehousing contracting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredCardContainer}>
          <div className={styles.featuredBgWrapper}>
            <Image
              src="/images/services/services_featured.jpeg"
              alt="Precision Industrial Coatings"
              fill
              className={styles.featuredBgImage}
              sizes="100vw"
              priority
            />
          </div>

          <div className={styles.featuredCard}>
            <h2 className={styles.featuredCardTitle}>
              Precision Industrial Coatings
            </h2>

            <p className={styles.featuredCardDesc}>
              Protecting structural integrity with certified grit blasting (SA 2.5) and professional paint application layers optimized for durability and longevity.
            </p>

            <div className={styles.featuredChecklist}>
              <div className={styles.checkItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Advanced sandblasting &amp; surface profiling</span>
              </div>
              <div className={styles.checkItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Anti-corrosive epoxy &amp; fireproof intumescent layers</span>
              </div>
              <div className={styles.checkItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>ISO &amp; environmental safety standard compliance</span>
              </div>
            </div>

            <div className={styles.featuredCardBtnGroup}>
              <button
                className={styles.featuredPrimaryBtn}
                onClick={() => setIsContactOpen(true)}
              >
                Book coating service
              </button>
              <Link href="/products" className={styles.featuredSecondaryBtn}>
                <span>→ Learn more</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContainer}>
          {/* Left Column */}
          <div className={styles.benefitsLeft}>
            <h2 className={styles.benefitsTitle}>Services</h2>
            <div className={styles.benefitsDivider} />
            <p className={styles.benefitsDesc}>
              Maximize operational efficiency, guarantee structural compliance, and extend asset lifespans with our certified industrial solutions.
            </p>
            <button 
              className={styles.benefitsCta}
              onClick={() => setIsContactOpen(true)}
            >
              ↳ Get started
            </button>
          </div>

          {/* Right Column */}
          <div className={styles.benefitsRight}>
            {/* Service 1: Steel Fabrication */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/steel2.jpeg"
                  alt="Steel Fabrication"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Steel Fabrication</h3>
                <p className={styles.benefitRowDesc}>
                  Custom heavy structural steel columns, crane girders, and customized iron baskets built to exact design specifications.
                </p>
              </div>
            </div>

            {/* Service 2: Sand Blasting & Painting */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/painting2.jpeg"
                  alt="Sand Blasting & Painting"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Sand Blasting &amp; Painting</h3>
                <p className={styles.benefitRowDesc}>
                  Certified grit blasting (SA 2.5) and professional coating application profiles for anti-corrosion and fire-proofing.
                </p>
              </div>
            </div>

            {/* Service 3: Solid Surface & Stone */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/stone.jpeg"
                  alt="Solid Surface & Stone"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Solid Surface &amp; Stone</h3>
                <p className={styles.benefitRowDesc}>
                  Premium stone countertops, solid acrylic vanity tops, and custom kitchen surface installations with a 10-year warranty.
                </p>
              </div>
            </div>

            {/* Service 4: Civil Contracting */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/general2.jpeg"
                  alt="Civil Contracting"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Civil Contracting</h3>
                <p className={styles.benefitRowDesc}>
                  Turnkey commercial warehouses, structural foundation work, office containers, and industrial worksite setup in KSA.
                </p>
              </div>
            </div>

            {/* Service 5: Forklift & Equipment Repair */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/forkliftrepair.jpeg"
                  alt="Forklift & Equipment Repair"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Forklift &amp; Equipment Repair</h3>
                <p className={styles.benefitRowDesc}>
                  Expert mechanical and engine repair services for heavy machinery, forklifts, lifting gears, and transport fleets.
                </p>
              </div>
            </div>

            {/* Service 6: Trading & Material Supply */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/trading.jpeg"
                  alt="Trading & Material Supply"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Trading &amp; Material Supply</h3>
                <p className={styles.benefitRowDesc}>
                  Sourcing and supplying certified carbon steel, industrial hardware, fasteners, and safety equipment at competitive rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Quality Testing Section */}
      <section className={styles.testingSection}>
        <div className={styles.testingContainer}>
          {/* Header Area */}
          <div className={styles.testingHeader}>
            <h2 className={styles.testingTitle}>
              Always quality tested, with proven results
            </h2>
            <div className={styles.testingGraphics}>
              <div className={`${styles.tiltedPhoto} ${styles.photo1}`}>
                <Image
                  src="/images/home/category_grid/safety_3.jpeg"
                  alt="Industrial Testing 1"
                  fill
                  className={styles.benefitImg}
                  sizes="100px"
                />
              </div>
              <div className={`${styles.tiltedPhoto} ${styles.photo2}`}>
                <Image
                  src="/images/home/category_grid/container_3.jpeg"
                  alt="Industrial Testing 2"
                  fill
                  className={styles.benefitImg}
                  sizes="100px"
                />
              </div>
              <div className={`${styles.tiltedPhoto} ${styles.photo3}`}>
                <Image
                  src="/images/home/category_grid/lifting_3.jpeg"
                  alt="Industrial Testing 3"
                  fill
                  className={styles.benefitImg}
                  sizes="100px"
                />
              </div>
            </div>
          </div>

          {/* Body Area */}
          <div className={styles.testingBody}>
            {/* Left Description */}
            <div className={styles.testingLeftDesc}>
              <p className={styles.testingMainDesc}>
                Our fabrications and coatings are subjected to strict third-party inspections and testing protocols prior to site delivery.
              </p>
              <p className={styles.testingSubDesc}>
                We maintain full traceability for carbon steel mill test certificates (MTC) and dry film paint thickness (DFT) logs. Our quality control processes comply with ISO 9001, AWS welding standards, and KSA industrial safety codes to guarantee structural integrity.
              </p>
            </div>

            {/* Right Stack of Audits */}
            <div className={styles.testingRightStack}>
              {/* Row 1: NDT Inspection */}
              <div className={styles.testingRow}>
                <div className={styles.testingRowLabel}>
                  <h3 className={styles.testingRowTitle}>NDT Inspection</h3>
                  <span className={styles.testingRowBadge}>✓ Passed</span>
                </div>
                <p className={styles.testingRowDesc}>
                  Non-Destructive Testing, including ultrasonic (UT) and magnetic particle testing (MT), is performed on load-bearing welds to guarantee zero defect propagation.
                </p>
              </div>

              {/* Row 2: DFT Coating Verification */}
              <div className={styles.testingRow}>
                <div className={styles.testingRowLabel}>
                  <h3 className={styles.testingRowTitle}>DFT Coating</h3>
                  <span className={styles.testingRowBadge}>✓ Passed</span>
                </div>
                <p className={styles.testingRowDesc}>
                  Dry Film Thickness tests verify coating layers against structural blueprints, ensuring perfect anti-corrosive protection in extreme salt and heat environments.
                </p>
              </div>

              {/* Row 3: Load Deflection */}
              <div className={styles.testingRow}>
                <div className={styles.testingRowLabel}>
                  <h3 className={styles.testingRowTitle}>Load Deflection</h3>
                  <span className={styles.testingRowBadge}>✓ Compliant</span>
                </div>
                <p className={styles.testingRowDesc}>
                  Deflection and structural load tests are executed to confirm that steel containers, baskets, and cranes withstand up to 150% of rated working load limits (WLL).
                </p>
              </div>

              {/* Row 4: Material Traceability */}
              <div className={styles.testingRow}>
                <div className={styles.testingRowLabel}>
                  <h3 className={styles.testingRowTitle}>Traceability</h3>
                  <span className={styles.testingRowBadge}>✓ Verified</span>
                </div>
                <p className={styles.testingRowDesc}>
                  Mill Test Certificates (MTC) are logged for every batch of carbon steel sourced, validating mechanical tensile strength and chemical composition compliance.
                </p>
              </div>
          </div>
        </div>
      </div>
    </section>

      {/* How It Works Section */}
      <section className={styles.howSection}>
        <div className={styles.howCardContainer}>
          <div className={styles.howBgWrapper}>
            <Image
              src="/images/services/services_howitworks.jpeg"
              alt="How it works background"
              fill
              className={styles.howBgImage}
              sizes="100vw"
              quality={100}
              priority
            />
          </div>
          <div className={styles.howOverlay} />

          <div className={styles.howContainer}>
            <div className={styles.howContent}>
              <h2 className={styles.howTitle}>How it works</h2>

              <div className={styles.howSteps}>
                {/* Step 1 */}
                <div className={styles.howStep}>
                  <span className={styles.howStepNum}>01</span>
                  <div className={styles.howStepText}>
                    <h3 className={styles.howStepTitle}>Design &amp; Blueprinting</h3>
                    <p className={styles.howStepDesc}>
                      Submit your CAD designs or work directly with our engineering team to map out detailed load-bearing specs and surface requirements.
                    </p>
                  </div>
                </div>

                <div className={styles.howStepDivider} />

                {/* Step 2 */}
                <div className={styles.howStep}>
                  <span className={styles.howStepNum}>02</span>
                  <div className={styles.howStepText}>
                    <h3 className={styles.howStepTitle}>Precision Fabrication</h3>
                    <p className={styles.howStepDesc}>
                      Our certified workshops execute structural steel works, CNC milling, custom iron baskets, and grit blasting to AWS and SA 2.5 standards.
                    </p>
                  </div>
                </div>

                <div className={styles.howStepDivider} />

                {/* Step 3 */}
                <div className={styles.howStep}>
                  <span className={styles.howStepNum}>03</span>
                  <div className={styles.howStepText}>
                    <h3 className={styles.howStepTitle}>Site Delivery &amp; Erection</h3>
                    <p className={styles.howStepDesc}>
                      We coordinate prompt logistics across KSA, transporting and erecting your structures with certified site safety protocols.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Stories / Testimonials Section */}
      <section className={styles.storiesSection}>
        <div className={styles.storiesContainer}>
          <div className={styles.storiesHeader}>
            <h2 className={styles.storiesTitle}>Real Stories, Real Results</h2>
            <div className={styles.storiesSubtitle}>
              <span>Discover reviews from</span>
              <span className={styles.verifiedBadge}>
                <span className={styles.verifiedCheck}>✓</span> Verified Clients
              </span>
            </div>
          </div>

          <div className={styles.storiesGrid}>
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Brooq Al Khalij&apos;s steel fabrication division exceeded all our requirements. The custom heavy-duty baskets were built precisely to blueprint specifications and hold up under immense daily load capacities.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Eng. Khalid A.</span>
            </div>

            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;We contracted Brooq Al Khalij for our chemical terminal tank blasting and protective coating works. Their SA 2.5 prep and epoxy coatings are flawless, completely matching our strict ISO specs.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Fahad M.</span>
            </div>

            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Outstanding warehousing construction services. They managed everything from structural load calculations to final erection and turnkey sign-off. Highly recommend their contracting teams.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Sultan S.</span>
            </div>
          </div>

          <div className={styles.storiesControls}>
            <button className={styles.controlBtn}>←</button>
            <button className={styles.controlBtn}>→</button>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <FaqSection />

      {/* Footer without StayUpToDate */}
      <Footer />

      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
