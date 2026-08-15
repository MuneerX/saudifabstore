"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import styles from "./CoreValueModal.module.css";

export interface CoreValueItem {
  id: string;
  title: string;
  category: string;
  image: string;
  paragraphs: string[];
}

export const CORE_VALUES_DATA: { [key: string]: CoreValueItem } = {
  iso: {
    id: "iso",
    title: "ISO Standards & Quality Control Policy",
    category: "Quality Assurance",
    image: "/images/about/iso2.png",
    paragraphs: [
      "BROOQ AL KHALIJ operates under ISO 9001:2015 Quality Management System standards across all structural steel fabrication, surface sandblasting, and industrial painting workshops in Dammam and Eastern Province sites.",
      "Every raw carbon steel plate, I-beam, hollow section, and pipe received at our facility undergoes Mill Test Certificate (MTC 3.1) auditing to verify chemical heat compositions and mechanical yield strengths. Structural welding is performed strictly to AWS D1.1 standards by certified welders.",
      "Comprehensive quality dossiers—including dimensional inspection logs, NDT certificates (Visual, MPI, UT), and SASO conformity documents—accompany all dispatches to ensure seamless client sign-off and site erection."
    ]
  },
  safety: {
    id: "safety",
    title: "Uncompromising Safety Protocols",
    category: "Occupational Health & Safety",
    image: "/images/about/safety3.png",
    paragraphs: [
      "Safety is the foundational core of Brooq Al Khalij's operations. Our safety management policy mandates zero-tolerance for site hazards across all fabrication yards, crane lifting operations, and contracting job sites.",
      "All custom lifting appliances, spreader beams, and forklift boom attachments are engineered with a minimum 2.5x dynamic safety factor and proof-tested at 1.5x Working Load Limit (WLL). Secondary safety retention pins and heavy-duty spring latches are mandatory on all hooks.",
      "Rigging teams maintain 6-month statutory third-party inspection certificates and perform pre-use checklists to guarantee zero-accident site environments matching Saudi Aramco and Ministry of Human Resources standards."
    ]
  },
  execution: {
    id: "execution",
    title: "Professional & Certified Execution",
    category: "Engineering Excellence",
    image: "/images/about/professional3.png",
    paragraphs: [
      "Our team comprises senior structural engineers, BIM LOD 400 CAD detailers, ASNT Level II NDT inspectors, and certified welding specialists qualified from leading Saudi and international technical academies.",
      "We utilize 3D Tekla Structures and SolidWorks software integrated directly with high-definition CNC plasma cutting tables and beam drill lines, ensuring ±0.5mm profile tolerance accuracy across complex structural node connections.",
      "From initial architectural blueprint review to final site installation, our dedicated project managers oversee every milestone, delivering turnkey industrial contracting solutions on schedule and within budget."
    ]
  },
  support: {
    id: "support",
    title: "Customer-First & Emergency Technical Support",
    category: "Client Services & AMC",
    image: "/images/about/support2.png",
    paragraphs: [
      "Brooq Al Khalij maintains a 24/7 dedicated customer response hotline to assist industrial facilities, logistics terminals, and contracting projects across the Kingdom.",
      "Our mobile technician response team guarantees under 2-hour dispatch for urgent site repairs, forklift attachments, or hydraulic torquing consultations in the Dammam, Jubail, and Khobar industrial zones.",
      "We offer tailored Annual Maintenance Contracts (AMC), preventative equipment inspections, and rapid component refabrication services to maximize equipment uptime for our partner clients."
    ]
  },
  durability: {
    id: "durability",
    title: "Maximum Value & Long-Term Durability",
    category: "Lifetime Value & ROI",
    image: "/images/about/maximum.png",
    paragraphs: [
      "We deliver high-value engineering solutions that minimize long-term total cost of ownership (TCO) for industrial asset owners and contracting general contractors.",
      "By utilizing high-yield structural steel grades (S355J2+N / ASTM A572 Gr 50) and SA 2.5 abrasive sandblasting, we optimize structural strength while minimizing tare weight and raw material overhead.",
      "Multi-coat industrial paint systems matching ISO 12944 C5-M marine exposure specs protect equipment against extreme Saudi humidity and salt spray, providing 25+ years of maintenance-free service life."
    ]
  }
};

interface Props {
  valueItem: CoreValueItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContactClick: () => void;
}

export function CoreValueModal({ valueItem, isOpen, onClose, onContactClick }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && valueItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, valueItem]);

  if (!isOpen || !valueItem || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <span className={styles.categoryBadge}>{valueItem.category}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.heroImageContainer}>
            <Image
              src={valueItem.image}
              alt={valueItem.title}
              fill
              className={styles.heroImage}
              priority
            />
          </div>

          <h2 className={styles.articleTitle}>{valueItem.title}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {valueItem.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.articleParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            Close Window
          </button>
          <Link
            href="/contact"
            className={styles.primaryBtn}
            onClick={onClose}
          >
            Inquire About Standards &amp; Services
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
