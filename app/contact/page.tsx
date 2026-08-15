"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { TreatmentQuizModal } from "../../components/TreatmentQuizModal";
import { ParallaxElement } from "../../components/ParallaxElement";
import { TextReveal } from "../../components/TextReveal";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import styles from "./page.module.css";

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDivision, setIsOpenDivision] = useState(false);
  const [isOpenScope, setIsOpenScope] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    division: "steel",
    location: "",
    scope: "small",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! Your project inquiry has been received. Our engineering team will contact you shortly.");
    setIsModalOpen(true);
  };

  const divisionLabels: Record<string, string> = {
    steel: "Steel Fabrication",
    blasting: "Blasting Works",
    coatings: "Painting & Coatings",
    forklift: "Forklift Repair",
    protorc: "ProTorc Torquing",
    diesel: "Diesel Pump Maintenance",
    chemical: "Chemical Factory",
    paper: "Paper & Plastic",
    stone: "Brooq Stone",
    wood: "Smart Woodworks",
    trading: "General Trading",
    zameter: "Zameter"
  };

  const scopeLabels: Record<string, string> = {
    small: "Under 50 Tons / Small Batch",
    medium: "50 – 200 Tons / Medium Commercial",
    large: "200+ Tons / Turnkey Industrial",
    maintenance: "Preventative AMC Contract"
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Overlay Navbar */}
      <Navbar isLight={false} hasBorder={false} />

      {/* Main Glass Contact Section */}
      <section className={styles.contactSection}>
        {/* Background Stock Image with Gradient Overlay inside the section */}
        <ParallaxElement speed={-0.10} className={styles.heroBackground}>
          <Image
            src="/images/contact/bg_7_2.jpeg"
            alt="Brooq Al Khalij Contact Background"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
          />
          <div className={styles.bgOverlay} />
        </ParallaxElement>

        <div className={styles.contactSectionContainer}>
          <div className={styles.contactGrid}>
            {/* Left Column: Glassmorphic Contact Form */}
            <div className={styles.formGlassCard}>
              <div className={styles.cardHeader}>
                <TextReveal animation="slide-up">
                  <h1 className={styles.title}>Project Inquiry &amp; Quotation</h1>
                </TextReveal>
                <TextReveal animation="blur" delay={0.15}>
                  <p className={styles.description}>
                    Submit your project requirements below to receive a custom commercial quotation and technical consultation from our division engineers.*
                  </p>
                </TextReveal>
              </div>

              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Form Row 1 */}
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Full Name</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Email Address</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                {/* Form Row 2 */}
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Phone Number</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="+966 5X XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Division</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <div className={styles.customDropdownWrapper}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpenDivision(!isOpenDivision);
                          setIsOpenScope(false);
                        }}
                        className={styles.customDropdownTrigger}
                      >
                        <span>{divisionLabels[formData.division]}</span>
                        <span className={`${styles.customDropdownTriggerArrow} ${isOpenDivision ? styles.customDropdownTriggerArrowOpen : ""}`} />
                      </button>
                      {isOpenDivision && (
                        <ul className={styles.customDropdownMenu}>
                          {Object.keys(divisionLabels).map((key) => (
                            <li
                              key={key}
                              onClick={() => {
                                setFormData({ ...formData, division: key });
                                setIsOpenDivision(false);
                              }}
                              className={`${styles.customDropdownItem} ${formData.division === key ? styles.customDropdownItemActive : ""}`}
                            >
                              {divisionLabels[key]}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Row 3 */}
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Project Location</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type="text"
                      placeholder="City / Industrial Zone"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Estimated Scope</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <div className={styles.customDropdownWrapper}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpenScope(!isOpenScope);
                          setIsOpenDivision(false);
                        }}
                        className={styles.customDropdownTrigger}
                      >
                        <span>{scopeLabels[formData.scope]}</span>
                        <span className={`${styles.customDropdownTriggerArrow} ${isOpenScope ? styles.customDropdownTriggerArrowOpen : ""}`} />
                      </button>
                      {isOpenScope && (
                        <ul className={styles.customDropdownMenu}>
                          {Object.keys(scopeLabels).map((key) => (
                            <li
                              key={key}
                              onClick={() => {
                                setFormData({ ...formData, scope: key });
                                setIsOpenScope(false);
                              }}
                              className={`${styles.customDropdownItem} ${formData.scope === key ? styles.customDropdownItemActive : ""}`}
                            >
                              {scopeLabels[key]}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Row 4 - Full Textarea */}
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <span className={styles.labelText}>Requirements &amp; Technical Notes</span>
                    <span className={styles.dashedConnector} />
                  </div>
                  <textarea
                    placeholder="Provide drawing references, dimensions, or specific material grade requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={styles.textareaField}
                  />
                </div>

                {/* Submit Action Button */}
                <button type="submit" className={styles.submitBtn}>
                  Submit Inquiry &amp; Request Quote
                </button>

                {/* Bottom Disclaimer Note */}
                <p className={styles.disclaimerText}>
                  *All submitted requirements are directly evaluated by qualified Brooq Al Khalij project engineers. We will review your blueprint specs and respond with a formal proposal.
                </p>
              </form>
            </div>

            {/* Right Column: Live Metric Stats, Quick Channels & Branch Cards */}
            <div className={styles.infoColumn}>
              {/* Live Metric Stats Display */}
              <div className={styles.liveMetricCard}>
                <span className={styles.metricLabel}>Direct Response Hotline:</span>
                <h2 className={styles.metricNumber}>24/7</h2>
                <span className={styles.metricSubtext}>Average technician dispatch: under 2 hours</span>
              </div>

              {/* Direct Quick Communication Channels */}
              <div className={styles.quickContactCard}>
                <span className={styles.quickContactHeader}>Direct Contact Channels:</span>
                <div className={styles.contactChannelsList}>
                  <a 
                    href="https://wa.me/966538121100?text=Hello%20Brooq%20Al%20Khalij%2C%20I%20would%20like%20to%20inquire%20about%20your%20services." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.whatsappChannelItem}
                  >
                    <MessageSquare size={18} />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a href="tel:+966138121100" className={styles.contactChannelItem}>
                    <Phone size={18} />
                    <span>Call: +966 13 812 1100</span>
                  </a>
                  <a href="mailto:info@brooqalkhalij.com" className={styles.contactChannelItem}>
                    <Mail size={18} />
                    <span>Email: info@brooqalkhalij.com</span>
                  </a>
                </div>
              </div>

              {/* Branch Locations Section */}
              <div className={styles.branchCardsContainer}>
                <span className={styles.branchCardsLabel}>Regional Divisions &amp; Workshops:</span>
                <div className={styles.branchGrid}>
                  {/* Branch Card 1 - Dammam */}
                  <div className={styles.branchGlassCard}>
                    <h3 className={styles.branchBigText}>Dammam</h3>
                    <span className={styles.branchSubText}>Headquarters &amp; Heavy Fabrication</span>
                    <p className={styles.branchAddress}>
                      2nd Industrial City, Street 68<br />
                      Dammam, Saudi Arabia
                    </p>
                    <svg className={styles.branchWaveSvg} viewBox="0 0 400 60" preserveAspectRatio="none">
                      <path
                        d="M0,30 C150,60 250,0 400,30 L400,60 L0,60 Z"
                        fill="rgba(255, 255, 255, 0.08)"
                      />
                    </svg>
                  </div>

                  {/* Branch Card 2 - Riyadh */}
                  <div className={styles.branchGlassCard}>
                    <h3 className={styles.branchBigText}>Riyadh</h3>
                    <span className={styles.branchSubText}>Logistics &amp; Trading Branch</span>
                    <p className={styles.branchAddress}>
                      Al-Sulay Industrial District<br />
                      Riyadh, Saudi Arabia
                    </p>
                    <svg className={styles.branchWaveSvg} viewBox="0 0 400 60" preserveAspectRatio="none">
                      <path
                        d="M0,20 C120,55 280,5 400,35 L400,60 L0,60 Z"
                        fill="rgba(255, 255, 255, 0.08)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Estimation Guide Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoSectionContainer}>
          <h2 className={styles.infoSectionTitle}>Our Project Estimation &amp; Consultation Process</h2>
          <div className={styles.dashedDivider} />
          
          <p className={styles.infoSectionIntro}>
            A formal project estimation represents the calculated budget, material allocation, and timeline required to complete your industrial build, structural fabrication, or contracting project. Every proposal balances material specifications, assembly complexity, quality certifications, and logistics variables to deliver a competitive cost projection.
          </p>

          <div className={styles.infoSubSection}>
            <h3 className={styles.infoSubSectionTitle}>How Proposals Are Formulated</h3>
            <p className={styles.infoSubSectionText}>
              Our engineering team evaluates your blueprint drawings, material grades (such as raw carbon steel tonnage or surface square meters), and fabrication specifications to generate a comprehensive bill of materials and transparent line-item proposal.
            </p>
          </div>

          <div className={styles.infoSubSection}>
            <h3 className={styles.infoSubSectionTitle}>Key Project Variables</h3>
            <p className={styles.infoSubSectionText}>
              A typical industrial steel or contracting estimate assumes standard AWS certified welds and a base SA 2.5 blast profile. Our engineers ensure all raw specifications strictly adhere to KSA building code limits and client safety standards.
            </p>
          </div>

          <div className={styles.infoSubSection}>
            <h3 className={styles.infoSubSectionTitle}>Key Proposal Evaluation Factors</h3>
            <p className={styles.infoSubSectionText}>
              If your project blueprints contain any of the following parameters, our engineers will incorporate specialized adjustments into your quotation:
            </p>
            <ul className={styles.infoList}>
              <li className={styles.infoListItem}>Raw steel index price fluctuations and specialized alloy sourcing</li>
              <li className={styles.infoListItem}>Complex multi-plane connection nodes requiring specialized manual fit-ups</li>
              <li className={styles.infoListItem}>Specific environmental ratings (high humidity or maritime anti-corrosion profiles)</li>
              <li className={styles.infoListItem}>Accelerated delivery schedules requiring dual-shift fabrication labor</li>
            </ul>
          </div>

          <div className={styles.infoSubSection}>
            <h3 className={styles.infoSubSectionTitle}>Estimation Optimization Tips</h3>
            <ul className={styles.infoList}>
              <li className={styles.infoListItem}>
                <strong>Material Sourcing:</strong> Opt for standard hot-rolled structural shapes where possible to secure the lowest mill run rates.
              </li>
              <li className={styles.infoListItem}>
                <strong>Welding Specs:</strong> Utilize automated fillet welding over manual double-bevel joins where high stress allows to speed up production.
              </li>
              <li className={styles.infoListItem}>
                <strong>Surface Treatment:</strong> Coordinate blasting and prime painting in-shop to reduce mobilization costs.
              </li>
              <li className={styles.infoListItem}>
                <strong>Logistics:</strong> Batch delivery timelines to match site erection phases and prevent container storage surcharges.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Wrapper with White Background */}
      <div style={{ backgroundColor: "#ffffff", width: "100%" }}>
        <Footer />
      </div>

      <TreatmentQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
