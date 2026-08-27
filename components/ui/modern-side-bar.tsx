"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Added Link import
import { useSession, signOut } from 'next-auth/react';
import apiClient from "@/lib/apiClient";
import {
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  Package,
  ShoppingCart,
  Users
} from 'lucide-react';
import styles from './modern-side-bar.module.css';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

// Original navigation items from admin/layout.tsx
const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3, href: "/admin" },
  { id: "products", name: "Products", icon: Package, href: "/admin/products" },
  { id: "orders", name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { id: "customers", name: "Customers", icon: Users, href: "/admin/customers" },
];

export function Sidebar({ className = "", children }: SidebarProps) {
  const { data: session } = useSession();

  // User profile data state
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });

  // Initialize state from localStorage with fallbacks
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-open');
      // Default to true for desktop, but respect saved state
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true; // SSR fallback
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [activeItem, setActiveItem] = useState("dashboard"); // Default active item
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-open', JSON.stringify(isOpen));
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user) {
        try {
          const profileResponse = await apiClient.getProfile();
          const user = profileResponse.user;
          setUserData({
            name: user.name || "",
            email: user.email || ""
          });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Fallback to session data
          setUserData({
            name: session.user.name || "",
            email: session.user.email || ""
          });
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  // Ensure sidebar is properly initialized on mount
  useEffect(() => {
    const initializeSidebar = () => {
      if (window.innerWidth >= 768) {
        // On desktop, ensure sidebar is open by default
        const savedOpenState = localStorage.getItem('sidebar-open');
        if (savedOpenState === null) {
          setIsOpen(true);
          localStorage.setItem('sidebar-open', 'true');
        } else {
          setIsOpen(JSON.parse(savedOpenState));
        }
      } else {
        setIsOpen(false);
      }
    };

    initializeSidebar();
  }, []);

  useEffect(() => {
    // Set active item based on current path
    const currentPath = window.location.pathname;
    const activeNav = navigationItems.find(item => item.href === currentPath);
    if (activeNav) {
      setActiveItem(activeNav.id);
    } else if (currentPath.startsWith('/admin/products')) {
      setActiveItem('products');
    } else if (currentPath.startsWith('/admin/orders')) {
      setActiveItem('orders');
    } else if (currentPath.startsWith('/admin/customers')) {
      setActiveItem('customers');
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // On desktop, respect the saved state, but default to open if no saved state
        const savedOpenState = localStorage.getItem('sidebar-open');
        if (savedOpenState === null) {
          setIsOpen(true); // Default to open on first load
        } else {
          // Ensure we set the state based on saved value
          setIsOpen(JSON.parse(savedOpenState));
        }
      } else {
        setIsOpen(false); // Always closed on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileNavOpen(!isMobileNavOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = async (itemId: string) => {
    if (itemId === "logout") {
      // Handle logout
      await signOut({ callbackUrl: "/admin/login" });
      return;
    }

    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsMobileNavOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const sidebarClasses = [
    styles.sidebar,
    isOpen ? styles.open : styles.closed,
    isCollapsed ? styles.collapsed : styles.expanded,
    className
  ].join(' ');

  // Debug logging
  console.log('Sidebar Debug:', {
    isOpen,
    isCollapsed,
    sidebarClasses,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR'
  });

  const mainContentClasses = [
    styles.mainContent,
    isCollapsed ? styles.collapsed : styles.expanded
  ].join(' ');

  const containerClasses = [
    styles.container,
    isCollapsed ? styles.collapsed : styles.expanded
  ].join(' ');

  return (
    <>
      {/* Mobile toggle button - always visible on mobile */}
      <button
        onClick={toggleSidebar}
        className={styles.mobileToggle}
        aria-label="Toggle navigation"
      >
        {isMobileNavOpen ?
          <X className={styles.mobileToggleIcon} /> :
          <Menu className={styles.mobileToggleIcon} />
        }
      </button>

      <div className={containerClasses}>
        <div className={sidebarClasses}>
        <div className={styles.header}>
          {!isCollapsed && (
            <div className={styles.logoWrapper}>
              <div className={styles.logo}>
                <span className={styles.logoText}>B</span>
              </div>
              <div className={styles.brand}>
                <span className={styles.brandName}>Saudi Fab Store</span>
                <span className={styles.brandSubtitle}>Executive Admin Portal</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className={styles.logo}>
              <span className={styles.logoText}>B</span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className={styles.collapseButton}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className={styles.collapseIcon} />
            ) : (
              <ChevronLeft className={styles.collapseIcon} />
            )}
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const navButtonClasses = [
                styles.navButton,
                isActive ? styles.active : ''
              ].join(' ');

              return (
                <li key={item.id} className={styles.navItem}>
                  <Link href={item.href} passHref>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={navButtonClasses}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <div className={styles.navButtonIconWrapper}>
                        <Icon className={styles.navButtonIcon} />
                      </div>

                      {!isCollapsed && (
                        <div className={styles.navButtonContent}>
                          <span className={styles.navButtonText}>{item.name}</span>
                          {item.badge && (
                            <span className={styles.badge}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {isCollapsed && item.badge && (
                        <div className={styles.collapsedBadge}>
                          <span className={styles.collapsedBadgeText}>
                            {parseInt(item.badge) > 9 ? '9+' : item.badge}
                          </span>
                        </div>
                      )}

                      {isCollapsed && (
                        <div className={styles.tooltip}>
                          {item.name}
                          {item.badge && (
                            <span className={styles.badge}>
                              {item.badge}
                            </span>
                          )}
                          <div className={styles.tooltipArrow} />
                        </div>
                      )}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
           <div className={styles.profileSection}>
             {!isCollapsed ? (
               <div className={styles.profileWrapper}>
                 <div className={styles.avatar}>
                   <span className={styles.avatarText}>
                     {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                   </span>
                 </div>
                 <div className={styles.profileInfo}>
                   <p className={styles.profileName}>{userData.name || 'User'}</p>
                   <p className={styles.profileRole}>
                     {session?.user?.role === 'admin' ? 'Administrator' : 'User'}
                   </p>
                 </div>
                 <div className={styles.statusIndicator} title="Online" />
               </div>
             ) : (
               <div className={styles.collapsedProfile}>
                 <div className={styles.collapsedAvatarWrapper}>
                   <div className={styles.collapsedAvatar}>
                     <span className={styles.collapsedAvatarText}>
                       {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                     </span>
                   </div>
                   <div className={styles.collapsedStatusIndicator} />
                 </div>
               </div>
             )}
           </div>

          <div className={styles.logoutSection}>
            <button
              onClick={() => handleItemClick("logout")}
              className={`${styles.logoutButton} ${isCollapsed ? styles.collapsed : styles.expanded}`}
              title={isCollapsed ? "Logout" : undefined}
            >
              <div className={styles.logoutIconWrapper}>
                <LogOut className={styles.logoutIcon} />
              </div>

              {!isCollapsed && (
                <span className={styles.logoutText}>Logout</span>
              )}

              {isCollapsed && (
                <div className={styles.tooltip}>
                  Logout
                  <div className={styles.tooltipArrow} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={mainContentClasses}>
        {children}
      </div>
      </div>

      {/* Mobile Navigation Overlay - Moved outside container */}
      {isMobileNavOpen && (
        <div className={styles.mobileNavOverlay}>
          <div className={styles.mobileNavContent}>
            <div className={styles.mobileNavHeader}>
              <div className={styles.mobileLogoWrapper}>
                <div className={styles.mobileLogo}>
                  <span className={styles.mobileLogoText}>B</span>
                </div>
                <div className={styles.mobileBrand}>
                  <span className={styles.mobileBrandName}>Saudi Fab Store</span>
                  <span className={styles.mobileBrandSubtitle}>Executive Admin Portal</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className={styles.mobileNavClose}
                aria-label="Close navigation"
              >
                <X className={styles.mobileNavCloseIcon} />
              </button>
            </div>

            <nav className={styles.mobileNav}>
              <ul className={styles.mobileNavList}>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;

                  return (
                    <li key={item.id} className={styles.mobileNavItem}>
                      <Link href={item.href} passHref>
                        <button
                          onClick={() => handleItemClick(item.id)}
                          className={`${styles.mobileNavButton} ${isActive ? styles.mobileActive : ''}`}
                        >
                          <div className={styles.mobileNavIconWrapper}>
                            <Icon className={styles.mobileNavIcon} />
                          </div>
                          <span className={styles.mobileNavText}>{item.name}</span>
                          {item.badge && (
                            <span className={styles.mobileBadge}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={styles.mobileNavFooter}>
              <div className={styles.mobileProfileWrapper}>
                <div className={styles.mobileAvatar}>
                  <span className={styles.mobileAvatarText}>
                    {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div className={styles.mobileProfileInfo}>
                  <p className={styles.mobileProfileName}>{userData.name || 'User'}</p>
                  <p className={styles.mobileProfileRole}>
                    {session?.user?.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleItemClick("logout")}
                className={styles.mobileLogoutButton}
              >
                <div className={styles.mobileLogoutIconWrapper}>
                  <LogOut className={styles.mobileLogoutIcon} />
                </div>
                <span className={styles.mobileLogoutText}>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
