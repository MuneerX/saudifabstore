"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaqSection } from "@/components/FaqSection";
import { ParallaxElement } from "@/components/ParallaxElement";
import { TextReveal } from "@/components/TextReveal";
import styles from "./page.module.css";
import { TreatmentQuizModal } from "@/components/TreatmentQuizModal";
import ServiceArrowIcon from "@/components/ServiceArrowIcon";
import { X } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  image: string;
  desc: string;
  client: string;
  duration: string;
  specifications: string[];
  fullDesc: string;
}

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "steel", label: "Steel Fabrication" },
  { id: "blasting", label: "Sandblasting & Prep" },
  { id: "coating", label: "Industrial Coatings" },
  { id: "stone", label: "Saudi Fab Stone" },
  { id: "protorc", label: "Protorc Bolting" }
];

const PROJECTS: ProjectItem[] = [
  {
    id: "tank-fab",
    title: "Heavy liquid storage tank refurbishing & chemical lining",
    category: "Steel Fabrication",
    categoryKey: "steel",
    location: "Dammam Industrial Area, KSA",
    image: "/images/portfolio/portfolio1.png",
    desc: "Complete structural repair, sandblasting, and multi-layer chemical-resistant coating of 50,000L tanks.",
    client: "National Petrochemical Co.",
    duration: "45 Days",
    specifications: [
      "Heavy gauge carbon steel wall reinforcement",
      "SA 2.5 Abrasive Sandblasting surface preparation",
      "Multi-coat anti-corrosive epoxy lining",
      "Full pressure leak testing & ISO certification"
    ],
    fullDesc: "Comprehensive industrial refurbishment of chemical storage vessels. The project involved structural steel wall replacement, full abrasive sandblasting to SA 2.5 standard, and precision application of high-durability chemical-resistant epoxy coatings."
  },
  {
    id: "readymix-refurb",
    title: "ReadyMix concrete truck fleet refurbishing & drum welding",
    category: "Sandblasting & Prep",
    categoryKey: "blasting",
    location: "Al Khobar Logistics Terminal, KSA",
    image: "/images/portfolio/portfolio2.png",
    desc: "Fleet-wide sandblasting, drum wall welding, and high-gloss polyurethane protective coating.",
    client: "Gulf Construction Materials Ltd",
    duration: "30 Days",
    specifications: [
      "Drum wall thickness ultrasonic inspection",
      "Glass bead abrasive residue removal",
      "Polyurethane topcoat with high UV resistance",
      "Heavy-duty mixing blade hard-facing"
    ],
    fullDesc: "Turnkey refurbishing of heavy-duty concrete transit mixer drums. Saudi Fab Store restored structural integrity through precision welding, cleaned all hardened residue via high-pressure sandblasting, and applied industrial polyurethane topcoats."
  },
  {
    id: "fire-proof",
    title: "Intumescent fire proof structural beam coating application",
    category: "Industrial Coatings",
    categoryKey: "coating",
    location: "Jubail Industrial City, KSA",
    image: "/images/portfolio/portfolio3.png",
    desc: "Certified 2-hour fire-rated intumescent coating applied across 12,000 sqm of structural steel framing.",
    client: "Jubail Energy & Power Infrastructure",
    duration: "60 Days",
    specifications: [
      "2-hour UL-listed fire rating compliance",
      "Dry Film Thickness (DFT) calibrated precision application",
      "Non-destructive acoustic testing across all key spans",
      "Corrosion-inhibiting primer base coat"
    ],
    fullDesc: "Specialized fireproofing application for major industrial power facilities in Jubail. Applied certified intumescent coatings designed to expand under extreme thermal exposure, protecting critical structural steel load-bearing columns."
  },
  {
    id: "pipe-loader",
    title: "Petroleum pipe loader modification & structural trusses",
    category: "Steel Fabrication",
    categoryKey: "steel",
    location: "Ras Tanura Port Terminal, KSA",
    image: "/images/portfolio/portfolio4.png",
    desc: "Custom structural modification of heavy pipe loading trusses for offshore oil loading docks.",
    client: "Eastern Maritime Logistics",
    duration: "25 Days",
    specifications: [
      "High-tensile structural steel fabrication",
      "Hydraulic load arm integration",
      "Marine-grade zinc-rich primer application",
      "NDT radiographic weld testing"
    ],
    fullDesc: "Engineering design modification and workshop fabrication of structural pipe loading ramps. Built using heavy structural carbon steel and finished with marine-grade anti-corrosive primer to withstand saltwater marine environments."
  },
  {
    id: "tool-baskets",
    title: "Heavy cargo & offshore EN 12079 tool basket fabrication",
    category: "Steel Fabrication",
    categoryKey: "steel",
    location: "Dammam Port Offshore Base, KSA",
    image: "/images/portfolio/portfolio5.png",
    desc: "EN 12079 / DNV certified heavy-duty steel tool baskets and offshore cargo containers.",
    client: "Offshore Marine Energy Solutions",
    duration: "18 Days",
    specifications: [
      "10-Ton certified maximum payload capacity",
      "DNV 2.7-1 safety lifting lug certification",
      "Hot-dip galvanized anti-rust finishing",
      "Integrated heavy tool racks and safety drop gates"
    ],
    fullDesc: "Production of heavy-duty steel cargo baskets engineered specifically for offshore rig transportation. Features reinforced floor grids, certified corner lifting eyes, and hot-dip galvanization for long-term corrosion resistance."
  },
  {
    id: "marble-sandblast",
    title: "Architectural marble & granite facade abrasive sandblasting",
    category: "Sandblasting & Prep",
    categoryKey: "blasting",
    location: "Riyadh Commercial District, KSA",
    image: "/images/portfolio/portfolio6.png",
    desc: "Precision abrasive micro-sandblasting for decorative texturing of natural granite and stone facades.",
    client: "Riyadh Architectural Development Co.",
    duration: "14 Days",
    specifications: [
      "Custom angular tooth profile media calibration",
      "Uniform slip-resistant surface texturing",
      "Zero-damage delicate stone edge control",
      "Hydrophobic protective sealer finish"
    ],
    fullDesc: "Architectural surface finishing for high-end commercial headquarters. Saudi Fab Store utilized specialized micro-abrasive media to create a uniform textured finish across natural granite wall cladding panels."
  },
  {
    id: "saudifabstore-stone-counter",
    title: "Saudi Fab Stone engineered quartz countertops & vanity slabs",
    category: "Saudi Fab Stone",
    categoryKey: "stone",
    location: "Dammam Luxury Hotel & Resort, KSA",
    image: "/images/portfolio/portfolio7.png",
    desc: "Custom CNC-machined quartz countertops, vanity tops, and seamless solid surface reception desks.",
    client: "Royal Khalij Hospitality Group",
    duration: "20 Days",
    specifications: [
      "Engineered stain-resistant saudifabstore Quartz slabs",
      "CNC precision edge profiling and sink cutouts",
      "Seamless thermal joint bonding technology",
      "10-Year certified factory warranty"
    ],
    fullDesc: "Turnkey solid surface design, CNC fabrication, and installation for a 5-star hotel project. Manufactured in our Dammam Saudi Fab Stone factory, delivering non-porous quartz surfaces with seamless joint execution."
  },
  {
    id: "protorc-bolting",
    title: "Protorc hydraulic torquing & flange joint integrity",
    category: "Protorc Bolting",
    categoryKey: "protorc",
    location: "Yanbu Industrial Complex, KSA",
    image: "/images/portfolio/portfolio9.png",
    desc: "High-precision hydraulic torque tightening and joint integrity verification for high-pressure pipelines.",
    client: "Saudi National Gas Pipeline Co.",
    duration: "15 Days",
    specifications: [
      "Calibrated hydraulic torque wrench execution",
      "Zero-leakage flange seal verification",
      "Ultrasound bolt elongation measurement",
      "Comprehensive digital torque log report"
    ],
    fullDesc: "Specialized on-site bolting services for high-pressure gas distribution pipelines. Utilizing Protorc precision hydraulic tools, our team guaranteed uniform bolt tensioning across high-pressure flange joints."
  },
  {
    id: "office-containers",
    title: "Modular insulated steel site office containers & trailers",
    category: "Steel Fabrication",
    categoryKey: "steel",
    location: "Neom Project Base Camp, KSA",
    image: "/images/portfolio/portfolio1.png",
    desc: "Heavy-duty structural steel framed site offices with fire-rated wall insulation and HVAC integration.",
    client: "Neom Contracting Consortium",
    duration: "30 Days",
    specifications: [
      "Heavy channel steel base frame construction",
      "Polyurethane sandwich panel thermal insulation",
      "Heavy electrical load distribution wiring",
      "Custom interior office workstations & AC units"
    ],
    fullDesc: "Modular site office container fabrication for mega-infrastructure project sites in KSA. Constructed with rigid steel frames to allow stacking and frequent site relocation while maintaining thermal comfort."
  }
];

export default function PortfolioPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const storiesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollStories = (direction: "left" | "right") => {
    if (storiesGridRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      storiesGridRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter(p => p.categoryKey === activeCategory);

  return (
    <div className={styles.pageWrapper}>
      {/* Navbar overlay matching About page */}
      <Navbar isLight={false} hasBorder={false} />

      {/* Hero Section matching About page layout grid */}
      <section className={styles.heroSection}>
        <ParallaxElement speed={-0.10} className={styles.bgWrapper}>
          <Image
            src="/images/portfolio_bg.jpeg"
            alt="Saudi Fab Store Works Showcase"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
        </ParallaxElement>

        {/* 12-column grid container matching AboutSection's introGrid */}
        <div className={styles.introGrid}>
          {/* Right Column Content starting at column 7 */}
          <div className={styles.rightColumnContent}>
            <div className={styles.contentArea}>
              <TextReveal animation="slide-up">
                <span className={styles.badge}>Portfolio &amp; Works</span>
              </TextReveal>
              <TextReveal animation="blur" delay={0.15}>
                <h1 className={styles.title}>
                  Proven Engineering. Executed Across 2,000+ Projects.
                </h1>
              </TextReveal>
              <Link href="/contact" className={styles.ctaButton}>
                <ServiceArrowIcon width={10} height={18} /> Request Project Proposal
              </Link>
            </div>

            <div className={styles.featuresArea}>
              <div className={styles.dividerLine} />
              <div className={styles.featuresGrid}>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Heavy structural steel &amp; custom pipe loading trusses
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    SA 2.5 abrasive sandblasting &amp; intumescent coatings
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Saudi Fab Stone solid surfaces &amp; Protorc hydraulic bolting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Guide Section matching About page Guide tabs */}
      <section className={styles.guideSection}>
        {/* Absolute header tabs overlapping border line */}
        <div className={styles.guideTabsHeader}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.guideTabButton} ${
                activeCategory === cat.id
                  ? styles.activeGuideTab
                  : styles.inactiveGuideTab
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.guideGridContainer}>
          <div className={styles.guideTitleArea}>
            <h2 className={styles.guideSubTitle}>Contracting Showcase</h2>
            <h2 className={styles.guideMainTitle}>Executed Works &amp; Project Studies</h2>
          </div>

          <div className={styles.guideCardsRow}>
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className={styles.guideCardLink}
                onClick={() => setSelectedProject(project)}
              >
                <div className={styles.guideCardImageWrapper}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={styles.guideCardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className={styles.cardCategoryBadge}>{project.category}</span>
                </div>
                <h3 className={styles.guideCardText}>{project.title}</h3>
                <p className={styles.cardLocationText}>📍 {project.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solution Showcase Section matching About page Featured Section */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredCardContainer}>
          <ParallaxElement speed={-0.05} className={styles.featuredBgWrapper}>
            <Image
              src="/images/blueprint_bg3.jpeg"
              alt="Featured Contracting Solution"
              fill
              className={styles.featuredBgImage}
              sizes="100vw"
              quality={100}
              unoptimized
              priority
            />
          </ParallaxElement>

          <div className={styles.featuredCard}>
            <h2 className={styles.featuredCardTitle}>
              From blueprint to <br />structural reality.
            </h2>

            <div className={styles.featuredCardDivider} />

            <p className={styles.featuredCardDesc}>
              Review our technical dossier of completed projects across Saudi Arabia. Submit your custom design drawings or contracting guidelines, and our senior engineering team will deliver a comprehensive project feasibility quote.
            </p>

            <Link href="/contact" className={styles.featuredPrimaryBtn}>
              Submit Project Request
            </Link>
          </div>
        </div>
      </section>

      {/* Real Stories, Real Results Section matching About page EXACTLY */}
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

      {/* Global Footer */}
      <Footer />

      {/* Lightbox Case Study Modal */}
      {selectedProject && mounted && createPortal(
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)} aria-label="Close">
              <X size={18} />
            </button>

            <div className={styles.modalImageWrapper}>
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className={styles.modalImage}
                unoptimized
              />
            </div>

            <div className={styles.modalBody}>
              <span className={styles.modalCategory}>{selectedProject.category}</span>
              <h2 className={styles.modalTitle}>{selectedProject.title}</h2>

              <div className={styles.modalMetaRow}>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>Client / Sector</span>
                  <span className={styles.modalMetaVal}>{selectedProject.client}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>Location</span>
                  <span className={styles.modalMetaVal}>{selectedProject.location}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>Duration</span>
                  <span className={styles.modalMetaVal}>{selectedProject.duration}</span>
                </div>
              </div>

              <p className={styles.modalDesc}>{selectedProject.fullDesc}</p>

              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px 0', color: '#111' }}>
                  Technical Specifications &amp; Work Execution:
                </h4>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedProject.specifications.map((spec, i) => (
                    <li key={i} style={{ fontSize: '13.5px', color: '#54514A' }}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '12px' }}>
                <Link 
                  href="/contact"
                  className={styles.featuredPrimaryBtn}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Inquire About Similar Project</span>
                  <ServiceArrowIcon width={10} height={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Quote / Quiz Modal */}
      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

