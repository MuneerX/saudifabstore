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
      <Navbar isLight={false} hasBorder={false} />

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

          {/* Right Column: All 11 Services & Divisions */}
          <div className={styles.benefitsRight}>
            {/* Service 1: Steel Fabrication */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/steel2.jpeg"
                  alt="Heavy Structural Steel Fabrication"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Heavy Structural Steel Fabrication</h3>
                <p className={styles.benefitRowDesc}>
                  Custom structural steel columns, roof trusses, crane girders, and heavy-duty transportable iron baskets engineered to exact AWS blueprints.
                </p>
              </div>
            </div>

            {/* Service 2: Sandblasting & Media Blasting */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/blasting.jpeg"
                  alt="Sandblasting & Media Blasting Services"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Sandblasting &amp; Media Blasting</h3>
                <p className={styles.benefitRowDesc}>
                  Certified abrasive grit blasting (SA 2.5), aluminum oxide blasting, glass bead satin finishing, and substrate-safe plastic media blasting.
                </p>
              </div>
            </div>

            {/* Service 3: Painting & Protective Coatings */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/blast2.jpeg"
                  alt="Painting & Protective Coatings"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Painting &amp; Protective Coatings</h3>
                <p className={styles.benefitRowDesc}>
                  Anti-corrosive epoxy primers, polyurethane finishes, siloxanes, zinc coats, dry film thickness (DFT) logging, and intumescent fireproofing.
                </p>
              </div>
            </div>

            {/* Service 4: Forklift Repair & Fleet Maintenance */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/forkliftrepair.jpeg"
                  alt="Forklift Repair & Fleet Maintenance"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Forklift Repair &amp; Fleet Maintenance</h3>
                <p className={styles.benefitRowDesc}>
                  Comprehensive workshop engine rebuilds, mast &amp; hydraulic system overhauls, mobile emergency repair units, and Annual Maintenance Contracts (AMC).
                </p>
              </div>
            </div>

            {/* Service 5: ProTorc Industrial Torquing & Machining */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/category_grid/lifting_3.jpeg"
                  alt="ProTorc Industrial Torquing & Machining"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>ProTorc Torquing &amp; On-Site Machining</h3>
                <p className={styles.benefitRowDesc}>
                  Hydraulic controlled bolt torquing, cold pipe cutting &amp; beveling (up to 60"), and leak-free flange facing machining for plant shutdowns.
                </p>
              </div>
            </div>

            {/* Service 6: Diesel Fire Pump Maintenance */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/category_grid/safety_3.jpeg"
                  alt="Diesel Pump Controller Maintenance"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Diesel Pump Controller Unit</h3>
                <p className={styles.benefitRowDesc}>
                  Testing &amp; maintenance of diesel fire pump controllers, automatic deluge triggers, manual emergency overrides, and dual battery charger setups.
                </p>
              </div>
            </div>

            {/* Service 7: Alfa Al-Arab Chemical Imports & Supply */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/trading.jpeg"
                  alt="Alfa Al-Arab Chemical Factory"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Alfa Al-Arab Chemical Factory</h3>
                <p className={styles.benefitRowDesc}>
                  Distributor of water treatment chemicals, organic raw materials, swimming pool treatments, commercial soaps, and industrial cleansers.
                </p>
              </div>
            </div>

            {/* Service 8: Paper & Plastic Factory Division */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/trading.jpeg"
                  alt="Paper & Plastic Factory Division"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Paper &amp; Plastic Factory Division</h3>
                <p className={styles.benefitRowDesc}>
                  High-speed automated converting of industrial paper packaging, custom shopping bags, retail boxes, wrapping sheets, and custom labels.
                </p>
              </div>
            </div>

            {/* Service 9: Brooq Stone Solid Surface & Quartz Factory */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/stone2.jpeg"
                  alt="Brooq Stone Solid Surface & Quartz"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Brooq Stone Solid Surface &amp; Quartz</h3>
                <p className={styles.benefitRowDesc}>
                  Seamless acrylic kitchen countertops, reception desks, quartz vanity tops, Corian Quality Network authorized thermoforming &amp; deep forming.
                </p>
              </div>
            </div>

            {/* Service 10: Smart Woodworks Division */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/stone.jpeg"
                  alt="Smart Woodworks Division"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Smart Woodworks &amp; Millwork</h3>
                <p className={styles.benefitRowDesc}>
                  Custom architectural corporate boardroom millwork, hotel wood reception desks, wardrobe fitouts, timber paneling, and CNC wood carving.
                </p>
              </div>
            </div>

            {/* Service 11: Brooq General Trading & PPE */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/trading.jpeg"
                  alt="Brooq General Trading & PPE"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>General Trading &amp; PPE Supply</h3>
                <p className={styles.benefitRowDesc}>
                  Sourcing and supplying certified PPE safety gear, professional hand/power tools, electrical fittings, plumbing, and sanitaryware fittings.
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
