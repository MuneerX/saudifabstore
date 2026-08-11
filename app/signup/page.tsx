"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff, Building, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function SignUpPage() {
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
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!agreedTerms) {
      setError("You must agree to the Terms of Service to create an account.");
      return;
    }

    setIsLoading(true);

    try {
      // Call register endpoint
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          company
        }),
      });

      const data = await registerRes.json();

      if (!registerRes.ok) {
        setError(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Automatically sign in upon successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/profile");
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
    <div className={styles.signupWrapper}>
      {/* Light Navbar matching page theme */}
      <Navbar hasBorder={true} isLight={true} />

      {/* Main Area with login_bg image fading into footer */}
      <main className={styles.mainArea}>
        <div className={styles.bgImageContainer}>
          <Image
            src="/images/login_bg.jpeg"
            alt="Brooq Al Khalij Industrial Background"
            fill
            priority
            unoptimized
            className={styles.bgImg}
          />
        </div>
        <div className={styles.bgFadeBottom} />

        <div className={styles.signupCard}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <span className={styles.portalBadge}>
              <span className={styles.badgeDot} /> New Client Registration
            </span>
            <h1 className={styles.title}>Create Your Account</h1>
            <p className={styles.subtitle}>
              Register to access B2B pricing, manage quotes, and track shipment status.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="signupName" className={styles.label}>
                  Full Name *
                </label>
                <div className={styles.inputFieldWrapper}>
                  <span className={styles.fieldIcon}>
                    <User size={18} />
                  </span>
                  <input
                    id="signupName"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signupCompany" className={styles.label}>
                  Company (Optional)
                </label>
                <div className={styles.inputFieldWrapper}>
                  <span className={styles.fieldIcon}>
                    <Building size={18} />
                  </span>
                  <input
                    id="signupCompany"
                    type="text"
                    placeholder="Brooq Partner Ltd"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signupEmail" className={styles.label}>
                Work Email Address *
              </label>
              <div className={styles.inputFieldWrapper}>
                <span className={styles.fieldIcon}>
                  <Mail size={18} />
                </span>
                <input
                  id="signupEmail"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="signupPassword" className={styles.label}>
                  Password *
                </label>
                <div className={styles.inputFieldWrapper}>
                  <span className={styles.fieldIcon}>
                    <Lock size={18} />
                  </span>
                  <input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
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

              <div className={styles.inputGroup}>
                <label htmlFor="signupConfirmPassword" className={styles.label}>
                  Confirm Password *
                </label>
                <div className={styles.inputFieldWrapper}>
                  <span className={styles.fieldIcon}>
                    <Lock size={18} />
                  </span>
                  <input
                    id="signupConfirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
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
                I agree to the <Link href="/contact" className={styles.termsLink}>Terms of Service</Link> and <Link href="/contact" className={styles.termsLink}>Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Client Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Already Registered?</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Login Link */}
          <div className={styles.footerActions}>
            <p className={styles.loginText}>
              Already have an account?
              <Link href="/login" className={styles.loginLink}>
                Sign in to Client Portal
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}