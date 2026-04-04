export default function Dashboard() {
  const { user, courses = [], assignments = [], announcements = [], timetable = [], forumPosts = [] } = useStore();

  // If the data isn't here yet, show a loading screen instead of crashing
  if (!user) {
    return <div className="h-screen bg-[#001f3f] text-white flex items-center justify-center">Loading your FUTA profile...</div>;
  }

  // ... the rest of your dashboard code ...
}
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
  const { user, courses, assignments, announcements, timetable, forumPosts } = useStore()

  // Get upcoming assignments (due within 7 days)
  const upcomingAssignments = assignments
    .filter((a) => a.status === 'pending')
    .filter((a) => isBefore(parseISO(a.deadline), addDays(new Date(), 7)))
    .slice(0, 3)

  // Get today's classes
  const today = format(new Date(), 'EEEE')
  const todaysClasses = timetable
    .filter((t) => t.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Get recent announcements
  const recentAnnouncements = announcements.slice(0, 3)

  // Get recent forum posts
  const recentForumPosts = forumPosts.slice(0, 3)

  // Calculate stats
  const totalCourses = courses.length
  const completedCourses = courses.filter((c) => c.progress === 100).length
  const pendingAssignments = assignments.filter((a) => a.status === 'pending').length
  const averageProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Progress */}
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
                {courses.slice(0, 4).map((course) => (
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

          {/* Today's Schedule */}
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
                  {todaysClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                    >
                      <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{cls.courseCode}</h4>
                        <p className="text-white/60 text-sm">{cls.courseTitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {cls.startTime} - {cls.endTime}
                        </p>
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

          {/* Upcoming Assignments */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-white text-lg">Upcoming Assignments</CardTitle>
              <Link to="/assignments">
                <Button variant="ghost" size="sm" className="text-[#8B5CF6]">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                    >
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{assignment.title}</h4>
                        <p className="text-white/60 text-sm">{assignment.courseCode}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-500">
                          Due {format(parseISO(assignment.deadline), 'MMM d')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
                  <p className="text-white/60">No upcoming assignments. You're all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
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
                <Link to="/marketplace">
                  <Button variant="outline" className="w-full h-auto py-4 border-white/10 text-white hover:bg-white/5 flex flex-col items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="text-sm">Marketplace</span>
                  </Button>
                </Link>
                <Link to="/cgpa">
                  <Button variant="outline" className="w-full h-auto py-4 border-white/10 text-white hover:bg-white/5 flex flex-col items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="text-sm">CGPA</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-white text-lg">Announcements</CardTitle>
              <Link to="/announcements">
                <Button variant="ghost" size="sm" className="text-[#8B5CF6]">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        announcement.category === 'exam' ? 'bg-red-500/20' :
                        announcement.category === 'deadline' ? 'bg-orange-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <Bell className={`w-4 h-4 ${
                          announcement.category === 'exam' ? 'text-red-500' :
                          announcement.category === 'deadline' ? 'text-orange-500' :
                          'text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm line-clamp-1">{announcement.title}</h4>
                        <p className="text-white/50 text-xs mt-1 line-clamp-2">{announcement.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Forum Activity */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-white text-lg">Forum Activity</CardTitle>
              <Link to="/forum">
                <Button variant="ghost" size="sm" className="text-[#8B5CF6]">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentForumPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <h4 className="text-white font-medium text-sm line-clamp-1">{post.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-white/50 text-xs">
                      <span>{post.replies.length} replies</span>
                      <span>•</span>
                      <span>{post.upvotes} upvotes</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
