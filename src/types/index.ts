// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  department: string;
  level: string;
  avatar?: string;
  qrCode?: string;
}

// Course Types
export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  level: string;
  department: string;
  progress: number;
  materials: Material[];
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video';
  url: string;
  uploadedAt: Date;
}

// Timetable Types
export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseTitle: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  venue: string;
}

// Assignment Types
export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  deadline: Date;
  status: 'pending' | 'submitted' | 'graded';
  description: string;
}

// CGPA Types
export interface CourseGrade {
  courseCode: string;
  courseTitle: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  points: number;
}

export interface SemesterResult {
  id: string;
  semester: string;
  session: string;
  courses: CourseGrade[];
  gpa: number;
}

// Past Question Types
export interface PastQuestion {
  id: string;
  courseCode: string;
  courseTitle: string;
  year: string;
  semester: string;
  downloadUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Forum Types
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  upvotes: number;
  replies: ForumReply[];
  createdAt: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  author: User;
  upvotes: number;
  createdAt: Date;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'exam' | 'deadline' | 'news' | 'event';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface ChatGroup {
  id: string;
  name: string;
  courseCode?: string;
  members: User[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
}

// Marketplace Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'books' | 'gadgets' | 'services' | 'data';
  images: string[];
  seller: User;
  condition?: 'new' | 'used' | 'refurbished';
  status: 'available' | 'sold' | 'reserved';
  createdAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  provider: User;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer: User;
  createdAt: Date;
}

// Data Bundle Types
export interface DataBundle {
  id: string;
  name: string;
  size: string;
  price: number;
  validity: string;
  network: 'mtn' | 'airtel' | 'glo' | '9mobile';
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}
