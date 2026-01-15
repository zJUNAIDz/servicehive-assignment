import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { api } from '../lib/apiClient'

export interface User {
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
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const AUTH_QUERY_KEY = useMemo(() => ['auth', 'me'], []);
  const {
    data: user,
    isLoading,
    isError,
    // refetch,
  } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<User>('/auth/me')
      return res.data
    },
    //* data._id should be data.id
    select: (data) => {
      if (!data) return null;
      return { id: data.id, name: data.name, email: data.email };
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      await navigate({ to: '/' })
      return response
    },
    [queryClient, navigate, AUTH_QUERY_KEY]
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
    await api.post('/auth/logout')
    await queryClient.resetQueries({ queryKey: AUTH_QUERY_KEY })
    await navigate({ to: '/auth/login' })
  }, [queryClient, navigate, AUTH_QUERY_KEY])

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!user,
    login,
    register,
    logout,
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
