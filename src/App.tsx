import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase' 
import { Toaster } from './components/ui/sonner'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

function ProtectedRoute({ children, session }: { children: React.ReactNode, session: any }) {
  if (session === undefined) return <div className="h-screen bg-[#0F0F0F] text-white flex items-center justify-center">Verifying InsideFUTA...</div>
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const [session, setSession] = useState<any>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session && window.location.pathname === '/login') navigate('/dashboard')
    })

    // Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      // IF LOGGED IN: Force move to dashboard
      if (session && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute session={session}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute session={session}><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
