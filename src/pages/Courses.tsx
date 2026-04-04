import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Search,
  BookOpen,
  FileText,
  Link as LinkIcon,
  Video,
  Plus,
  Download,
  ChevronRight,
} from 'lucide-react'

export default function Courses() {
  const { courses, addCourse, addMaterial } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    description: '',
    lecturer: '',
  })
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'pdf' as const,
    url: '',
  })

  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.title) {
      toast.error('Please fill in all required fields')
      return
    }
    addCourse({
      ...newCourse,
      level: '200',
      department: 'Computer Science',
      progress: 0,
    })
    setNewCourse({ code: '', title: '', description: '', lecturer: '' })
    toast.success('Course added successfully!')
  }

  const handleAddMaterial = () => {
    if (!selectedCourse || !newMaterial.title || !newMaterial.url) {
      toast.error('Please fill in all fields')
      return
    }
    addMaterial(selectedCourse, {
      ...newMaterial,
      uploadedBy: 'You',
      size: '2.5MB',
    })
    setNewMaterial({ title: '', type: 'pdf', url: '' })
    toast.success('Material added successfully!')
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />
      case 'link':
        return <LinkIcon className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-white/60" />
    }
  }

  return (
    <DashboardLayout title="My Courses">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-white">Course Code</Label>
                <Input
                  placeholder="e.g., CSC 211"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Course Title</Label>
                <Input
                  placeholder="e.g., Object-Oriented Programming"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Input
                  placeholder="Brief description..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Lecturer</Label>
                <Input
                  placeholder="Dr. ..."
                  value={newCourse.lecturer}
                  onChange={(e) => setNewCourse({ ...newCourse, lecturer: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button onClick={handleAddCourse} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                Add Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="bg-[#1A1A1A] border-white/5 card-hover">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <Badge className="bg-white/10 text-white/70">
                  {course.materials.length} materials
                </Badge>
              </div>
              <CardTitle className="text-white text-lg mt-4">{course.code}</CardTitle>
              <p className="text-white/60 text-sm">{course.title}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2 bg-white/10" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Lecturer: {course.lecturer}</span>
                </div>

                {/* Recent Materials */}
                {course.materials.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-white/60 text-xs uppercase tracking-wider">Recent Materials</p>
                    {course.materials.slice(0, 2).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                      >
                        {getMaterialIcon(material.type)}
                        <span className="text-white text-sm flex-1 truncate">{material.title}</span>
                        <button className="text-[#8B5CF6] hover:text-[#A78BFA]">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/10 text-white hover:bg-white/5"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Material
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1A1A] border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add Material to {course.code}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label className="text-white">Title</Label>
                          <Input
                            placeholder="Material title..."
                            value={newMaterial.title}
                            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Type</Label>
                          <select
                            value={newMaterial.type}
                            onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          >
                            <option value="pdf">PDF Document</option>
                            <option value="video">Video</option>
                            <option value="link">External Link</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">URL / Link</Label>
                          <Input
                            placeholder="https://..."
                            value={newMaterial.url}
                            onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <Button onClick={handleAddMaterial} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                          Add Material
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link to={`/courses/${course.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
