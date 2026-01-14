import { api } from '@/lib/apiClient'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createContext, useCallback, useContext, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isError: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<unknown>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    data: user,
    isLoading,
    isError,
    // refetch,
  } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const res = await api.get<User>('/auth/me')
      return res.data
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      navigate({ to: '/' })
      return response
    },
    [navigate, queryClient]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api.post('/auth/register', { name, email, password })
      // After registration, automatically log in
      await login(email, password)
    },
    [login]
  )

  const logout = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    await api.post('/auth/logout')
    await navigate({ to: '/auth/login' })
  }, [queryClient, navigate])

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
//eslint-disable-next-line
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
