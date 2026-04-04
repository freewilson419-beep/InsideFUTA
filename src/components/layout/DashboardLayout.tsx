import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  ShoppingBag,
  User,
  Bell,
  Menu,
  X,
  Home,
  Calculator,
  Book,
  MessageCircle,
  Megaphone,
  Zap,
  LogOut,
  QrCode,
  Settings,
  Shield,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

const sidebarLinks = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  { icon: Calendar, label: 'Timetable', href: '/timetable' },
  { icon: FileText, label: 'Assignments', href: '/assignments' },
  { icon: Calculator, label: 'CGPA Calculator', href: '/cgpa' },
  { icon: Book, label: 'Past Questions', href: '/past-questions' },
  { icon: MessageSquare, label: 'Forum', href: '/forum' },
  { icon: Megaphone, label: 'Announcements', href: '/announcements' },
  { icon: MessageCircle, label: 'Chat', href: '/chat' },
  { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
  { icon: Zap, label: 'Data Bundles', href: '/data-bundles' },
]

const bottomLinks = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: QrCode, label: 'ID Card', href: '/id-card' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, notifications } = useStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#1A1A1A] border-r border-white/5 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">iF</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">insidefuta</span>
                <p className="text-white/40 text-xs">Student Platform</p>
              </div>
            </Link>
          </div>

          {/* Main Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(link.href)
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                  {link.label === 'Assignments' && (
                    <Badge className="ml-auto bg-white/20 text-white text-xs">3</Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Bottom Links */}
            <div className="mt-8 pt-4 border-t border-white/5 space-y-1">
              {bottomLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(link.href)
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#8B5CF6] text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.name}</p>
                <p className="text-white/40 text-xs truncate">{user?.matricNumber}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              {title && <h1 className="text-xl font-semibold text-white">{title}</h1>}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/5">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B5CF6] text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5">
                  <Shield className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/profile">
                <Avatar className="w-9 h-9 cursor-pointer">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-[#8B5CF6] text-white text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
