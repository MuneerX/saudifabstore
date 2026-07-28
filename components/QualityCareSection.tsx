"use client";

import React from "react";
import { Stethoscope, UserCheck, Truck, Pill } from "lucide-react";
import styles from "./QualityCareSection.module.css";

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "quality",
    icon: <Stethoscope size={24} strokeWidth={1.4} />,
    title: "Quality on Works",
    description:
      "From day one, our focus is delivering superior quality standards that ensure safety and long-term value."
  },
  {
    id: "value",
    icon: <UserCheck size={24} strokeWidth={1.4} />,
    title: "Value for Money",
    description:
      "High quality always ends up costing clients less in the end — be it through solutions that improve productivity or safety."
  },
  {
    id: "professional",
    icon: <Truck size={24} strokeWidth={1.4} />,
    title: "Professional Works",
    description:
      "Brooq Al Khalij has professional workers and engineers who are qualified from correspondent academies."
  },
  {
    id: "affordable",
    icon: <Pill size={24} strokeWidth={1.4} />,
    title: "Extremely Affordable",
    description:
      "We have our own workers and staff, so we can provide affordable prices. Experienced labors complete work faster."
  }
];

export function QualityCareSection() {
  return (
    <section className={styles.section}>
      {/* Smooth transition glow from Company section (#F6EADF) into Why Choose (#FBF9F4) */}
      <div className={styles.topTransitionGlow} />
      <div className={styles.container}>
        {/* Headline */}
        <h2 className={styles.headline}>
          Why Industry Leaders Choose <br />
          Brooq Al Khalij Group
        </h2>

        {/* 4 Feature Columns Grid */}
        <div className={styles.featuresGrid}>
          {FEATURES.map((item) => (
            <div key={item.id} className={styles.featureCard}>
              <div className={styles.dashedDivider} />
              <div className={styles.iconWrapper}>{item.icon}</div>
              <div className={styles.contentBox}>
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
