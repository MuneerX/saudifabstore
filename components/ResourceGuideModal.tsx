"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import styles from "./ResourceGuideModal.module.css";

export interface ResourceArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  readTime: string;
  paragraphs: string[];
}

export const GUIDE_ARTICLES_DATA: { [key: string]: ResourceArticle } = {
  "general-0": {
    id: "general-0",
    title: "Why structural integrity is critical for heavy industrial storage",
    category: "General Engineering",
    image: "/images/about/general1_processed.jpeg",
    readTime: "8 min read",
    paragraphs: [
      "Heavy industrial skips, hoppers, and storage containers operating in Saudi Arabia's major industrial hubs—such as Dammam 2nd Industrial City, Jubail Industrial City, and Ras Al Khair—are subjected to extreme operational demands. Equipment must continuously sustain massive static payloads, intense forklift transport shocks, dynamic crane lifting accelerations, and harsh desert ambient temperatures exceeding +50°C. Ensuring certified structural integrity is not merely a matter of equipment durability; it is an indispensable operational requirement to prevent catastrophic structural collapse, costly facility downtime, and workplace safety hazards.",
      "Engineering for long-term structural integrity begins at the CAD design phase through Finite Element Analysis (FEA) computer modeling. By simulating von Mises stress distributions under combined static and dynamic load vectors, structural engineers identify high-stress concentration nodes. High-grade carbon steel plates conforming to ASTM A36, EN 10025 S275JR, or S355J2+N standards are selected based on required yield strength margins. Critical corner posts, trunnion pin mounts, and floor channels are reinforced with heavy-duty gusset plates and continuous stiffeners to eliminate structural flex, metal fatigue, and permanent deformation.",
      "Welding execution adheres strictly to AWS D1.1 structural welding standards. Full-penetration butt joins and continuous fillet seam welds are specified across all primary load paths, eliminating internal air pockets and moisture traps that accelerate internal rust. Weld joints undergo rigorous pre-weld beveling and interpass temperature controls, followed by 100% visual inspection and selective Magnetic Particle Inspection (MPI) to detect sub-surface micro-cracks before equipment leaves the workshop floor.",
      "Surface protection plays an equal role in preserving structural integrity. Fabrications undergo abrasive blast cleaning to ISO 8501-1 Sa 2.5 standards to remove mill scale and create a sharp 50-75 micron anchor profile. Multi-layer coating systems—combining zinc-rich epoxy primers for sacrificial cathodic protection, high-build epoxy intermediate coats, and aliphatic polyurethane topcoats—are applied to resist coastal humidity and chemical exposure.",
      "Before dispatching equipment to client sites, finished storage skips undergo proof-load testing at 1.5 times their rated Working Load Limit (WLL) on calibrated hydraulic test beds. Accompanied by SASO conformity certificates and third-party NDT reports, certified industrial skips deliver unyielding structural reliability for over 25 years of continuous service."
    ]
  },
  "general-1": {
    id: "general-1",
    title: "A complete guide to lifting and material handling safety compliance",
    category: "Safety & Handling",
    image: "/images/about/general_2_processed.jpeg",
    readTime: "9 min read",
    paragraphs: [
      "Material handling and heavy lifting accessories—including crane skip hoppers, spreader beams, forklift boom attachments, and specialized rigging clamps—must strictly comply with Saudi Arabian Ministry of Human Resources occupational health rules, SASO regulations, Aramco safety instructions, and international codes such as ASME B30.20 and BS EN 13155.",
      "Designing compliant lifting equipment mandates a minimum safety factor of 2.5 times dynamic loading to accommodate operational forces encountered during crane slewing, rapid winch acceleration, and rough site transport across onshore oil fields and offshore marine terminals. Structural engineers utilize 3D FEA simulations to model load distribution across lifting lugs, trunnion shafts, and spreader bar pin connections.",
      "Trunnion pins and primary lifting lugs demand specialized metallurgical selection and precision machining. High-tensile forged alloy steel pins undergo ultrasonic volumetric testing to verify freedom from internal inclusions. Lifting hooks incorporate heavy-duty spring safety latches to prevent accidental sling disengagement, while forklift attachments feature secondary steel safety retention chains pinned directly to the forklift carriage.",
      "On-site operational compliance requires strict adherence to pre-use inspection protocols. Rigging crews must verify high-visibility Working Load Limit (WLL) markings, check 6-month third-party inspection tags, and perform visual checks for trunnion pin wear, weld cracks, or frame deformation prior to executing any overhead lift.",
      "Statutory compliance mandates 6-month third-party re-certification by accredited inspection agencies. Proof-load testing at 1.5 times WLL, magnetic particle inspection of load-bearing welds, and digital asset tracking logs ensure complete auditability and zero-accident site operations."
    ]
  },
  "general-2": {
    id: "general-2",
    title: "Essential protective coatings: how to combat steel oxidation",
    category: "Protective Coatings",
    image: "/images/about/general3_processed.jpeg",
    readTime: "10 min read",
    paragraphs: [
      "Coastal industrial environments across Saudi Arabia's Eastern Province—including Jubail, Dammam, and Ras Al Khair—present severe atmospheric corrosion conditions classified under ISO 12944 as C5-M (Marine Heavy Industrial). High relative humidity, airborne salt spray, sulfur dioxide emissions, and intense UV radiation accelerate carbon steel oxidation up to five times faster than inland desert locations.",
      "Effective corrosion protection relies 80% on surface preparation quality. Carbon steel fabrications are solvent-cleaned to SSPC-SP 1 and abrasive blast-cleaned to ISO 8 Sa 2.5 (Near-White Metal Blast) specifications. Using angular steel grit media, blasting removes all mill scale, rust, and surface contaminants while establishing a uniform 50-75 micron sharp anchor profile required for strong chemical and mechanical coating adhesion.",
      "High-performance multi-coat coating systems utilize a inorganic or organic zinc-rich epoxy primer applied at 60-80 microns Dry Film Thickness (DFT). The metallic zinc dust provides sacrificial galvanic cathodic protection, protecting exposed steel even if the outer paint layers suffer physical impact or scratching during transport.",
      "An intermediate high-build epoxy barrier coat applied at 150-200 microns DFT creates an impermeable shield against water vapor, oxygen, and chloride ion penetration. Formulated with micaceous iron oxide (MIO) or glass flake additives, intermediate coats significantly increase diffusion path lengths through the coating matrix.",
      "The topcoat consists of an aliphatic polyurethane or fluoropolymer finish applied at 50-75 microns DFT. Engineered for maximum UV resistance, polyurethane topcoats maintain gloss, prevent chalking under intense sunlight, resist chemical washdowns, and deliver an aesthetically superior finish durable for over 25 years."
    ]
  },
  "quality-0": {
    id: "quality-0",
    title: "Certified safety standards: understanding ISO 9001 in KSA fabrication",
    category: "Quality Assurance",
    image: "/images/about/quality1_processed_processed.jpeg",
    readTime: "8 min read",
    paragraphs: [
      "Integrating ISO 9001:2015 Quality Management Systems into heavy structural steel fabrication facilities provides the structured operational framework needed to meet rigorous Saudi Arabian project standards, Aramco specifications, and international construction codes.",
      "Quality assurance begins at raw material procurement. Every steel plate, structural section, and pipe received at Saudi Fab Store is verified against original Mill Test Certificates (MTC 3.1) to confirm chemical heat composition (carbon, manganese, silicon, sulfur, phosphorus) and mechanical properties including yield strength, tensile strength, and elongation.",
      "Complete material traceability is enforced across all workshop operations. Heat numbers are hard-stamped onto raw plates and tracked through computerized shop management systems. Color-coded end painting identifies steel grades across cutting, fitting, welding, and surface treatment stages.",
      "Welding operations follow qualified Welding Procedure Specifications (WPS) supported by Procedure Qualification Records (PQR). All welders maintain AWS D1.1 and EN 287-1 certifications, undergoing regular requalification testing to ensure zero-defect seam welds.",
      "In-process inspection checkpoints enforce strict dimensional tolerance verification matching ISO 13920 Class B standards. Dimensional logs, weld NDT reports, DFT coating records, and SASO conformity certificates accompany finished dispatches to guarantee seamless client handover."
    ]
  },
  "quality-1": {
    id: "quality-1",
    title: "Weld inspections and non-destructive testing (NDT) workflows",
    category: "Quality Control",
    image: "/images/about/quality2_processed.jpeg",
    readTime: "9 min read",
    paragraphs: [
      "Non-destructive testing (NDT) methodologies are vital for verifying the structural soundness of welded joints without damaging finished equipment, ensuring heavy skips, lifting beams, and skid frames withstand operational stresses safely.",
      "Inspection workflows begin with 100% Visual Testing (VT) under AWS D1.1 code criteria. Certified inspectors evaluate weld bead profile geometry, leg length symmetry, throat thickness, undercut depth limits (<0.5mm), and freedom from surface cracks or excessive spatter.",
      "Liquid Dye Penetrant Inspection (DPI) and Magnetic Particle Inspection (MPI) detect fine surface-breaking cracks and sub-surface planar flaws in ferromagnetic structural steel welds using AC/DC yokes and fluorescent magnetic ink under ultraviolet light.",
      "Ultrasonic Testing (UT) inspects full-penetration butt welds for internal volumetric defects. Using shear wave transducers calibrated against IIW reference blocks, Level II NDT technicians evaluate weld root fusion, internal porosity, and slag inclusions.",
      "All NDT personnel hold ASNT Level II or PCN certifications. Detailed inspection reports with defect mapping schematics are archived in quality control registers and delivered to project contractors for complete transparency."
    ]
  },
  "quality-2": {
    id: "quality-2",
    title: "Dry film thickness (DFT) gauges: guaranteeing coating durability",
    category: "Surface Finishing",
    image: "/images/about/quality3_processed.jpeg",
    readTime: "7 min read",
    paragraphs: [
      "Precise measurement of Dry Film Thickness (DFT) is essential to verifying that industrial protective paint systems achieve designed corrosion barrier targets. Sub-specification DFT leaves pinholes and thin spots leading to premature rust bleed, while excessive DFT can cause mud-cracking, solvent entrapment, and loss of adhesion.",
      "Inspectors execute DFT measurement protocols matching SSPC-PA 2 standards using digital magnetic induction gauges. Gauges are calibrated on smooth steel standards and adjusted for substrate blast roughness using non-magnetic NIST-traceable reference shim foils.",
      "Sampling density mandates taking spot measurements across flat web plates, flange edges, internal stiffeners, and continuous weld seams. Spot readings must average within 80% to 120% of target specification DFT to pass quality audit releases.",
      "Digital DFT gauges automatically calculate mean, standard deviation, and range values, exporting data logs directly to quality management software for inclusion in final project dossier handovers."
    ]
  },
  "design-0": {
    id: "design-0",
    title: "Custom structures: transitioning from initial CAD design to workshop floor",
    category: "Engineering & CAD",
    image: "/images/about/design1_processed.jpeg",
    readTime: "8 min read",
    paragraphs: [
      "Modern 3D BIM and CAD workflows bridge the gap between complex structural engineering concepts and precision workshop floor execution, streamlining production across Saudi Arabia's contracting sector.",
      "Detailed 3D models developed in Tekla Structures and SolidWorks achieve BIM LOD 400 specification levels. Models define structural member connections, bolt hole patterns, weld prep bevels, and gusset plate geometry with millimeter precision.",
      "Automated NC1 and DXF files are generated directly from 3D models for automated CNC manufacturing equipment. High-definition plasma cutting tables and CNC beam lines execute plate cutting and hole drilling with ±0.5mm profile accuracy.",
      "Computerized plate nesting software optimizes material layout across standard steel sheet dimensions, achieving plate yield efficiencies up to 92% and significantly reducing scrap raw material costs.",
      "Digital shop drawings guide certified fitters through assembly sequences, while trial shop assemblies verify fit-up accuracy before surface blasting, painting, and site dispatch."
    ]
  },
  "engineering-0": {
    id: "engineering-0",
    title: "Custom structures: transitioning from initial CAD design to workshop floor",
    category: "Engineering & CAD",
    image: "/images/about/design1_processed.jpeg",
    readTime: "8 min read",
    paragraphs: [
      "Modern 3D BIM and CAD workflows bridge the gap between complex structural engineering concepts and precision workshop floor execution, streamlining production across Saudi Arabia's contracting sector.",
      "Detailed 3D models developed in Tekla Structures and SolidWorks achieve BIM LOD 400 specification levels. Models define structural member connections, bolt hole patterns, weld prep bevels, and gusset plate geometry with millimeter precision.",
      "Automated NC1 and DXF files are generated directly from 3D models for automated CNC manufacturing equipment. High-definition plasma cutting tables and CNC beam lines execute plate cutting and hole drilling with ±0.5mm profile accuracy.",
      "Computerized plate nesting software optimizes material layout across standard steel sheet dimensions, achieving plate yield efficiencies up to 92% and significantly reducing scrap raw material costs.",
      "Digital shop drawings guide certified fitters through assembly sequences, while trial shop assemblies verify fit-up accuracy before surface blasting, painting, and site dispatch."
    ]
  },
  "design-1": {
    id: "design-1",
    title: "Optimizing load capacities for large-scale contracting projects",
    category: "Structural Engineering",
    image: "/images/about/design2_processed.jpeg",
    readTime: "9 min read",
    paragraphs: [
      "Engineering heavy contracting equipment requires balancing tare weight minimization with maximum dynamic payload capacity, allowing contractors to optimize transport payloads while preserving structural safety margins.",
      "Finite Element Analysis (FEA) computer simulations model static and dynamic stress distributions under combined payload weights, crane lifting accelerations, transport vibration, and thermal expansion forces.",
      "Von Mises stress mapping identifies peak stress concentration zones, allowing engineers to strategically position stiffeners and gusset plates while reducing thickness in low-stress plate regions.",
      "Selecting high-strength structural steel grades like S355J2+N or ASTM A572 Grade 50 over standard mild steel increases load capacity by up to 25% while maintaining required safety factors under heavy operating conditions.",
      "Fatigue life analysis evaluates cyclic stress ranges during continuous loading and dumping operations, ensuring structural longevity across mining, contracting, and industrial fleet applications."
    ]
  },
  "engineering-1": {
    id: "engineering-1",
    title: "Optimizing load capacities for large-scale contracting projects",
    category: "Structural Engineering",
    image: "/images/about/design2_processed.jpeg",
    readTime: "9 min read",
    paragraphs: [
      "Engineering heavy contracting equipment requires balancing tare weight minimization with maximum dynamic payload capacity, allowing contractors to optimize transport payloads while preserving structural safety margins.",
      "Finite Element Analysis (FEA) computer simulations model static and dynamic stress distributions under combined payload weights, crane lifting accelerations, transport vibration, and thermal expansion forces.",
      "Von Mises stress mapping identifies peak stress concentration zones, allowing engineers to strategically position stiffeners and gusset plates while reducing thickness in low-stress plate regions.",
      "Selecting high-strength structural steel grades like S355J2+N or ASTM A572 Grade 50 over standard mild steel increases load capacity by up to 25% while maintaining required safety factors under heavy operating conditions.",
      "Fatigue life analysis evaluates cyclic stress ranges during continuous loading and dumping operations, ensuring structural longevity across mining, contracting, and industrial fleet applications."
    ]
  },
  "design-2": {
    id: "design-2",
    title: "Sustainable carbon steel sourcing: grades, testing, and compliance",
    category: "Material Science",
    image: "/images/about/design3_processed.jpeg",
    readTime: "8 min read",
    paragraphs: [
      "Sourcing certified structural steel plates and sections from primary mills across the GCC ensures high weldability, mechanical ductility, and structural reliability across industrial contracting projects.",
      "Chemical composition analysis regulates carbon, manganese, silicon, sulfur, and phosphorus content. Controlling Carbon Equivalent Values (CEV < 0.43%) prevents heat-affected zone (HAZ) cold cracking without requiring preheating for standard plate thicknesses.",
      "Mechanical testing includes Charpy V-Notch impact testing at low temperatures (-20°C) to verify material toughness against brittle fracture under sudden dynamic shock loading.",
      "Mill Test Certificates (MTC 3.1) are audited for every heat batch, backed by independent laboratory testing to confirm chemical heat compliance and mechanical yield/tensile strength.",
      "Utilizing 100% recyclable structural steel supports Saudi Vision 2030 industrial sustainability targets, delivering long-lasting equipment designed for circular economic reuse."
    ]
  },
  "engineering-2": {
    id: "engineering-2",
    title: "Sustainable carbon steel sourcing: grades, testing, and compliance",
    category: "Material Science",
    image: "/images/about/design3_processed.jpeg",
    readTime: "8 min read",
    paragraphs: [
      "Sourcing certified structural steel plates and sections from primary mills across the GCC ensures high weldability, mechanical ductility, and structural reliability across industrial contracting projects.",
      "Chemical composition analysis regulates carbon, manganese, silicon, sulfur, and phosphorus content. Controlling Carbon Equivalent Values (CEV < 0.43%) prevents heat-affected zone (HAZ) cold cracking without requiring preheating for standard plate thicknesses.",
      "Mechanical testing includes Charpy V-Notch impact testing at low temperatures (-20°C) to verify material toughness against brittle fracture under sudden dynamic shock loading.",
      "Mill Test Certificates (MTC 3.1) are audited for every heat batch, backed by independent laboratory testing to confirm chemical heat compliance and mechanical yield/tensile strength.",
      "Utilizing 100% recyclable structural steel supports Saudi Vision 2030 industrial sustainability targets, delivering long-lasting equipment designed for circular economic reuse."
    ]
  }
};

interface Props {
  article: ResourceArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onContactClick: () => void;
}

export function ResourceGuideModal({ article, isOpen, onClose, onContactClick }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && article) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, article]);

  if (!isOpen || !article || !mounted) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.paragraphs[0],
    "image": `https://saudifabstore.com${article.image}`,
    "author": {
      "@type": "Organization",
      "name": "Saudi Fab Store Heavy Engineering Division",
      "url": "https://saudifabstore.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Saudi Fab Store Commercial & Contracting Co.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://saudifabstore.com/images/logo.png"
      }
    },
    "datePublished": "2026-08-01",
    "dateModified": "2026-08-15",
    "articleSection": article.category,
    "keywords": "Steel Fabrication Dammam, Heavy Industrial Skips Saudi Arabia, AWS D1.1 ISO 9001 Fabrication, Corrosion Protection ISO 12944 Jubail, Structural Engineering KSA"
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      {/* JSON-LD Structured Data Schema for Google Search Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article 
        className={styles.modalCard} 
        onClick={(e) => e.stopPropagation()}
        itemScope 
        itemType="https://schema.org/TechArticle"
      >
        {/* Header */}
        <header className={styles.modalHeader}>
          <span className={styles.categoryBadge} itemProp="articleSection">{article.category}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close guide modal">
            ✕
          </button>
        </header>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.heroImageContainer}>
            <Image
              src={article.image}
              alt={`${article.title} - Saudi Fab Store Saudi Industrial Guide`}
              fill
              className={styles.heroImage}
              priority
              itemProp="image"
            />
          </div>

          <h1 className={styles.articleTitle} itemProp="headline">{article.title}</h1>

          <div className={styles.metaRow}>
            <span itemProp="author">By Saudi Fab Store Engineering</span>
            <span>•</span>
            <span>{article.readTime}</span>
            <span>•</span>
            <time itemProp="dateModified" dateTime="2026-08-15">Updated August 2026</time>
          </div>

          {/* Continuous Editorial Long-Form Paragraphs */}
          <section itemProp="articleBody" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {article.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.articleParagraph}>
                {paragraph}
              </p>
            ))}
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.modalFooter}>
          <Link href="/products" className={styles.secondaryBtn} onClick={onClose}>
            Explore Products
          </Link>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              onClose();
              onContactClick();
            }}
          >
            Inquire for Technical Specs
          </button>
        </footer>
      </article>
    </div>,
    document.body
  );
}

