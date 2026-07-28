"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Building2 } from "lucide-react";
import styles from "./Testimonials.module.css";
import { TreatmentQuizModal } from "./TreatmentQuizModal";

export function Testimonials() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.mainLayout}>
            {/* Left Section: Staggered Cards (Card 1 & Card 2) */}
            <div className={styles.leftCardsRow}>
              {/* Card 1: Leftmost lower portrait */}
              <div className={styles.card1Wrapper}>
                <Image
                  src="/images/testimonial-1.png"
                  alt="Good Life Customer Testimonial 1"
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div className={styles.testimonialOverlay}>
                  <div className={styles.companyLogo}>
                    <Building2 size={16} />
                    <span>Averda</span>
                  </div>
                  <p className={styles.testimonialText}>"Perfect sandblasting Company"</p>
                  <p className={styles.testimonialAuthor}>Tommy, Averda Saudi Ltd</p>
                </div>
              </div>

              {/* Card 2: Center-left featured card with loading spinner */}
              <div className={styles.card2Wrapper}>
                <Image
                  src="/images/testimonial-2.png"
                  alt="Good Life Customer Testimonial 2"
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <div className={styles.testimonialOverlay}>
                  <div className={styles.companyLogo}>
                    <Building2 size={16} />
                    <span>Gulf Middle East</span>
                  </div>
                  <p className={styles.testimonialText}>"Professionalism is trademark. Brooq Al Khalij does all work in a professional manner and completion of work on time."</p>
                  <p className={styles.testimonialAuthor}>John, Gulf Middle East</p>
                </div>
                <div className={styles.spinnerOverlay} />
              </div>
            </div>

            {/* Right Section: Header Block + Cards (Card 3 & Card 4) */}
            <div className={styles.rightColumn}>
              {/* Header & Trustpilot Rating */}
              <div className={styles.headerBlock}>
                <h2 className={styles.headline}>
                  Trusted by{" "}
                  <span className={styles.avatarStack}>
                    <Image
                      src="/images/testimonial-1.png"
                      alt="Customer Avatar 1"
                      width={32}
                      height={42}
                      className={styles.avatarImg}
                    />
                    <Image
                      src="/images/testimonial-2.png"
                      alt="Customer Avatar 2"
                      width={32}
                      height={42}
                      className={styles.avatarImg}
                    />
                    <Image
                      src="/images/testimonial-4.png"
                      alt="Customer Avatar 3"
                      width={32}
                      height={42}
                      className={styles.avatarImg}
                    />
                  </span>{" "}
                  100+ active customers and leading companies
                </h2>

                {/* Trustpilot Widget */}
                <div className={styles.trustpilotWidget}>
                  <span>Excellent</span>
                  <div className={styles.starsBox}>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={styles.starSquare}>
                        ★
                      </div>
                    ))}
                  </div>
                  <div className={styles.reviewsLink}>
                    2,000+ Projects Done
                  </div>
                  <span className={styles.trustpilotLogo}>
                    <span className={styles.trustpilotStar}>★</span> 98% Success Rate
                  </span>
                </div>
              </div>

              {/* Right Cards Row (Card 3 & Card 4) */}
              <div className={styles.rightCardsRow}>
                {/* Card 3: Senior woman with play button */}
                <div className={styles.card3Wrapper}>
                <Image
                    src="/images/testimonial-3.png"
                    alt="Good Life Customer Testimonial 3"
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  <div className={styles.testimonialOverlay}>
                    <div className={styles.companyLogo}>
                      <Building2 size={16} />
                      <span>NOV Trading Co.</span>
                    </div>
                    <p className={styles.testimonialText}>"Trustable Company in all Situations. Works are very fast and professionally doing all the works."</p>
                    <p className={styles.testimonialAuthor}>Jassim, NOV Trading Co.</p>
                  </div>
                  <button
                    onClick={() => setIsQuizOpen(true)}
                    className={styles.playButton}
                    aria-label="Play testimonial video"
                  >
                    <Play size={20} className={styles.playIcon} />
                  </button>
                </div>

                {/* Card 4: Far-right portrait */}
                <div className={styles.card4Wrapper}>
                <Image
                    src="/images/testimonial-4.png"
                    alt="Good Life Customer Testimonial 4"
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className={styles.testimonialOverlay}>
                    <div className={styles.companyLogo}>
                      <Building2 size={16} />
                      <span>Brooq Al Khalij</span>
                    </div>
                    <p className={styles.testimonialText}>"At Brooq Al Khalij, our clients are the focus of everything we do. We work hard to deliver products that earn results."</p>
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