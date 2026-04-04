import { useState } from 'react'
import { supabase } from '../lib/supabase' // Make sure this path is correct

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert('Check your email for the confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#001f3f] text-white p-4">
      <div className="w-full max-w-md bg-white text-[#001f3f] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center mb-2">Inside<span className="text-[#ffcc00]">FUTA</span></h1>
        <p className="text-center text-gray-500 mb-8">
          {isSignUp ? 'Create your student account' : 'Welcome back, Scholar'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="School Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full bg-[#003366] hover:bg-[#001f3f] text-white font-bold py-3 rounded-lg transition duration-300"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-4 text-sm text-[#003366] hover:underline"
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  )
}
