"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";
import { ShaderGradient } from "@/components/ShaderGradient";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  InformationSquareIcon, 
  Mail01Icon,
  PhoneCallIcon, 
  CheckmarkBadge01Icon, 
  Message01Icon,
  ArrowRight01Icon,
  DeliveryTruck01Icon,
  DeliveryReturn02Icon,
  ReceiptIcon,
  Award04Icon,
  PackageIcon,
  CreditCardIcon,
  Copy01Icon,
  Tick02Icon,
  Location01Icon,
  DeliveryBox01Icon
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import styles from "./page.module.css";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"survey" | "submitted">("survey");
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  // Unified Survey State
  const [selectedTopic, setSelectedTopic] = useState("orders");

  useEffect(() => {
    const topicParam = searchParams.get("topic");
    if (topicParam) {
      setSelectedTopic(topicParam);
    }
  }, [searchParams]);
  const [subCategory, setSubCategory] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredAction, setPreferredAction] = useState("");
  const [notes, setNotes] = useState("");

  const topics = [
    { id: "orders", label: "Order Tracking & Dispatch", icon: DeliveryTruck01Icon },
    { id: "report_issue", label: "Report Item or Seller Issue", icon: InformationSquareIcon },
    { id: "account_reset", label: "Account & Password Reset", icon: Award04Icon },
    { id: "returns", label: "30-Day Site Return Claim", icon: DeliveryReturn02Icon },
    { id: "billing", label: "VAT Tax Invoice & CR", icon: ReceiptIcon },
    { id: "logistics", label: "Crane & Heavy Logistics", icon: Location01Icon },
    { id: "quality", label: "SASO & Mill Quality Certs", icon: Award04Icon },
    { id: "credit", label: "B2B Commercial Credit", icon: CreditCardIcon },
    { id: "rfq", label: "Custom Product RFQ", icon: PackageIcon }
  ];

  // Dynamic Guidance & Solutions Map (Clean titles without category badges)
  const categoryGuidanceMap: Record<string, {
    title: string;
    items: { question: string; answer: string }[];
  }> = {
    report_issue: {
      title: "Item or Seller Issue Resolution",
      items: [
        {
          question: "How do I report a non-compliant or defective item?",
          answer: "Select 'Non-Compliant Material Delivered' or 'Transit Defect' in the category options below. Our quality engineering team will arrange 100% free site pickup and priority replacement."
        },
        {
          question: "What if the delivered item does not match CAD specifications?",
          answer: "Provide your PO or order number in the survey. Our Dammam workshop estimators review dimensional discrepancies and dispatch replacement flatbeds within 24 hours."
        },
        {
          question: "How are seller disputes resolved?",
          answer: "All items sold on Saudi Fab Store carry direct manufacturer warranties and SASO compliance certificates under strict SLA dispute resolution."
        }
      ]
    },
    account_reset: {
      title: "Account & Password Recovery Help",
      items: [
        {
          question: "How do I reset my account password?",
          answer: "Enter your registered corporate email below. An instant password reset link or verification code will be sent directly to your inbox."
        },
        {
          question: "What if I lost access to my corporate email address?",
          answer: "Select 'Update Registered Corporate Email'. Our security desk will verify your Commercial Registration (CR) and restore access within 2 hours."
        },
        {
          question: "How do I unlock a locked corporate admin account?",
          answer: "Select 'Account Lockout Assistance'. Executive admin accounts can be unlocked immediately after security identity confirmation."
        }
      ]
    },
    orders: {
      title: "Order Tracking & Dispatch Solutions",
      items: [
        {
          question: "Where can I track my active order status online?",
          answer: "You can track live flatbed dispatches, driver contact info, PO history, and MTR heat certificates directly in your Client Profile / Orders page (/profile)."
        },
        {
          question: "How do I get driver live GPS tracking?",
          answer: "Enter your PO number in the survey or visit your Client Profile page for real-time dispatch telemetry and driver updates across KSA."
        },
        {
          question: "Where can I download MTR mill heat certificates?",
          answer: "All SASO & ASTM certified steel orders include digital MTR mill heat certs downloadable directly from your Client Profile or emailed upon dispatch."
        },
        {
          question: "What if my flatbed delivery is delayed on-site?",
          answer: "Choose 'Immediate Dispatch Call Back'. We reroute drivers or dispatch priority backup flatbeds within 15 minutes across KSA."
        }
      ]
    },
    returns: {
      title: "30-Day Site Return & Claim Guidance",
      items: [
        {
          question: "What is covered under the 30-day site guarantee?",
          answer: "Any non-compliant dimensional specs, structural coating defects, or transit damage are covered for 100% free site pickup and replacement."
        },
        {
          question: "How quickly are replacement products dispatched?",
          answer: "Once site engineering inspection is confirmed, replacement flatbed dispatches depart from Dammam or Riyadh within 24 hours."
        },
        {
          question: "Can I receive a commercial credit refund note?",
          answer: "Yes, approved claims can issue an immediate commercial credit note applied directly to your corporate procurement account."
        }
      ]
    },
    billing: {
      title: "15% VAT Tax Invoice & ZATCA Assistance",
      items: [
        {
          question: "How do I obtain an official ZATCA 15% VAT Tax Invoice?",
          answer: "Submit your CR or PO number. Instant PDF ZATCA tax invoices are emailed to your corporate address immediately."
        },
        {
          question: "Can I edit the company CR or VAT registration details?",
          answer: "Select 'Company CR / VAT Number Edit Request'. Our finance desk updates ZATCA e-invoicing records before issuing final tax receipts."
        },
        {
          question: "What payment methods are supported for B2B orders?",
          answer: "We support direct corporate bank wire transfers (SAR / USD), certified company cheques, and credit line billing for approved accounts."
        }
      ]
    },
    logistics: {
      title: "Crane & Restricted Zone Logistics",
      items: [
        {
          question: "Do flatbed trucks include crane unloading on-site?",
          answer: "Crane-rigged flatbed trailers can be scheduled by selecting 'Assign Crane-Rigged Flatbed Trailer' in your resolution preferences."
        },
        {
          question: "How do you handle Aramco & SABIC gate permits?",
          answer: "Our drivers hold active Aramco / SABIC IQAMA clearances and vehicle gate passes for seamless restricted industrial zone entry."
        },
        {
          question: "Are oversized transport permits provided?",
          answer: "Yes, special oversized transport permits and escort vehicles are coordinated for long-span girders, heavy tanks, and structural frames."
        }
      ]
    },
    quality: {
      title: "SASO & Mill Certification Guidance",
      items: [
        {
          question: "Are SWL proof load test sheets provided?",
          answer: "All lifting beams, spreader bars, and heavy shackles are proof-load tested with official third-party SWL test certificates."
        },
        {
          question: "What NDT weld inspection reports are available?",
          answer: "We provide NDT MPI (Magnetic Particle) and UT (Ultrasonic Testing) weld inspection dossiers certified by ASNT Level II engineers."
        },
        {
          question: "Is Saudi Fab Store ISO 9001 certified?",
          answer: "Yes, Saudi Fab Store operates under audited ISO 9001:2015 Quality Management and SASO safety compliance standards."
        }
      ]
    },
    credit: {
      title: "B2B Commercial Credit & Terms",
      items: [
        {
          question: "What credit terms are available for corporate buyers?",
          answer: "We offer 30-day standard, 60-day project, and 90-day mega-contractor commercial credit terms for verified Saudi commercial accounts."
        },
        {
          question: "What documents are required to apply for credit?",
          answer: "Submit your Commercial Registration (CR), VAT certificate, 6 months bank statement, and corporate procurement authorization letter."
        },
        {
          question: "How long does credit application approval take?",
          answer: "Commercial credit evaluations are completed by our B2B finance desk within 2 business days upon receiving completed documents."
        }
      ]
    },
    rfq: {
      title: "Custom Product Fabrication Guidance",
      items: [
        {
          question: "How fast do I receive a formal line-item quotation?",
          answer: "Standard product RFQs receive formal line-item quotation PDFs within 2 hours. Custom engineered fabrications take under 4 hours."
        },
        {
          question: "Can I submit custom CAD / PDF engineering drawings?",
          answer: "Yes, attach notes or request engineering review. Our Dammam workshop estimators review DWG, DXF, and PDF drawings directly."
        },
        {
          question: "What surface preparation & coating profiles are offered?",
          answer: "We offer SA 2.5 sandblasting, hot-dip galvanizing (ASTM A123), epoxy primers, and custom polyurethane industrial finishes."
        }
      ]
    }
  };

  const subCategoryOptions: Record<string, string[]> = {
    report_issue: [
      "Non-Compliant Material Delivered",
      "Damaged Shipment / Transit Defect",
      "Seller Performance / Delivery Delay",
      "Incorrect Specification / Size Discrepancy"
    ],
    account_reset: [
      "Forgot Password / Reset Security Code",
      "Update Registered Corporate Email / Phone",
      "Commercial Registration (CR) Verification",
      "Account Lockout Assistance"
    ],
    orders: [
      "Flatbed Truck Delayed On-Site",
      "Partial Material Delivered",
      "Driver Unreachable / GPS Offline",
      "Missing MTR Mill Heat Certificate"
    ],
    returns: [
      "Material Damaged in Transit",
      "Non-Compliant Dimensional Spec",
      "Coating Profile / Paint Defect",
      "Wrong Quantity / Spec Delivered"
    ],
    billing: [
      "Request Official 15% VAT Tax Invoice PDF",
      "Company CR / VAT Number Edit Request",
      "Payment Receipt & Wire Confirmation",
      "Commercial Price Discrepancy"
    ],
    logistics: [
      "Crane Unloading Required at Job Site",
      "Restricted Zone Access Permit (Aramco / SABIC)",
      "Oversized Load Special Transport Permit",
      "Scheduled Off-Hours Site Delivery"
    ],
    quality: [
      "SWL Proof Load Testing Certificate",
      "NDT Weld Inspection Report (MPI / UT)",
      "SASO Safety Compliance Audit Sheet",
      "ISO 9001:2015 Quality System Dossier"
    ],
    credit: [
      "30-Day Standard Commercial Credit Term",
      "60-Day Extended Turnkey Project Credit",
      "90-Day Mega-Contractor Credit Line",
      "Annual Blanket Procurement Account"
    ],
    rfq: [
      "Forklift Attachments & Material Handling",
      "Waste Containers & Industrial Skips",
      "Lifting & Hoisting Equipment",
      "Safety & Hazard Protection Equipment",
      "Hardware & Structural Supplies",
      "Warehouse & Logistics Equipment",
      "Safety & Chemical Storage Cabinets",
      "Pallet Rack & Column Protection"
    ]
  };

  const actionOptions: Record<string, string[]> = {
    report_issue: [
      "Immediate Technical Inspection Call Back",
      "Dispatch Priority Replacement Order",
      "File Formal Seller Dispute Ticket"
    ],
    account_reset: [
      "Send Instant Password Reset Email",
      "Call Security Desk for Identity Verification",
      "Re-activate Corporate Admin Account"
    ],
    orders: [
      "Immediate Dispatch Call Back (Under 15 Mins)",
      "Email Driver Live GPS Tracking Link",
      "Re-issue MTR Mill Certificates PDF"
    ],
    returns: [
      "Dispatch Immediate Replacement Flatbed",
      "Issue Commercial Credit Refund Note",
      "Schedule Site Engineering Inspection"
    ],
    billing: [
      "Email Revised Tax Invoice PDF Immediately",
      "Call Finance Desk for Account Reconciliation",
      "Download Official ZATCA Receipt"
    ],
    logistics: [
      "Assign Crane-Rigged Flatbed Trailer",
      "Submit Zone Clearance & Driver IQAMA",
      "Contact Logistics Manager Pre-Arrival"
    ],
    quality: [
      "Send Stamped PDF Quality Package via Email",
      "Include Stamped Hardcopy in Next Delivery",
      "Speak with Quality Assurance Engineer"
    ],
    credit: [
      "Send Commercial Credit Application Form",
      "Direct Call from B2B Finance Director",
      "Schedule Executive Setup Meeting"
    ],
    rfq: [
      "Send Formal Line-Item Quotation PDF",
      "Call Commercial Estimating Desk",
      "Schedule Workshop Engineering Review"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = `SF-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setStep("submitted");
    toast.success(`Support Ticket ${generatedTicket} created! Our Dammam team is reviewing your request.`);
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    toast.success("Ticket ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewSurvey = () => {
    setStep("survey");
    setSubCategory("");
    setReferenceNumber("");
    setFullName("");
    setEmail("");
    setPhone("");
    setPreferredAction("");
    setNotes("");
  };

  const activeGuidance = categoryGuidanceMap[selectedTopic] || categoryGuidanceMap.orders;

  return (
    <div className={styles.pageWrapper}>
      {/* Distinct & Simple Transparent Navigation Bar for Contact Page */}
      <header className={styles.transparentHeader}>
        <div className={styles.headerContainer}>
          {/* Brand Logo & Help Badge */}
          <div className={styles.logoBadgeGroup}>
            <Link href="/" className={styles.brandLogoLink}>
              <Image 
                src="/images/logo.png" 
                alt="Saudi Fab Store" 
                width={130} 
                height={36} 
                className={styles.logoImg}
                priority
              />
            </Link>
            <span className={styles.headerDivider}>/</span>
            <span className={styles.helpBadgeLabel}>Help &amp; Support Portal</span>
          </div>

          {/* Contact Specific Nav Links */}
          <nav className={styles.contactNavLinks}>
            <button type="button" onClick={handleNewSurvey} className={styles.navLinkBtn}>
              <HugeiconsIcon icon={DeliveryTruck01Icon} size={16} strokeWidth={2.2} />
              <span>Track Orders</span>
            </button>
            <a href="https://wa.me/966538121100" target="_blank" rel="noopener noreferrer" className={styles.navLinkItem}>
              <HugeiconsIcon icon={Message01Icon} size={16} strokeWidth={2.2} />
              <span>WhatsApp Support</span>
            </a>
            <a href="tel:+966138121100" className={styles.navLinkItem}>
              <HugeiconsIcon icon={PhoneCallIcon} size={16} strokeWidth={2.2} />
              <span>+966 13 812 1100</span>
            </a>
          </nav>

          {/* Right Action: Back to Store */}
          <div className={styles.headerRightActions}>
            <Link href="/products" className={styles.backToStoreBtn}>
              <span>Back to Store</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO HEADER SECTION WITH MESHGRADIENT SHADER */}
      <section className={styles.heroSection}>
        <div className={styles.shaderFrame}>
          <ShaderGradient />
          <div className={styles.shaderBottomFade} />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.brandYellowBadge}>
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} strokeWidth={2.2} />
              Support Center &amp; Self-Service Hub
            </span>
          </div>

          <h1 className={styles.heroMainTitle}>Customer Service &amp; Support Center</h1>
          <p className={styles.heroSubTitle}>
            How can we help you today? Complete our unified diagnostic survey below to track dispatches, request 15% VAT invoices, report site returns, or access SASO quality certificates.
          </p>

          {/* 3 Top Support Channel Quick Cards */}
          <div className={styles.topCardsGrid}>
            
            {/* Card 1 */}
            <a href="mailto:care@saudifab.com?subject=Customer%20Support%20%26%20Inquiry" className={styles.quickChannelCard}>
              <div className={styles.cardIconCircle}>
                <HugeiconsIcon icon={Mail01Icon} size={22} strokeWidth={2.2} />
              </div>
              <div className={styles.cardTextGroup}>
                <h3 className={styles.cardTitle}>Email Customer Support</h3>
                <p className={styles.cardDesc}>Send a direct email inquiry to our commercial &amp; customer support desk in Dammam.</p>
              </div>
              <span className={styles.cardArrowLink}>
                Send email <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.2} />
              </span>
            </a>

            {/* Card 2 */}
            <a href="https://wa.me/966538121100" target="_blank" rel="noopener noreferrer" className={styles.quickChannelCard}>
              <div className={styles.cardIconCircle}>
                <HugeiconsIcon icon={Message01Icon} size={22} strokeWidth={2.2} />
              </div>
              <div className={styles.cardTextGroup}>
                <h3 className={styles.cardTitle}>WhatsApp Technician Chat</h3>
                <p className={styles.cardDesc}>Direct instant chat with senior workshop engineers for immediate site requirements.</p>
              </div>
              <span className={styles.cardArrowLink}>
                Start chat <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.2} />
              </span>
            </a>

            {/* Card 3 */}
            <a href="tel:+966138121100" className={styles.quickChannelCard}>
              <div className={styles.cardIconCircle}>
                <HugeiconsIcon icon={PhoneCallIcon} size={22} strokeWidth={2.2} />
              </div>
              <div className={styles.cardTextGroup}>
                <h3 className={styles.cardTitle}>Direct Hotline Call</h3>
                <p className={styles.cardDesc}>Speak directly with our Dammam commercial estimating desk for urgent POs.</p>
              </div>
              <span className={styles.cardArrowLink}>
                Call hotline <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.2} />
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* 2. UNIFIED ALL-IN-ONE SUPPORT DIAGNOSTIC & RESOLUTION SURVEY SECTION */}
      <section id="support-survey" className={styles.unifiedSurveySection}>
        <div className={styles.surveyContainer}>
          <div className={styles.twoColumnSupportGrid}>
            
            {/* LEFT COLUMN: Unified Diagnostic Survey & Resolution Form */}
            <div className={styles.surveyFormColumn}>
              
              {step === "survey" ? (
                <>
                  <div className={styles.surveyHeaderBlock}>
                    <h2 className={styles.surveyMainTitle}>Report &amp; Track Support Issues</h2>
                    <p className={styles.surveySubDesc}>
                      Select your topic below, choose your diagnostic category, and receive an instant support ticket ID for guaranteed under 2-hour response across Saudi Arabia.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.unifiedFormGrid}>
                    
                    {/* STEP 1: TOPIC SELECTION CARDS */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>1. Select Support Topic *</label>
                      <div className={styles.topicCardsGrid}>
                        {topics.map((t) => {
                          const isSelected = selectedTopic === t.id;
                          return (
                            <div
                              key={t.id}
                              onClick={() => {
                                setSelectedTopic(t.id);
                                setSubCategory("");
                                setPreferredAction("");
                              }}
                              className={`${styles.topicCard} ${isSelected ? styles.topicCardActive : ''}`}
                            >
                              <div className={styles.topicIconBox}>
                                <HugeiconsIcon icon={t.icon} size={18} strokeWidth={2.2} />
                              </div>
                              <span className={styles.topicLabel}>{t.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP 2: SPECIFIC SUB-CATEGORY DIAGNOSTICS */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>2. Select Specific Problem Category *</label>
                      <div className={styles.subCategoryGrid}>
                        {subCategoryOptions[selectedTopic]?.map((option, idx) => {
                          const isSelected = subCategory === option;
                          return (
                            <div
                              key={idx}
                              onClick={() => setSubCategory(option)}
                              className={`${styles.subCategoryTile} ${isSelected ? styles.subCategoryTileActive : ''}`}
                            >
                              <span className={styles.tileRadioDot}>
                                {isSelected && <span className={styles.tileRadioInnerDot} />}
                              </span>
                              <span className={styles.tileText}>{option}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP 3: IDENTIFICATION & CONTACT DETAILS */}
                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>PO Number / Order # / CR # (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. PO-98412 / CR 1010XXXXXX / SF-8821"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          className={styles.inputField}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={styles.inputField}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Corporate Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={styles.inputField}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+966 5X XXX XXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={styles.inputField}
                        />
                      </div>
                    </div>

                    {/* STEP 4: PREFERRED RESOLUTION ACTION */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>4. Preferred Resolution Action *</label>
                      <div className={styles.actionPillsRow}>
                        {actionOptions[selectedTopic]?.map((act, idx) => {
                          const isSelected = preferredAction === act;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setPreferredAction(act)}
                              className={`${styles.actionBtnPill} ${isSelected ? styles.actionBtnPillActive : ''}`}
                            >
                              <span>{act}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP 5: NOTES & REMARKS */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Additional Notes &amp; Site Details</label>
                      <textarea
                        placeholder="Provide any specific driver notes, site access permits, or drawing details to help our team resolve this immediately..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={styles.textareaField}
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={!subCategory || !fullName || !phone}
                      className={styles.primarySubmitBtn}
                    >
                      Submit Support Survey &amp; Generate Ticket ID
                    </button>

                    <p className={styles.disclaimerNote}>
                      *All submitted tickets are tracked directly by our Dammam commercial desk under strict SLA. Response time guaranteed under 2 business hours.
                    </p>

                  </form>
                </>
              ) : (
                <div className={styles.submittedContainer}>
                  <div className={styles.successIconCircle}>
                    <HugeiconsIcon icon={CheckmarkBadge01Icon} size={48} strokeWidth={2.2} />
                  </div>

                  <h2 className={styles.successTitle}>Support Ticket Dispatched!</h2>
                  <p className={styles.successSub}>
                    Your issue survey has been received by Saudi Fab Store Commercial &amp; Logistics Desk in Dammam.
                  </p>

                  {/* Ticket Reference Box */}
                  <div className={styles.ticketCardBox}>
                    <span className={styles.ticketBoxLabel}>Official Support Ticket ID:</span>
                    <div className={styles.ticketValueRow}>
                      <span className={styles.ticketCode}>{ticketId}</span>
                      <button type="button" onClick={handleCopyTicket} className={styles.copyBtn}>
                        <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} strokeWidth={2.2} />
                        <span>{copied ? "Copied!" : "Copy ID"}</span>
                      </button>
                    </div>
                    <span className={styles.slaBadge}>Guaranteed SLA Response: Under 2 Hours</span>
                  </div>

                  <div className={styles.directContactPrompt}>
                    <span>Need emergency site assistance right now?</span>
                    <div className={styles.directButtonsRow}>
                      <a 
                        href={`https://wa.me/966538121100?text=Hello%2C%20I%20have%20submitted%20ticket%20${ticketId}%20and%20need%20urgent%20site%20assistance.`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.whatsappDirectBtn}
                      >
                        <HugeiconsIcon icon={Message01Icon} size={16} strokeWidth={2.2} />
                        <span>WhatsApp Technician</span>
                      </a>
                      <a href="tel:+966138121100" className={styles.phoneDirectBtn}>
                        <HugeiconsIcon icon={PhoneCallIcon} size={16} strokeWidth={2.2} />
                        <span>Call Hotline Desk</span>
                      </a>
                    </div>
                  </div>

                  <button type="button" onClick={handleNewSurvey} className={styles.newSurveyBtn}>
                    Submit Another Support Inquiry
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Unboxed Clean Guidance & SLA Section */}
            <aside className={styles.supportSideColumn}>
              
              {/* Under 2 Hours SLA Guarantee Card */}
              <div className={styles.slaCardBox}>
                <div className={styles.slaIconCircle}>
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} size={22} strokeWidth={2.2} />
                </div>
                <div className={styles.slaTextContent}>
                  <span className={styles.slaTagBadge}>GUARANTEED RESPONSE SLA</span>
                  <h3 className={styles.slaCardTitle}>Under 2 Hours SLA</h3>
                  <p className={styles.slaCardDesc}>
                    Average technical evaluation &amp; dispatch response time across KSA &amp; GCC industrial zones.
                  </p>
                </div>
              </div>

              {/* Unboxed Dynamic Category Guidance & FAQ Solutions */}
              {activeGuidance && (
                <div className={styles.unboxedGuidanceBlock}>
                  <h4 className={styles.sideCardHeader}>{activeGuidance.title}</h4>

                  <div className={styles.guidanceItemsList}>
                    {activeGuidance.items.map((item, idx) => (
                      <div key={idx} className={styles.guidanceItemBox}>
                        <h5 className={styles.guidanceQuestion}>{item.question}</h5>
                        <p className={styles.guidanceAnswer}>{item.answer}</p>
                      </div>
                    ))}
                  </div>

                  {selectedTopic === "orders" && (
                    <div className={styles.profileOrderTrackBox}>
                      <p className={styles.profileOrderTrackText}>
                        Have an existing order? View live dispatches and MTR certs in your profile.
                      </p>
                      <Link href="/profile" className={styles.profileOrderTrackBtn}>
                        <HugeiconsIcon icon={DeliveryBox01Icon} size={15} strokeWidth={2.2} />
                        <span>Track Orders in Profile</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2.2} />
                      </Link>
                    </div>
                  )}
                </div>
              )}

            </aside>

          </div>
        </div>
      </section>
      {/* Distinct Contact Page Footer Component (Includes Direct Offices & Legal Bar) */}
      <Footer isContactPage={true} />
    </div>
  );
}
