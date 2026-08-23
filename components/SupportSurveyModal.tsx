"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  CheckmarkBadge01Icon, 
  DeliveryTruck01Icon, 
  DeliveryReturn02Icon, 
  ReceiptIcon, 
  Award04Icon, 
  CreditCardIcon, 
  Message01Icon,
  PhoneCallIcon,
  Copy01Icon,
  Tick02Icon
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import styles from "./SupportSurveyModal.module.css";

export type SupportSurveyType = "orders" | "returns" | "billing" | "logistics" | "quality" | "credit";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  surveyType: SupportSurveyType | null;
}

export function SupportSurveyModal({ isOpen, onClose, surveyType }: Props) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"form" | "submitted">("form");
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  // Form states
  const [issueCategory, setIssueCategory] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [preferredAction, setPreferredAction] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("form");
      setCopied(false);
      setIssueCategory("");
      setReferenceNumber("");
      setContactPhone("");
      setPreferredAction("");
      setNotes("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, surveyType]);

  if (!isOpen || !surveyType || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = `SF-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(randomTicket);
    setStep("submitted");
    toast.success(`Diagnostic Ticket ${randomTicket} submitted! Our support team is acting on your request.`);
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    toast.success("Ticket ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const surveyConfigs: Record<SupportSurveyType, {
    title: string;
    tag: string;
    icon: typeof DeliveryTruck01Icon;
    subtitle: string;
    categories: string[];
    refLabel: string;
    refPlaceholder: string;
    actions: string[];
  }> = {
    orders: {
      title: "Order Tracking & Site Dispatch Diagnostics",
      tag: "TRACKING & DISPATCH ISSUE SURVEY",
      icon: DeliveryTruck01Icon,
      subtitle: "Diagnose flatbed delivery status, missing mill heat certificates, or driver delays across Saudi Arabia.",
      categories: [
        "Flatbed Truck Delayed On-Site",
        "Partial Material Delivered",
        "Driver Unreachable / GPS Offline",
        "Missing MTR Mill Certificate"
      ],
      refLabel: "Order / PO Number (Optional)",
      refPlaceholder: "e.g. PO-98412 / SF-8821",
      actions: [
        "Immediate Dispatch Call Back (Under 15 Mins)",
        "Email Updated Driver Live Tracking Link",
        "Re-issue MTR Mill Certificates PDF"
      ]
    },
    returns: {
      title: "30-Day Site Return & Replacement Survey",
      tag: "SITE RETURN & CLAIMS DIAGNOSTICS",
      icon: DeliveryReturn02Icon,
      subtitle: "Report non-compliant structural specs, damaged delivery items, or initiate free site pickup.",
      categories: [
        "Material Damaged in Transit",
        "Non-Compliant Dimensional Spec",
        "Coating Profile / Paint Defect",
        "Wrong Quantity / Spec Delivered"
      ],
      refLabel: "PO / Delivery Note Number (Optional)",
      refPlaceholder: "e.g. DN-4029 / SF-9102",
      actions: [
        "Dispatch Immediate Replacement Flatbed",
        "Issue Commercial Credit Refund Note",
        "Schedule Site Engineering Quality Inspection"
      ]
    },
    billing: {
      title: "15% KSA Commercial Tax Invoice & VAT Diagnostics",
      tag: "BILLING & TAX INVOICE WIZARD",
      icon: ReceiptIcon,
      subtitle: "Request instant 15% KSA VAT tax invoice PDF downloads, CR details correction, or billing clarification.",
      categories: [
        "Request Official 15% VAT Tax Invoice PDF",
        "Company CR / VAT Number Edit Request",
        "Payment Receipt & Wire Confirmation",
        "Commercial Price Discrepancy"
      ],
      refLabel: "Commercial Registration (CR) or Invoice # (Optional)",
      refPlaceholder: "e.g. CR 1010XXXXXX / INV-7712",
      actions: [
        "Email Revised Tax Invoice PDF Immediately",
        "Call Finance Desk for Account Reconciliation",
        "Download Official ZATCA Compliant Receipt"
      ]
    },
    logistics: {
      title: "Heavy Transport & Crane Site Logistics Survey",
      tag: "SITE LOGISTICS & CRANE PERMIT WIZARD",
      icon: DeliveryTruck01Icon,
      subtitle: "Configure crane site unloading, restricted industrial zone permits, or oversized transport dispatches.",
      categories: [
        "Crane Unloading Required at Job Site",
        "Restricted Zone Access Permit (Aramco / SABIC)",
        "Oversized Load Special Transport Permit",
        "Scheduled Off-Hours Site Delivery"
      ],
      refLabel: "Job Site Location / Zone Name (Optional)",
      refPlaceholder: "e.g. Dammam 2nd Industrial / Jubail Gate 3",
      actions: [
        "Assign Crane-Rigged Flatbed Trailer",
        "Submit Zone Clearance & Driver IQAMA Docs",
        "Contact Logistics Manager Pre-Arrival"
      ]
    },
    quality: {
      title: "SASO & ISO 9001:2015 Quality Certificate Request",
      tag: "QUALITY CERTIFICATION & TEST SHEET DIAGNOSTICS",
      icon: Award04Icon,
      subtitle: "Request official SWL proof load certificates, NDT weld reports, or SASO safety compliance test sheets.",
      categories: [
        "SWL Proof Load Testing Certificate",
        "NDT Weld Inspection Report (MPI / UT)",
        "SASO Safety Compliance Audit Sheet",
        "ISO 9001:2015 Quality System Dossier"
      ],
      refLabel: "Product Serial # or PO Heat Number (Optional)",
      refPlaceholder: "e.g. Heat #H-9402 / Serial #SKP-104",
      actions: [
        "Send Stamped PDF Quality Package via Email",
        "Include Physical Stamped Hardcopy in Next Delivery",
        "Speak with Quality Assurance Engineer"
      ]
    },
    credit: {
      title: "Saudi Arabia B2B Commercial Credit Line Application",
      tag: "B2B CREDIT TERMS & FINANCING WIZARD",
      icon: CreditCardIcon,
      subtitle: "Apply for 30 to 90-day commercial credit lines for registered corporate contractors across KSA.",
      categories: [
        "30-Day Standard Commercial Credit Term",
        "60-Day Extended Turnkey Project Credit",
        "90-Day Mega-Contractor Credit Line",
        "Annual Blanket Procurement Account"
      ],
      refLabel: "Estimated Monthly Volume / Product Scope (Optional)",
      refPlaceholder: "e.g. SAR 500,000 / month",
      actions: [
        "Send Official Commercial Credit Application Form",
        "Direct Call from B2B Finance Director",
        "Schedule Executive Account Setup Meeting"
      ]
    }
  };

  const config = surveyConfigs[surveyType];

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <header className={styles.modalHeader}>
          <div className={styles.headerTagRow}>
            <span className={styles.surveyTag}>{config.tag}</span>
          </div>
          <h2 className={styles.modalTitle}>{config.title}</h2>
          <p className={styles.modalSub}>{config.subtitle}</p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className={styles.surveyForm}>
            
            {/* Step 1: Category Diagnostics Selection */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>1. Select Diagnostic Category *</label>
              <div className={styles.categoryRadioGrid}>
                {config.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => setIssueCategory(cat)}
                    className={`${styles.radioTile} ${issueCategory === cat ? styles.radioTileActive : ''}`}
                  >
                    <span className={styles.radioDot}>
                      {issueCategory === cat && <span className={styles.radioInnerDot} />}
                    </span>
                    <span className={styles.radioTileLabel}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Identification & Contact Row */}
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{config.refLabel}</label>
                <input
                  type="text"
                  placeholder={config.refPlaceholder}
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Contact Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+966 5X XXX XXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={styles.inputField}
                />
              </div>
            </div>

            {/* Step 3: Preferred Next Steps */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>3. Select Preferred Resolution Action *</label>
              <div className={styles.actionSelectRow}>
                {config.actions.map((act, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setPreferredAction(act)}
                    className={`${styles.actionPill} ${preferredAction === act ? styles.actionPillActive : ''}`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Specific Remarks */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Additional Issue Remarks &amp; Notes</label>
              <textarea
                placeholder="Describe any specific site constraints, driver notes, or details to help our team resolve this instantly..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textareaField}
              />
            </div>

            {/* Submit CTA */}
            <button 
              type="submit" 
              disabled={!issueCategory || !contactPhone}
              className={styles.submitBtn}
            >
              Submit Diagnostic Ticket &amp; Request Instant Resolution
            </button>

          </form>
        ) : (
          <div className={styles.submittedContainer}>
            <div className={styles.successIconCircle}>
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={42} strokeWidth={2.2} />
            </div>

            <h3 className={styles.successTitle}>Diagnostic Ticket Submitted!</h3>
            <p className={styles.successSub}>
              Your support ticket has been dispatched to Saudi Fab Store Commercial &amp; Logistics Desk in Dammam.
            </p>

            {/* Ticket Box */}
            <div className={styles.ticketBox}>
              <span className={styles.ticketBoxLabel}>Official Support Ticket Reference:</span>
              <div className={styles.ticketValueRow}>
                <span className={styles.ticketCode}>{ticketId}</span>
                <button type="button" onClick={handleCopyTicket} className={styles.copyBtn}>
                  <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} strokeWidth={2.2} />
                  <span>{copied ? "Copied!" : "Copy ID"}</span>
                </button>
              </div>
              <span className={styles.slaBadge}>Expected Response Time: Under 2 Hours</span>
            </div>

            <div className={styles.directContactPrompt}>
              <span>Need urgent emergency site coordination?</span>
              <div className={styles.directButtonsRow}>
                <a href={`https://wa.me/966538121100?text=Hello%2C%20I%20have%20submitted%20ticket%20${ticketId}%20and%20need%20urgent%20assistance.`} target="_blank" rel="noopener noreferrer" className={styles.whatsappDirectBtn}>
                  <HugeiconsIcon icon={Message01Icon} size={16} strokeWidth={2.2} />
                  <span>WhatsApp Technician</span>
                </a>
                <a href="tel:+966138121100" className={styles.phoneDirectBtn}>
                  <HugeiconsIcon icon={PhoneCallIcon} size={16} strokeWidth={2.2} />
                  <span>Call Hotline</span>
                </a>
              </div>
            </div>

            <button type="button" onClick={onClose} className={styles.finishCloseBtn}>
              Return to Help Center
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
