import { useWebSocket } from '@/shared/providers/websocket-context'
import { useEffect } from 'react'
import { toast } from "sonner"
export function NotificationToast() {
  const { notifications, clearNotification } = useWebSocket()
  useEffect(() => {
    notifications.forEach((notification, index) => {
      toast.success(notification.message, {
        id: `${notification.timestamp}-${index}`,
        description: 'Congratulations! 🎉',
        duration: 5000,
        onDismiss: () => clearNotification(index),
        onAutoClose: () => clearNotification(index),
      })
    })
  }, [notifications, clearNotification])

  return null
}