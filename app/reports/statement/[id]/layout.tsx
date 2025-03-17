import type React from "react"
export default function StatementLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="print:bg-white print:p-0">{children}</div>
}

