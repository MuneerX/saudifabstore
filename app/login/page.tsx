"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, MessageSquare, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (res?.ok) {
        router.push("/profile");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Dark overlay navbar matching contact page style */}
      <Navbar isLight={false} hasBorder={false} />

      {/* Main Glass Login Section */}
      <section className={styles.contactSection}>
        {/* Background Stock Image with Gradient Overlay */}
        <div className={styles.heroBackground}>
          <Image
            src="/images/bg_4.jpeg"
            alt="Brooq Al Khalij Login Background"
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
            {/* Left Column: Glassmorphic Login Form */}
            <div className={styles.formGlassCard}>
              <div className={styles.cardHeader}>
                <h1 className={styles.title}>Client Sign In</h1>
                <p className={styles.description}>
                  Access your commercial quotes, track active fabrications, and manage your B2B industrial orders.
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
                {/* Email Field Group */}
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <span className={styles.labelText}>Email Address</span>
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

                {/* Password Field Group */}
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

                {/* Remember Me & Forgot Password */}
                <div className={styles.formOptions}>
                  <label className={styles.rememberMe}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.rememberText}>Remember me</span>
                  </label>

                  <Link href="/contact" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Action Button */}
                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: "8px" }} />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In &amp; Access Portal
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>Account Access</span>
                  <div className={styles.dividerLine} />
                </div>

                {/* Bottom Actions */}
                <div className={styles.footerActions}>
                  <p className={styles.signupText}>
                    Don't have a portal account?
                    <Link href="/signup" className={styles.signupLink}>
                      Create an account
                    </Link>
                  </p>

                  <Link href="/admin/login" className={styles.adminLink}>
                    Looking for Admin Portal Login? →
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Hero-Style Brand Title on Bottom */}
        <div className={styles.heroBrandBottom}>
          <h2 className={styles.heroBrandText}>Quality Excellence</h2>
        </div>
      </section>
    </div>
  );
}