import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './auth-context'
import { notificationSocket } from '../lib/websocket-client'

type Notification = Parameters<
  Parameters<typeof notificationSocket.subscribe>[0]
>[0][number]

interface WebSocketContextValue {
  notifications: Notification[]
  clearNotification: (id: number) => void
  clearAllNotifications: () => void
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      notificationSocket.disconnect()
      return
    }

    notificationSocket.connect(user.id)
    const unsubscribe = notificationSocket.subscribe(setNotifications)

    return () => {
      unsubscribe()
      notificationSocket.disconnect()
    }
  }, [isAuthenticated, user?.id])

  return (
    <WebSocketContext.Provider
      value={{
        notifications,
        clearNotification: notificationSocket.clearNotification.bind(
          notificationSocket
        ),
        clearAllNotifications: notificationSocket.clearAll.bind(
          notificationSocket
        ),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useWebSocket() {
  const ctx = useContext(WebSocketContext)
  if (!ctx) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return ctx
}
