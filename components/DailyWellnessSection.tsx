"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Layers, 
  Flame, 
  Shield, 
  Wrench, 
  Settings, 
  HardHat, 
  Package, 
  Compass,
  ArrowRight 
} from "lucide-react";
import { ParallaxElement } from "./ParallaxElement";
import styles from "./DailyWellnessSection.module.css";
import { TreatmentQuizModal } from "./TreatmentQuizModal";

interface ServiceItem {
  id: string;
  name: string;
  subheading: string;
  imageSrc: string;
  icon: React.ReactNode;
  link: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "steel-fabrication",
    name: "Steel Fabrication",
    subheading: "Custom steel structures, workbenches, cranes, trailers & office containers.",
    imageSrc: "/images/home/services/steel2.jpeg",
    icon: <Layers size={30} strokeWidth={1.5} />,
    link: "/services/steel-fabrication"
  },
  {
    id: "blasting-works",
    name: "Blasting & Sandblasting",
    subheading: "Abrasive sandblasting, paint & rust removal, mill scale surface prep.",
    imageSrc: "/images/home/services/blasting3.jpeg",
    icon: <Flame size={30} strokeWidth={1.5} />,
    link: "/services/blasting-sandblasting"
  },
  {
    id: "painting-coatings",
    name: "Industrial Painting & Coatings",
    subheading: "High-durability protective surface coatings and fireproof coating applications.",
    imageSrc: "/images/home/services/painting3.jpeg",
    icon: <Shield size={30} strokeWidth={1.5} />,
    link: "/services/industrial-painting-coatings"
  },
  {
    id: "forklift-repair",
    name: "Forklift Repair & Servicing",
    subheading: "Comprehensive maintenance, overhaul, and repair for heavy equipment.",
    imageSrc: "/images/home/services/forklift2.jpeg",
    icon: <Wrench size={30} strokeWidth={1.5} />,
    link: "/services/forklift-repair"
  },
  {
    id: "torquing-bolting",
    name: "Protorc Torquing & Bolting",
    subheading: "Precision bolting, hydraulic torquing, and torque control for industrial plants.",
    imageSrc: "/images/home/services/protoc3.jpeg",
    icon: <Settings size={30} strokeWidth={1.5} />,
    link: "/services/protorc-torquing-bolting"
  },
  {
    id: "safety-trading",
    name: "General Safety Trading",
    subheading: "Supply of certified safety gloves, helmets, goggles, and industrial gear.",
    imageSrc: "/images/home/services/general2.jpeg",
    icon: <HardHat size={30} strokeWidth={1.5} />,
    link: "/services/general-safety-trading"
  },
  {
    id: "packaging-factory",
    name: "Paper & Plastic Packaging",
    subheading: "BCT-rated heavy compression corrugated boxes & plastic packaging.",
    imageSrc: "/images/home/services/paper4.png",
    icon: <Package size={30} strokeWidth={1.5} />,
    link: "/services/paper-plastic-packaging"
  },
  {
    id: "custom-woodworks",
    name: "Smart Woodworks & Joinery",
    subheading: "Precision joinery, custom industrial timber fabrication, and woodwork.",
    imageSrc: "/images/home/services/wood2.jpeg",
    icon: <Compass size={30} strokeWidth={1.5} />,
    link: "/services/smart-woodworks"
  }
];

export function DailyWellnessSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // All drag state tracked via refs to avoid stale closures and re-render delays
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  // Attach mouseup on document so releasing outside slider still ends drag
  useEffect(() => {
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (sliderRef.current) {
        sliderRef.current.style.cursor = 'grab';
      }
      // Reset hasDragged after a short delay so click handlers can read it
      setTimeout(() => { hasDraggedRef.current = false; }, 100);
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      return;
    }
    setIsQuizOpen(true);
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -474, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 474, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="our-services" className={styles.productsSection}>
        {/* Main Card Wrapper */}
        <div className={styles.productImageWrap}>
          {/* Header inside Card */}
          <div className={styles.productSectionContent}>
            <h2 className={styles.display} aria-label="Our Services">
              <span className={styles.splitLines}>
                <span className={styles.splitWord}>Our</span>{" "}
                <span className={styles.splitWord}>Services</span>
              </span>
            </h2>
            <div className={styles.featuredFlex}>
              <div className={styles.subheading}>02</div>
              <p className={styles.heading5}>
                Delivering creative industrial strategies, fabrication, blasting, coating, and maintenance services to help clients grow.
              </p>
            </div>
          </div>

          {/* Slider Component inside Card */}
          <div className={styles.gsapSliderOne} aria-label="Services Slider" role="region">
            <div className={styles.gsapSliderCollection}>
              <div
                ref={sliderRef}
                className={styles.gsapSliderList}
                role="list"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                {SERVICES.map((srv, idx) => (
                  <div
                    key={srv.id}
                    className={styles.gsapSliderItemCopy}
                    role="group"
                    aria-roledescription="Slide"
                    aria-label={`Service ${idx + 1} of ${SERVICES.length}`}
                  >
                    <div className={styles.productSlide}>
                      <div
                        onClick={handleCardClick}
                        className={styles.productCard}
                      >
                        {/* Top Section: Title with Superscript & Uppercase Tagline */}
                        <div className={styles.cardHeaderWrap}>
                          <h3 className={styles.serviceTitleText}>
                            {srv.name} <sup className={styles.serviceSupScript}>0{idx + 1}</sup>
                          </h3>
                          <p className={styles.serviceTaglineText}>
                            {srv.subheading}
                          </p>
                        </div>

                        {/* Middle Section: Service Image Container */}
                        <div className={styles.centerIconContainer}>
                          <Image
                            src={srv.imageSrc}
                            alt={srv.name}
                            fill
                            className={styles.centerImage}
                            sizes="400px"
                            style={srv.id === 'forklift-repair' ? { transform: 'scale(1.35)', transformOrigin: 'center bottom' } : undefined}
                          />
                        </div>

                        {/* Bottom Section: Divider & Side-by-Side Action Buttons */}
                        <div className={styles.cardFooterDivider}>
                          <div className={styles.cardButtonGroup}>
                            <Link
                              href="/contact"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasDraggedRef.current) e.preventDefault();
                              }}
                              className={styles.primaryGetStartedBtn}
                            >
                              Request Quote
                            </Link>

                            <Link
                              href={srv.link}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasDraggedRef.current) e.preventDefault();
                              }}
                              className={styles.secondaryLearnBtn}
                            >
                              <span>↳ Learn more</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Background Image inside Card */}
          <div className={styles.imageTrigger}>
            <ParallaxElement speed={-0.10} className={styles.imageTarget} style={{ height: "128%", top: "-15%", width: "100%", position: "absolute" }}>
              <Image
                src="/images/home/services/service_bg_3.png"
                alt="Brooq Al Khalij Services background"
                fill
                className={styles.imageFull}
                priority
              />
            </ParallaxElement>
          </div>
        </div>

        {/* Sub section below Card */}
        <div className={styles.productsSubsection}>
          <div className={styles.wLayoutGrid}>
            <div className={styles.paddingLeft}>
              <h3 className={styles.hMaxWidth}>
                Explore our
                <span className={styles.spanHighlight}>specialized services</span>
              </h3>
            </div>
            <div className={styles.featuredContent}>
              <p className={styles.pMaxWidth}>
                Browse our full range of contracting and industrial services, or contact our engineering team to receive tailored proposals for your project.
              </p>
              <div className={styles.ctaFlex}>
                <Link
                  href="/services"
                  className={styles.subSectionPrimaryBtn1}
                >
                  <svg
                    className={styles.subSectionArrowIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 8 5"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.32517 0.0354578L5.42397 1.6028e-07L8 2.51064L5.4458 5L4.3052 4.96635L5.57012 3.73355C5.878 3.43348 6.15998 3.16461 6.41658 2.92694L0.205982 2.9077L0.244359 2.0731L6.45486 2.09244C6.20397 1.86046 5.92658 1.59621 5.62262 1.29997L4.32517 0.0354578Z"
                      fill="#222222"
                    />
                    <path
                      d="M0.82393 2.00287e-07L0.82393 2.90815H0L2.64111e-07 1.65186e-07L0.82393 2.00287e-07Z"
                      fill="#222222"
                    />
                  </svg>
                  <span>Explore All Services</span>
                </Link>
                <div className={styles.horizontalDivider} />
                <Link
                  href="/contact"
                  className={styles.subSectionPrimaryBtn2}
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Modal */}
      <TreatmentQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </>
  );
}
