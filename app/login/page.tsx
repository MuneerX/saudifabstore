"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
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
    <div className={styles.loginWrapper}>
      {/* Light Navbar matching page theme */}
      <Navbar hasBorder={true} isLight={true} />

      {/* Main Form Hero Section with login_bg image fading into footer */}
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

        <div className={styles.loginCard}>
          {/* Card Header */}
          <div className={styles.cardHeader}>
            <span className={styles.portalBadge}>
              <span className={styles.badgeDot} /> Client Portal
            </span>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              Sign in to manage your quotes, tracking, and custom industrial orders.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Area */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="loginEmail" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputFieldWrapper}>
                <span className={styles.fieldIcon}>
                  <Mail size={18} />
                </span>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="loginPassword" className={styles.label}>
                Password
              </label>
              <div className={styles.inputFieldWrapper}>
                <span className={styles.fieldIcon}>
                  <Lock size={18} />
                </span>
                <input
                  id="loginPassword"
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

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

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
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}