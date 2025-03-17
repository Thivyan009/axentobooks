import type React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4"
}

export function Heading({ children, as: Component = "h2", className, ...props }: HeadingProps) {
  return (
    <Component
      className={cn(
        "scroll-m-20 font-semibold tracking-tight",
        {
          "text-3xl lg:text-4xl": Component === "h1",
          "text-2xl lg:text-3xl": Component === "h2",
          "text-xl lg:text-2xl": Component === "h3",
          "text-lg lg:text-xl": Component === "h4",
        },
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

