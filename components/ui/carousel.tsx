"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import styles from "./carousel.module.css"; // Import CSS module

export function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.carousel}>
      {children}
    </div>
  )
}

export function CarouselContent({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.carouselContent}>
      {children}
    </div>
  )
}

export function CarouselItem({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.carouselItem}>
      {children}
    </div>
  )
}

export function CarouselPrevious({ children }: { children: React.ReactNode }) {
  return (
    <button className={styles.carouselPrevious}>
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
      {children}
    </button>
  )
}

export function CarouselNext({ children }: { children: React.ReactNode }) {
  return (
    <button className={styles.carouselNext}>
      <ArrowRight />
      <span className="sr-only">Next slide</span>
      {children}
    </button>
  )
}