function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setLoading(false)
      if (event === 'SIGNED_IN') {
        // This is what actually pushes you to the dashboard
        navigate('/dashboard', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) return null; // Or a spinner

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* If session exists, kick them to dashboard from login */}
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App // <--- DO NOT FORGET THIS!
