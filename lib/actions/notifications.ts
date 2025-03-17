"use server"

import prisma from "@/lib/prisma"
import type { Notification } from "@/lib/types/notification"

export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        timestamp: "desc",
      },
    })

    return { notifications }
  } catch (error) {
    console.error("Failed to get notifications:", error)
    return { error: "Failed to get notifications" }
  }
}

export async function markAsRead(userId: string, notificationId: string) {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
      },
    })

    return { notification }
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return { error: "Failed to mark notification as read" }
  }
}

export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error)
    return { error: "Failed to mark all notifications as read" }
  }
}

export async function clearNotification(userId: string, notificationId: string) {
  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to clear notification:", error)
    return { error: "Failed to clear notification" }
  }
}

export async function addNotification(userId: string, data: Omit<Notification, "id" | "timestamp">) {
  try {
    const notification = await prisma.notification.create({
      data: {
        ...data,
        userId,
        timestamp: new Date().toISOString(),
      },
    })

    return { notification }
  } catch (error) {
    console.error("Failed to add notification:", error)
    return { error: "Failed to add notification" }
  }
} 