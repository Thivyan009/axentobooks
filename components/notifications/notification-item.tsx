"use client"

import { formatDistanceToNow } from "date-fns"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/lib/types/notification"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onClear: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead, onClear }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "transaction":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className={`flex items-start gap-4 p-4 ${!notification.read ? "bg-muted/50" : ""}`}>
      {getIcon()}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-none">{notification.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <div className="flex items-center gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal text-blue-500 hover:text-blue-600"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-auto p-0 text-muted-foreground/50 hover:text-muted-foreground"
        onClick={() => onClear(notification.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

