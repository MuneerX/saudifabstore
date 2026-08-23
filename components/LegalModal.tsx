"use client";

import React, { useEffect, useState, useId } from "react";
import { createPortal } from "react-dom";
import {
  ShieldCheck,
  FileText,
  Award,
  Search,
  X,
  Printer,
  CheckCircle2,
  Lock,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Scale,
  Check
} from "lucide-react";
import styles from "./LegalModal.module.css";

export type LegalTab = "privacy" | "terms" | "saso-iso";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
}

export function LegalModal({ isOpen, onClose, defaultTab = "privacy" }: Props) {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");

  // Unique IDs for accessibility
  const titleId = useId();
  const descriptionId = useId();

  // Cookie Preference State
  const [cookies, setCookies] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setSearchQuery("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setTimeout(() => {
      onClose();
      setAcknowledged(false);
    }, 400);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Helper to check search match
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTopRow}>
            <div className={styles.brandInfo}>
              <div className={styles.badgeIcon}>
                {activeTab === "privacy" && <ShieldCheck size={22} />}
                {activeTab === "terms" && <FileText size={22} />}
                {activeTab === "saso-iso" && <Award size={22} />}
              </div>
              <div className={styles.modalTitleGroup}>
                <h2 id={titleId} className={styles.modalMainHeading}>
                  {activeTab === "privacy" && "Privacy & Data Protection Policy"}
                  {activeTab === "terms" && "Terms & Conditions of Service"}
                  {activeTab === "saso-iso" && "SASO & ISO Compliance Dossier"}
                </h2>
                <p id={descriptionId} className={styles.modalSubHeading}>
                  Saudi Fab Store Co. LLC • Official Legal & Technical Framework (KSA Standards)
                </p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                className={styles.printBtn}
                onClick={handlePrint}
                title="Print Policy Statement"
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>

              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close legal modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Bar: Tabs + Search Bar */}
          <div className={styles.navBar}>
            <div className={styles.tabsGroup} role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "privacy"}
                className={`${styles.tabBtn} ${
                  activeTab === "privacy" ? styles.tabBtnActive : ""
                }`}
                onClick={() => {
                  setActiveTab("privacy");
                  setActiveSection("");
                }}
              >
                <ShieldCheck size={16} />
                <span>Privacy Policy</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "terms"}
                className={`${styles.tabBtn} ${
                  activeTab === "terms" ? styles.tabBtnActive : ""
                }`}
                onClick={() => {
                  setActiveTab("terms");
                  setActiveSection("");
                }}
              >
                <FileText size={16} />
                <span>Terms &amp; Conditions</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "saso-iso"}
                className={`${styles.tabBtn} ${
                  activeTab === "saso-iso" ? styles.tabBtnActive : ""
                }`}
                onClick={() => {
                  setActiveTab("saso-iso");
                  setActiveSection("");
                }}
              >
                <Award size={16} />
                <span>SASO &amp; ISO Compliance</span>
              </button>
            </div>

            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={15} />
              <input
                type="text"
                placeholder="Search policy or clause..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className={styles.modalBodyContainer}>
          {/* Quick Nav Sidebar */}
          <div className={styles.sideNav}>
            <span className={styles.sideNavTitle}>Quick Navigation</span>
            <div className={styles.sideNavList}>
              {activeTab === "privacy" && (
                <>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-pdpl" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-pdpl")}
                  >
                    <span>1. Saudi PDPL &amp; Scope</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-data-collection" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-data-collection")}
                  >
                    <span>2. Data We Collect</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-data-usage" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-data-usage")}
                  >
                    <span>3. How Data Is Used</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-security" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-security")}
                  >
                    <span>4. AES-256 &amp; Security</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-rights" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-rights")}
                  >
                    <span>5. Your Rights under KSA Law</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-cookies" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-cookies")}
                  >
                    <span>6. Cookie Preferences</span>
                    <ChevronRight size={13} />
                  </button>
                </>
              )}

              {activeTab === "terms" && (
                <>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-scope" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-scope")}
                  >
                    <span>1. Scope &amp; Portal Terms</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-rfq" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-rfq")}
                  >
                    <span>2. RFQ &amp; Price Validity</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-specs" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-specs")}
                  >
                    <span>3. Steel Fabrication Specs</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-payment" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-payment")}
                  >
                    <span>4. Payment &amp; ZATCA VAT</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-delivery" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-delivery")}
                  >
                    <span>5. Logistics &amp; Site Delivery</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-warranty" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-warranty")}
                  >
                    <span>6. Inspection &amp; Warranty</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-law" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-law")}
                  >
                    <span>7. KSA Jurisdiction</span>
                    <ChevronRight size={13} />
                  </button>
                </>
              )}

              {activeTab === "saso-iso" && (
                <>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-saso-saleem" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-saso-saleem")}
                  >
                    <span>1. SASO &amp; SABER SALEEM</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-iso9001" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-iso9001")}
                  >
                    <span>2. ISO 9001:2015 QMS</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-ndt" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-ndt")}
                  >
                    <span>3. AWS Welding &amp; NDT</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-iso14001" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-iso14001")}
                  >
                    <span>4. ISO 14001 EMS</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-iso45001" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-iso45001")}
                  >
                    <span>5. ISO 45001 Safety</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    className={`${styles.sideNavItem} ${
                      activeSection === "sec-aramco" ? styles.sideNavItemActive : ""
                    }`}
                    onClick={() => scrollToSection("sec-aramco")}
                  >
                    <span>6. Aramco &amp; MHRSD Standards</span>
                    <ChevronRight size={13} />
                  </button>
                </>
              )}
            </div>

            {/* Sidebar Compliance Callout */}
            <div className={styles.sidebarComplianceBox}>
              <div className={styles.complianceBadgeRow}>
                <CheckCircle2 size={14} />
                <span>Verified Standards</span>
              </div>
              <p>
                CR No: 2050123456 • SASO Certificate No: SASO-2026-BK889 • SABER Registered Partner
              </p>
              <a
                href="/about"
                className={styles.verifyLink}
                target="_blank"
                rel="noreferrer"
              >
                <span>View Company Credentials</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Main Content Scroll Area */}
          <div className={styles.contentArea}>
            <div className={styles.lastUpdatedBanner}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} />
                <span>
                  <strong>Official Policy Document:</strong> Version 4.2 • Effective Date: January 1, 2026
                </span>
              </div>
              <span>Dammam First Industrial City, KSA</span>
            </div>

            {/* TAB 1: PRIVACY POLICY */}
            {activeTab === "privacy" && (
              <>
                {matchesSearch("pdpl privacy personal data saudi arabia law royal decree m/19") && (
                  <div id="sec-pdpl" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <ShieldCheck className={styles.sectionHeadingIcon} size={20} />
                      <span>1. Saudi PDPL &amp; Regulatory Framework</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Saudi Fab Store Co. LLC (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) strictly respects and protects the personal and commercial privacy of all corporate clients, contracting partners, supply chain procurement officers, and digital visitors. This policy is framed in full alignment with the <strong>Saudi Arabia Personal Data Protection Law (PDPL)</strong> enacted under Royal Decree No. M/19 and its Executive Regulations, alongside international standards (GDPR) for cross-border industrial inquiries.
                    </p>
                  </div>
                )}

                {matchesSearch("collect data information accounts rfq commercial cr vat tax") && (
                  <div id="sec-data-collection" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Building2 className={styles.sectionHeadingIcon} size={20} />
                      <span>2. Information We Collect</span>
                    </h3>
                    <p className={styles.paragraph}>
                      To fulfill industrial requests for quotation (RFQs), custom steel fabrication contracts, equipment supply, and client portal authentication, we gather the following categories of information:
                    </p>
                    <div className={styles.featureList}>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>
                          <Building2 size={16} className={styles.sectionHeadingIcon} />
                          <span>Corporate &amp; Commercial Data</span>
                        </div>
                        <p className={styles.featureCardText}>
                          Commercial Registration (CR) numbers, ZATCA VAT registration details, corporate billing address, authorized buyer names, and official company email domains.
                        </p>
                      </div>

                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>
                          <FileText size={16} className={styles.sectionHeadingIcon} />
                          <span>Technical Specs &amp; RFQs</span>
                        </div>
                        <p className={styles.featureCardText}>
                          Structural CAD blueprints (Tekla/SolidWorks), bill of quantities (BOQ), material grade preferences (e.g. S355J2+N / ASTM A572), and project site delivery locations.
                        </p>
                      </div>

                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>
                          <Lock size={16} className={styles.sectionHeadingIcon} />
                          <span>Digital Telemetry &amp; Auth</span>
                        </div>
                        <p className={styles.featureCardText}>
                          Client portal login credentials, IP addresses, browser cookies, device metadata, and audit logs during RFQ submissions or document downloads.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {matchesSearch("use data processing rfq saber saso zatca billing portal") && (
                  <div id="sec-data-usage" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <CheckCircle2 className={styles.sectionHeadingIcon} size={20} />
                      <span>3. Purpose &amp; Processing of Information</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Your information is processed strictly for legitimate industrial and commercial purposes:
                    </p>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <li className={styles.paragraph}>
                        Generating accurate engineering estimates, fabrication timelines, and SASO compliance dossiers.
                      </li>
                      <li className={styles.paragraph}>
                        Processing tax-compliant e-invoices integrated with the Saudi ZATCA FATOORA portal.
                      </li>
                      <li className={styles.paragraph}>
                        Issuing third-party NDT test certificates, Mill Test Reports (MTC 3.1), and SABER clearance documents.
                      </li>
                      <li className={styles.paragraph}>
                        Delivering emergency 24/7 technical field response across Dammam, Jubail, and Khobar industrial zones.
                      </li>
                    </ul>
                  </div>
                )}

                {matchesSearch("security aes-256 encryption tls ssl cloud protection audit") && (
                  <div id="sec-security" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Lock className={styles.sectionHeadingIcon} size={20} />
                      <span>4. Data Security &amp; Encryption Standards</span>
                    </h3>
                    <p className={styles.paragraph}>
                      We employ defense-in-depth cybersecurity measures to prevent unauthorized data access, disclosure, or alteration. All client portal transmissions are encrypted using <strong>TLS 1.3 with 256-bit SSL encryption</strong>. Stored database archives, project blueprints, and commercial invoices are protected with <strong>AES-256 bit hardware-level encryption</strong> on secure cloud infrastructure located within Saudi Arabia.
                    </p>
                  </div>
                )}

                {matchesSearch("rights access rectify destroy pdpl saudi law opt out consent") && (
                  <div id="sec-rights" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Scale className={styles.sectionHeadingIcon} size={20} />
                      <span>5. Your Rights under KSA Law</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Under Article 4 of the Saudi PDPL, data subjects possess fundamental rights regarding their personal information:
                    </p>
                    <div className={styles.featureList}>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>Right to Access &amp; Request</div>
                        <p className={styles.featureCardText}>Request a complete digital record of all corporate and contact data maintained by Saudi Fab Store.</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>Right to Rectification</div>
                        <p className={styles.featureCardText}>Update or correct inaccurate company profiles, tax IDs, or representative contacts instantly via client portal.</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>Right to Eradication &amp; Opt-out</div>
                        <p className={styles.featureCardText}>Request deletion of inactive account records or unsubscribe from non-essential promotional bulletins.</p>
                      </div>
                    </div>
                  </div>
                )}

                {matchesSearch("cookies preferences analytics marketing essential track") && (
                  <div id="sec-cookies" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Sparkles className={styles.sectionHeadingIcon} size={20} />
                      <span>6. Cookie Preferences &amp; Management Center</span>
                    </h3>
                    <p className={styles.paragraph}>
                      You can customize your browser cookie preferences below. Essential cookies are required for portal security, session preservation, and RFQ submission handling.
                    </p>

                    <div className={styles.cookieContainer}>
                      <div className={styles.cookieRow}>
                        <div className={styles.cookieInfo}>
                          <span className={styles.cookieTitle}>Strictly Necessary &amp; Security Cookies</span>
                          <span className={styles.cookieDesc}>Required for authentication, shopping cart state, and SABER certification verification.</span>
                        </div>
                        <label className={styles.switch}>
                          <input type="checkbox" checked={cookies.essential} disabled />
                          <span className={styles.slider} />
                        </label>
                      </div>

                      <div className={styles.cookieRow}>
                        <div className={styles.cookieInfo}>
                          <span className={styles.cookieTitle}>Performance &amp; Analytics Cookies</span>
                          <span className={styles.cookieDesc}>Helps us optimize load times, PDF catalog downloads, and portal navigation performance.</span>
                        </div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={cookies.analytics}
                            onChange={(e) => setCookies({ ...cookies, analytics: e.target.checked })}
                          />
                          <span className={styles.slider} />
                        </label>
                      </div>

                      <div className={styles.cookieRow}>
                        <div className={styles.cookieInfo}>
                          <span className={styles.cookieTitle}>Personalization &amp; Bulletin Cookies</span>
                          <span className={styles.cookieDesc}>Enables tailored technical recommendations, steel market price updates, and new tool announcements.</span>
                        </div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={cookies.marketing}
                            onChange={(e) => setCookies({ ...cookies, marketing: e.target.checked })}
                          />
                          <span className={styles.slider} />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: TERMS & CONDITIONS */}
            {activeTab === "terms" && (
              <>
                {matchesSearch("terms scope agreement conditions supply contract saudifabstore") && (
                  <div id="sec-scope" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <FileText className={styles.sectionHeadingIcon} size={20} />
                      <span>1. Scope of Agreement &amp; Portal Terms</span>
                    </h3>
                    <p className={styles.paragraph}>
                      These Terms and Conditions govern all commercial quotations, purchase orders, structural steel fabrication contracts, sandblasting services, industrial equipment rentals, and digital portal usage provided by <strong>Saudi Fab Store Co. LLC</strong>. By issuing a Purchase Order (PO) or utilizing our procurement portal, the Client accepts these terms in full without reservation.
                    </p>
                  </div>
                )}

                {matchesSearch("rfq quotation price validity steel 15 days raw material index") && (
                  <div id="sec-rfq" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Scale className={styles.sectionHeadingIcon} size={20} />
                      <span>2. Quotations &amp; Price Validity Period</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Due to international steel price fluctuations (LME &amp; local mill indices), written quotations issued by Saudi Fab Store remain valid for exactly <strong>fifteen (15) calendar days</strong> from issuance date unless specified otherwise in writing. Order confirmation is subject to final inventory availability and written acceptance by our commercial department.
                    </p>
                  </div>
                )}

                {matchesSearch("specs steel fabrication tolerances aws d1.1 iso 13920 cnc plasma") && (
                  <div id="sec-specs" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Award className={styles.sectionHeadingIcon} size={20} />
                      <span>3. Steel Fabrication Specifications &amp; Tolerances</span>
                    </h3>
                    <p className={styles.paragraph}>
                      All steel structures, industrial skip containers, crane attachments, and custom weldments are manufactured in accordance with approved CAD/BIM shop drawings. Fabrication tolerances adhere strictly to <strong>ISO 13920 Class B</strong> for linear dimensions and angular tolerances. Welding procedures comply with <strong>AWS D1.1 (Structural Welding Code – Steel)</strong> using AWS-certified welders.
                    </p>
                  </div>
                )}

                {matchesSearch("payment zatca vat 15% invoicing sar saudi riyal billing") && (
                  <div id="sec-payment" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Building2 className={styles.sectionHeadingIcon} size={20} />
                      <span>4. Payment Terms &amp; ZATCA VAT Compliance</span>
                    </h3>
                    <p className={styles.paragraph}>
                      All monetary figures quoted are in <strong>Saudi Riyal (SAR)</strong> and exclude Value Added Tax unless explicitly stated. A standard <strong>15% VAT</strong> is applied to all invoices in compliance with ZATCA regulations. Standard payment terms for approved credit accounts are Net 30 days from invoice date. Customized fabrication orders require an initial 50% advance deposit prior to steel cutting.
                    </p>
                  </div>
                )}

                {matchesSearch("delivery logistics freight offloading site dammam jubail rfq") && (
                  <div id="sec-delivery" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <CheckCircle2 className={styles.sectionHeadingIcon} size={20} />
                      <span>5. Logistics, Delivery &amp; Site Offloading</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Delivery timelines are calculated from the receipt of approved shop drawings and deposit clearance. Unless agreed otherwise under Ex-Works (EXW) terms, Saudi Fab Store coordinates transport to client job sites across Saudi Arabia. Clients are responsible for ensuring clear crane/forklift access and prompt offloading within 2 hours of trailer arrival at site.
                    </p>
                  </div>
                )}

                {matchesSearch("inspection warranty 7 days mtc 3.1 claims defect repair") && (
                  <div id="sec-warranty" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <ShieldCheck className={styles.sectionHeadingIcon} size={20} />
                      <span>6. Inspection, MTC 3.1 &amp; Warranty Terms</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Clients are granted a <strong>seven (7) day inspection window</strong> upon material delivery to verify quantities and dimensional conformity against the packing list and Mill Test Certificates (MTC EN 10204 3.1). All structural weldments carry a <strong>12-month craftsmanship warranty</strong> covering structural integrity against weld cracking under rated Working Load Limits (WLL).
                    </p>
                  </div>
                )}

                {matchesSearch("jurisdiction saudi law dammam commercial court disputes force majeure") && (
                  <div id="sec-law" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Scale className={styles.sectionHeadingIcon} size={20} />
                      <span>7. Governing Law &amp; Jurisdiction</span>
                    </h3>
                    <p className={styles.paragraph}>
                      These terms and any dispute or claim arising out of commercial transactions shall be governed by and construed in accordance with the <strong>Laws of the Kingdom of Saudi Arabia</strong>. Any legal dispute that cannot be settled amicably shall be submitted to the exclusive jurisdiction of the <strong>Commercial Courts of Dammam, Eastern Province, KSA</strong>.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* TAB 3: SASO & ISO COMPLIANCE */}
            {activeTab === "saso-iso" && (
              <>
                {matchesSearch("saso saber saleem certification saudi standards quality") && (
                  <div id="sec-saso-saleem" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Award className={styles.sectionHeadingIcon} size={20} />
                      <span>1. SASO &amp; SABER SALEEM Conformity</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Saudi Fab Store operations strictly adhere to the regulatory requirements of the <strong>Saudi Standards, Metrology and Quality Organization (SASO)</strong> under the <strong>SALEEM Product Safety Program</strong>. All manufactured machinery, heavy skips, lifting attachments, and safety equipment are registered on the official <strong>SABER digital platform</strong> with verified Certificates of Conformity (CoC).
                    </p>
                  </div>
                )}

                {matchesSearch("iso 9001:2015 quality management qms mtc 3.1 raw material") && (
                  <div id="sec-iso9001" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <CheckCircle2 className={styles.sectionHeadingIcon} size={20} />
                      <span>2. ISO 9001:2015 Quality Management Systems</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Our fabrication facility in Dammam First Industrial City maintains full <strong>ISO 9001:2015 certification</strong>. Every incoming steel plate, I-beam, and hollow section undergoes raw material verification against Mill Test Certificates (MTC 3.1), verifying chemical composition, heat numbers, and mechanical yield strength prior to cutting.
                    </p>
                  </div>
                )}

                {matchesSearch("aws welding ndt inspection mpi ut visual level ii certification") && (
                  <div id="sec-ndt" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <ShieldCheck className={styles.sectionHeadingIcon} size={20} />
                      <span>3. AWS Structural Welding &amp; NDT Protocol</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Structural welding processes strictly follow <strong>AWS D1.1 standards</strong> executed by qualified welders holding valid 6G/4G certifications. Non-Destructive Testing (NDT) is conducted by ASNT Level II certified inspectors:
                    </p>
                    <div className={styles.featureList}>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>VT - Visual Testing (100%)</div>
                        <p className={styles.featureCardText}>Full surface visual inspection for weld profile, throat thickness, undercut, and porosity verification.</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>MPI - Magnetic Particle (Critical Nodes)</div>
                        <p className={styles.featureCardText}>Detection of surface and near-surface micro-discontinuities on load-bearing padeyes and spreader beams.</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureCardTitle}>UT - Ultrasonic Testing (Heavy Beams)</div>
                        <p className={styles.featureCardText}>Volumetric inspection of full-penetration butt welds on heavy structural beams exceeding 20mm thickness.</p>
                      </div>
                    </div>
                  </div>
                )}

                {matchesSearch("iso 14001:2015 environmental management sandblasting voc paint") && (
                  <div id="sec-iso14001" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Sparkles className={styles.sectionHeadingIcon} size={20} />
                      <span>4. ISO 14001:2015 Environmental Compliance</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Our surface treatment facility features eco-friendly SA 2.5 grit sandblasting enclosures equipped with heavy-duty dust collection cyclones. Paint application utilizes low-VOC epoxy and polyurethane marine-grade coating systems compliant with <strong>ISO 14001:2015 Environmental Standards</strong> and Saudi National Center for Environmental Compliance (NCEC) directives.
                    </p>
                  </div>
                )}

                {matchesSearch("iso 45001:2018 safety proof test 1.5x wll aramco mhrsd") && (
                  <div id="sec-iso45001" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Lock className={styles.sectionHeadingIcon} size={20} />
                      <span>5. ISO 45001:2018 Safety &amp; Proof-Load Testing</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Occupational health and safety is governed under <strong>ISO 45001:2018</strong>. All manufactured lifting gear, skip hoppers, and custom lifting beams undergo proof-load testing at <strong>1.5 times Working Load Limit (WLL)</strong> on calibrated hydraulic test beds before receiving third-party load test certificates.
                    </p>
                  </div>
                )}

                {matchesSearch("aramco mhrsd approval vendor code saudi government compliance") && (
                  <div id="sec-aramco" className={styles.sectionBlock}>
                    <h3 className={styles.sectionHeading}>
                      <Building2 className={styles.sectionHeadingIcon} size={20} />
                      <span>6. Saudi Aramco &amp; MHRSD Vendor Prequalification</span>
                    </h3>
                    <p className={styles.paragraph}>
                      Saudi Fab Store holds active vendor prequalification credentials for major Saudi energy and infrastructure entities, including Saudi Aramco safety instructions, SABIC technical specs, and Ministry of Human Resources occupational safety requirements. Complete quality dossiers (QAP) accompany every major project shipment.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerNotes}>
            <CheckCircle2 size={16} style={{ color: "#10B981" }} />
            <span>Document verified by Saudi Fab Store Legal &amp; Compliance Department.</span>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.closeSecondaryBtn} onClick={onClose}>
              Close Window
            </button>

            <button className={styles.acknowledgeBtn} onClick={handleAcknowledge}>
              {acknowledged ? (
                <>
                  <Check size={16} />
                  <span>Acknowledged!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Accept &amp; Acknowledge</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

