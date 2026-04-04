import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase' 

// ... keep your other imports ...

function App() {
  const [session, setSession] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 1. Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      
      // If the user just logged in and is still on the login page, move them!
      if (session && (location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* If logged in, redirect away from Login/Signup */}
      <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />
      
      {/* Protect the dashboard */}
      <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
