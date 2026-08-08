"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "./page.module.css";
import { TreatmentQuizModal } from "../../components/TreatmentQuizModal";

const DIVISION_TABS = [
  { id: "steel", label: "Steel Fabrication" },
  { id: "blasting", label: "Blasting Works" },
  { id: "coatings", label: "Painting & Coatings" },
  { id: "forklift", label: "Forklift Repair" },
  { id: "protorc", label: "ProTorc Torquing" },
  { id: "diesel", label: "Diesel Pump Maintenance" },
  { id: "chemical", label: "Chemical Factory" },
  { id: "paper", label: "Paper & Plastic" },
  { id: "stone", label: "Brooq Stone" },
  { id: "wood", label: "Smart Woodworks" },
  { id: "trading", label: "General Trading" }
];

const DIVISION_ARTICLES: {
  [key: string]: Array<{ title: string; image: string }>;
} = {
  steel: [
    {
      title: "Heavy structural steel columns, columns grids, and assembly plates",
      image: "/images/home/services/steel.jpeg"
    },
    {
      title: "Custom steel transport baskets and overhead crane girder systems",
      image: "/images/home/services/steel2.jpeg"
    },
    {
      title: "Detailed workshop layout drawings and AWS engineering calculations",
      image: "/images/home/category_grid/container_3.jpeg"
    }
  ],
  blasting: [
    {
      title: "Traditional grit blasting with aluminum oxide to remove rust & mill scale",
      image: "/images/home/services/blasting.jpeg"
    },
    {
      title: "Glass bead blasting as a surface finish for a clean matte texture",
      image: "/images/home/services/blast2.jpeg"
    },
    {
      title: "Substrate-safe plastic media blasting for delicate fiberglass & aluminum",
      image: "/images/home/services/blasting3.jpeg"
    }
  ],
  coatings: [
    {
      title: "Anti-corrosive epoxy coat primers and intermediate protective layers",
      image: "/images/home/services/blast2.jpeg"
    },
    {
      title: "Urethanes, acrylics, siloxanes, enamels, and zinc coatings",
      image: "/images/home/services/blasting.jpeg"
    },
    {
      title: "DFT gauge measurements ensuring exact specification compliance",
      image: "/images/home/services/blasting3.jpeg"
    }
  ],
  forklift: [
    {
      title: "Forklift mechanical service, engine repair, and transmission overhauls",
      image: "/images/home/services/forkliftrepair.jpeg"
    },
    {
      title: "Tailored Annual Maintenance Contracts (AMC) for fleet operations",
      image: "/images/home/services/forkliftrepair.jpeg"
    },
    {
      title: "Mobile on-site technician dispatches for prompt emergency repairs",
      image: "/images/home/services/forkliftrepair.jpeg"
    }
  ],
  protorc: [
    {
      title: "Hydraulic controlled bolt torquing services with certified technicians",
      image: "/images/home/category_grid/lifting_3.jpeg"
    },
    {
      title: "Cold cutting & pipe beveling services for ranges up to 60 inches",
      image: "/images/home/category_grid/container_3.jpeg"
    },
    {
      title: "Flange facing services ensuring clean sealing surfaces in plants",
      image: "/images/home/category_grid/safety_3.jpeg"
    }
  ],
  diesel: [
    {
      title: "Diesel engine fire pump controllers with deluge valve triggering",
      image: "/images/home/category_grid/safety_3.jpeg"
    },
    {
      title: "Emergency manual start backup systems and hardwired pushbuttons",
      image: "/images/home/category_grid/lifting_3.jpeg"
    },
    {
      title: "Dual battery charger setups keeping controllers continuously powered",
      image: "/images/home/category_grid/container_3.jpeg"
    }
  ],
  chemical: [
    {
      title: "Alfa Al-Arab chemical supply: raw materials and water treatments",
      image: "/images/home/services/trading.jpeg"
    },
    {
      title: "Car wash detergents, hospital-grade soaps, and industrial cleansers",
      image: "/images/home/services/trading.jpeg"
    },
    {
      title: "Sodium metabisulfite, citric acid, and chlorine tablets distribution",
      image: "/images/home/services/trading.jpeg"
    }
  ],
  paper: [
    {
      title: "Paper and plastic packaging manufacturing for KSA enterprises",
      image: "/images/home/services/trading.jpeg"
    },
    {
      title: "Custom shopping bags, packaging boxes, and wrapping sheets",
      image: "/images/home/services/trading.jpeg"
    },
    {
      title: "High-speed automated paper converting and cutting operations",
      image: "/images/home/services/trading.jpeg"
    }
  ],
  stone: [
    {
      title: "Molded kitchen countertops, reception desks, and vanity tops",
      image: "/images/home/services/stone.jpeg"
    },
    {
      title: "Authorized Corian Quality Network fabrication and installation",
      image: "/images/home/services/stone2.jpeg"
    },
    {
      title: "Thermoforming, deep forming, and seamless joint techniques",
      image: "/images/home/services/stone.jpeg"
    }
  ],
  wood: [
    {
      title: "Smart Woodworks: custom cabinets, wardrobes, and corporate fitouts",
      image: "/images/home/services/stone2.jpeg"
    },
    {
      title: "CNC wood carving, architectural paneling, and interior trim works",
      image: "/images/home/services/stone.jpeg"
    },
    {
      title: "Timber profiling, lacquer polishing, and turnkey installations",
      image: "/images/home/services/stone2.jpeg"
    }
  ],
  trading: [
    {
      title: "PPE gear, safety helmets, protection goggles, and coveralls",
      image: "/images/home/services/trading.jpeg"
    },
    {
      title: "Professional hand/power tools, plumbing fixtures, and sanitaryware",
      image: "/images/home/services/trading.jpeg"
    },
    {
      title: "Fast local logistics, construction hardware, and supply contracts",
      image: "/images/home/services/trading.jpeg"
    }
  ]
};

const DIVISION_DETAILS: {
  [key: string]: {
    title: string;
    desc: string;
    checklist: string[];
    image: string;
  };
} = {
  steel: {
    title: "Heavy Structural Steel Fabrication",
    desc: "Our workshops specialize in heavy-duty structural steel fabrications from detailed blueprints. We fabricate structural steel columns, trusses, overhead crane girders, and custom heavy baskets built to carry high loads.",
    checklist: [
      "Heavy columns & roof rafters",
      "Overhead crane girder frames",
      "Custom transportable iron baskets",
      "Blueprint engineering compliance",
      "AWS certified welding inspection"
    ],
    image: "/images/home/services/steel2.jpeg"
  },
  blasting: {
    title: "Sandblasting & Media Blasting Services",
    desc: "Traditional sandblasting removes rust, mill scale, and paint coatings using aluminum oxide media. We also provide specialized glass bead blasting for satin finishes and plastic media blasting for damage-free coating removal.",
    checklist: [
      "Abrasive grit-blasting (SA 2.5)",
      "Aluminum oxide blasting media",
      "Glass bead blasting (matte finish)",
      "Plastic media blasting (substrate safe)",
      "Automobile & equipment frame prep"
    ],
    image: "/images/home/services/blasting.jpeg"
  },
  coatings: {
    title: "Painting & Protective Coatings",
    desc: "We apply epoxies, urethanes, acrylics, siloxanes, enamels, and zinc primers on steel and concrete surfaces. Our painters guarantee dry film thickness (DFT) logs match environmental and industrial specifications.",
    checklist: [
      "Anti-corrosive epoxy coats",
      "Polyurethane & siloxane finishes",
      "Dry Film Thickness (DFT) testing",
      "Intumescent fireproofing layers",
      "Fast-cure primers & zinc coats"
    ],
    image: "/images/home/services/blast2.jpeg"
  },
  forklift: {
    title: "Forklift Repair & Fleet Maintenance",
    desc: "Complete destination repairs for industrial warehouse forklift fleets. Our factory-trained technicians provide comprehensive workshop rebuilds, mobile dispatches, and tailored Annual Maintenance Contracts (AMC).",
    checklist: [
      "Engine & transmission overhauls",
      "Hydraulic system & mast fixes",
      "Planned preventative AMC programs",
      "Mobile emergency repair service",
      "Diagnostics & electrical tuning"
    ],
    image: "/images/home/services/forkliftrepair.jpeg"
  },
  protorc: {
    title: "ProTorc Industrial Torquing & Machining",
    desc: "ProTorc serves upstream and downstream oil & gas sectors, petrochemical plants, and cement industries. We specialize in hydraulic controlled bolt torquing, pipe cold cutting & beveling, and flange facing.",
    checklist: [
      "Hydraulic controlled bolt torquing",
      "Pipe cold cutting & beveling (to 60\")",
      "On-site flange facing machining",
      "API & ECITB certified technicians",
      "Leak-free joint completions"
    ],
    image: "/images/home/category_grid/lifting_3.jpeg"
  },
  diesel: {
    title: "Diesel Pump Controller Maintenance",
    desc: "Maintenance and testing of diesel engine driven fire pump controllers. We configure controllers for automatic pressure switch startup, manual Emergency overrides, deluge valves, and dual battery charging systems.",
    checklist: [
      "Automatic starts & deluge inputs",
      "Manual Emergency Start buttons",
      "Dual battery charger integrations",
      "Controller testing diagnostics",
      "Fire pump safety compliance"
    ],
    image: "/images/home/category_grid/safety_3.jpeg"
  },
  chemical: {
    title: "Alfa Al-Arab Chemical Imports & Supply",
    desc: "Established in 2009, Alfa Al-Arab is a chemical supplier located in Dammam. We supply water treatment chemicals, organic chemicals, swimming pool treatments, and detergents to hotels, laundries, and washing stations.",
    checklist: [
      "Organic & industrial chemicals",
      "Water treatment chemicals",
      "Swimming pool treatments",
      "Liquid detergents & soaps",
      "Sodium metabisulfite & chlorine tabs"
    ],
    image: "/images/home/services/trading.jpeg"
  },
  paper: {
    title: "Paper & Plastic Factory Division",
    desc: "We manufacture custom paper and plastic packaging products for industrial, logistics, and retail businesses. Our production lines supply shopping bags, packaging boxes, wrapping sheets, and custom labels.",
    checklist: [
      "Industrial paper packaging",
      "Custom plastic bags & wrappers",
      "Flexible packaging printing",
      "Retail wrapping & box supply",
      "High-speed automated converting"
    ],
    image: "/images/home/services/trading.jpeg"
  },
  stone: {
    title: "Brooq Stone Solid Surface & Quartz Factory",
    desc: "Established in 2000, Brooq Stone supplies premium quartz and acrylic solid surface countertops, reception counters, vanity tops, and wall cladding. We serve hotels, residential compounds, and private villas.",
    checklist: [
      "Seamless acrylic kitchen tops",
      "Quartz reception counters",
      "Natural stone vanity tops",
      "Corian Quality Network authorized",
      "Thermoforming & deep forming fitouts"
    ],
    image: "/images/home/services/stone2.jpeg"
  },
  wood: {
    title: "Smart Woodworks Division",
    desc: "Custom architectural millwork and cabinetry manufacturing. We produce premium corporate boardrooms, hotel reception desks, office storage layouts, wardrobes, and custom interior timber paneling.",
    checklist: [
      "Corporate boardroom millwork",
      "Hotel wood reception desks",
      "Custom wardrobe installations",
      "Timber paneling & polishing",
      "CNC routing & wood carving"
    ],
    image: "/images/home/services/stone.jpeg"
  },
  trading: {
    title: "Brooq General Trading & Supply",
    desc: "A major Tools and PPE distributor in Dammam. For over 10 years, we have supplied Saudi contractors with personal protective equipment (PPE), professional hand/power tools, electrical, plumbing, and sanitaryware.",
    checklist: [
      "PPE safety gear & coveralls",
      "Professional hand & power tools",
      "Electrical & plumbing items",
      "Sanitaryware fittings & decor",
      "Fast bulk construction deliveries"
    ],
    image: "/images/home/services/trading.jpeg"
  }
};

export default function DivisionsPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("steel");

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
            src="/images/home/services/service_bg.png"
            alt="Brooq Al Khalij Divisions background"
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
              <span className={styles.badge}>Specialized Divisions</span>
              <h1 className={styles.title}>
                Industrial excellence. Structural scale.
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
                    Custom Fabrication: ISO &amp; AWS certified manufacturing facilities
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Surface Treatments: Grit blasting and defensive coatings
                  </p>
                </div>
                <div className={styles.featureCol}>
                  <p className={styles.featureText}>
                    Contracting &amp; Logistics: Heavy equipment repair, stone, and civil projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Guide Section / Divisions Resource Guide */}
      <section className={styles.guideSection}>
        <div className={styles.guideTabsHeader}>
          {DIVISION_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.guideTabButton} ${
                activeTab === tab.id
                  ? styles.activeGuideTab
                  : styles.inactiveGuideTab
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.guideGridContainer}>
          <div className={styles.guideTitleArea}>
            <h2 className={styles.guideMainTitle}>Divisions Resource Guide</h2>
            <Link href="/products" className={styles.guideViewAll}>
              <span>→ View products &amp; services</span>
            </Link>
          </div>

          <div className={styles.guideCardsRow}>
            {DIVISION_ARTICLES[activeTab].map((article, idx) => (
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

      {/* Dynamic Division Details Section */}
      <section className={styles.detailsSection}>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsGrid}>
            {/* Left Content */}
            <div className={styles.detailsLeft}>
              <span className={styles.detailsBadge}>Division Capabilities</span>
              <h2 className={styles.detailsTitle}>
                {DIVISION_DETAILS[activeTab].title}
              </h2>
              <p className={styles.detailsDesc}>
                {DIVISION_DETAILS[activeTab].desc}
              </p>

              <div className={styles.detailsDivider} />

              <h4 className={styles.checklistHeadline}>Key Technical Scope:</h4>
              <div className={styles.detailsChecklist}>
                {DIVISION_DETAILS[activeTab].checklist.map((item, idx) => (
                  <div key={idx} className={styles.detailsCheckItem}>
                    <span className={styles.detailsCheckIcon}>✓</span>
                    <span className={styles.detailsCheckText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className={styles.detailsRight}>
              <div className={styles.detailsImageWrapper}>
                <Image
                  src={DIVISION_DETAILS[activeTab].image}
                  alt={DIVISION_DETAILS[activeTab].title}
                  fill
                  className={styles.detailsImage}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <TreatmentQuizModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
