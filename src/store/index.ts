import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  name: string
  email: string
  matricNumber: string
  department: string
  level: string
  avatar?: string
  phone?: string
  bio?: string
}

export interface Course {
  id: string
  code: string
  title: string
  description: string
  level: string
  department: string
  lecturer: string
  progress: number
  materials: Material[]
}

export interface Material {
  id: string
  title: string
  type: 'pdf' | 'link' | 'video' | 'doc'
  url: string
  size?: string
  uploadedAt: string
  uploadedBy: string
}

export interface TimetableEntry {
  id: string
  courseId: string
  courseCode: string
  courseTitle: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  startTime: string
  endTime: string
  venue: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  courseId: string
  courseCode: string
  deadline: string
  status: 'pending' | 'submitted' | 'graded'
  submittedAt?: string
  score?: number
  maxScore: number
}

export interface PastQuestion {
  id: string
  courseId: string
  courseCode: string
  courseTitle: string
  year: string
  semester: string
  examType: 'midterm' | 'final' | 'quiz'
  fileUrl: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  downloads: number
}

export interface ForumPost {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  tags: string[]
  upvotes: number
  userUpvoted: boolean
  replies: ForumReply[]
  createdAt: string
  views: number
}

export interface ForumReply {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  upvotes: number
  createdAt: string
  isBestAnswer: boolean
}

export interface Announcement {
  id: string
  title: string
  content: string
  category: 'exam' | 'deadline' | 'news' | 'event' | 'general'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  expiresAt?: string
  author: string
}

export interface ChatMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  fileUrl?: string
  fileName?: string
}

export interface ChatGroup {
  id: string
  name: string
  description: string
  courseCode?: string
  members: string[]
  messages: ChatMessage[]
  createdAt: string
  avatar?: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: 'books' | 'gadgets' | 'services' | 'data' | 'others'
  images: string[]
  condition?: 'new' | 'used' | 'refurbished'
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  status: 'available' | 'sold' | 'reserved'
  location: string
  createdAt: string
  views: number
}

export interface DataBundle {
  id: string
  name: string
  size: string
  price: number
  validity: string
  network: 'mtn' | 'airtel' | 'glo' | '9mobile'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'assignment' | 'announcement' | 'message' | 'marketplace' | 'general'
  read: boolean
  createdAt: string
  link?: string
}

// Store interface
interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void

  // Courses
  courses: Course[]
  addCourse: (course: Omit<Course, 'id' | 'materials'>) => void
  updateCourse: (id: string, data: Partial<Course>) => void
  deleteCourse: (id: string) => void
  addMaterial: (courseId: string, material: Omit<Material, 'id' | 'uploadedAt'>) => void
  deleteMaterial: (courseId: string, materialId: string) => void

  // Timetable
  timetable: TimetableEntry[]
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void
  updateTimetableEntry: (id: string, data: Partial<TimetableEntry>) => void
  deleteTimetableEntry: (id: string) => void
  getTimetableByDay: (day: string) => TimetableEntry[]

  // Assignments
  assignments: Assignment[]
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void
  updateAssignment: (id: string, data: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void
  submitAssignment: (id: string) => void

  // Past Questions
  pastQuestions: PastQuestion[]
  addPastQuestion: (pq: Omit<PastQuestion, 'id' | 'downloads'>) => void
  deletePastQuestion: (id: string) => void
  incrementDownloads: (id: string) => void

  // Forum
  forumPosts: ForumPost[]
  addForumPost: (post: Omit<ForumPost, 'id' | 'upvotes' | 'replies' | 'views' | 'userUpvoted' | 'createdAt'>) => void
  addForumReply: (postId: string, reply: Omit<ForumReply, 'id' | 'upvotes' | 'createdAt' | 'isBestAnswer'>) => void
  upvotePost: (postId: string) => void
  upvoteReply: (postId: string, replyId: string) => void
  markBestAnswer: (postId: string, replyId: string) => void

  // Announcements
  announcements: Announcement[]
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void
  deleteAnnouncement: (id: string) => void

  // Chat
  chatGroups: ChatGroup[]
  addChatGroup: (group: Omit<ChatGroup, 'id' | 'messages' | 'createdAt'>) => void
  joinChatGroup: (groupId: string, userId: string) => void
  leaveChatGroup: (groupId: string, userId: string) => void
  sendMessage: (groupId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void

  // Marketplace
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'views'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  markAsSold: (id: string) => void

  // Data Bundles
  dataBundles: DataBundle[]

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void

  // CGPA
  semesterResults: SemesterResult[]
  addSemesterResult: (result: SemesterResult) => void
  calculateCGPA: () => number
}

export interface SemesterResult {
  id: string
  semester: string
  session: string
  courses: {
    courseId: string
    courseCode: string
    units: number
    grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  }[]
}

// Grade points mapping
const gradePoints: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    code: 'CSC 211',
    title: 'Object-Oriented Programming',
    description: 'Introduction to OOP concepts using Java',
    level: '200',
    department: 'Computer Science',
    lecturer: 'Dr. Adeyemi',
    progress: 75,
    materials: [
      { id: 'm1', title: 'Week 1 - Introduction to OOP', type: 'pdf', url: '#', size: '2.5MB', uploadedAt: '2024-01-15', uploadedBy: 'Dr. Adeyemi' },
      { id: 'm2', title: 'Week 2 - Classes and Objects', type: 'pdf', url: '#', size: '3.1MB', uploadedAt: '2024-01-22', uploadedBy: 'Dr. Adeyemi' },
    ],
  },
  {
    id: '2',
    code: 'MTS 201',
    title: 'Linear Algebra',
    description: 'Matrix operations and vector spaces',
    level: '200',
    department: 'Mathematics',
    lecturer: 'Prof. Ojo',
    progress: 60,
    materials: [
      { id: 'm3', title: 'Matrix Operations Notes', type: 'pdf', url: '#', size: '1.8MB', uploadedAt: '2024-01-10', uploadedBy: 'Prof. Ojo' },
    ],
  },
  {
    id: '3',
    code: 'PHY 112',
    title: 'General Physics II',
    description: 'Electricity, magnetism and optics',
    level: '100',
    department: 'Physics',
    lecturer: 'Dr. Nwosu',
    progress: 45,
    materials: [],
  },
  {
    id: '4',
    code: 'GNS 101',
    title: 'Use of English',
    description: 'English language and communication skills',
    level: '100',
    department: 'General Studies',
    lecturer: 'Mrs. Johnson',
    progress: 90,
    materials: [
      { id: 'm4', title: 'Essay Writing Guide', type: 'pdf', url: '#', size: '1.2MB', uploadedAt: '2024-01-05', uploadedBy: 'Mrs. Johnson' },
    ],
  },
]

const mockTimetable: TimetableEntry[] = [
  { id: '1', courseId: '1', courseCode: 'CSC 211', courseTitle: 'Object-Oriented Programming', day: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'LT 1' },
  { id: '2', courseId: '2', courseCode: 'MTS 201', courseTitle: 'Linear Algebra', day: 'Tuesday', startTime: '14:00', endTime: '16:00', venue: 'LT 3' },
  { id: '3', courseId: '3', courseCode: 'PHY 112', courseTitle: 'General Physics II', day: 'Wednesday', startTime: '10:00', endTime: '12:00', venue: 'Physics Lab' },
  { id: '4', courseId: '4', courseCode: 'GNS 101', courseTitle: 'Use of English', day: 'Thursday', startTime: '11:00', endTime: '13:00', venue: 'Auditorium' },
  { id: '5', courseId: '1', courseCode: 'CSC 211', courseTitle: 'Object-Oriented Programming Lab', day: 'Friday', startTime: '14:00', endTime: '17:00', venue: 'Computer Lab' },
]

const mockAssignments: Assignment[] = [
  { id: '1', title: 'Programming Assignment 3', description: 'Implement a class hierarchy for a library system', courseId: '1', courseCode: 'CSC 211', deadline: '2024-03-25T23:59', status: 'pending', maxScore: 100 },
  { id: '2', title: 'Matrix Problem Set', description: 'Solve problems 1-10 from chapter 3', courseId: '2', courseCode: 'MTS 201', deadline: '2024-03-28T23:59', status: 'pending', maxScore: 50 },
  { id: '3', title: 'Physics Lab Report', description: 'Submit lab report on Ohm\'s Law experiment', courseId: '3', courseCode: 'PHY 112', deadline: '2024-03-22T23:59', status: 'submitted', submittedAt: '2024-03-21T18:30', score: 85, maxScore: 100 },
]

const mockPastQuestions: PastQuestion[] = [
  { id: '1', courseId: '1', courseCode: 'CSC 211', courseTitle: 'Object-Oriented Programming', year: '2023', semester: 'First', examType: 'final', fileUrl: '#', fileSize: '1.5MB', uploadedBy: 'Admin', uploadedAt: '2024-01-20', downloads: 245 },
  { id: '2', courseId: '1', courseCode: 'CSC 211', courseTitle: 'Object-Oriented Programming', year: '2022', semester: 'First', examType: 'final', fileUrl: '#', fileSize: '1.3MB', uploadedBy: 'Admin', uploadedAt: '2024-01-20', downloads: 189 },
  { id: '3', courseId: '2', courseCode: 'MTS 201', courseTitle: 'Linear Algebra', year: '2023', semester: 'First', examType: 'midterm', fileUrl: '#', fileSize: '890KB', uploadedBy: 'Admin', uploadedAt: '2024-01-22', downloads: 156 },
]

const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Help with CSC 211 Assignment - Inheritance',
    content: 'I\'m struggling with the inheritance concept in the latest assignment. Can someone explain how to properly extend a base class?',
    authorId: 'u1',
    authorName: 'John Doe',
    tags: ['CSC 211', 'Programming', 'Help'],
    upvotes: 8,
    userUpvoted: false,
    replies: [
      { id: 'r1', content: 'You need to use the extends keyword. Make sure to call super() in your constructor!', authorId: 'u2', authorName: 'Jane Smith', upvotes: 12, createdAt: '2024-03-20T10:30', isBestAnswer: true },
      { id: 'r2', content: 'Check the lecture slides from week 3, they have good examples.', authorId: 'u3', authorName: 'Mike Johnson', upvotes: 5, createdAt: '2024-03-20T11:15', isBestAnswer: false },
    ],
    createdAt: '2024-03-20T09:00',
    views: 156,
  },
  {
    id: '2',
    title: 'Past Questions for MTS 201 - 2022/2023',
    content: 'Does anyone have past questions for Linear Algebra from last session?',
    authorId: 'u4',
    authorName: 'Sarah Williams',
    tags: ['MTS 201', 'Past Questions'],
    upvotes: 15,
    userUpvoted: true,
    replies: [],
    createdAt: '2024-03-19T14:20',
    views: 234,
  },
]

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'Exam Timetable Released', content: 'The final examination timetable for 2023/2024 session has been released. Please check your portal for details.', category: 'exam', priority: 'high', createdAt: '2024-03-20T08:00', author: 'Academic Office' },
  { id: '2', title: 'Course Registration Deadline Extended', content: 'Registration deadline has been extended to March 30, 2024.', category: 'deadline', priority: 'high', createdAt: '2024-03-19T10:00', author: 'Registrar' },
  { id: '3', title: 'New Study Groups Formed', content: 'New study groups for CSC and MTS courses are now available. Join through the Study Hub.', category: 'news', priority: 'medium', createdAt: '2024-03-18T16:00', author: 'Student Affairs' },
]

const mockChatGroups: ChatGroup[] = [
  { id: '1', name: 'CSC 211 Study Group', description: 'Discussion group for Object-Oriented Programming', courseCode: 'CSC 211', members: ['u1', 'u2', 'u3'], messages: [], createdAt: '2024-01-15' },
  { id: '2', name: 'MTS 201 Problem Solvers', description: 'Linear Algebra help and discussions', courseCode: 'MTS 201', members: ['u1', 'u4'], messages: [], createdAt: '2024-01-20' },
  { id: '3', name: 'General Chat', description: 'General discussions for all students', members: ['u1', 'u2', 'u3', 'u4'], messages: [], createdAt: '2024-01-01' },
]

const mockProducts: Product[] = [
  { id: '1', title: 'MacBook Pro 2020 - 13 inch', description: 'Good condition, 256GB SSD, 8GB RAM. Selling because I upgraded.', price: 450000, originalPrice: 600000, category: 'gadgets', images: ['/images/product-laptop.png'], condition: 'used', sellerId: 'u2', sellerName: 'Jane Smith', status: 'available', location: 'School Gate', createdAt: '2024-03-15', views: 89 },
  { id: '2', title: 'Engineering Textbooks Bundle', description: 'Collection of 200L engineering textbooks. All in good condition.', price: 15000, category: 'books', images: ['/images/product-textbook.png'], condition: 'used', sellerId: 'u3', sellerName: 'Mike Johnson', status: 'available', location: 'Library', createdAt: '2024-03-18', views: 45 },
  { id: '3', title: 'Scientific Calculator - Casio fx-991ES', description: 'Brand new, never used. Perfect for MTS and PHY courses.', price: 8500, category: 'gadgets', images: ['/images/product-calculator.png'], condition: 'new', sellerId: 'u4', sellerName: 'Sarah Williams', status: 'available', location: 'Hostel C', createdAt: '2024-03-19', views: 67 },
  { id: '4', title: 'LED Desk Lamp', description: 'Adjustable brightness, USB powered. Great for late night studying.', price: 12000, category: 'gadgets', images: ['/images/product-lamp.png'], condition: 'new', sellerId: 'u1', sellerName: 'John Doe', status: 'available', location: 'Hostel A', createdAt: '2024-03-20', views: 23 },
]

const mockDataBundles: DataBundle[] = [
  { id: '1', name: 'MTN Weekly', size: '1GB', price: 500, validity: '7 days', network: 'mtn' },
  { id: '2', name: 'MTN Monthly', size: '3GB', price: 1200, validity: '30 days', network: 'mtn' },
  { id: '3', name: 'Airtel Weekly', size: '1.5GB', price: 600, validity: '7 days', network: 'airtel' },
  { id: '4', name: 'Airtel Monthly', size: '4GB', price: 1500, validity: '30 days', network: 'airtel' },
  { id: '5', name: 'GLO Mega', size: '5GB', price: 1500, validity: '30 days', network: 'glo' },
  { id: '6', name: '9mobile Daily', size: '500MB', price: 200, validity: '1 day', network: '9mobile' },
]

const mockNotifications: Notification[] = [
  { id: '1', title: 'Assignment Due Soon', message: 'CSC 211 Assignment 3 is due in 2 days', type: 'assignment', read: false, createdAt: '2024-03-23T10:00', link: '/assignments' },
  { id: '2', title: 'New Announcement', message: 'Exam timetable has been released', type: 'announcement', read: false, createdAt: '2024-03-20T08:00', link: '/announcements' },
  { id: '3', title: 'New Message', message: 'Jane Smith replied to your forum post', type: 'message', read: true, createdAt: '2024-03-19T14:30', link: '/forum' },
]

// Create store
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Auth Error:", error.message)
      return false 
    }

    if (data.user) {
      // Pulling the actual data saved during that specific user's signup
      const { full_name, dept, level, matric } = data.user.user_metadata

      set({
        user: {
          id: data.user.id,
          name: full_name || 'Student',
          email: data.user.email || '',
          matricNumber: matric || 'N/A',
          department: dept || 'General',
          level: level || '100',
          avatar: data.user.user_metadata.avatar_url || '',
        },
        isAuthenticated: true,
      })
      return true
    }
    return false
  } catch (err) {
    return false
  }
},

      signup: async (data) => {
        if (data.email && data.name) {
          set({
            user: {
              id: 'u' + Date.now(),
              name: data.name,
              email: data.email,
              matricNumber: data.matricNumber || '',
              department: data.department || '',
              level: data.level || '',
              avatar: '',
              phone: '',
              bio: '',
            },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (data) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...data } })
        }
      },

      // Courses
      courses: mockCourses,

      addCourse: (course) => {
        const newCourse: Course = {
          ...course,
          id: 'c' + Date.now(),
          materials: [],
        }
        set((state) => ({ courses: [...state.courses, newCourse] }))
      },

      updateCourse: (id, data) => {
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        }))
      },

      addMaterial: (courseId, material) => {
        const newMaterial: Material = {
          ...material,
          id: 'm' + Date.now(),
          uploadedAt: new Date().toISOString(),
        }
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, materials: [...c.materials, newMaterial] } : c
          ),
        }))
      },

      deleteMaterial: (courseId, materialId) => {
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId
              ? { ...c, materials: c.materials.filter((m) => m.id !== materialId) }
              : c
          ),
        }))
      },

      // Timetable
      timetable: mockTimetable,

      addTimetableEntry: (entry) => {
        const newEntry: TimetableEntry = {
          ...entry,
          id: 't' + Date.now(),
        }
        set((state) => ({ timetable: [...state.timetable, newEntry] }))
      },

      updateTimetableEntry: (id, data) => {
        set((state) => ({
          timetable: state.timetable.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }))
      },

      deleteTimetableEntry: (id) => {
        set((state) => ({
          timetable: state.timetable.filter((t) => t.id !== id),
        }))
      },

      getTimetableByDay: (day) => {
        return get().timetable.filter((t) => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
      },

      // Assignments
      assignments: mockAssignments,

      addAssignment: (assignment) => {
        const newAssignment: Assignment = {
          ...assignment,
          id: 'a' + Date.now(),
        }
        set((state) => ({ assignments: [...state.assignments, newAssignment] }))
      },

      updateAssignment: (id, data) => {
        set((state) => ({
          assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }))
      },

      deleteAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        }))
      },

      submitAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === id ? { ...a, status: 'submitted', submittedAt: new Date().toISOString() } : a
          ),
        }))
      },

      // Past Questions
      pastQuestions: mockPastQuestions,

      addPastQuestion: (pq) => {
        const newPQ: PastQuestion = {
          ...pq,
          id: 'pq' + Date.now(),
          downloads: 0,
        }
        set((state) => ({ pastQuestions: [...state.pastQuestions, newPQ] }))
      },

      deletePastQuestion: (id) => {
        set((state) => ({
          pastQuestions: state.pastQuestions.filter((pq) => pq.id !== id),
        }))
      },

      incrementDownloads: (id) => {
        set((state) => ({
          pastQuestions: state.pastQuestions.map((pq) =>
            pq.id === id ? { ...pq, downloads: pq.downloads + 1 } : pq
          ),
        }))
      },

      // Forum
      forumPosts: mockForumPosts,

      addForumPost: (post) => {
        const newPost: ForumPost = {
          ...post,
          id: 'fp' + Date.now(),
          upvotes: 0,
          replies: [],
          views: 0,
          userUpvoted: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ forumPosts: [newPost, ...state.forumPosts] }))
      },

      addForumReply: (postId, reply) => {
        const newReply: ForumReply = {
          ...reply,
          id: 'fr' + Date.now(),
          upvotes: 0,
          createdAt: new Date().toISOString(),
          isBestAnswer: false,
        }
        set((state) => ({
          forumPosts: state.forumPosts.map((p) =>
            p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
          ),
        }))
      },

      upvotePost: (postId) => {
        set((state) => ({
          forumPosts: state.forumPosts.map((p) =>
            p.id === postId
              ? { ...p, upvotes: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1, userUpvoted: !p.userUpvoted }
              : p
          ),
        }))
      },

      upvoteReply: (postId, replyId) => {
        set((state) => ({
          forumPosts: state.forumPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  replies: p.replies.map((r) =>
                    r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r
                  ),
                }
              : p
          ),
        }))
      },

      markBestAnswer: (postId, replyId) => {
        set((state) => ({
          forumPosts: state.forumPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  replies: p.replies.map((r) => ({ ...r, isBestAnswer: r.id === replyId })),
                }
              : p
          ),
        }))
      },

      // Announcements
      announcements: mockAnnouncements,

      addAnnouncement: (announcement) => {
        const newAnnouncement: Announcement = {
          ...announcement,
          id: 'an' + Date.now(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ announcements: [newAnnouncement, ...state.announcements] }))
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        }))
      },

      // Chat
      chatGroups: mockChatGroups,

      addChatGroup: (group) => {
        const newGroup: ChatGroup = {
          ...group,
          id: 'cg' + Date.now(),
          messages: [],
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ chatGroups: [...state.chatGroups, newGroup] }))
      },

      joinChatGroup: (groupId, userId) => {
        set((state) => ({
          chatGroups: state.chatGroups.map((g) =>
            g.id === groupId && !g.members.includes(userId)
              ? { ...g, members: [...g.members, userId] }
              : g
          ),
        }))
      },

      leaveChatGroup: (groupId, userId) => {
        set((state) => ({
          chatGroups: state.chatGroups.map((g) =>
            g.id === groupId ? { ...g, members: g.members.filter((m) => m !== userId) } : g
          ),
        }))
      },

      sendMessage: (groupId, message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: 'msg' + Date.now(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          chatGroups: state.chatGroups.map((g) =>
            g.id === groupId ? { ...g, messages: [...g.messages, newMessage] } : g
          ),
        }))
      },

      // Marketplace
      products: mockProducts,

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: 'p' + Date.now(),
          createdAt: new Date().toISOString(),
          views: 0,
        }
        set((state) => ({ products: [newProduct, ...state.products] }))
      },

      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      markAsSold: (id) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, status: 'sold' } : p)),
        }))
      },

      // Data Bundles
      dataBundles: mockDataBundles,

      // Notifications
      notifications: mockNotifications,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: 'n' + Date.now(),
          read: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ notifications: [newNotification, ...state.notifications] }))
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }))
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // CGPA
      semesterResults: [],

      addSemesterResult: (result) => {
        set((state) => ({ semesterResults: [...state.semesterResults, result] }))
      },

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
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
