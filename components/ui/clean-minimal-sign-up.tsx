"use client" 

import * as React from "react"
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import styles from "./clean-minimal-sign-up.module.css";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const SignUp2 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await apiClient.register({ name, email, password });
      router.push("/login");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.skeletonIcon}></div>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonDescription}></div>
        <div className={styles.formGroup}>
          <div className={styles.skeletonInput}></div>
          <div className={styles.skeletonInput}></div>
          <div className={styles.skeletonInput}></div>
          <div className={styles.skeletonInput}></div>
        </div>
        <div className={styles.skeletonButton}></div>
      </div>
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <User width={20} height={20} />
        </div>
        <h2 className={styles.title}>
          Create Account
        </h2>
        <p className={styles.description}>
          Sign up to get started
        </p>
        {error && (
          <div className={styles.error}>{error}</div>
        )}
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <User width={20} height={20} />
            </span>
            <input
              placeholder="Full Name"
              type="text"
              value={name}
              className={styles.input}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Mail width={20} height={20} />
            </span>
            <input
              placeholder="Email or Mobile Phone Number"
              type="text"
              value={email}
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.passwordWrapper}>
            <span className={styles.inputIcon}>
              <Lock width={20} height={20} />
            </span>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff width={20} height={20} /> : <Eye width={20} height={20} />}
            </span>
          </div>
          <div className={styles.passwordWrapper}>
            <span className={styles.inputIcon}>
              <Lock width={20} height={20} />
            </span>
            <input
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              className={styles.input}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className={styles.togglePassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff width={20} height={20} /> : <Eye width={20} height={20} />}
            </span>
          </div>
          <div className={styles.forgotPassword}>
          </div>
        </div>
        <button
          onClick={handleSignUp}
          className={styles.signInButton}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
 
export { SignUp2 };