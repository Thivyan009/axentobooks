import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    title: string
    href?: string
  }[]
}

export function Breadcrumb({ segments, className, ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)} {...props}>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1

        return (
          <React.Fragment key={segment.title}>
            {segment.href ? (
              <Link
                href={segment.href}
                className={cn(
                  "hover:text-foreground transition-colors",
                  isLast && "text-foreground pointer-events-none",
                )}
              >
                {segment.title}
              </Link>
            ) : (
              <span className={cn(isLast && "text-foreground")}>{segment.title}</span>
            )}
            {!isLast && <ChevronRight className="mx-2 h-4 w-4" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

