"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { ParallaxElement } from "./ParallaxElement";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.mainLayout}>
          {/* Left Section: Staggered Cards (Card 1 & Card 2) */}
          <div className={styles.leftCardsRow}>
            {/* Card 1: Leftmost lower portrait */}
            <div className={styles.card1Wrapper}>
              <ParallaxElement speed={-0.10} className={styles.cardImgWrapper}>
                <Image
                  src="/images/home/testimonial/fireproof.png"
                  alt="Averda Work Showcase"
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </ParallaxElement>
              <div className={styles.testimonialOverlay}>
                <div className={styles.companyLogo}>
                  <Image 
                    src="/images/home/testimonial/averda.png" 
                    alt="Averda Logo" 
                    width={110} 
                    height={44} 
                    className={`${styles.logoImg} ${styles.averdaLogo}`}
                  />
                </div>
                <p className={styles.testimonialText}>"Perfect sandblasting Company"</p>
                <p className={styles.testimonialAuthor}>Tommy, Averda Saudi Ltd</p>
              </div>
            </div>

            {/* Card 2: Center-left featured card with loading spinner */}
            <div className={styles.card2Wrapper}>
              <ParallaxElement speed={-0.10} className={styles.cardImgWrapper}>
                <Image
                  src="/images/home/testimonial/pipe.png"
                  alt="Gulf Middle East Work Showcase"
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </ParallaxElement>
              <div className={styles.testimonialOverlay}>
                <div className={styles.companyLogo}>
                  <Image 
                    src="/images/home/testimonial/gulf.png" 
                    alt="Gulf Middle East Logo" 
                    width={170} 
                    height={68} 
                    className={`${styles.logoImg} ${styles.gulfLogo}`}
                  />
                </div>
                <p className={styles.testimonialText}>"Professionalism is trademark. Saudi Fab Store does all work in a professional manner and completion of work on time."</p>
                <p className={styles.testimonialAuthor}>John, Gulf Middle East</p>
              </div>
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
                    src="/images/home/testimonial/circularsteel.png"
                    alt="Customer Avatar 1"
                    width={32}
                    height={42}
                    className={styles.avatarImg}
                  />
                  <Image
                    src="/images/home/testimonial/pipe.png"
                    alt="Customer Avatar 2"
                    width={32}
                    height={42}
                    className={styles.avatarImg}
                  />
                  <Image
                    src="/images/home/testimonial/fireproof.png"
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
              {/* Card 3: NOV content with circularsteel background */}
              <div className={styles.card3Wrapper}>
                <ParallaxElement speed={-0.10} className={styles.cardImgWrapper}>
                  <Image
                    src="/images/home/testimonial/circularsteel.png"
                    alt="Satorp Work Showcase"
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </ParallaxElement>
                <div className={styles.testimonialOverlay}>
                  <div className={styles.companyLogo}>
                    <Image 
                      src="/images/home/testimonial/nov.png" 
                      alt="NOV Logo" 
                      width={100} 
                      height={40} 
                      className={styles.logoImg}
                    />
                  </div>
                  <p className={styles.testimonialText}>"Trustable Company in all Situations. Works are very fast and professionally doing all the works."</p>
                  <p className={styles.testimonialAuthor}>Jassim, NOV Trading Co.</p>
                </div>
              </div>

              {/* Card 4: Satorp content with steel background */}
              <div className={styles.card4Wrapper}>
                <ParallaxElement speed={-0.10} className={styles.cardImgWrapper}>
                  <Image
                    src="/images/home/testimonial/steel.png"
                    alt="NOV Work Showcase"
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </ParallaxElement>
                <div className={`${styles.testimonialOverlay} ${styles.darkerOverlay}`}>
                  <p className={styles.testimonialText}>"At Saudi Fab Store, our clients are the focus of everything we do. We work hard to deliver products that earn results."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
