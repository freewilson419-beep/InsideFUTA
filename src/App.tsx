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

// 1. Protected Route: Blocks access if not logged in
function ProtectedRoute({ children, session }: { children: React.ReactNode, session: any }) {
  if (session === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#001f3f] text-white">
        Checking FUTA Session...
      </div>
    )
  }
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const [session, setSession] = useState<any>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    // 2. Check if a user is already logged in when the app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 3. The "Redirect Engine": Moves you to the dashboard the moment you log in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      
      if (event === 'SIGNED_IN' || session) {
        // If we just logged in, force the browser to the dashboard
        navigate('/dashboard', { replace: true })
      }
      
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Pages: Redirect to dashboard if session exists */}
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />

        {/* Protected Dashboard */}
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

        {/* Catch all back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
