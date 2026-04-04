import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Megaphone,
  Calendar,
  Bell,
  Clock,
  BookOpen,
  PartyPopper,
} from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  exam: <BookOpen className="w-5 h-5" />,
  deadline: <Clock className="w-5 h-5" />,
  news: <Megaphone className="w-5 h-5" />,
  event: <PartyPopper className="w-5 h-5" />,
  general: <Bell className="w-5 h-5" />,
}

const categoryColors: Record<string, string> = {
  exam: 'bg-red-500/20 text-red-500',
  deadline: 'bg-orange-500/20 text-orange-500',
  news: 'bg-blue-500/20 text-blue-500',
  event: 'bg-purple-500/20 text-purple-500',
  general: 'bg-white/10 text-white/70',
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-500 text-white',
  medium: 'bg-orange-500 text-white',
  low: 'bg-blue-500 text-white',
}

export default function Announcements() {
  const { announcements } = useStore()

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <DashboardLayout title="Announcements">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Exams</p>
                <p className="text-xl font-bold text-white">
                  {announcements.filter((a) => a.category === 'exam').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Deadlines</p>
                <p className="text-xl font-bold text-white">
                  {announcements.filter((a) => a.category === 'deadline').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-white/60 text-sm">News</p>
                <p className="text-xl font-bold text-white">
                  {announcements.filter((a) => a.category === 'news').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Events</p>
                <p className="text-xl font-bold text-white">
                  {announcements.filter((a) => a.category === 'event').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="bg-[#1A1A1A] border-white/5 card-hover">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[announcement.category]}`}>
                  {categoryIcons[announcement.category]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold text-lg">{announcement.title}</h3>
                    <Badge className={priorityColors[announcement.priority]}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-white/70 leading-relaxed mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-white/50 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                    <span>by {announcement.author}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
