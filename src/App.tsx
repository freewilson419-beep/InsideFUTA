import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase' 
import { Toaster } from './components/ui/sonner'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if a user is already logged in when the app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // This is the magic part: it listens for the "Sign In" event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_IN') {
        navigate('/dashboard') // This physically moves the page
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
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App
