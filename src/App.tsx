function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true) // 1. Add loading state
  const navigate = useNavigate()

  useEffect(() => {
    // 2. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false) // 3. Stop loading once we check
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setLoading(false) // 4. Ensure loading stops on changes
      if (event === 'SIGNED_IN') {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  // 5. DO NOT render routes until the initial check is done
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B5CF6]"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* If logged in, /login sends you to /dashboard */}
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />
        {/* If NOT logged in, /dashboard sends you to /login */}
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
