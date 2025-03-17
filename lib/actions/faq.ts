"use server"

import prisma from "@/lib/prisma"

export async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    return { faqs }
  } catch (error) {
    console.error("Failed to get FAQs:", error)
    return { error: "Failed to get FAQs" }
  }
}

export async function getFAQByCategory(category: string) {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: {
        category
      },
      orderBy: {
        order: 'asc'
      }
    })
    return { faqs }
  } catch (error) {
    console.error("Failed to get FAQs by category:", error)
    return { error: "Failed to get FAQs by category" }
  }
} 