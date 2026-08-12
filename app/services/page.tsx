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

          {/* Right Column: All 8 Core Services matching Home Page */}
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
                  Custom steel structures, workbenches, cranes, trailers &amp; office containers.
                </p>
                <Link href="/services/steel-fabrication" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 2: Blasting & Sandblasting */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/blasting3.jpeg"
                  alt="Blasting & Sandblasting"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Blasting &amp; Sandblasting</h3>
                <p className={styles.benefitRowDesc}>
                  Abrasive sandblasting, paint &amp; rust removal, mill scale surface prep.
                </p>
                <Link href="/services/blasting-sandblasting" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 3: Industrial Painting & Coatings */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/painting3.jpeg"
                  alt="Industrial Painting & Coatings"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Industrial Painting &amp; Coatings</h3>
                <p className={styles.benefitRowDesc}>
                  High-durability protective surface coatings and fireproof coating applications.
                </p>
                <Link href="/services/industrial-painting-coatings" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 4: Forklift Repair & Servicing */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/forklift2.jpeg"
                  alt="Forklift Repair & Servicing"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Forklift Repair &amp; Servicing</h3>
                <p className={styles.benefitRowDesc}>
                  Comprehensive maintenance, overhaul, and repair for heavy equipment.
                </p>
                <Link href="/services/forklift-repair" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 5: ProTorc Torquing & Bolting */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/protoc3.jpeg"
                  alt="ProTorc Torquing & Bolting"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>ProTorc Torquing &amp; Bolting</h3>
                <p className={styles.benefitRowDesc}>
                  Precision bolting, hydraulic torquing, and torque control for industrial plants.
                </p>
                <Link href="/services/protorc-torquing-bolting" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 6: General Safety Trading */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/general2.jpeg"
                  alt="General Safety Trading"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>General Safety Trading</h3>
                <p className={styles.benefitRowDesc}>
                  Supply of certified safety gloves, helmets, goggles, and industrial gear.
                </p>
                <Link href="/services/general-safety-trading" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 7: Paper & Plastic Packaging */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/paper2.jpeg"
                  alt="Paper & Plastic Packaging"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Paper &amp; Plastic Packaging</h3>
                <p className={styles.benefitRowDesc}>
                  BCT-rated heavy compression corrugated boxes &amp; plastic packaging.
                </p>
                <Link href="/services/paper-plastic-packaging" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Service 8: Smart Woodworks & Joinery */}
            <div className={styles.benefitRow}>
              <div className={styles.benefitImgWrapper}>
                <Image
                  src="/images/home/services/wood2.jpeg"
                  alt="Smart Woodworks & Joinery"
                  fill
                  className={styles.benefitImg}
                  sizes="280px"
                />
              </div>
              <div className={styles.benefitText}>
                <h3 className={styles.benefitRowTitle}>Smart Woodworks &amp; Joinery</h3>
                <p className={styles.benefitRowDesc}>
                  Precision joinery, custom industrial timber fabrication, and woodwork.
                </p>
                <Link href="/services/smart-woodworks" className={styles.serviceDetailBtn}>
                  <span>Explore Service</span>
                  <span className={styles.serviceBtnArrow}>
                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                      <path d="M8.525 10.1329L5.79699 7.4043L4.82646 8.37483L6.41179 9.96016C6.61825 10.1666 6.84702 10.3496 7.09408 10.5058C7.21247 10.5807 7.14384 10.7643 7.00487 10.7431L6.35746 10.6425C6.15672 10.611 5.95427 10.5956 5.75067 10.5956L4.08355 10.6287C3.69408 10.6333 3.30575 10.6819 2.92772 10.7746L2.56798 10.8626C2.4353 10.8952 2.31577 10.7751 2.34837 10.643L2.43644 10.2833C2.52909 9.90469 2.57828 9.51693 2.58228 9.12746L2.61145 8.20268H1.93373H1.25602L1.21084 9.12232C1.20169 9.64333 1.26403 10.1626 1.39614 10.6665C1.54312 11.2287 1.98235 11.6673 2.54396 11.8143C3.04782 11.9458 3.56711 12.0082 4.08812 11.9996L5.75067 11.9659C5.95369 11.9659 6.15672 11.9504 6.35746 11.919L7.00487 11.8183C7.14327 11.7966 7.21247 11.9807 7.09408 12.0556C6.84702 12.2118 6.61825 12.3948 6.41179 12.6012L4.82646 14.1866L5.79699 15.1571L8.525 12.4285C9.15868 11.7949 9.15868 10.7671 8.525 10.1335V10.1329Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </Link>
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
