import { Navbar } from '@/shared/components/navbar'
import { NotificationToast } from '@/shared/components/notification-toast'
import { AuthProvider } from '@/shared/providers/auth-context'
import { WebSocketProvider } from '@/shared/providers/websocket-context'
import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "./root.css"

interface MyRouterContext {
  queryClient: QueryClient
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <div className='h-full bg-amber-200'>
          <Navbar />
          <NotificationToast />
          <hr />
          <Outlet />
          {/* <TanStackRouterDevtools position="bottom-right" /> */}
        </div>
      </WebSocketProvider>
    </AuthProvider>
  )
}