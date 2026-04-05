import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase' // Ensure your supabase client is imported

// ... (Keep all your interfaces: User, Course, etc. exactly as they are)

// Grade points mapping
const gradePoints: Record<string, number> = {
  A: 5, B: 4, C: 3, D: 2, E: 1, F: 0,
}

// THE CHANGE: We keep the Mocks available, but we don't force them 
// into the initial state anymore so "John Doe" disappears.
const mockCourses: Course[] = [ /* ... keep your existing mock arrays here ... */ ]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- AUTH SECTION (FIXED) ---
      user: null, // No more John Doe on start
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error

          if (data.user) {
            const { full_name, dept, level, matric } = data.user.user_metadata
            set({
              user: {
                id: data.user.id,
                name: full_name || 'Student',
                email: data.user.email || '',
                matricNumber: matric || 'N/A',
                department: dept || 'General',
                level: level || '100',
              },
              isAuthenticated: true,
              // When a real user logs in, we clear the mock data 
              // so they can start fresh or fetch their real data.
              courses: [], 
              timetable: [],
              assignments: []
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
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email!,
            password: data.password,
            options: {
              data: {
                full_name: data.name,
                dept: data.department,
                level: data.level,
                matric: data.matricNumber,
              }
            }
          })
          if (error) throw error
          return true // User needs to verify email now
        } catch (err) {
          console.error("Signup Error:", err)
          return false
        }
      },

      logout: () => {
        supabase.auth.signOut()
        set({ user: null, isAuthenticated: false, courses: [], timetable: [] })
      },

      // --- DATA SECTION (CLEANED) ---
      // We initialize these as empty so the Dashboard shows "No classes" 
      // instead of John Doe's classes until you add yours.
      courses: [], 
      timetable: [],
      assignments: [],
      pastQuestions: [],
      forumPosts: [],
      announcements: [],
      chatGroups: [],
      products: [],
      notifications: [],
      semesterResults: [],

      // ... (Keep all your helper functions: addCourse, addAssignment, etc. exactly as they are)
      
      calculateCGPA: () => {
        const { semesterResults } = get()
        if (semesterResults.length === 0) return 0
        let totalPoints = 0
        let totalUnits = 0
        semesterResults.forEach((semester) => {
          semester.courses.forEach((course) => {
            totalPoints += gradePoints[course.grade] * course.units
            totalUnits += course.units
          })
        })
        return totalUnits > 0 ? totalPoints / totalUnits : 0
      },
    }),
    {
      name: 'insidefuta-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        // We persist the user but NOT the empty arrays
      }),
    }
  )
)
