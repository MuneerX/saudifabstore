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
  const [referralSource, setReferralSource] = useState("Direct");
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
        body: JSON.stringify({ name, email, referralSource, password }),
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
      <div className={styles.authContainer}>
        {/* Logo Right Above Card */}
        <div className={styles.logoRow}>
          <Link href="/" aria-label="Saudi Fab Store Home">
            <Image
              src="/images/logo4_2.png"
              alt="Saudi Fab Store Logo"
              width={145}
              height={36}
              className={styles.authLogo}
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Create Account Form Card */}
        <div className={styles.formCard}>
          <h1 className={styles.title}>Create account</h1>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Your name</label>
              <input
                type="text"
                required
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Mobile number or email</label>
              <input
                type="text"
                required
                placeholder="name@company.com or 05XXXXXXXX"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>How did you hear about us?</label>
              <select
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                className={styles.inputField}
                style={{ appearance: "auto", cursor: "pointer" }}
              >
                <option value="Direct">Direct / Search Engine</option>
                <option value="Social">Social Media (LinkedIn, X, Instagram)</option>
                <option value="Referral">Referral / Colleague / Partner</option>
                <option value="Organic">Industry Fair / Trade News</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Password</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  style={{ paddingRight: "38px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePasswordBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Re-enter password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
              />
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
                I agree to the Saudi Fab Store <Link href="/terms?tab=conditions" className={styles.termsLink}>Terms of Service</Link> and <Link href="/terms?tab=privacy" className={styles.termsLink}>Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit Action Button */}
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ marginRight: "6px" }} />
                  Creating account...
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>
        </div>

        {/* Already Have an Account Button Below Card */}
        <div className={styles.createAccountWrapper}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Already have an account?</span>
          </div>
          <Link href="/login" className={styles.createAccountBtn}>
            Sign in to your account
          </Link>
        </div>

        {/* Auth Footer Right Below Container */}
        <footer className={styles.authFooter}>
          <div className={styles.authFooterLinks}>
            <Link href="/terms?tab=conditions">Conditions of Use</Link>
            <Link href="/terms?tab=privacy">Privacy Notice</Link>
            <Link href="/contact">Help Center</Link>
          </div>
          <p className={styles.authFooterCopy}>
            &copy; 2026, Saudi Fab Store, Inc. or its affiliates
          </p>
        </footer>
      </div>
    </div>
  );
}
