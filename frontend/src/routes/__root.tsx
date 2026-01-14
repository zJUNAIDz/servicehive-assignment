import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/lib/auth-context'
import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
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
      <div className='h-full bg-amber-200'>
        <Navbar />
        <hr />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </AuthProvider>
  )
}