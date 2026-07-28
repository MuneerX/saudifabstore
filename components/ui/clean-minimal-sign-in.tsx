"use client" 

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail, Eye, EyeOff } from "lucide-react";
import styles from "./clean-minimal-sign-in.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignIn2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url); // Use the URL provided by NextAuth.js
      } else {
        // Fallback or handle unexpected scenario if no error and no URL
        router.push("/profile"); // Default to profile if NextAuth.js doesn't provide a URL
      }
    } catch {
      setError("An unexpected error occurred");
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
          <LogIn width={20} height={20} />
        </div>
        <h2 className={styles.title}>
          Welcome Back
        </h2>
        <p className={styles.description}>
          Sign in to access your account
        </p>
        {error && (
          <div className={styles.error}>{error}</div>
        )}
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <Mail width={20} height={20} />
            </span>
            <input
              placeholder="Email"
              type="email"
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
          <div className={styles.forgotPassword}>
            <button className={styles.forgotPasswordButton}>
              Forgot password?
            </button>
          </div>
        </div>
        <button
          onClick={handleSignIn}
          className={styles.signInButton}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
 
export { SignIn2 };