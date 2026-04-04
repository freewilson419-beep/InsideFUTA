import { createClient } from '@supabase/supabase-js'

// Direct Connection - No more looking "up and down"!
const supabaseUrl = 'https://taaqbgtgvthnqplebghx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYXFiZ3RndnRobnFwbGViZ2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzU2OTksImV4cCI6MjA5MDg1MTY5OX0.MJAod6tU5qJEUyG938NqAMAEN6FRPjSboz2PIIJL_lw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
