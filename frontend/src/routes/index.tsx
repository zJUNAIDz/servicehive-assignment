import { useAuth } from '@/shared/providers/auth-context'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    Navigate({ to: '/auth/login' })
    return null
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to GigFlow!</h1>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p className="text-gray-700">
            <strong>Name:</strong> {user?.name}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-gray-700">
            <strong>ID:</strong> {user?.id}
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}