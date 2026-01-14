import { Navbar } from '@/shared/components/navbar'
import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "./root.css"
import { AuthProvider } from '@/shared/lib/auth-context'
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