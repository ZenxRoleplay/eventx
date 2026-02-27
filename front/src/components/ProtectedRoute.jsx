import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute
 * @param {string|null} requiredRole  - 'admin' | 'organizer' | null (any logged-in user)
 * @param {string}      redirectTo    - where to send unauthenticated users
 */
export default function ProtectedRoute({ children, requiredRole = null, redirectTo = '/login' }) {
  const { isLoggedIn, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to={redirectTo} replace />

  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/" replace />
  }

  if (requiredRole === 'organizer' && role !== 'organizer' && role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
