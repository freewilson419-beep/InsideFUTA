import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase' 
import { Toaster } from './components/ui/sonner'

// Page Imports
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

// 1. Protected Route component
function ProtectedRoute({ children, session }: { children: React.ReactNode, session: any }) {
  if (session === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#001f3f] text-white font-bold">
        Verifying InsideFUTA Session...
      </div>
    )
  }
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const [session, setSession] = useState<any>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    // 2. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      // If we are already logged in and try to go to /login, push to dashboard
      if (session && window.location.pathname === '/login') {
        navigate('/dashboard', { replace: true })
      }
    })

    // 3. Auth Listener (This handles the redirect the moment you click Sign In)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes - Redirect if session exists */}
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute session={session}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
