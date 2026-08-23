"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HardHat } from "lucide-react";
import styles from "./MedicalSupportSection.module.css";
import { TextReveal } from "./TextReveal";
import { TreatmentQuizModal } from "./TreatmentQuizModal";

export function MedicalSupportSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.card} ref={sectionRef}>
          {/* Full Screen Background Video Layer (No Overlays) */}
          <div className={styles.fullScreenVideoWrapper}>
            <video
              ref={videoRef}
              src="/images/home/portfolio/forkliftvideo2.mp4"
              muted
              playsInline
              onEnded={() => setIsVideoEnded(true)}
              className={styles.fullScreenVideo}
            />
            {/* End Frame Image layer displayed once video ends */}
            {isVideoEnded && (
              <Image
                src="/images/home/portfolio/forklift_end_2.png"
                alt="Saudi Fab Store Forklift Portfolio End Frame"
                fill
                className={styles.endFrameImage}
                priority
              />
            )}
          </div>

        {/* Foreground Content Container */}
        <div className={styles.container}>
          {/* Main Headline */}
          <h2 className={styles.headline}>
            Proven Industrial Leadership & Track Record
          </h2>

          <div className={styles.gridContent}>
            {/* Left Column Text Block */}
            <div className={styles.leftColumn}>
              <div className={styles.dottedDivider} />
              <TextReveal animation="slide-up">
                <div className={styles.metaLabel}>INDUSTRIAL CONTRACTING & SOLUTIONS</div>
              </TextReveal>
              <TextReveal animation="blur" delay={0.15}>
                <p className={styles.bodyCopy}>
                  Saudi Fab Store delivers creative strategies, tactics and approaches to help clients grow their business with over 2,000+ completed projects across 7 specialized divisions.
                </p>
              </TextReveal>
              <Link
                href="/our-works"
                className={styles.primaryButton}
              >
                View Portfolio
              </Link>
            </div>

            {/* 3 Distinct Floating Cards Spread Across Section */}
            <div className={styles.widgetsContainer}>
              {/* Card 1: Top Right Floating Progress Card */}
              <div className={styles.widgetProgress}>
                <div className={styles.badgeTag}>Projects Delivered</div>
                <div className={styles.progressStatRow}>
                  <span className={styles.weightVal}>2,000+</span>
                  <span className={styles.trendVal}>↑ 98.5%</span>
                </div>
                <svg className={styles.sparklineSvg} viewBox="0 0 100 30">
                  <path
                    d="M 0 20 Q 25 5, 50 18 T 100 6"
                    stroke="#EB5521"
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Card 2: Bottom Left Engineering Team Inbox Card */}
              <div className={styles.widgetInbox}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.teamBadgeIcon}>
                    <HardHat size={26} color="#ffffff" />
                  </div>
                  <div className={styles.notificationBadge}>250+</div>
                </div>
                <div className={styles.inboxContent}>
                  <div className={styles.inboxHeader}>Engineering Crew & Workforce</div>
                  <p className={styles.inboxText}>
                    250+ certified engineers & technicians serving 500+ enterprise clients across Saudi Arabia.
                  </p>
                </div>
              </div>

              {/* Card 3: Bottom Right Corporate History & Emblem Card */}
              <div className={styles.widgetPrescription}>
                <div className={styles.emblemColumn}>
                  <div className={styles.emblemYearBadge}>
                    <span className={styles.emblemNumber}>25+</span>
                    <span className={styles.emblemUnit}>YEARS</span>
                  </div>
                </div>
                <div className={styles.rxDetails}>
                  <h3 className={styles.rxTitle}>Saudi Fab Store Group</h3>
                  <span className={styles.rxSub}>Est. 2000 — Dallah Ind. Area, Dammam</span>
                  <div className={styles.prescribedFooter}>
                    <span>Group Managing Director</span>
                    <span className={styles.signatureScript}>Badr Al Suabei</span>
                  </div>
                </div>
              </div>
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

