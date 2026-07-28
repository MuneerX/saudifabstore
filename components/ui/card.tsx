import * as React from "react"
import styles from "./card.module.css"; // Import CSS module

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.card} ${className || ''}`}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.cardHeader} ${className || ''}`}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.cardTitle} ${className || ''}`}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.cardDescription} ${className || ''}`}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.cardAction} ${className || ''}`}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.cardContent} ${className || ''}`}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`${styles.cardFooter} ${className || ''}`}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}