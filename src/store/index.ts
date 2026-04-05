import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  name: string
  email: string
  matricNumber: string
  department: string
  level: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => Promise<void>
}

export const useStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (authError) throw authError

      if (authData.user) {
        // Fetch the profile data from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError) {
          console.warn("Profile not found, using auth metadata")
        }

        set({
          user: {
            id: authData.user.id,
            name: profile?.full_name || authData.user.user_metadata.full_name || 'Israel Adebisi',
            email: authData.user.email || '',
            matricNumber: profile?.matric || authData.user.user_metadata.matric || 'N/A',
            department: profile?.department || 'Industrial Mathematics',
            level: profile?.level || '100',
          },
          isAuthenticated: true,
        })
        return true
      }
      return false
    } catch (err) {
      console.error("Login Error:", err)
      return false
    }
  },

  signup: async (data) => {
    try {
      // 1. Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email!,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            matric: data.matricNumber,
          }
        }
      })

      if (authError) throw authError

      // 2. Insert into the 'profiles' table (Fixes the 403 fetching issue)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: data.name,
              department: data.department || 'Industrial Mathematics',
              level: data.level || '100',
              matric: data.matricNumber,
              school_email: data.email
            }
          ])

        if (profileError) throw profileError
      }
      return true
    } catch (err) {
      console.error("Signup Error (likely 422 or Duplicate):", err)
      return false
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },
}))
