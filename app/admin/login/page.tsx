"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  AlertCircle
} from "lucide-react";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        // Check if user is admin by making a request to verify role
        const response = await fetch("/api/admin/verify-role");
        const data = await response.json();

        if (data.isAdmin) {
          router.push("/admin");
        } else {
          setError("Access denied. Admin privileges required.");
          // Sign out the user since they don't have admin privileges
          await signOut({ redirect: false });
        }
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* Logo and Branding */}
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <span className={styles.logoText}>S</span>
            </div>
            <div className={styles.brand}>
              <span className={styles.brandName}>ShopCo Ltd</span>
              <span className={styles.brandSubtitle}>Admin Dashboard</span>
            </div>
          </div>
          <div className={styles.welcomeText}>
            <h1 className={styles.welcomeTitle}>Welcome Back</h1>
            <p className={styles.welcomeSubtitle}>
              Sign in to access your admin dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <Shield className={styles.adminIcon} />
              <h2 className={styles.formTitle}>Admin Login</h2>
              <p className={styles.formSubtitle}>
                Enter your credentials to access the dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {error && (
                <div className={styles.errorMessage}>
                  <AlertCircle className={styles.errorIcon} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    placeholder="admin@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className={styles.toggleIcon} />
                    ) : (
                      <Eye className={styles.toggleIcon} />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    disabled={isLoading}
                  />
                  <span className={styles.checkboxText}>Remember me</span>
                </label>
                <Link href="/admin/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className={styles.buttonIcon} />
                  </>
                )}
              </button>
            </form>

            <div className={styles.demoCredentials}>
              <p className={styles.demoTitle}>Demo Credentials:</p>
              <div className={styles.demoInfo}>
                <span className={styles.demoLabel}>Email:</span>
                <span className={styles.demoValue}>admin@example.com</span>
              </div>
              <div className={styles.demoInfo}>
                <span className={styles.demoLabel}>Password:</span>
                <span className={styles.demoValue}>admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}