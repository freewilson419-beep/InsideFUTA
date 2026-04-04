import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Users,
  BookOpen,
  FileText,
  Megaphone,
  Plus,
  Trash2,
  Shield,
  GraduationCap,
} from 'lucide-react'

export default function Admin() {
  const { courses, assignments, announcements, addAnnouncement, deleteAnnouncement } = useStore()
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
  })

  const stats = [
    { label: 'Total Users', value: '10,234', icon: Users, color: 'bg-blue-500/20 text-blue-500' },
    { label: 'Courses', value: courses.length.toString(), icon: BookOpen, color: 'bg-green-500/20 text-green-500' },
    { label: 'Assignments', value: assignments.length.toString(), icon: FileText, color: 'bg-orange-500/20 text-orange-500' },
    { label: 'Announcements', value: announcements.length.toString(), icon: Megaphone, color: 'bg-purple-500/20 text-purple-500' },
  ]

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('Please fill in all fields')
      return
    }
    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      category: newAnnouncement.category as any,
      priority: newAnnouncement.priority as any,
      author: 'Admin',
    })
    setNewAnnouncement({ title: '', content: '', category: 'general', priority: 'medium' })
    toast.success('Announcement posted!')
  }

  return (
    <DashboardLayout title="Admin Panel">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#8B5CF6]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-white/60">Manage the insidefuta platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="bg-[#1A1A1A] border border-white/10 mb-6">
          <TabsTrigger value="announcements" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
            Announcements
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
            Users
          </TabsTrigger>
          <TabsTrigger value="courses" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
            Courses
          </TabsTrigger>
          <TabsTrigger value="moderation" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
            Moderation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-0 space-y-6">
          {/* Add Announcement */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#8B5CF6]" />
                Post New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Announcement title..."
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
              <textarea
                placeholder="Announcement content..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white min-h-[100px] resize-none"
              />
              <div className="flex gap-4">
                <select
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="general">General</option>
                  <option value="exam">Exam</option>
                  <option value="deadline">Deadline</option>
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <Button
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  onClick={handleAddAnnouncement}
                >
                  Post Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.slice(0, 5).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                  >
                    <div>
                      <p className="text-white font-medium">{announcement.title}</p>
                      <p className="text-white/60 text-sm">
                        {new Date(announcement.createdAt).toLocaleDateString()} • {announcement.author}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        announcement.priority === 'high' ? 'bg-red-500 text-white' :
                        announcement.priority === 'medium' ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }>
                        {announcement.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => deleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">User management features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-0">
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Course Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <GraduationCap className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Course management features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="mt-0">
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Content Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <Shield className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Moderation features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
