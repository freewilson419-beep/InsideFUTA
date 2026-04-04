import { createClient } from '@supabase/supabase-js'

// This pulls the keys from the .env file you already made!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase keys are missing! Check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
