import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase' 
import { Toaster } from './components/ui/sonner'

// --- ADD THESE LINES HERE ---
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
// ----------------------------

// 1. IMPROVED Protected Route component
function ProtectedRoute({ children, session }: { children: React.ReactNode, session: any }) {
  if (session === undefined) return <div className="flex h-screen items-center justify-center bg-[#001f3f] text-white">Loading InsideFUTA...</div>
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

// ... the rest of your App() function stays exactly the same ...

function App() {
  const [session, setSession] = useState<any>(undefined) // undefined means "loading"

  useEffect(() => {
    // 2. REAL AUTH CHECK: Get current session from Supabase on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 3. LISTEN: If the user logs in or out, update the app immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        {/* If already logged in, don't show login/signup pages, redirect to dashboard */}
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Routes - Pass the 'session' to them */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* ... Apply the same <ProtectedRoute session={session}> to ALL other protected routes ... */}
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
