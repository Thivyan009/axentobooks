import type { Metadata } from "next"
import { ProfileContent } from "@/components/profile/profile-content"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Profile - Axento Books",
  description: "Manage your profile information and settings",
}

export default function ProfilePage() {
  redirect("/settings")
} 