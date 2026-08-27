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

        {/* Admin Sign In Form Card */}
        <div className={styles.formCard}>
          <h1 className={styles.title}>Admin Sign in</h1>

          {/* Error Alert Banner */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* Email Field Group */}
            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Admin email address</label>
              <input
                type="email"
                required
                placeholder="admin@saudifabstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            {/* Password Field Group */}
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.labelText}>Password</label>
                <Link href="/contact" className={styles.forgotLink}>
                  Reset Credentials?
                </Link>
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  style={{ paddingRight: "38px" }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePasswordBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ marginRight: "6px" }} />
                  Signing in...
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>

            {/* Demo Credentials Callout */}
            <div className={styles.demoCredentialsBox}>
              <div className={styles.demoHeader}>
                <KeyRound size={13} />
                <span>Executive Demo Access</span>
              </div>
              <div className={styles.demoRow}>
                <span className={styles.demoLabel}>Admin Email:</span>
                <code className={styles.demoCode}>admin@saudifabstore.com</code>
              </div>
              <div className={styles.demoRow}>
                <span className={styles.demoLabel}>Password:</span>
                <code className={styles.demoCode}>admin123</code>
              </div>
            </div>

            {/* Footer Return Link */}
            <div className={styles.footerActions}>
              <Link href="/" className={styles.storefrontLink}>
                <ArrowLeft size={13} />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Client Sign In Link Below Card */}
        <div className={styles.createAccountWrapper}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Not an Admin?</span>
          </div>
          <Link href="/login" className={styles.createAccountBtn}>
            Client Sign in
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
