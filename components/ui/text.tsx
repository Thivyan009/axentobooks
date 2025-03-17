import type React from "react"
import { cn } from "@/lib/utils"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "lead" | "large" | "small" | "muted"
}

export function Text({ children, variant = "default", className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        {
          "text-base": variant === "default",
          "text-xl text-muted-foreground": variant === "lead",
          "text-lg font-semibold": variant === "large",
          "text-sm font-medium": variant === "small",
          "text-sm text-muted-foreground": variant === "muted",
        },
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

