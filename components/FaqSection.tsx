"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ParallaxElement } from "./ParallaxElement";
import { TextReveal } from "./TextReveal";
import styles from "./FaqSection.module.css";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Can Brooq Al Khalij handle emergency fabrication and repair requests?",
    answer: "Yes, we are highly regarded for our rapid turnaround times. Our clients trust us to deliver fast, professional work during emergency situations to ensure minimal downtime for their critical operations."
  },
  {
    id: "faq-2",
    question: "Do you outsource your fabrication and manufacturing processes?",
    answer: "No, all of our steel fabrication, stone cutting, and manufacturing are handled entirely in-house at our Dammam facilities. This strict internal control ensures premium quality, allows for high customization, and provides factory-direct pricing."
  },
  {
    id: "faq-3",
    question: "Are your industrial coatings and blasting services suitable for extreme environments?",
    answer: "Absolutely. We specialize in heavy-duty applications including fire-proof coatings and industrial-grade surface prep. We customize our abrasive blasting profiles using various media sizes to ensure perfect adhesion and longevity in harsh conditions."
  },
  {
    id: "faq-4",
    question: "What level of warranty and quality assurance do you provide?",
    answer: "We stand by our craftsmanship. For our premium stone and solid surface installations, we provide a comprehensive 10-year warranty. All our contracting divisions operate with ISO-certified quality assurance to guarantee industry-standard results."
  },
  {
    id: "faq-5",
    question: "We need highly specific, non-standard structures. Can you design them from scratch?",
    answer: "Yes, our in-house engineering team designs and fabricates custom structures from scratch. Whether you need specialized 1-ton jib cranes, heavy-duty iron baskets, or custom office containers, we tailor every detail to your exact operational requirements."
  }
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={styles.section} id="faq">
      <div className={styles.brandFogGlow} />
      {/* Background Industrial Bolt Image Layer */}
      <div className={styles.bgImageContainer}>
        <ParallaxElement speed={-0.10} style={{ position: "relative", width: "100%", height: "125%", top: "-12.5%" }}>
          <Image
            src="/images/home/faq/bolt.png"
            alt="Brooq Al Khalij Industrial Bolt background"
            fill
            className={styles.bgImage}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </ParallaxElement>
      </div>

      <div className={styles.container}>
        {/* Left Column: Heading & Subtitle */}
        <div className={styles.leftCol}>
          <div className={styles.headerBlock}>
            <TextReveal animation="slide-up">
              <h2 className={styles.headline}>
                <span>Frequently</span>
                <span className={styles.secondLine}>asked questions</span>
              </h2>
            </TextReveal>
            <TextReveal animation="blur" delay={0.2}>
              <p className={styles.subText}>
                Find answers to common questions about Brooq Al Khalij Group and our services.
              </p>
            </TextReveal>
          </div>
        </div>

        {/* Right Column: Accordion Items */}
        <div className={styles.rightCol}>
          <div className={styles.accordionList}>
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={styles.faqRow}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.questionText}>{item.question}</span>
                    <svg
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className={`${styles.answerWrapper} ${
                      isOpen ? styles.answerWrapperOpen : ""
                    }`}
                  >
                    <div className={styles.answerContent}>
                      <p className={styles.answerText}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
