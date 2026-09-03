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

        {/* Sign In Form Card */}
        <div className={styles.formCard}>
          <h1 className={styles.title}>Sign in</h1>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* Email Field Group */}
            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Email or mobile phone number</label>
              <input
                type="text"
                required
                placeholder="name@company.com or 05XXXXXXXX"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
              />
            </div>

            {/* Password Field Group */}
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.labelText}>Password</label>
                <Link href="/contact?topic=account_reset" className={styles.forgotLink}>
                  Forgot password?
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

            {/* Remember Me Checkbox */}
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.rememberText}>Keep me signed in</span>
            </label>
          </form>
        </div>

        {/* Create Account Divider & Button Directly Below Card */}
        <div className={styles.createAccountWrapper}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>New to Saudi Fab Store?</span>
          </div>
          <Link href="/signup" className={styles.createAccountBtn}>
            Create your Saudi Fab account
          </Link>
          <div className={styles.adminPortalLinkRow}>
            <Link href="/admin/login" className={styles.adminPortalLink}>
              Looking for Admin Portal Login? →
            </Link>
          </div>
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
