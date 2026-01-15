import { Link } from '@tanstack/react-router'
import { useAuth } from '../providers/auth-context'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="p-4 flex items-center justify-between bg-amber-300 shadow-md">
      <div className="flex gap-4 items-center">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold text-amber-900',
          }}
          activeOptions={{ exact: true }}
          className="text-lg hover:text-amber-800 transition-colors"
        >
          GigFlow
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to="/gigs"
              activeProps={{
                className: 'font-bold text-amber-900',
              }}
              className="hover:text-amber-800 transition-colors"
            >
              Gigs
            </Link>
          </>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-amber-900">
              Welcome, <strong>{user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth/login"
              activeProps={{
                className: 'font-bold',
              }}
              className="text-amber-900 hover:text-amber-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              activeProps={{
                className: 'font-bold',
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  )
}