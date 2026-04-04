import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase' 

// ... keep your other imports ...

function App() {
  const [session, setSession] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

 // ... Keep your imports and App function start ...

  useEffect(() => {
    // 1. If I refresh the page and I'm already logged in, take me to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard', { replace: true });
    });

    // 2. If I just clicked the "Sign In" button, take me to dashboard
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

// ... Keep your return statement with <Routes> ...
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
