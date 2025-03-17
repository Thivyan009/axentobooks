"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TooltipSystemProps {
  tooltips: {
    targetSelector: string
    content: string
    position?: "top" | "right" | "bottom" | "left"
  }[]
  onComplete: () => void
  isActive: boolean
}

export function TooltipSystem({ tooltips, onComplete, isActive }: TooltipSystemProps) {
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Update tooltip position when target element changes
  useEffect(() => {
    if (!isActive) return

    const updatePosition = () => {
      const currentTooltip = tooltips[currentTooltipIndex]
      if (!currentTooltip) return

      const targetElement = document.querySelector(currentTooltip.targetSelector)
      if (!targetElement) return

      const targetRect = targetElement.getBoundingClientRect()
      const position = currentTooltip.position || "bottom"

      let top = 0
      let left = 0

      switch (position) {
        case "top":
          top = targetRect.top - (tooltipRef.current?.offsetHeight || 0) - 10
          left = targetRect.left + targetRect.width / 2
          break
        case "right":
          top = targetRect.top + targetRect.height / 2
          left = targetRect.right + 10
          break
        case "bottom":
          top = targetRect.bottom + 10
          left = targetRect.left + targetRect.width / 2
          break
        case "left":
          top = targetRect.top + targetRect.height / 2
          left = targetRect.left - (tooltipRef.current?.offsetWidth || 0) - 10
          break
      }

      setTooltipPosition({ top, left })
      setIsVisible(true)

      // Highlight the target element
      targetElement.classList.add("tooltip-highlight")
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)

      // Remove highlight from all elements
      document.querySelectorAll(".tooltip-highlight").forEach((el) => {
        el.classList.remove("tooltip-highlight")
      })
    }
  }, [currentTooltipIndex, tooltips, isActive])

  const handleNext = () => {
    if (currentTooltipIndex < tooltips.length - 1) {
      setCurrentTooltipIndex(currentTooltipIndex + 1)
    } else {
      setIsVisible(false)
      onComplete()
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    onComplete()
  }

  if (!isActive || !isVisible) return null

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed z-50 w-64 rounded-lg border bg-card p-4 shadow-lg"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1 h-6 w-6 rounded-full p-0"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="mb-3 text-sm">{tooltips[currentTooltipIndex].content}</div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentTooltipIndex + 1} of {tooltips.length}
            </span>
            <Button size="sm" onClick={handleNext}>
              {currentTooltipIndex < tooltips.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

