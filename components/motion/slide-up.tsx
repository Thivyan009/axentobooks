"use client"

import type React from "react"

import { motion } from "framer-motion"

interface SlideUpProps {
  children: React.ReactNode
  delay?: number
}

export function SlideUp({ children, delay = 0 }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.21, 1.02, 0.73, 0.99],
      }}
    >
      {children}
    </motion.div>
  )
}

