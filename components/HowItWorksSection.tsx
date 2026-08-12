"use client";

import React from "react";
import styles from "./HowItWorksSection.module.css";

interface ClientBrand {
  id: string;
  name: string;
  logoPath: string;
}

const ALL_CLIENT_LOGOS: ClientBrand[] = [
  { id: "aramco", name: "Saudi Aramco", logoPath: "/images/home/clients/aramco.png" },
  { id: "sabic", name: "SABIC", logoPath: "/images/home/clients/SABIC.png" },
  { id: "halliburton", name: "Halliburton", logoPath: "/images/home/clients/Halliburton-Logo.png" },
  { id: "petrorabigh", name: "Petro Rabigh", logoPath: "/images/home/clients/Petro_Rabigh_-_Logo.svg.webp" },
  { id: "alkhorayef", name: "Al Khorayef", logoPath: "/images/home/clients/alkhorayef.png" },
  { id: "carrier", name: "Carrier", logoPath: "/images/home/clients/carrier.svg" },
  { id: "weatherford", name: "Weatherford", logoPath: "/images/home/clients/Weatherford_International_Logo.svg" },
  { id: "waraq", name: "Waraq Paper Industries", logoPath: "/images/home/clients/waraq logo.png" },
  { id: "nass", name: "NASS Group", logoPath: "/images/home/clients/nass-the-group-company-seeklogo.png" },
  { id: "maaden", name: "Ma'aden", logoPath: "/images/home/clients/maaden.webp" },

  { id: "sec", name: "Saudi Energy", logoPath: "/images/home/clients/Saudi_Energy.webp" },
  { id: "satorp", name: "SATORP", logoPath: "/images/home/clients/satorp.png" },
  { id: "swcc", name: "SWCC", logoPath: "/images/home/clients/swcc.png" },
  { id: "dragados", name: "Dragados", logoPath: "/images/home/clients/dragados.png" },
  { id: "npcc", name: "NPCC", logoPath: "/images/home/clients/national-petroleum-construction-company-seeklogo.png" },
  { id: "intecsa", name: "Intecsa", logoPath: "/images/home/clients/intecsa_logo.png" },
  { id: "gulfmirad", name: "Gulf Mirad", logoPath: "/images/home/clients/gulfmirad.png" },
  { id: "gulfmirad2", name: "Gulf Mirad Group", logoPath: "/images/home/clients/gulfmirad2.png" },
  { id: "harrispye", name: "Harris Pye", logoPath: "/images/home/clients/harris pye.png" },
  { id: "averda", name: "Averda", logoPath: "/images/home/clients/averda.png" },

  { id: "conaquarts", name: "Conaquartz", logoPath: "/images/home/clients/conaquarts.png" },
  { id: "saipem", name: "Saipem", logoPath: "/images/home/clients/saipem logo.png" },
  { id: "taqa", name: "TAQA", logoPath: "/images/home/clients/taqa.png" },
  { id: "advancedlines", name: "Advanced Lines Group", logoPath: "/images/home/clients/Advanced-Lines-Group.png" },
  { id: "qematnajd", name: "Qemat Najd", logoPath: "/images/home/clients/qemat najd.png" },
  { id: "varel", name: "Varel", logoPath: "/images/home/clients/varel_logo_purple.png" },
  { id: "nov", name: "NOV Trading Co.", logoPath: "/images/home/clients/NOV.png" },
  { id: "mialogo", name: "MIA", logoPath: "/images/home/clients/mialogo.webp" },
  { id: "mislogo", name: "MIS", logoPath: "/images/home/clients/mis logo.png" },
  { id: "andmore", name: "and more", logoPath: "" },
];

export function HowItWorksSection() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mouse-x", `-1000px`);
    e.currentTarget.style.setProperty("--mouse-y", `-1000px`);
  };

  const handleCellMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--cell-x", `${x}px`);
    e.currentTarget.style.setProperty("--cell-y", `${y}px`);
  };

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
        <div
          className={styles.clientsGrid}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Desktop Architectural Grid Lines (extended past bounds) */}
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "0%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "10%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "20%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "30%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "40%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "50%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "60%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "70%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "80%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "90%" }} />
          <div className={`${styles.vLine} ${styles.desktopLines}`} style={{ left: "100%" }} />

          <div className={`${styles.hLine} ${styles.desktopLines}`} style={{ top: "0px" }} />
          <div className={`${styles.hLine} ${styles.desktopLines}`} style={{ top: "115px" }} />
          <div className={`${styles.hLine} ${styles.desktopLines}`} style={{ top: "230px" }} />
          <div className={`${styles.hLine} ${styles.desktopLines}`} style={{ top: "345px" }} />

          {ALL_CLIENT_LOGOS.map((brand) => (
            <div
              key={brand.id}
              className={styles.gridCell}
              onMouseMove={handleCellMouseMove}
            >
              {brand.id === "andmore" ? (
                <span className={styles.andMoreText}>and more...</span>
              ) : (
                <img
                  src={brand.logoPath}
                  alt={brand.name}
                  className={styles.logoImg}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
