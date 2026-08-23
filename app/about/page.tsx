"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AboutPageSection } from "../../components/AboutPageSection";
import { FaqSection } from "../../components/FaqSection";
import { ParallaxElement } from "../../components/ParallaxElement";
import { TextReveal } from "../../components/TextReveal";
import ServiceArrowIcon from "../../components/ServiceArrowIcon";
import styles from "./page.module.css";
import { TreatmentQuizModal } from "../../components/TreatmentQuizModal";
import { ResourceGuideModal, GUIDE_ARTICLES_DATA, ResourceArticle } from "../../components/ResourceGuideModal";
import { CoreValueModal, CORE_VALUES_DATA, CoreValueItem } from "../../components/CoreValueModal";

const GUIDE_TABS = [
  { id: "general", label: "General" },
  { id: "quality", label: "Quality & Safety" },
  { id: "engineering", label: "Engineering & Design" }
];

const GUIDE_ARTICLES: {
  [key: string]: ResourceArticle[];
} = {
  general: [
    GUIDE_ARTICLES_DATA["general-0"],
    GUIDE_ARTICLES_DATA["general-1"],
    GUIDE_ARTICLES_DATA["general-2"]
  ],
  quality: [
    GUIDE_ARTICLES_DATA["quality-0"],
    GUIDE_ARTICLES_DATA["quality-1"],
    GUIDE_ARTICLES_DATA["quality-2"]
  ],
  engineering: [
    GUIDE_ARTICLES_DATA["engineering-0"],
    GUIDE_ARTICLES_DATA["engineering-1"],
    GUIDE_ARTICLES_DATA["engineering-2"]
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
    desc: "Saudi Fab Store has professional workers and engineers who are qualified from correspondent academies."
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
  const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);
  const [selectedCoreValue, setSelectedCoreValue] = useState<CoreValueItem | null>(null);
  const storiesGridRef = useRef<HTMLDivElement>(null);

  const scrollStories = (direction: "left" | "right") => {
    if (storiesGridRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      storiesGridRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar overlay */}
      <Navbar isLight={false} hasBorder={false} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <ParallaxElement speed={-0.10} className={styles.bgWrapper}>
          <Image
            src="/images/about/about_hero2.jpeg"
            alt="About Saudi Fab Store"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
        </ParallaxElement>
        <div className={styles.overlay} />

        {/* 12-column grid container matching AboutSection's introGrid */}
        <div className={styles.introGrid}>
          {/* Right Column Content starting at column 7 */}
          <div className={styles.rightColumnContent}>
            <div className={styles.contentArea}>
              <TextReveal animation="slide-up">
                <span className={styles.badge}>Who We Are</span>
              </TextReveal>
              <TextReveal animation="blur" delay={0.15}>
                <h1 className={styles.title}>
                  Built for strength. Engineered to last.
                </h1>
              </TextReveal>
              <Link href="/contact" className={styles.ctaButton}>
                <ServiceArrowIcon width={10} height={18} /> Get started today
              </Link>
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
                    ISO-certified quality &amp; structural engineering
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Reliable contracting &amp; project execution in KSA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
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
          </div>

          <div className={styles.guideCardsRow}>
            {GUIDE_ARTICLES[activeGuideTab].map((article, idx) => (
              <div
                key={idx}
                className={styles.guideCardLink}
                onClick={() => setSelectedArticle(article)}
                style={{ cursor: "pointer" }}
              >
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body Details */}
      <AboutPageSection />

      {/* Difference Section */}
      <section className={styles.differenceSection}>
        <div className={styles.topTransitionGlow} />
        <div className={styles.differenceContainer}>
          <h2 className={styles.differenceHeadline}>
            The Saudi Fab Store Difference
          </h2>

          <div className={styles.differenceFeaturedBox}>
            <ParallaxElement speed={-0.10} className={styles.differenceImageWrapper}>
              <Image
                src="/images/about/about_container2.png"
                alt="Saudi Fab Store Featured Container"
                fill
                className={styles.differenceImage}
                sizes="(max-width: 900px) 100vw, 1000px"
                quality={95}
                priority
              />
            </ParallaxElement>
            <Link href="/products" className={styles.differenceCtaBtn}>
              View products
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
          <div className={styles.calculatorsTitleArea}>
            <h2 className={styles.calculatorsTitle}>
              Core Values &amp; <br />
              <span className={styles.spanHighlight}>Commitments</span>
            </h2>
          </div>

          <div className={styles.calculatorsDivider} />

          <div className={styles.topCalculatorsRow}>
            <div className={styles.calculatorsHeaderArea}>
              <p className={styles.calculatorsDesc}>
                We build with absolute integrity, ensuring every project meets rigorous Saudi and international standards for safety, durability, and craftsmanship.
              </p>
              <Link href="/contact" className={styles.calculatorsHeaderBtn}>
                Inquire about standards
              </Link>
            </div>

            {/* Top Card 1: ISO Standards & Quality */}
            <div
              className={`${styles.calcCard} ${styles.topCalcCard1}`}
              onClick={() => setSelectedCoreValue(CORE_VALUES_DATA.iso)}
              style={{ cursor: "pointer" }}
            >
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

              <div className={styles.calcCardLink}>
                <ServiceArrowIcon width={10} height={18} />
                <span>View Quality Policy</span>
              </div>
            </div>

            {/* Top Card 2: Uncompromising Safety */}
            <div
              className={`${styles.calcCard} ${styles.topCalcCard2}`}
              onClick={() => setSelectedCoreValue(CORE_VALUES_DATA.safety)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/safety3.png"
                  alt="Safety Protocols"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.topCalcCardTitle}>
                Uncompromising Safety Protocols
              </h3>

              <div className={styles.calcCardLink}>
                <ServiceArrowIcon width={10} height={18} />
                <span>View Safety Standards</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Cards */}
          <div className={styles.bottomCalculatorsRow}>
            {/* Bottom Card 1: Professional Execution */}
            <div
              className={`${styles.calcCard} ${styles.bottomCalcCard1}`}
              onClick={() => setSelectedCoreValue(CORE_VALUES_DATA.execution)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.cardBgImageWrapper}>
                <Image
                  src="/images/about/professional3.png"
                  alt="Professional Execution"
                  fill
                  className={styles.cardBgImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className={styles.calcCardTitle}>
                Professional &amp; Certified Execution
              </h3>

              <div className={styles.calcCardLink}>
                <ServiceArrowIcon width={10} height={18} />
                <span>Meet Our Engineers</span>
              </div>
            </div>

            {/* Bottom Card 2: Customer-First Approach */}
            <div
              className={`${styles.calcCard} ${styles.bottomCalcCard2}`}
              onClick={() => setSelectedCoreValue(CORE_VALUES_DATA.support)}
              style={{ cursor: "pointer" }}
            >
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

              <div className={styles.calcCardLink}>
                <ServiceArrowIcon width={10} height={18} />
                <span>Contact Support</span>
              </div>
            </div>

            {/* Bottom Card 3: Value & Durability */}
            <div
              className={`${styles.calcCard} ${styles.bottomCalcCard3}`}
              onClick={() => setSelectedCoreValue(CORE_VALUES_DATA.durability)}
              style={{ cursor: "pointer" }}
            >
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

              <div className={styles.calcCardLink}>
                <ServiceArrowIcon width={10} height={18} />
                <span>View ROI Details</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solution Showcase Section */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredCardContainer}>
          <ParallaxElement speed={-0.10} className={styles.featuredBgWrapper}>
            <Image
              src="/images/about/about_precision.jpeg"
              alt="Featured Contracting Solution"
              fill
              className={styles.featuredBgImage}
              sizes="100vw"
              priority
            />
          </ParallaxElement>

          <div className={styles.featuredCard}>
            <h2 className={styles.featuredCardTitle}>
              Build with absolute strength, <br />project with confidence
            </h2>

            <div className={styles.featuredCardDivider} />

            <p className={styles.featuredCardDesc}>
              Custom structural steel, precision industrial fabrication, and high-durability coatings engineered to secure your facilities, support heavy operations, and guarantee lasting reliability.
            </p>

            <Link href="/contact" className={styles.featuredPrimaryBtn}>
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Customer Stories Section */}
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

          <div ref={storiesGridRef} className={styles.storiesGrid}>
            {/* Card 1 */}
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Saudi Fab Store&apos;s engineering team is top-notch. They responded quickly, providing incredibly helpful structural load calculations. Their prompt replies and support made our warehouse design process effortless.&rdquo;
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
                &ldquo;Saudi Fab Store helped us deliver our logistics terminal project on schedule. Their execution team is extremely professional and their anti-corrosive blast coatings are durable. They really give you peace of mind.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Sultan S.</span>
            </div>

            {/* Card 4 (New) */}
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Our Saudi Aramco certified pipe racks and structural steel skid frames arrived fully compliant with AWS D1.1 specifications. Excellent workshop craftsmanship and material traceability.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Tariq H. — Project Director</span>
            </div>

            {/* Card 5 (New) */}
            <div className={styles.storyCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.storyText}>
                &ldquo;Outstanding sandblasting surface preparation and C5-M marine coating durability for our heavy contracting fleet in Dammam Industrial Area. Highly recommended partner.&rdquo;
              </p>
              <span className={styles.storyAuthor}>Mohammad N. — Operations Manager</span>
            </div>
          </div>

          <div className={styles.storiesControls}>
            <button onClick={() => scrollStories("left")} className={styles.controlBtn}>←</button>
            <button onClick={() => scrollStories("right")} className={styles.controlBtn}>→</button>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ResourceGuideModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onContactClick={() => setIsContactOpen(true)}
      />

      <CoreValueModal
        valueItem={selectedCoreValue}
        isOpen={!!selectedCoreValue}
        onClose={() => setSelectedCoreValue(null)}
        onContactClick={() => setIsContactOpen(true)}
      />
    </div>
  );
}

