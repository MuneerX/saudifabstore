"use client";

import React from "react";
import styles from "./HowItWorksSection.module.css";

interface ClientBrand {
  id: string;
  name: string;
  logoPath: string;
}

const ALL_CLIENT_LOGOS: ClientBrand[] = [
  // Row 1
  { id: "aramco", name: "Saudi Aramco", logoPath: "/images/home/clients/aramco.png" },
  { id: "sabic", name: "SABIC", logoPath: "/images/home/clients/SABIC.png" },
  { id: "halliburton", name: "Halliburton", logoPath: "/images/home/clients/Halliburton-Logo.png" },
  { id: "petrorabigh", name: "Petro Rabigh", logoPath: "/images/home/clients/Petro_Rabigh_-_Logo.svg.webp" },
  { id: "alkhorayef", name: "Al Khorayef", logoPath: "/images/home/clients/alkhorayef.png" },
  { id: "carrier", name: "Carrier", logoPath: "/images/home/clients/carrier.svg" },
  { id: "weatherford", name: "Weatherford", logoPath: "/images/home/clients/Weatherford_International_Logo.svg" },
  { id: "gulfcons", name: "Gulf Consolidated", logoPath: "/images/home/clients/gulfconsolidated.png" },
  { id: "nass", name: "NASS Group", logoPath: "/images/home/clients/nass-the-group-company-seeklogo.png" },

  // Row 2
  { id: "maaden", name: "Ma'aden", logoPath: "/images/home/clients/maaden.webp" },
  { id: "sec", name: "Saudi Energy", logoPath: "/images/home/clients/Saudi_Energy.webp" },
  { id: "satorp", name: "SATORP", logoPath: "/images/home/clients/satorp.png" },
  { id: "swcc", name: "SWCC", logoPath: "/images/home/clients/swcc.png" },
  { id: "dragados", name: "Dragados", logoPath: "/images/home/clients/dragados.png" },
  { id: "npcc", name: "NPCC", logoPath: "/images/home/clients/national-petroleum-construction-company-seeklogo.png" },
  { id: "intecsa", name: "Intecsa", logoPath: "/images/home/clients/intecsa_logo.png" },
  { id: "gulfmirad", name: "Gulf Mirad", logoPath: "/images/home/clients/gulfmirad.png" },
  { id: "harrispye", name: "Harris Pye", logoPath: "/images/home/clients/harris pye.png" },

  // Row 3
  { id: "averda", name: "Averda", logoPath: "/images/home/clients/averda.png" },
  { id: "conaquarts", name: "Conaquartz", logoPath: "/images/home/clients/conaquarts.png" },
  { id: "saipem", name: "Saipem", logoPath: "/images/home/clients/saipem logo.png" },
  { id: "taqa", name: "TAQA", logoPath: "/images/home/clients/taqa.png" },
  { id: "advancedlines", name: "Advanced Lines Group", logoPath: "/images/home/clients/Advanced-Lines-Group.png" },
  { id: "alhuwais", name: "Al Huwais", logoPath: "/images/home/clients/alhuwais.png" },
  { id: "qematnajd", name: "Qemat Najd", logoPath: "/images/home/clients/qemat najd.png" },
  { id: "saharitank", name: "Sahari Tank", logoPath: "/images/home/clients/sahari tank.png" },
  { id: "varel", name: "Varel", logoPath: "/images/home/clients/varel_logo_purple.png" },
];

export function HowItWorksSection() {
  return (
    <section className={styles.section}>
      {/* Ambient Brand Fog Glow */}
      <div className={styles.brandFogGlow} />

      {/* Main Container */}
      <div className={styles.container}>
        {/* Top Header Block */}
        <div className={styles.topBlock}>
          <p className={styles.subText}>
            Proudly serving leading industrial, oil & gas, and infrastructure partners across Saudi Arabia.
          </p>
          <h2 className={styles.headline}>Our Clients</h2>
        </div>

        {/* Architectural Bordered Logo Grid matching exact reference image */}
        <div className={styles.clientsGrid}>
          {ALL_CLIENT_LOGOS.map((brand) => (
            <div key={brand.id} className={styles.gridCell}>
              <img
                src={brand.logoPath}
                alt={brand.name}
                className={styles.logoImg}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
