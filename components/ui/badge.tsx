import * as React from "react"
import styles from "./badge.module.css"; // Import CSS module

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "destructive" | "outline";
}) {
  return (
    <span
      className={`${styles.badge} ${styles[`badgeVariant-${variant}`]} ${className || ''}`}
      {...props}
    />
  )
}

export { Badge }