"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import styles from "./layout.module.css";

const Sidebar = dynamic(() => import("@/components/ui/modern-side-bar").then(m => m.Sidebar), {
  ssr: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Skip authentication for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip authentication check for login page
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Check authentication and admin role for other admin pages
    const checkAdminAccess = async () => {
      if (status === "loading") {
        return; // Wait for session to load
      }

      if (status === "unauthenticated") {
        router.push("/admin/login");
        setIsLoading(false);
        return;
      }

      if (status === "authenticated" && session?.user) {
        try {
          // Verify admin role
          const response = await fetch("/api/admin/verify-role");
          const data = await response.json();

          if (data.isAdmin) {
            setIsAdmin(true);
          } else {
            // User is authenticated but not admin
            router.push("/admin/login");
          }
        } catch (error) {
          console.error("Error verifying admin role:", error);
          router.push("/admin/login");
        }
      }

      setIsLoading(false);
    };

    checkAdminAccess();
  }, [router, pathname, isLoginPage, session, status]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  // Render login page without admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Don't render admin layout if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
}