"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import styles from "./sheet.module.css"; // Import CSS module

// This file is now a placeholder as we are removing shadcn/ui components.
// You would typically replace this with a custom sheet/dialog implementation
// or a different UI library if needed.

// For now, exporting empty functions to avoid compilation errors in other files
export function Sheet({
  children,
  open,
  ...props
}: {
  children: React.ReactNode;
  open?: boolean;
  [key: string]: unknown;
}) {
  return (
    <div
      className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SheetTrigger({ children }: { children: React.ReactNode }) {
  return <button className={styles.sheetTrigger}>{children}</button>;
}

export function SheetClose({ children }: { children: React.ReactNode }) {
  return <button className={styles.sheetClose}>{children}</button>;
}

export function SheetPortal({ children }: { children: React.ReactNode }) {
  return <div className={styles.sheetPortal}>{children}</div>;
}

export function SheetOverlay({ children }: { children: React.ReactNode }) {
  return <div className={styles.sheetOverlay}>{children}</div>;
}

export function SheetContent({
  children,
  side = "right",
  className,
  ...props
}: {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <div
      className={`${styles.sheetContent} ${styles[`sheetContent-${side}`]} ${className || ""}`}
      {...props}
    >
      {children}
      <button className={styles.sheetCloseButton}>
        <XIcon className={styles.closeIcon} />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}

export function SheetHeader({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <div
      className={`${styles.sheetHeader} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SheetFooter({ children }: { children: React.ReactNode }) {
  return <div className={styles.sheetFooter}>{children}</div>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.sheetTitle}>{children}</h2>;
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <p className={styles.sheetDescription}>{children}</p>;
}