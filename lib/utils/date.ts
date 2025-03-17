export function getMonthName(date: Date) {
  return date.toLocaleString("default", { month: "long" })
}

export function formatDate(date: Date | string, format: string = "MMM d, yyyy") {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
} 