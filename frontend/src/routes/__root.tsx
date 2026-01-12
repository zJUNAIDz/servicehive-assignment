import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "./root.css"
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className='h-full bg-amber-200'>
      <div className="p-2 flex gap-2 text-lg bg-amber-300">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/auth/login"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Login
        </Link>{' '}
        <Link
          to="/auth/register"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Register
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}