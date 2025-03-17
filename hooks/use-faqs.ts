"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getFAQs, getFAQByCategory } from "@/lib/actions/faq"

export type FAQ = {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadFAQs() {
      try {
        const { faqs: data, error } = selectedCategory
          ? await getFAQByCategory(selectedCategory)
          : await getFAQs()

        if (error) {
          toast.error(error)
        } else if (data) {
          setFaqs(data)
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error)
        toast.error("Failed to load FAQs")
      } finally {
        setLoading(false)
      }
    }

    loadFAQs()
  }, [selectedCategory])

  return {
    faqs,
    loading,
    selectedCategory,
    setSelectedCategory,
  }
} 