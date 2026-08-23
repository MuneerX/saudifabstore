"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff, User, Building, ArrowRight, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import styles from "./page.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agreedTerms) {
      setError("You must agree to the Terms & Conditions to register.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Something went wrong during registration.");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Dark overlay navbar matching contact page style */}
      <Navbar isLight={false} hasBorder={false} />

      {/* Main Glass Sign Up Section */}
      <section className={styles.contactSection}>
        {/* Background Stock Image with Gradient Overlay */}
        <div className={styles.heroBackground}>
          <Image
            src="/images/bg_4.jpeg"
            alt="Saudi Fab Store Register Background"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
            unoptimized
          />
          <div className={styles.bgOverlay} />
        </div>

        <div className={styles.contactSectionContainer}>
          <div className={styles.contactGrid}>
            {/* Left Column: Glassmorphic Register Form */}
            <div className={styles.formGlassCard}>
              <div className={styles.cardHeader}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.description}>
                  Register for secure access to the Saudi Fab Client portal to request B2B quotes and track structural fabrications.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className={styles.errorBanner} role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

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
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Company (Optional)</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type="text"
                      placeholder="Saudi Fab Partner Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                {/* Email Field Group */}
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <span className={styles.labelText}>Work Email Address</span>
                    <span className={styles.dashedConnector} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                {/* Form Row 2 */}
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Password</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.inputField}
                        style={{ paddingRight: "45px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.togglePasswordBtn}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <span className={styles.labelText}>Confirm Password</span>
                      <span className={styles.dashedConnector} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className={styles.termsRow}>
                  <input
                    type="checkbox"
                    id="signupTerms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="signupTerms" className={styles.termsText}>
                    I agree to the Saudi Fab Store <Link href="/contact" className={styles.termsLink}>Terms of Service</Link> and Portal Privacy Policy.
                  </label>
                </div>

                {/* Submit Action Button */}
                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: "8px" }} />
                      Registering Account...
                    </>
                  ) : (
                    <>
                      Create Portal Account
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>Already Registered?</span>
                  <div className={styles.dividerLine} />
                </div>

                {/* Bottom Actions */}
                <div className={styles.footerActions}>
                  <p className={styles.signupText}>
                    Already have an account?
                    <Link href="/login" className={styles.signupLink}>
                      Sign in to Client Portal
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Hero-Style Brand Title on Bottom */}
        <div className={styles.heroBrandBottom}>
          <h2 className={styles.heroBrandText}>Client Partnership</h2>
        </div>
      </section>
    </div>
  );
}
