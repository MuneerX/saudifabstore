"use client";

import React, { useState } from "react";
import styles from "./StayUpToDate.module.css"; // Import CSS module

export function StayUpToDate() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      alert("Successfully subscribed to newsletter!");
    }, 1000);
  };

  return (
    <section className={styles.stayUpToDateSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>
        <div className={styles.formContainer}>
          <form className={styles.newsletterForm} onSubmit={handleSubmit} role="form" aria-label="Newsletter subscription">
            <div className={styles.inputWrapper}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.messageIcon}
                aria-hidden="true"
              >
                <path
                  d="M2.25 5.25H21.75V18.75H2.25V5.25Z"
                  stroke="#000000"
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.25 5.25L12 13.5L21.75 5.25"
                  stroke="#000000"
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.emailInput}
                value={email}
                onChange={handleEmailChange}
                required
                aria-label="Email address"
                aria-invalid={!isValid}
                aria-describedby={!isValid ? "email-error" : undefined}
              />
            </div>
            <button
              type="submit"
              className={styles.subscribeButton}
              disabled={isSubmitting || !isValid}
              aria-label="Subscribe to Newsletter"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
            </button>
          </form>
          {!isValid && (
            <span id="email-error" className={styles.errorMessage} role="alert">
              Please enter a valid email address
            </span>
          )}
        </div>
      </div>
    </section>
  );
}