"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both administrative email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid administrative credentials. Access denied.");
      } else if (result?.ok) {
        // Check if user is admin by making a request to verify role
        const response = await fetch("/api/admin/verify-role");
        const data = await response.json();

        if (data.isAdmin) {
          router.push("/admin");
        } else {
          setError("Access denied. Executive admin privileges are required for this area.");
          await signOut({ redirect: false });
        }
      }
    } catch {
      setError("Authentication failed. Please check network connectivity and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Reused Main Site Navigation Bar */}
      <Navbar isLight={false} hasBorder={false} />

      {/* Main Admin Login Section */}
      <section className={styles.adminSection}>
        {/* Background Image with Gradient Overlay */}
        <div className={styles.heroBackground}>
          <Image
            src="/images/login_bg.jpeg"
            alt="Brooq Al Khalij Executive Admin Background"
            fill
            className={styles.bgImage}
            sizes="100vw"
            priority
            unoptimized
          />
          <div className={styles.bgOverlay} />
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.gridWrapper}>
            {/* Glassmorphic Executive Admin Form Card */}
            <div className={styles.formGlassCard}>
              <div className={styles.cardHeader}>
                <h1 className={styles.title}>Admin Sign In</h1>
                <p className={styles.description}>
                  Authenticate with your administrator account to access order management, client databases, and executive control systems.
                </p>
              </div>

              {/* Error Alert Banner */}
              {error && (
                <div className={styles.errorBanner} role="alert">
                  <AlertCircle size={16} className={styles.errorIcon} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Email Field Group */}
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <span className={styles.labelText}>Admin Email Address</span>
                    <span className={styles.dashedConnector} />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} />
                    <input
                      type="email"
                      required
                      placeholder="admin@brooqalkhalij.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field Group */}
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <span className={styles.labelText}>Security Password</span>
                    <span className={styles.dashedConnector} />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.togglePasswordBtn}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Form Options */}
                <div className={styles.formOptions}>
                  <label className={styles.rememberMe}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkbox}
                      disabled={isLoading}
                    />
                    <span className={styles.rememberText}>Keep session active</span>
                  </label>

                  <Link href="/contact" className={styles.forgotLink}>
                    Reset Admin Credentials?
                  </Link>
                </div>

                {/* Submit Action Button */}
                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} style={{ marginRight: "8px" }} />
                      Authenticating Credentials...
                    </>
                  ) : (
                    <>
                      <span>Authorize &amp; Launch Dashboard</span>
                      <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>Administrative Access</span>
                  <div className={styles.dividerLine} />
                </div>

                {/* Demo Credentials Callout */}
                <div className={styles.demoCredentialsBox}>
                  <div className={styles.demoHeader}>
                    <KeyRound size={14} className={styles.keyIcon} />
                    <span>Executive Demo Access</span>
                  </div>
                  <div className={styles.demoRow}>
                    <span className={styles.demoLabel}>Admin Email:</span>
                    <code className={styles.demoCode}>admin@brooqalkhalij.com</code>
                  </div>
                  <div className={styles.demoRow}>
                    <span className={styles.demoLabel}>Password:</span>
                    <code className={styles.demoCode}>admin123</code>
                  </div>
                </div>

                {/* Footer Return Link */}
                <div className={styles.footerActions}>
                  <Link href="/" className={styles.storefrontLink}>
                    <ArrowLeft size={14} />
                    <span>Return to Storefront</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Hero-Style Brand Title on Bottom */}
        <div className={styles.heroBrandBottom}>
          <h2 className={styles.heroBrandText}>Operational Control</h2>
        </div>
      </section>
    </div>
  );
}