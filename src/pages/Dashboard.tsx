// 1. ALL imports must be here at the top!
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  ChevronRight,
  MessageSquare,
  Bell,
  ShoppingBag,
  MapPin,
  CheckCircle,
} from 'lucide-react'
import { format, parseISO, isBefore, addDays } from 'date-fns'

export default function Dashboard() {
  // 2. Get data from your store
  const { user, courses = [], assignments = [], announcements = [], timetable = [], forumPosts = [] } = useStore()

  // 3. SAFETY GUARD: If there is no user, show loading
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F0F0F] text-white">
        <p className="animate-pulse">Loading InsideFUTA Dashboard...</p>
      </div>
    )
  }

  // 4. Calculations (placed inside the function, after the guard)
  const upcomingAssignments = assignments
    .filter((a: any) => a.status === 'pending')
    .filter((a: any) => isBefore(parseISO(a.deadline), addDays(new Date(), 7)))
    .slice(0, 3)

  const today = format(new Date(), 'EEEE')
  const todaysClasses = timetable
    .filter((t: any) => t.day === today)
    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))

  const totalCourses = courses.length
  const completedCourses = courses.filter((c: any) => c.progress === 100).length
  const pendingAssignments = assignments.filter((a: any) => a.status === 'pending').length
  const averageProgress = courses.length > 0
    ? Math.round(courses.reduce((acc: number, c: any) => acc + c.progress, 0) / courses.length)
    : 0

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {/* Added a fallback just in case name is undefined */}
        // Replace that line with this:
Welcome back, {user?.full_name ? user.full_name.trim().split(/\s+/)[0] : 'Student'}! 👋
        </h2>
        <p className="text-white/60">
          Here's what's happening in your academic journey today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <span className="text-2xl font-bold text-white">{totalCourses}</span>
            </div>
            <p className="text-white/60 text-sm">Active Courses</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-2xl font-bold text-white">{completedCourses}</span>
            </div>
            <p className="text-white/60 text-sm">Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-2xl font-bold text-white">{pendingAssignments}</span>
            </div>
            <p className="text-white/60 text-sm">Pending Tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-white">{averageProgress}%</span>
            </div>
            <p className="text-white/60 text-sm">Avg Progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-white text-lg">Course Progress</CardTitle>
              <Link to="/courses">
                <Button variant="ghost" size="sm" className="text-[#8B5CF6]">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.slice(0, 4).map((course: any) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium">{course.code}</span>
                        <span className="text-white/60 text-sm">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-white text-lg">Today's Schedule</CardTitle>
              <Link to="/timetable">
                <Button variant="ghost" size="sm" className="text-[#8B5CF6]">
                  Full Timetable <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todaysClasses.length > 0 ? (
                <div className="space-y-3">
                  {todaysClasses.map((cls: any) => (
                    <div key={cls.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{cls.courseCode}</h4>
                        <p className="text-white/60 text-sm">{cls.courseTitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{cls.startTime} - {cls.endTime}</p>
                        <p className="text-white/60 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {cls.venue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No classes scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
           <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/past-questions">
                  <Button variant="outline" className="w-full h-auto py-4 border-white/10 text-white hover:bg-white/5 flex flex-col items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="text-sm">Past Questions</span>
                  </Button>
                </Link>
                <Link to="/forum">
                  <Button variant="outline" className="w-full h-auto py-4 border-white/10 text-white hover:bg-white/5 flex flex-col items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="text-sm">Forum</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
