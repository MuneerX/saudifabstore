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

const GUIDE_TABS = [
  { id: "general", label: "General" },
  { id: "quality", label: "Quality & Safety" },
  { id: "engineering", label: "Engineering & Design" }
];

const GUIDE_ARTICLES: {
  [key: string]: Array<{ title: string; image: string }>;
} = {
  general: [
    {
      title: "Why structural integrity is critical for heavy industrial storage",
      image: "/images/about/general1.jpeg"
    },
    {
      title: "A complete guide to lifting and material handling safety compliance",
      image: "/images/about/general_2.jpeg"
    },
    {
      title: "Essential protective coatings: how to combat steel oxidation",
      image: "/images/about/general3.jpeg"
    }
  ],
  quality: [
    {
      title: "Certified safety standards: understanding ISO 9001 in KSA fabrication",
      image: "/images/about/quality1.jpeg"
    },
    {
      title: "Weld inspections and non-destructive testing (NDT) workflows",
      image: "/images/about/quality2.jpeg"
    },
    {
      title: "Dry film thickness (DFT) gauges: guaranteeing coating durability",
      image: "/images/about/quality3.jpeg"
    }
  ],
  engineering: [
    {
      title: "Custom structures: transitioning from initial CAD design to workshop floor",
      image: "/images/about/design1.jpeg"
    },
    {
      title: "Optimizing load capacities for large-scale contracting projects",
      image: "/images/about/design2.jpeg"
    },
    {
      title: "Sustainable carbon steel sourcing: grades, testing, and compliance",
      image: "/images/about/design3.jpeg"
    }
  ]
};

const DIFFERENCE_FEATURES = [
  {
    num: "01",
    title: "Quality on Works",
    desc: "From day one, our focus is delivering superior quality standards that ensure safety and long-term value."
  },
  {
    num: "02",
    title: "Value for Money",
    desc: "High quality always ends up costing clients less in the end — be it through solutions that improve productivity or safety."
  },
  {
    num: "03",
    title: "Professional Works",
    desc: "Brooq Al Khalij has professional workers and engineers who are qualified from correspondent academies."
  },
  {
    num: "04",
    title: "Extremely Affordable",
    desc: "We have our own workers and staff, so we can provide affordable prices. Experienced labors complete work faster."
  }
];

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState("general");

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
            src="/images/about/about_hero.jpeg"
            alt="About Brooq Al Khalij"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.overlay} />

        {/* 12-column grid container matching AboutSection's introGrid */}
        <div className={styles.introGrid}>
          {/* Right Column Content starting at column 7 */}
          <div className={styles.rightColumnContent}>
            <div className={styles.contentArea}>
              <span className={styles.badge}>Who We Are</span>
              <h1 className={styles.title}>
                Built for strength. Engineered to last.
              </h1>
              <button 
                className={styles.ctaButton}
                onClick={() => setIsContactOpen(true)}
              >
                <span className={styles.arrowIcon}>→</span> Get started today
              </button>
            </div>

            <div className={styles.featuresArea}>
              <div className={styles.dividerLine} />
              <div className={styles.featuresGrid}>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Tailored, high-capacity fabrication solutions
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    ISO-certified quality & structural engineering
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Reliable contracting & project execution in KSA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section (Implementing tabbed guide structure like attached image) */}
      <section className={styles.guideSection}>
        {/* Absolute header tabs overlapping border line */}
        <div className={styles.guideTabsHeader}>
          {GUIDE_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.guideTabButton} ${
                activeGuideTab === tab.id
                  ? styles.activeGuideTab
                  : styles.inactiveGuideTab
              }`}
              onClick={() => setActiveGuideTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.guideGridContainer}>
          <div className={styles.guideTitleArea}>
            <h2 className={styles.guideMainTitle}>Industrial Resource Guide</h2>
            <Link href="/products" className={styles.guideViewAll}>
              <span>→ View all</span>
            </Link>
          </div>

          <div className={styles.guideCardsRow}>
            {GUIDE_ARTICLES[activeGuideTab].map((article, idx) => (
              <Link key={idx} href="/products" className={styles.guideCardLink}>
                <div className={styles.guideCardImageWrapper}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className={styles.guideCardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className={styles.guideCardText}>{article.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Body Details - Render the standard AboutSection component ("Delivering proven quality structures...") immediately after Guide section */}
      <AboutSection />

      {/* Difference Section (Reusing Why Choose features from homepage styled after reference image) */}
      <section className={styles.differenceSection}>
        <div className={styles.differenceContainer}>
          <h2 className={styles.differenceHeadline}>
            The Brooq Al Khalij Difference
          </h2>

          <div className={styles.differenceFeaturedBox}>
            <div className={styles.differenceImageWrapper}>
              <Image
                src="/images/about/about_container2.png"
                alt="Brooq Al Khalij Featured Container"
                fill
                className={styles.differenceImage}
                sizes="(max-width: 900px) 100vw, 1000px"
                quality={95}
                priority
              />
            </div>
            <Link href="/products" className={styles.differenceCtaBtn}>
              View featured product
            </Link>
          </div>

          <div className={styles.differenceFeaturesGrid}>
            {DIFFERENCE_FEATURES.map((item) => (
              <div key={item.num} className={styles.differenceFeatureCard}>
                <span className={styles.differenceNumber}>{item.num}</span>
                <h3 className={styles.differenceFeatureTitle}>{item.title}</h3>
                <p className={styles.differenceFeatureDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values & Quality Commitments Section */}
      <section className={styles.calculatorsSection}>
        <div className={styles.calculatorsContainer}>
          
          {/* Headline block outside grid (above divider) */}
          <div className={styles.calculatorsTitleArea}>
            <h2 className={styles.calculatorsTitle}>
              Core Values &amp; <br />
              <span className={styles.spanHighlight}>Commitments</span>
            </h2>
          </div>

          {/* Black/Dark dashed divider line */}
          <div className={styles.calculatorsDivider} />

          {/* Grid Area: Description (left) alongside 2 tall cards (right) */}
          <div className={styles.topCalculatorsRow}>
            <div className={styles.calculatorsHeaderArea}>
              <p className={styles.calculatorsDesc}>
                We build with absolute integrity, ensuring every project meets rigorous Saudi and international standards for safety, durability, and craftsmanship.
              </p>
              <button 
                className={styles.calculatorsHeaderBtn}
                onClick={() => setIsContactOpen(true)}
              >
                Inquire about standards
              </button>
            </div>

            {/* Top Card 1: ISO Standards & Quality */}
            <div className={`${styles.calcCard} ${styles.topCalcCard1}`}>
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/iso2.png"
                  alt="ISO Standards"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.topCalcCardTitle}>
                ISO Standards &amp; Quality Control
              </h3>

              <Link href="/about" className={styles.calcCardLink}>
                <span>→ View Quality Policy</span>
              </Link>
            </div>

            {/* Top Card 2: Uncompromising Safety */}
            <div className={`${styles.calcCard} ${styles.topCalcCard2}`}>
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/protocol.png"
                  alt="Safety Protocols"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.topCalcCardTitle}>
                Uncompromising Safety Protocols
              </h3>

              <Link href="/about" className={styles.calcCardLink}>
                <span>→ View Safety Standards</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row: 3 Cards */}
          <div className={styles.bottomCalculatorsRow}>
            {/* Bottom Card 1: Professional Execution */}
            <div className={`${styles.calcCard} ${styles.bottomCalcCard1}`}>
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/professional.png"
                  alt="Professional Execution"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.calcCardTitle}>
                Professional &amp; Certified Execution
              </h3>

              <Link href="/about" className={styles.calcCardLink}>
                <span>→ Meet Our Engineers</span>
              </Link>
            </div>

            {/* Bottom Card 2: Customer-First Approach */}
            <div className={`${styles.calcCard} ${styles.bottomCalcCard2}`}>
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/support2.png"
                  alt="Customer-First Support"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.calcCardTitle}>
                Customer-First &amp; Emergency Support
              </h3>

              <Link href="/about" className={styles.calcCardLink}>
                <span>→ Contact Support</span>
              </Link>
            </div>

            {/* Bottom Card 3: Value & Durability */}
            <div className={`${styles.calcCard} ${styles.bottomCalcCard3}`}>
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/maximum.png"
                  alt="Maximum Value & Durability"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.calcCardTitle}>
                Maximum Value &amp; Long-Term Durability
              </h3>

              <Link href="/about" className={styles.calcCardLink}>
                <span>→ View ROI Details</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solution Showcase Section (Nesting inside container card, flush bottom-right) */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredCardContainer}>
          {/* Background Image Layer */}
          <div className={styles.featuredBgWrapper}>
            <Image
              src="/images/about/about_precision2.jpeg"
              alt="Featured Contracting Solution"
              fill
              className={styles.featuredBgImage}
              sizes="100vw"
              priority
            />
          </div>

          {/* White Card Content (Aligned to right bottom, flush with the parent edges without spaces) */}
          <div className={styles.featuredCard}>
            <h2 className={styles.featuredCardTitle}>
              Build with absolute strength, <br />project with confidence
            </h2>

            <div className={styles.featuredCardDivider} />

            <p className={styles.featuredCardDesc}>
              Custom structural steel, precision industrial fabrication, and high-durability coatings engineered to secure your facilities, support heavy operations, and guarantee lasting reliability.
            </p>

            <button 
              className={styles.featuredPrimaryBtn}
              onClick={() => setIsContactOpen(true)}
            >
              Get started
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials / Customer Stories Section (Real Stories, Real Results) */}
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
            {/* Card 1 */}
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Brooq Al Khalij&apos;s engineering team is top-notch. They responded quickly, providing incredibly helpful structural load calculations. Their prompt replies and support made our warehouse design process effortless.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Eng. Khalid A.</span>
            </div>

            {/* Card 2 */}
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;I am thrilled with the exceptional quality of structural steel fabrication. A minor specification adjustment was swiftly resolved, and our heavy industrial vessels arrived well-packaged and promptly on site.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Fahad M.</span>
            </div>

            {/* Card 3 */}
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Brooq Al Khalij helped us deliver our logistics terminal project on schedule. Their execution team is extremely professional and their anti-corrosive blast coatings are durable. They really give you peace of mind.&rdquo;
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

      {/* Accordion FAQ Section reused from homepage */}
      <FaqSection />

      {/* Footer — StayUpToDate removed */}
      <Footer />

      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
